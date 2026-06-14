import {useLocation, useNavigate} from 'react-router-dom'
import {useState} from "react";
import Navbar from "../components/Navbar";

export default function Result() {
    const location = useLocation()
    const navigate = useNavigate()
    const results = location.state.results
    const selectedPlayers = location.state.selectedPlayers
    const mode = location.state.mode
    const [currentMatch, setCurrentMatch] = useState(0)
    const [phase, setPhase] = useState('group')
    const roundNames = ['Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final']

    let leaguePoints = 0
    for(let i = 0; i < 3; i++){
        if(results[i].won) leaguePoints += 3
    }
    const advanced = leaguePoints >= 4

    return(
        <div className="min-h-screen w-full overflow-x-hidden text-white" style={{backgroundColor: '#0d1117'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12">

                {phase === 'group' && (
                    <div className="flex flex-col items-center w-full max-w-xl">
                        <p className="text-sm tracking-widest mb-2" style={{color: '#F5C518'}}>GROUP STAGE</p>
                        <h1 className="text-4xl font-black tracking-wider mb-10 text-white">MATCHDAY RESULTS</h1>

                        <div className="flex flex-col gap-3 w-full mb-8">
                            {results.slice(0,3).map((item, i) => (
                                <div key={i} className="flex justify-between items-center px-6 py-4 rounded-xl" style={{backgroundColor: '#111827', border: `1px solid ${item.won ? '#1a9e5c30' : '#e6394630'}`}}>
                                    <span className="text-sm tracking-wider" style={{color: '#9ca3af'}}>MATCHDAY {i+1}</span>
                                    <span className="font-black text-lg" style={{color: item.won ? '#1a9e5c' : '#e63946'}}>
                                        {item.won ? 'WIN' : 'LOSS'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-sm tracking-widest" style={{color: '#9ca3af'}}>POINTS</span>
                            <span className="text-4xl font-black" style={{color: '#F5C518'}}>{leaguePoints}</span>
                        </div>

                        <div className="px-6 py-4 rounded-xl mb-8 text-center w-full" style={{backgroundColor: advanced ? '#14532d30' : '#7f1d1d30', border: `1px solid ${advanced ? '#1a9e5c' : '#e63946'}`}}>
                            <p className="font-bold text-lg" style={{color: advanced ? '#1a9e5c' : '#e63946'}}>
                                {advanced ? '✓ YOU ADVANCED' : '✗ ELIMINATED IN GROUP STAGE'}
                            </p>
                        </div>
                        {!advanced &&
                            <button
                                onClick={() => navigate('/summary', { state: { results, mode, eliminated: true, eliminatedAt: 'Group Stage' } })}
                                className="px-12 py-4 rounded-full font-black tracking-widest transition-all hover:opacity-80 mt-4"
                                style={{backgroundColor: '#111827', color: '#e63946', border: '1px solid #e63946'}}>
                                SEE RESULTS
                            </button>
                        }

                        {advanced &&
                            <button
                                onClick={() => { setPhase('knockout'); setCurrentMatch(3) }}
                                className="px-12 py-4 rounded-full font-black tracking-widest transition-all hover:opacity-80 hover:scale-105"
                                style={{backgroundColor: '#F5C518', color: '#0d1117'}}>
                                ENTER KNOCKOUTS
                            </button>
                        }
                    </div>
                )}

                {phase === 'knockout' && (
                    <div className="flex flex-col items-center w-full max-w-xl">
                        <p className="text-sm tracking-widest mb-2" style={{color: '#F5C518'}}>KNOCKOUT STAGE</p>
                        <h1 className="text-4xl font-black tracking-wider mb-10 text-white">{roundNames[currentMatch-3].toUpperCase()}</h1>

                        <div className="px-8 py-8 rounded-2xl text-center w-full mb-8" style={{backgroundColor: '#111827', border: `1px solid ${results[currentMatch].won ? '#1a9e5c' : '#e63946'}30`}}>
                            <p className="text-sm tracking-widest mb-4" style={{color: '#9ca3af'}}>RESULT</p>
                            <p className="text-5xl font-black" style={{color: results[currentMatch].won ? '#1a9e5c' : '#e63946'}}>
                                {results[currentMatch].won ? 'WIN' : 'LOSS'}
                            </p>
                        </div>

                        {results[currentMatch].won && currentMatch === 7 &&
                            <button
                                onClick={() => navigate('/summary', { state: { results, mode, eliminated: false, eliminatedAt: 'Final' } })}
                                className="px-12 py-4 rounded-full font-black tracking-widest transition-all hover:opacity-80 hover:scale-105"
                                style={{backgroundColor: '#F5C518', color: '#0d1117'}}>
                                🏆 YOU WON THE WORLD CUP
                            </button>
                        }
                        {results[currentMatch].won && currentMatch < 7 &&
                            <button
                                onClick={() => setCurrentMatch(currentMatch + 1)}
                                className="px-12 py-4 rounded-full font-black tracking-widest transition-all hover:opacity-80 hover:scale-105"
                                style={{backgroundColor: '#F5C518', color: '#0d1117'}}>
                                NEXT: {roundNames[currentMatch - 2].toUpperCase()}
                            </button>
                        }
                        {!results[currentMatch].won &&
                            <button
                                onClick={() => navigate('/summary', { state: { results, mode, eliminated: true, eliminatedAt: roundNames[currentMatch-3] } })}
                                className="px-12 py-4 rounded-full font-black tracking-widest transition-all hover:opacity-80"
                                style={{backgroundColor: '#111827', color: '#e63946', border: '1px solid #e63946'}}>
                                SEE RESULTS
                            </button>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}