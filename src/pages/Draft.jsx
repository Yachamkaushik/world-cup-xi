import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import playersData from '../data/players.json'
import players_2002 from '../data/players_2002.json'
import players_2006 from '../data/players_2006.json'
import players_2010 from '../data/players_2010.json'
import players_2014 from '../data/players_2014.json'

const allPlayersData = [...playersData, ...players_2002, ...players_2006, ...players_2010, ...players_2014]
const allCombos = [...new Set(allPlayersData.map(p => `${p.nation}_${p.wc_year}`))]
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from 'framer-motion'
import { nationFlags } from '../utils/flags'

const positionColors = {
    GK: { bg: '#78350f', text: '#fbbf24' },
    DEF: { bg: '#1e3a5f', text: '#60a5fa' },
    MID: { bg: '#14532d', text: '#4ade80' },
    FWD: { bg: '#7f1d1d', text: '#f87171' },
}

const positionFullNames = {
    GK: 'GOALKEEPER',
    DEF: 'DEFENDER',
    MID: 'MIDFIELDER',
    FWD: 'FORWARD'
}

function getPlayerStats(player) {
    const s = player.wc_stats
    if (player.position === 'GK')
        return { 'Save %': s.save_pct, 'Clean Sheets': s.clean_sheets, 'Goals Conceded': s.goals_conceded }
    if (player.position === 'DEF')
        return { 'Tackles': s.tackles, 'Interceptions': s.interceptions, 'Clearances': s.clearances }
    if (player.position === 'MID')
        return { 'Key Passes': s.key_passes, 'Assists': s.assists, 'Prog Passes': s.progressive_passes }
    if (player.position === 'FWD')
        return { 'Goals': s.goals, 'Assists': s.assists, 'Goals/90': s.goals_per90 }
}

export default function Draft() {
    const navigate = useNavigate();
    const location = useLocation()
    const [round, setRound] = useState(0)
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [usedCombos, setUsedCombos] = useState([])
    const [currentYear, setCurrentYear] = useState(null)
    const [positions, setPositions] = useState(['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD'])
    const [currentSquad, setCurrentSquad] = useState([])
    const [currentNation, setCurrentNation] = useState(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [skipUsed, setSkipUsed] = useState(false)

    const mode = location.state?.mode

    useEffect(() => {
        if (!mode) { navigate('/'); return }
        const shuffled = [...positions].sort(() => Math.random() - 0.5)
        setPositions(shuffled)
    }, [])

    if (!mode) return null

    const currentPosition = positions[round]
    const broadPosition = currentPosition

    const doSpin = (isSkip = false) => {
        if (isSkip && (skipUsed || !currentSquad.length)) return
        if (isSkip) setSkipUsed(true)
        setCurrentSquad([])
        setCurrentNation(null)
        setIsSpinning(true)

        const currentUsed = [...usedCombos]

        setTimeout(() => {
            const bigNations = ['Brazil', 'Germany', 'France', 'Argentina', 'Spain', 'Portugal', 'Italy', 'Netherlands', 'England', 'Belgium']
            const allNations = [...new Set(allPlayersData.map(p => p.nation))]

            const weightedNations = allNations.flatMap(n =>
                bigNations.includes(n) ? [n, n] : [n]
            )

            const availableWeighted = weightedNations.filter(nation => {
                const nationCombos = allCombos.filter(c => c.startsWith(`${nation}_`))
                return nationCombos.some(c => !currentUsed.includes(c))
            })

            const nation = availableWeighted[Math.floor(Math.random() * availableWeighted.length)]

            const nationCombos = allCombos.filter(c => c.startsWith(`${nation}_`) && !currentUsed.includes(c))
            const picked = nationCombos[Math.floor(Math.random() * nationCombos.length)]
            const year = parseInt(picked.split('_')[1])

            const squad = allPlayersData.filter(p => p.nation === nation && p.wc_year === year)
            setCurrentNation(nation)
            setCurrentYear(year)
            setCurrentSquad(squad)
            setUsedCombos([...currentUsed, picked])
            setIsSpinning(false)
        }, 600)
    }
    return (
        <div className="h-screen w-full overflow-hidden text-white flex flex-col" style={{ backgroundColor: '#0a0a0f' }}>
            <Navbar />

            <div className="px-8 py-6 flex flex-col flex-1 overflow-hidden" style={{maxWidth: '1400px', margin: '0 auto', width: '100%'}}>

                {/* top bar */}
                <div className="flex justify-between items-start mb-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                            <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>
                                THE DRAW · ROUND {round + 1} / 11
                            </p>
                        </div>
                        <motion.h1
                            key={round}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="font-black" style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', letterSpacing: '-0.02em'}}>
                            {positionFullNames[currentPosition] || currentPosition}
                        </motion.h1>
                        <p className="text-sm mt-1" style={{color: '#4b5563'}}>
                            Spin to reveal a nation. Pick one {currentPosition} from their squad.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {mode === 'classic' && (
                            <button
                                onClick={() => doSpin(true)}
                                className="text-xs font-bold px-3 py-2 rounded"
                                style={{
                                    backgroundColor: skipUsed ? '#1f2937' : '#e6394615',
                                    color: skipUsed ? '#374151' : '#e63946',
                                    border: `1px solid ${skipUsed ? '#374151' : '#e6394640'}`,
                                    cursor: skipUsed ? 'default' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}>
                                {skipUsed ? 'SKIP USED' : 'SKIP (1)'}
                            </button>
                        )}
                        <span className="text-xs font-bold px-3 py-2 rounded" style={{
                            backgroundColor: '#F5C51815',
                            color: '#F5C518',
                            border: '1px solid #F5C51830'
                        }}>
                            {mode.toUpperCase()} MODE
                        </span>
                    </div>
                </div>

                {/* main content */}
                <div className="flex gap-6 flex-1 overflow-hidden" style={{minHeight: 0}}>

                    {/* left — the pot */}
                    <div className="flex flex-col items-center justify-center rounded-2xl p-8 overflow-y-auto" style={{
                        backgroundColor: '#111827',
                        border: '1px solid #ffffff10',
                        minWidth: '260px',
                        width: '260px'
                    }}>
                        {!currentNation ? (
                            <div className="flex flex-col items-center gap-6">
                                <p className="text-xs tracking-widest" style={{color: '#4b5563'}}>THE POT</p>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    border: '2px dashed #ffffff15',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <span style={{fontSize: '2rem', opacity: 0.3}}>?</span>
                                </div>
                                {isSpinning ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                        style={{ fontSize: '1.2rem' }}>
                                        ⚽
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={() => doSpin(false)}
                                        className="px-8 py-3 rounded-full font-black tracking-widest text-sm transition-all hover:opacity-80"
                                        style={{ backgroundColor: '#F5C518', color: '#0a0a0f' }}>
                                        SPIN
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <p className="text-xs tracking-widest" style={{color: '#4b5563'}}>THE POT</p>
                                <motion.span
                                    key={currentNation}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
                                    style={{fontSize: '4rem', display: 'inline-block'}}>
                                    {nationFlags[currentNation] || '🏳️'}
                                </motion.span>
                                <h2 className="font-black text-2xl text-white">{currentNation}</h2>
                                <p className="text-xs font-bold tracking-widest" style={{color: '#F5C518'}}>{currentYear}</p>
                                <p className="text-xs tracking-widest" style={{color: '#4b5563'}}>
                                    SQUAD RATING · {Math.ceil(allPlayersData.filter(p => p.nation === currentNation && p.wc_year === currentYear).reduce((sum, p) => sum + p.base_rating, 0) / 23)}
                                </p>
                                <p className="text-xs mt-2" style={{color: '#374151'}}>PICK A PLAYER →</p>
                            </div>
                        )}
                    </div>

                    {/* right — player cards */}
                    <div className="flex-1 overflow-y-auto" style={{paddingRight: '8px', paddingLeft: '4px', paddingBottom: '4px'}}>
                        {currentSquad.length === 0 ? (
                            <div className="flex items-center justify-center h-full" style={{color: '#1f2937'}}>
                                <p className="text-sm tracking-widest">SPIN TO REVEAL SQUAD</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {currentSquad.map(player => {
                                    const colors = positionColors[player.position] || { bg: '#1f2937', text: '#9ca3af' }
                                    const isCurrentPos = player.position === broadPosition
                                    return (
                                        <button
                                            key={player.id}
                                            onClick={() => {
                                                if (!isCurrentPos) return
                                                const finalTeam = [...selectedPlayers, player]
                                                setSelectedPlayers(finalTeam)
                                                setRound(round + 1)
                                                setCurrentSquad([])
                                                setCurrentNation(null)
                                                if (round + 1 === 11) {
                                                    navigate('/simulate', { state: { selectedPlayers: finalTeam, mode } })
                                                }
                                            }}
                                            className="text-left p-4 rounded-xl transition-all"
                                            style={{
                                                backgroundColor: '#111827',
                                                border: `1px solid ${isCurrentPos ? colors.text + '40' : '#ffffff08'}`,
                                                opacity: isCurrentPos ? 1 : 0.25,
                                                cursor: isCurrentPos ? 'pointer' : 'default',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={e => {
                                                if (isCurrentPos) {
                                                    e.currentTarget.style.boxShadow = `0 0 25px ${colors.text}60`
                                                    e.currentTarget.style.border = `1px solid ${colors.text}80`
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.boxShadow = 'none'
                                                e.currentTarget.style.border = `1px solid ${isCurrentPos ? colors.text + '40' : '#ffffff08'}`
                                            }}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                                                    backgroundColor: colors.bg,
                                                    color: colors.text
                                                }}>{player.position}</span>
                                                <span className="text-xs font-black" style={{color: '#4b5563'}}>#{player.squad_number}</span>
                                            </div>
                                            <p className="font-bold text-white text-sm mb-2">{player.name}</p>
                                            {mode === 'classic' && isCurrentPos && (
                                                <div className="mt-2">
                                                    {Object.entries(getPlayerStats(player)).map(([key, val]) => (
                                                        <div key={key} className="flex justify-between text-xs mt-1">
                                                            <span style={{ color: '#4b5563' }}>{key}</span>
                                                            <span style={{ color: colors.text }}>{val ?? 'N/A'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* bottom — position slots */}
                <div className="mt-4 shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-xs tracking-widest" style={{color: '#4b5563'}}>YOUR XI · {selectedPlayers.length} / 11</p>
                        <p className="text-xs tracking-widest" style={{color: '#4b5563'}}>{11 - round} ROUNDS REMAINING</p>
                    </div>
                    <div className="grid grid-cols-11 gap-2">
                        {positions.map((pos, i) => {
                            const filled = selectedPlayers[i]
                            const isCurrent = i === round
                            return (
                                <div key={i} className="flex flex-col items-center rounded-xl p-2 text-center" style={{
                                    backgroundColor: '#111827',
                                    border: `1px solid ${isCurrent ? '#F5C518' : filled ? '#ffffff15' : '#ffffff08'}`,
                                    minHeight: '80px',
                                    boxShadow: isCurrent ? '0 0 15px #F5C51825' : 'none'
                                }}>
                                    <p style={{color: isCurrent ? '#F5C518' : '#1f2937', fontSize: '0.6rem'}} className="font-bold mb-1">{isCurrent ? pos : filled ? pos : '?'}</p>
                                    {filled ? (
                                        <p className="font-bold text-white" style={{fontSize: '0.6rem', lineHeight: 1.3}}>{filled.name.split(' ').slice(-1)[0]}</p>
                                    ) : isCurrent ? (
                                        <p className="font-black" style={{color: '#F5C51860', fontSize: '0.8rem'}}>{pos}</p>
                                    ) : (
                                        <p className="font-black" style={{color: '#1f2937', fontSize: '0.8rem'}}>?</p>
                                    )}
                                    <p className="mt-1" style={{color: '#374151', fontSize: '0.55rem'}}>{String(i + 1).padStart(2, '0')}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}