import { useLocation } from 'react-router-dom'
import {useEffect,useState} from "react";
import playersData from '../data/players.json'

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
    const location = useLocation()
    const [round, setRound] = useState(0)
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [usedNations, setUsedNations] = useState([])
    const mode =location.state.mode
    const [positions, setPositions] = useState(['GK', 'RB', 'LB', 'CB', 'CB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST'])
    useEffect(() => {
        const shuffled = [...positions].sort(() => Math.random() - 0.5)
        setPositions(shuffled)
    },[])
    const [currentSquad, setCurrentSquad] = useState([])
    const[currentNation, setCurrentNation] = useState()
    const nations = [...new Set(playersData.map(p => p.nation))]
    return(
        <div>
            <button onClick={()=>{
                const available = nations.filter(n => !usedNations.includes(n))
                const index=Math.floor(Math.random() * available.length)
                const picked = available[index]
                setCurrentNation(picked)
                setCurrentSquad((playersData.filter(n => n.nation===picked)))
                setUsedNations([...usedNations,picked])
            }}>Spin</button>
            <h1>Round : {round}</h1>
            <h2>{positions[round]}</h2>
            <h2>{currentNation}</h2>
            {currentSquad.map(player => (
                <div key={player.id}>
                    <p>{player.name}</p>
                    <p>{player.position}</p>
                    {mode === 'classic' && Object.entries(getPlayerStats(player)).map(([key, val]) => (
                        <p key={key}>{key}: {val ?? 'N/A'}</p>
                    ))}
                </div>
            ))}
        </div>
    )
}