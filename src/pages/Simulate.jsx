import {useLocation, useNavigate} from 'react-router-dom'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import playersData from '../data/players_2018.json'
import players_2002 from '../data/players_2002.json'
import players_2006 from '../data/players_2006.json'
import players_2010 from '../data/players_2010.json'
import players_2014 from '../data/players_2014.json'
import players_1994 from '../data/players_1994.json'
import players_1998 from '../data/players_1998.json'
import players_2022 from '../data/players_2022.json'
import players_1990 from '../data/players_1990.json'
import players_1986 from '../data/players_1986.json'
import players_1982 from '../data/players_1982.json'
import {buildPositionScores, calculateEffectiveTeamRatings, calculateTeamRatings, generateOpponent, simulateMatch} from '../utils/simulate.js'

const allPlayersData = [...playersData, ...players_2002, ...players_2006, ...players_2010, ...players_2014, ...players_1994, ...players_1998, ...players_2022, ...players_1990, ...players_1986, ...players_1982]


const dotColors = [
    { border: '#F5C518', text: '#F5C518', glow: '#F5C51840' },
    { border: '#60a5fa', text: '#60a5fa', glow: '#60a5fa40' },
    { border: '#4ade80', text: '#4ade80', glow: '#4ade8040' },
    { border: '#f87171', text: '#f87171', glow: '#f8717140' },
    { border: '#c084fc', text: '#c084fc', glow: '#c084fc40' },
    { border: '#fb923c', text: '#fb923c', glow: '#fb923c40' },
]

function PlayerDot({ player, colorIndex }) {
    const color = dotColors[colorIndex % dotColors.length]
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center rounded-full font-black text-xs"
                 style={{
                     width: '36px', height: '36px',
                     backgroundColor: '#0a0a0f',
                     border: `2px solid ${color.border}`,
                     color: color.text,
                     boxShadow: `0 0 10px ${color.glow}`
                 }}>
                {player.base_rating}
            </div>
            <p className="text-white font-semibold text-center" style={{fontSize: '0.55rem', maxWidth: '60px', lineHeight: 1.2}}>
                {player.name.split(' ').slice(-1)[0]}
            </p>
        </div>
    )
}

export default function Simulate() {
    const navigate = useNavigate()
    const location = useLocation()
    if (!location.state?.selectedPlayers) { navigate('/'); return null }
    const selectedPlayers = location.state.selectedPlayers
    const mode = location.state.mode
    const accentColor = mode === 'purist' ? '#3b82f6' : '#F5C518'
    const accentGlow = mode === 'purist' ? '#3b82f640' : '#F5C51840'
    const accentBorder = mode === 'purist' ? '#3b82f6' : '#F5C518'
    const ratings = calculateTeamRatings(selectedPlayers)
    const positionScores = buildPositionScores(allPlayersData)
    const myTeam = calculateEffectiveTeamRatings(selectedPlayers, positionScores)

    const gks = selectedPlayers.filter(p => p.position === 'GK')
    const defs = selectedPlayers.filter(p => p.position === 'DEF')
    const mids = selectedPlayers.filter(p => p.position === 'MID')
    const fwds = selectedPlayers.filter(p => p.position === 'FWD')

    return(
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-10" style={{flex: 1}}>

                <div className="flex items-center gap-3 mb-3">
                    <div style={{height: '1px', width: '40px', background: `linear-gradient(to right, transparent, ${accentColor})`}} />
                    <p className="text-xs tracking-widest font-semibold" style={{color: accentColor}}>THE DRAFT IS COMPLETE</p>
                    <div style={{height: '1px', width: '40px', background: `linear-gradient(to left, transparent, ${accentColor})`}} />
                </div>
                <h1 className="font-black mb-2 text-center" style={{fontSize: 'clamp(2rem, 6vw, 4rem)', color: 'white', letterSpacing: '-0.02em'}}>
                    YOUR WORLD CUP XI
                </h1>
                <p className="text-sm mb-8 text-center" style={{color: '#4b5563'}}>
                    The calm before the storm. Review your squad — then send them out to face history.
                </p>

                <div className="flex gap-4 mb-10">
                    {[
                        { label: 'OVR', value: ratings[0], gold: true },
                        { label: 'ATK', value: ratings[1] },
                        { label: 'MID', value: ratings[2] },
                        { label: 'DEF', value: ratings[3] },
                    ].map(({ label, value, gold }) => (
                        <div key={label} className="flex flex-col items-center px-8 py-5 rounded-2xl" style={{
                            backgroundColor: '#111827',
                            border: `1px solid ${gold ? accentBorder : '#ffffff15'}`,
                            boxShadow: gold ? `0 0 20px ${accentGlow}` : 'none'
                        }}>
                            <span className="text-xs tracking-widest mb-1" style={{color: '#4b5563'}}>{label}</span>
                            <span className="text-4xl font-black" style={{color: gold ? accentColor : 'white'}}>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="relative rounded-2xl overflow-hidden mb-10" style={{
                    width: '100%',
                    maxWidth: '480px',
                    aspectRatio: '2/3',
                    background: 'linear-gradient(180deg, #0d2818 0%, #0f3320 50%, #0d2818 100%)',
                    border: '1px solid #1a5c30'
                }}>
                    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100px', height: '100px',
                            borderRadius: '50%',
                            border: '1px solid #ffffff15'
                        }} />
                        <div style={{
                            position: 'absolute', top: '50%', left: '5%', right: '5%',
                            height: '1px', backgroundColor: '#ffffff15'
                        }} />
                        <div style={{
                            position: 'absolute', bottom: '3%', left: '25%', right: '25%',
                            height: '14%', border: '1px solid #ffffff15'
                        }} />
                        <div style={{
                            position: 'absolute', top: '3%', left: '4%', right: '4%', bottom: '3%',
                            border: '1px solid #ffffff20',
                            borderRadius: '4px'
                        }} />
                    </div>

                    <div className="absolute flex justify-around items-center w-full" style={{top: '8%'}}>
                        {fwds.map((p, i) => <PlayerDot key={p.id} player={p} colorIndex={i} />)}
                    </div>

                    <div className="absolute flex justify-around items-center w-full" style={{top: '32%'}}>
                        {mids.map((p, i) => <PlayerDot key={p.id} player={p} colorIndex={i + 2} />)}
                    </div>

                    <div className="absolute flex justify-around items-center w-full" style={{top: '58%'}}>
                        {defs.map((p, i) => <PlayerDot key={p.id} player={p} colorIndex={i + 1} />)}
                    </div>

                    <div className="absolute flex justify-around items-center w-full" style={{top: '80%'}}>
                        {gks.map((p, i) => <PlayerDot key={p.id} player={p} colorIndex={0} />)}
                    </div>
                </div>

                <button
                    onClick={() => {
                        const allNations = [...new Set(allPlayersData.map(p => p.nation))]
                        const usedNations = []
                        const results = []
                        for(let i = 0; i < 8; i++){
                            const opponent = generateOpponent(i, usedNations, allNations)
                            usedNations.push(opponent.nation)
                            results.push(simulateMatch(myTeam, opponent, i))
                        }
                        navigate('/result', { state: { results, selectedPlayers, mode } })
                    }}
                    className="px-16 py-5 rounded-full font-black tracking-widest text-lg"
                    style={{backgroundColor: accentColor, color: '#0a0a0f', transition: 'all 0.2s ease'}}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 0 40px ${accentGlow}`
                        e.currentTarget.style.transform = 'scale(1.03)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'scale(1)'
                    }}>
                    START WORLD CUP
                </button>
            </div>
            <Footer />
        </div>
    )
}