import {useLocation,useNavigate} from 'react-router-dom'

function calculateTeamRatings(selectedPlayers) {
    let gkRating=0
    let atkRating=0
    let defRating=0
    let midRating=0
    let ovr=0;
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
    if(player.position === 'GK'){
        return (player.base_rating * 0.6) + ((s.save_pct ?? 0) * 0.35) + ((s.clean_sheets ?? 0) * 4) - ((s.goals_conceded ?? 0) * 1.5)
    }
    if(player.position === 'FWD'){
        return (player.base_rating * 0.6) + ((s.goals_per90 ?? 0) * 15) + (((s.shots_on_target ?? 0) / m) * 90 * 4) + ((s.assists ?? 0) * 2)
    }
    if(player.position === 'MID'){
        return (player.base_rating * 0.6) + (((s.key_passes ?? 0) / m) * 90 * 8) + (((s.progressive_passes ?? 0) / m) * 90 * 5) + ((s.assists ?? 0) * 3)
    }
    if(player.position === 'DEF'){
        return (player.base_rating * 0.6) + (((s.tackles ?? 0) / m) * 90 * 8) + (((s.interceptions ?? 0) / m) * 90 * 10) + (((s.clearances ?? 0) / m) * 90 * 3)
    }
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

export default function Simulate() {
    const navigate = useNavigate()
    const location = useLocation()
    const selectedPlayers = location.state.selectedPlayers
    const mode = location.state.mode
    const ratings = calculateTeamRatings(selectedPlayers)
    const myTeam = calculateEffectiveTeamRatings(selectedPlayers)

    return(
        <div>
            <h2>Team OVR: {ratings[0]}</h2>
            <h3>ATK: {ratings[1]}</h3>
            <h3>MID: {ratings[2]}</h3>
            <h3>DEF: {ratings[3]}</h3>
            {selectedPlayers.map(p => (
                <div key={p.id}>
                    <p>{p.name}</p>
                </div>
            ))}
            <button onClick={() => {
                const results = []
                for(let i = 0; i < 8; i++){
                    const opponent = generateOpponent(i)
                    results.push(simulateMatch(myTeam, opponent))
                }
                navigate('/result', { state: { results, selectedPlayers, mode } })
            }}>PLAY WORLD CUP</button>
        </div>
    )
}