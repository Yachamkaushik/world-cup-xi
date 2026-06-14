import {useLocation, useNavigate} from 'react-router-dom'
import Navbar from "../components/Navbar";

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

function generateOpponent(round) {
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
    return { ATK, MID, DEF, GK, OVR, style, baseOVR }
}

function simulateMatch(myTeam, opponent){
    let attackingThreat = (myTeam.MID * 0.40) + (myTeam.ATK * 0.60)
    let yourScoringChance = attackingThreat / (attackingThreat + opponent.DEF)
    let theirAttackingThreat = (opponent.MID * 0.40) + (opponent.ATK * 0.60)
    let theirScoringChance = theirAttackingThreat / (theirAttackingThreat + myTeam.DEF)
    theirScoringChance = theirScoringChance * (1 - (myTeam.GK - 70) * 0.003)
    const winProb = yourScoringChance / (yourScoringChance + theirScoringChance)
    const finalWinProb = winProb + (Math.random() * 0.24 - 0.12)
    return { won: finalWinProb > 0.5, winProb: finalWinProb, opponent }
}

const positionColors = {
    GK: { bg: '#78350f', text: '#fbbf24' },
    DEF: { bg: '#1e3a5f', text: '#60a5fa' },
    MID: { bg: '#14532d', text: '#4ade80' },
    FWD: { bg: '#7f1d1d', text: '#f87171' },
}

export default function Simulate() {
    const navigate = useNavigate()
    const location = useLocation()
    const selectedPlayers = location.state.selectedPlayers
    const mode = location.state.mode
    const ratings = calculateTeamRatings(selectedPlayers)
    const myTeam = calculateEffectiveTeamRatings(selectedPlayers)

    return(
        <div className="min-h-screen w-full overflow-x-hidden text-white" style={{backgroundColor: '#0d1117'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12">

                {/* header */}
                <p className="text-sm tracking-widest mb-2" style={{color: '#F5C518'}}>YOUR SQUAD IS READY</p>
                <h1 className="text-5xl font-black tracking-wider mb-10 text-white">WORLD CUP XI</h1>

                {/* team ratings */}
                <div className="flex gap-6 mb-12">
                    {[
                        { label: 'OVR', value: ratings[0] },
                        { label: 'ATK', value: ratings[1] },
                        { label: 'MID', value: ratings[2] },
                        { label: 'DEF', value: ratings[3] },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col items-center px-6 py-4 rounded-xl" style={{backgroundColor: '#111827', border: '1px solid #ffffff15'}}>
                            <span className="text-3xl font-black" style={{color: '#F5C518'}}>{value}</span>
                            <span className="text-xs tracking-widest mt-1" style={{color: '#9ca3af'}}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* player list */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mb-12">
                    {selectedPlayers.map(p => {
                        const colors = positionColors[p.position] || { bg: '#1f2937', text: '#9ca3af' }
                        return (
                            <div key={p.id} className="px-4 py-3 rounded-xl flex items-center gap-3" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{backgroundColor: colors.bg, color: colors.text}}>{p.position}</span>
                                <span className="text-sm font-semibold text-white">{p.name}</span>
                            </div>
                        )
                    })}
                </div>

                {/* play button */}
                <button
                    onClick={() => {
                        const results = []
                        for(let i = 0; i < 8; i++){
                            const opponent = generateOpponent(i)
                            results.push(simulateMatch(myTeam, opponent))
                        }
                        navigate('/result', { state: { results, selectedPlayers, mode } })
                    }}
                    className="px-16 py-5 rounded-full font-black tracking-widest text-lg transition-all hover:opacity-80 hover:scale-105"
                    style={{backgroundColor: '#F5C518', color: '#0d1117'}}>
                    START WORLD CUP
                </button>
            </div>
        </div>
    )
}