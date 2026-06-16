import {useLocation, useNavigate} from 'react-router-dom'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import playersData from '../data/players.json'

function calculateTeamRatings(selectedPlayers) {
    let gkRating=0, atkRating=0, defRating=0, midRating=0, ovr=0
    const fwds = selectedPlayers.filter(p => p.position === 'FWD')
    const defs = selectedPlayers.filter(p => p.position === 'DEF')
    const mids = selectedPlayers.filter(p => p.position === 'MID')
    selectedPlayers.forEach((player)=>{
        ovr+=player.base_rating
        if (player.position === 'GK') gkRating+=player.base_rating
        if (player.position === 'DEF') defRating+=player.base_rating
        if (player.position === 'MID') midRating+=player.base_rating
        if (player.position === 'FWD') atkRating+=player.base_rating
    })
    return [Math.ceil(ovr/11),Math.ceil(atkRating/fwds.length),Math.ceil(midRating/mids.length),Math.ceil(defRating/defs.length),gkRating]
}
function generateScoreline(winProb, won){
    let goalDiff = (winProb - 0.5) * 6
    let totalGoals = 2 + Math.floor(Math.random() * 3)
    let yourGoals = Math.round((totalGoals + goalDiff) / 2)
    let oppGoals = totalGoals - yourGoals
    yourGoals = Math.max(0, yourGoals)
    oppGoals = Math.max(0, oppGoals)
    if(yourGoals === oppGoals && won === true){
        yourGoals += 1
    }
    if(yourGoals === oppGoals && won === false){
        oppGoals += 1
    }
    return { yourGoals, oppGoals }
}
function calculateEffectiveRating(player){
    const s = player.wc_stats
    const m = s.minutes_played || 1
    if(m === 0) return 0
    if(player.position === 'GK') return (player.base_rating * 0.6) + ((s.save_pct ?? 0) * 0.35) + ((s.clean_sheets ?? 0) * 4) - ((s.goals_conceded ?? 0) * 1.5)
    if(player.position === 'FWD') return (player.base_rating * 0.6) + ((s.goals_per90 ?? 0) * 15) + (((s.shots_on_target ?? 0) / m) * 90 * 4) + ((s.assists ?? 0) * 2)
    if(player.position === 'MID') return (player.base_rating * 0.6) + (((s.key_passes ?? 0) / m) * 90 * 8) + (((s.progressive_passes ?? 0) / m) * 90 * 5) + ((s.assists ?? 0) * 3)
    if(player.position === 'DEF') return (player.base_rating * 0.6) + (((s.tackles ?? 0) / m) * 90 * 8) + (((s.interceptions ?? 0) / m) * 90 * 10) + (((s.clearances ?? 0) / m) * 90 * 3)
}

function calculateEffectiveTeamRatings(selectedPlayers){
    const fwds = selectedPlayers.filter(p => p.position === 'FWD')
    const defs = selectedPlayers.filter(p => p.position === 'DEF')
    const mids = selectedPlayers.filter(p => p.position === 'MID')
    const gk = selectedPlayers.find(p => p.position === 'GK')
    let atkTeamRating=0, defTeamRating=0, midTeamRating=0
    const gkRating = Math.ceil(calculateEffectiveRating(gk))
    fwds.forEach(p => atkTeamRating += calculateEffectiveRating(p))
    defs.forEach(p => defTeamRating += calculateEffectiveRating(p))
    mids.forEach(p => midTeamRating += calculateEffectiveRating(p))
    const effectiveATK = Math.ceil(atkTeamRating/fwds.length * (1 + (midTeamRating/mids.length - 75) * 0.005))
    const effectiveDEF = Math.ceil(defTeamRating/defs.length * (1 + (midTeamRating/mids.length - 75) * 0.005))
    const effectiveMID = Math.ceil(midTeamRating/mids.length)
    const OVR = Math.ceil((effectiveATK * 0.30) + (effectiveMID * 0.25) + (effectiveDEF * 0.25) + (gkRating * 0.20))
    return { ATK: effectiveATK, MID: effectiveMID, DEF: effectiveDEF, GK: gkRating, OVR }
}

function generateOpponent(round, usedNations, allNations) {
    const ranges = [[70,78],[70,78],[70,78],[75,82],[78,84],[82,87],[85,89],[88,93]]
    const [min, max] = ranges[round]
    const baseOVR = Math.floor(Math.random() * (max - min + 1)) + min
    const styles = ['attacking', 'defensive', 'balanced']
    const style = styles[Math.floor(Math.random() * 3)]
    let ATK, MID, DEF, GK
    if (style === 'attacking') { ATK=baseOVR+7; MID=baseOVR+2; DEF=baseOVR-6; GK=baseOVR-3 }
    else if (style === 'defensive') { ATK=baseOVR-6; MID=baseOVR+2; DEF=baseOVR+7; GK=baseOVR+3 }
    else { ATK=baseOVR+Math.floor(Math.random()*7)-3; MID=baseOVR+Math.floor(Math.random()*7)-3; DEF=baseOVR+Math.floor(Math.random()*7)-3; GK=baseOVR+Math.floor(Math.random()*7)-3 }
    const OVR = Math.ceil((ATK*0.30)+(MID*0.25)+(DEF*0.25)+(GK*0.20))

    const availableNations = allNations.filter(n => !usedNations.includes(n))
    const nation = availableNations[Math.floor(Math.random() * availableNations.length)]

    return { ATK, MID, DEF, GK, OVR, style, baseOVR, nation }
}

function simulateMatch(myTeam, opponent){
    let attackingThreat = (myTeam.MID * 0.40) + (myTeam.ATK * 0.60)
    let yourScoringChance = attackingThreat / (attackingThreat + opponent.DEF)
    let theirAttackingThreat = (opponent.MID * 0.40) + (opponent.ATK * 0.60)
    let theirScoringChance = theirAttackingThreat / (theirAttackingThreat + myTeam.DEF)
    theirScoringChance = theirScoringChance * (1 - (myTeam.GK - 70) * 0.003)
    const winProb = yourScoringChance / (yourScoringChance + theirScoringChance)
    const finalWinProb = winProb + (Math.random() * 0.24 - 0.12)
    const won = finalWinProb > 0.5
    const { yourGoals, oppGoals } = generateScoreline(finalWinProb, won)
    return { won, winProb: finalWinProb, opponent, yourGoals, oppGoals }
}

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
    const selectedPlayers = location.state.selectedPlayers
    const mode = location.state.mode
    const ratings = calculateTeamRatings(selectedPlayers)
    const myTeam = calculateEffectiveTeamRatings(selectedPlayers)

    const gks = selectedPlayers.filter(p => p.position === 'GK')
    const defs = selectedPlayers.filter(p => p.position === 'DEF')
    const mids = selectedPlayers.filter(p => p.position === 'MID')
    const fwds = selectedPlayers.filter(p => p.position === 'FWD')

    return(
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-10" style={{flex: 1}}>

                <div className="flex items-center gap-3 mb-3">
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #F5C518)'}} />
                    <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>THE DRAFT IS COMPLETE</p>
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #F5C518)'}} />
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
                            border: `1px solid ${gold ? '#F5C518' : '#ffffff15'}`,
                            boxShadow: gold ? '0 0 20px #F5C51820' : 'none'
                        }}>
                            <span className="text-xs tracking-widest mb-1" style={{color: '#4b5563'}}>{label}</span>
                            <span className="text-4xl font-black" style={{color: gold ? '#F5C518' : 'white'}}>{value}</span>
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
                        const allNations = [...new Set(playersData.map(p => p.nation))]
                        const usedNations = []
                        const results = []
                        for(let i = 0; i < 8; i++){
                            const opponent = generateOpponent(i, usedNations, allNations)
                            usedNations.push(opponent.nation)
                            results.push(simulateMatch(myTeam, opponent))
                        }
                        navigate('/result', { state: { results, selectedPlayers, mode } })
                    }}
                    className="px-16 py-5 rounded-full font-black tracking-widest text-lg"
                    style={{backgroundColor: '#F5C518', color: '#0a0a0f', transition: 'all 0.2s ease'}}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 0 40px #F5C51840'
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