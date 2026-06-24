import {useLocation, useNavigate} from 'react-router-dom'
import {useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {motion} from "framer-motion";
import { nationFlags } from '../utils/flags'


export default function Result() {
    const location = useLocation()
    const navigate = useNavigate()
    const [currentMatch, setCurrentMatch] = useState(0)
    const [phase, setPhase] = useState('group')

    if (!location.state?.results) { navigate('/'); return null }
    const results = location.state.results
    const selectedPlayers = location.state.selectedPlayers
    const mode = location.state.mode
    const roundNames = ['Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final']

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
    }

    let leaguePoints = 0
    for(let i = 0; i < 3; i++){
        if(results[i].outcome === 'win') leaguePoints += 3
        else if(results[i].outcome === 'draw') leaguePoints += 1
    }
    const advanced = leaguePoints >= 4

    return(
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12" style={{flex: 1}}>

                {phase === 'group' && (
                    <div className="flex flex-col items-center w-full" style={{maxWidth: '700px'}}>
                        <div className="flex items-center gap-3 mb-3">
                            <div style={{height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #F5C518)'}} />
                            <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>GROUP STAGE</p>
                            <div style={{height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #F5C518)'}} />
                        </div>
                        <h1 className="font-black mb-10 text-center" style={{fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'white', letterSpacing: '-0.02em'}}>
                            MATCHDAY RESULTS
                        </h1>

                        <div className="w-full rounded-2xl p-6" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3 mb-6">
                                {results.slice(0,3).map((item, i) => {
                                    const badge = item.outcome === 'win' ? 'W' : item.outcome === 'draw' ? 'D' : 'L'
                                    const badgeColor = badge === 'W' ? '#1a9e5c' : badge === 'D' ? '#F5C518' : '#e63946'
                                    return (
                                        <motion.div key={i} variants={rowVariants} className="flex justify-between items-center px-6 py-4 rounded-xl" style={{
                                            backgroundColor: '#0a0a0f',
                                            border: '1px solid #ffffff08'
                                        }}>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-bold" style={{color: '#4b5563', width: '40px'}}>MD{i+1}</span>
                                                <span className="font-bold text-white">You</span>
                                            </div>
                                            <span className="font-black text-2xl text-white">{item.yourGoals} – {item.oppGoals}</span>
                                            <div className="flex items-center gap-3">
                                                <span style={{fontSize: '1.3rem'}}>{nationFlags[item.opponent.nation] || '🏳️'}</span>
                                                <span className="font-bold text-white">{item.opponent.nation}</span>
                                                <span className="flex items-center justify-center font-black text-xs rounded-md" style={{
                                                    width: '28px', height: '28px',
                                                    color: badgeColor,
                                                    border: `1px solid ${badgeColor}`,
                                                    backgroundColor: badgeColor + '15'
                                                }}>{badge}</span>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>

                            <div style={{height: '1px', backgroundColor: '#ffffff10'}} className="mb-6" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs tracking-widest mb-1" style={{color: '#4b5563'}}>POINTS</p>
                                    <p className="text-4xl font-black" style={{color: '#F5C518'}}>{leaguePoints}</p>
                                </div>
                                <p className="font-black text-2xl" style={{color: advanced ? '#1a9e5c' : '#e63946'}}>
                                    {advanced ? 'ADVANCED ✓' : 'ELIMINATED ✗'}
                                </p>
                            </div>
                        </div>

                        {advanced ? (
                            <button
                                onClick={() => { setPhase('knockout'); setCurrentMatch(3) }}
                                className="px-12 py-4 rounded-full font-black tracking-widest mt-8"
                                style={{backgroundColor: '#F5C518', color: '#0a0a0f', transition: 'all 0.2s ease'}}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px #F5C51840'; e.currentTarget.style.transform = 'scale(1.03)' }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}>
                                TO THE KNOCKOUTS →
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/summary', { state: { results, selectedPlayers, mode, eliminated: true, eliminatedAt: 'Group Stage' } })}
                                className="px-12 py-4 rounded-full font-black tracking-widest mt-8"
                                style={{backgroundColor: '#111827', color: '#e63946', border: '1px solid #e63946'}}>
                                SEE RESULTS
                            </button>
                        )}
                    </div>
                )}

                {phase === 'knockout' && results[currentMatch] && (
                    <div className="flex flex-col items-center w-full" style={{maxWidth: '700px'}}>
                        <div className="flex items-center gap-3 mb-3">
                            <div style={{height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #F5C518)'}} />
                            <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>KNOCKOUT STAGE</p>
                            <div style={{height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #F5C518)'}} />
                        </div>
                        <h1 className="font-black mb-10 text-center" style={{fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'white', letterSpacing: '-0.02em'}}>
                            {roundNames[currentMatch-3].toUpperCase()}
                        </h1>

                        <motion.div
                            key={currentMatch}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full rounded-2xl p-8 text-center" style={{
                            backgroundColor: '#111827',
                            border: `1px solid ${results[currentMatch].won ? '#1a9e5c40' : '#e6394640'}`
                        }}>
                            <div className="flex items-center justify-center gap-8 mb-6">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="font-bold text-lg text-white">You</span>
                                </div>
                                <span className="font-black" style={{fontSize: '3rem', color: results[currentMatch].won ? '#1a9e5c' : '#e63946'}}>
                                    {results[currentMatch].yourGoals} – {results[currentMatch].oppGoals}
                                </span>
                                <div className="flex flex-col items-center gap-2">
                                    <span style={{fontSize: '2rem'}}>{nationFlags[results[currentMatch].opponent.nation] || '🏳️'}</span>
                                    <span className="font-bold text-lg text-white">{results[currentMatch].opponent.nation}</span>
                                </div>
                            </div>
                            {results[currentMatch].wentToPens && (
                                <p className="font-bold text-sm mb-3" style={{color: '#9ca3af'}}>
                                    ({results[currentMatch].penScore} on penalties)
                                </p>
                            )}
                            <p className="font-black text-xl tracking-widest" style={{color: results[currentMatch].won ? '#1a9e5c' : '#e63946'}}>
                                {results[currentMatch].won ? 'WIN' : 'LOSS'}
                            </p>
                        </motion.div>

                        {results[currentMatch].won && currentMatch === 7 &&
                            <button
                                onClick={() => navigate('/summary', { state: { results, selectedPlayers, mode, eliminated: false, eliminatedAt: 'Final' } })}
                                className="px-12 py-4 rounded-full font-black tracking-widest mt-8"
                                style={{backgroundColor: '#F5C518', color: '#0a0a0f', transition: 'all 0.2s ease'}}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px #F5C51840'; e.currentTarget.style.transform = 'scale(1.03)' }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}>
                                🏆 YOU WON THE WORLD CUP
                            </button>
                        }
                        {results[currentMatch].won && currentMatch < 7 &&
                            <button
                                onClick={() => setCurrentMatch(currentMatch + 1)}
                                className="px-12 py-4 rounded-full font-black tracking-widest mt-8"
                                style={{backgroundColor: '#F5C518', color: '#0a0a0f', transition: 'all 0.2s ease'}}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px #F5C51840'; e.currentTarget.style.transform = 'scale(1.03)' }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}>
                                NEXT: {roundNames[currentMatch - 2].toUpperCase()} →
                            </button>
                        }
                        {!results[currentMatch].won &&
                            <button
                                onClick={() => navigate('/summary', { state: { results, selectedPlayers, mode, eliminated: true, eliminatedAt: roundNames[currentMatch-3] } })}
                                className="px-12 py-4 rounded-full font-black tracking-widest mt-8"
                                style={{backgroundColor: '#111827', color: '#e63946', border: '1px solid #e63946'}}>
                                SEE RESULTS
                            </button>
                        }
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}