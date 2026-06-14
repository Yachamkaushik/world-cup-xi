import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import playersData from '../data/players.json'
import Navbar from "../components/Navbar";

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
    const [usedNations, setUsedNations] = useState([])
    const mode = location.state.mode
    const [positions, setPositions] = useState(['GK', 'RB', 'LB', 'CB', 'CB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST'])
    const [currentSquad, setCurrentSquad] = useState([])
    const [currentNation, setCurrentNation] = useState()
    const nations = [...new Set(playersData.map(p => p.nation))]

    useEffect(() => {
        const shuffled = [...positions].sort(() => Math.random() - 0.5)
        setPositions(shuffled)
    }, [])

    return (
        <div className="min-h-screen w-full overflow-x-hidden text-white" style={{ backgroundColor: '#0d1117' }}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12">

                {/* round + position header */}
                <p className="text-sm tracking-widest mb-2" style={{ color: '#9ca3af' }}>ROUND {round + 1} OF 11</p>
                <h1 className="text-6xl font-black tracking-wider mb-6" style={{ color: '#F5C518' }}>{positions[round]}</h1>

                {/* nation */}
                {currentNation && (
                    <h2 className="text-2xl font-bold mb-8 text-white">{currentNation}</h2>
                )}

                {/* spin button - only show if no squad yet */}
                {currentSquad.length === 0 && (
                    <button
                        onClick={() => {
                            const available = nations.filter(n => !usedNations.includes(n))
                            const index = Math.floor(Math.random() * available.length)
                            const picked = available[index]
                            setCurrentNation(picked)
                            setCurrentSquad(playersData.filter(n => n.nation === picked))
                            setUsedNations([...usedNations, picked])
                        }}
                        className="px-10 py-4 rounded-full font-bold tracking-widest text-sm transition-all hover:opacity-80"
                        style={{ backgroundColor: '#F5C518', color: '#0d1117' }}>
                        SPIN
                    </button>
                )}

                {/* squad grid */}
                {currentSquad.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mt-8">
                        {currentSquad.map(player => (
                            <button
                                key={player.id}
                                onClick={() => {
                                    const finalTeam = [...selectedPlayers, player]
                                    setSelectedPlayers(finalTeam)
                                    setRound(round + 1)
                                    setCurrentSquad([])
                                    if (round + 1 === 11) {
                                        navigate('/simulate', { state: { selectedPlayers: finalTeam, mode } })
                                    }
                                }}
                                className="text-left p-4 rounded-xl transition-all hover:scale-105 hover:border-yellow-400"
                                style={{ backgroundColor: '#111827', border: '1px solid #ffffff15' }}>
                                <p className="font-bold text-white mb-1">{player.name}</p>
                                <p className="text-xs mb-3 px-2 py-1 rounded-full inline-block" style={{ backgroundColor: '#1f2937', color: '#9ca3af' }}>{player.position}</p>
                                {mode === 'classic' && (
                                    <div className="mt-2">
                                        {Object.entries(getPlayerStats(player)).map(([key, val]) => (
                                            <div key={key} className="flex justify-between text-xs mt-1">
                                                <span style={{ color: '#6b7280' }}>{key}</span>
                                                <span style={{ color: '#F5C518' }}>{val ?? 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* selected players so far */}
                {selectedPlayers.length > 0 && (
                    <div className="mt-12 w-full max-w-5xl">
                        <p className="text-sm tracking-widest mb-4" style={{ color: '#9ca3af' }}>YOUR XI SO FAR</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedPlayers.map(p => (
                                <div key={p.id} className="px-3 py-2 rounded-lg text-sm font-bold" style={{ backgroundColor: '#111827', color: '#F5C518', border: '1px solid #F5C51830' }}>
                                    {p.name} <span style={{ color: '#6b7280' }}>· {p.position}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}