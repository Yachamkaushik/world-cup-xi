function getRawScore(player) {
    const s = player.wc_stats
    const m = s.minutes_played || 1
    if (m === 0) return 0
    if (player.position === 'GK') return ((s.save_pct ?? 0) * 0.5) + ((s.clean_sheets ?? 0) * 5) - ((s.goals_conceded ?? 0) * 2)
    if (player.position === 'FWD') return (s.goals_per90 ?? 0) * 10 + ((s.shots_on_target ?? 0) / m) * 90 + (s.assists ?? 0) * 1.5
    if (player.position === 'MID') return ((s.key_passes ?? 0) / m) * 90 * 1.5 + ((s.progressive_passes ?? 0) / m) * 90 + (s.assists ?? 0) * 2
    if (player.position === 'DEF') return ((s.interceptions ?? 0) / m) * 90 * 4
    return 0
}

function buildPositionScores(allPlayers) {
    const scores = { GK: [], FWD: [], MID: [], DEF: [] }
    allPlayers.forEach(p => scores[p.position].push(getRawScore(p)))
    Object.keys(scores).forEach(pos => scores[pos].sort((a, b) => a - b))
    return scores
}

function percentileOf(score, sortedScores) {
    let count = 0
    for (const s of sortedScores) { if (s <= score) count++ }
    return (count / sortedScores.length) * 100
}

function calculateEffectiveRating(player, positionScores) {
    const score = getRawScore(player)
    const pct = percentileOf(score, positionScores[player.position])
    const bonusPct = -5 + (pct / 100) * 27
    const effective = player.base_rating + player.base_rating * (bonusPct / 100)
    return Math.min(effective, 99)
}

function calculateEffectiveTeamRatings(selectedPlayers, positionScores){
    const fwds = selectedPlayers.filter(p => p.position === 'FWD')
    const defs = selectedPlayers.filter(p => p.position === 'DEF')
    const mids = selectedPlayers.filter(p => p.position === 'MID')
    const gk = selectedPlayers.find(p => p.position === 'GK')
    let atkTeamRating=0, defTeamRating=0, midTeamRating=0
    const gkRating = Math.ceil(calculateEffectiveRating(gk, positionScores))
    fwds.forEach(p => atkTeamRating += calculateEffectiveRating(p, positionScores))
    defs.forEach(p => defTeamRating += calculateEffectiveRating(p, positionScores))
    mids.forEach(p => midTeamRating += calculateEffectiveRating(p, positionScores))
    const effectiveATK = Math.ceil(atkTeamRating/fwds.length * (1 + (midTeamRating/mids.length - 75) * 0.005))
    const effectiveDEF = Math.ceil(defTeamRating/defs.length * (1 + (midTeamRating/mids.length - 75) * 0.005))
    const effectiveMID = Math.ceil(midTeamRating/mids.length)
    const OVR = Math.ceil((effectiveATK * 0.30) + (effectiveMID * 0.25) + (effectiveDEF * 0.25) + (gkRating * 0.20))
    return { ATK: effectiveATK, MID: effectiveMID, DEF: effectiveDEF, GK: gkRating, OVR }
}

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

function generateScoreline(winProb, outcome){
    let goalDiff = (winProb - 0.5) * 6
    let totalGoals = 2 + Math.floor(Math.random() * 3)
    let yourGoals = Math.round((totalGoals + goalDiff) / 2)
    let oppGoals = totalGoals - yourGoals
    yourGoals = Math.max(0, yourGoals)
    oppGoals = Math.max(0, oppGoals)

    if (outcome === 'draw') {
        const avg = Math.round((yourGoals + oppGoals) / 2)
        yourGoals = avg
        oppGoals = avg
    } else if (outcome === 'win' && yourGoals <= oppGoals) {
        yourGoals = oppGoals + 1
    } else if (outcome === 'loss' && oppGoals <= yourGoals) {
        oppGoals = yourGoals + 1
    }

    return { yourGoals, oppGoals }
}

function generatePenalties(outcome) {
    const winPens = Math.floor(Math.random() * 3) + 3  // 3-5
    const lossPens = winPens - 1
    if (outcome === 'win') {
        return `${winPens}-${lossPens}`
    } else {
        return `${lossPens}-${winPens}`
    }
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

function simulateMatch(myTeam, opponent, roundIndex){
    let attackingThreat = (myTeam.MID * 0.40) + (myTeam.ATK * 0.60)
    let yourScoringChance = attackingThreat / (attackingThreat + opponent.DEF)
    let theirAttackingThreat = (opponent.MID * 0.40) + (opponent.ATK * 0.60)
    let theirScoringChance = theirAttackingThreat / (theirAttackingThreat + myTeam.DEF)
    theirScoringChance = theirScoringChance * (1 - (myTeam.GK - 70) * 0.003)
    const winProb = yourScoringChance / (yourScoringChance + theirScoringChance)
    const finalWinProb = winProb + (Math.random() * 0.24 - 0.12)

    let outcome
    if (finalWinProb > 0.55) outcome = 'win'
    else if (finalWinProb < 0.45) outcome = 'loss'
    else outcome = 'draw'

    let wentToPens = false
    let penScore = null

    if (outcome === 'draw' && roundIndex >= 3) {
        outcome = Math.random() > 0.5 ? 'win' : 'loss'
        wentToPens = true
        penScore = generatePenalties(outcome)
    }

    const { yourGoals, oppGoals } = generateScoreline(finalWinProb, wentToPens ? 'draw' : outcome)
    return { won: outcome === 'win', outcome, winProb: finalWinProb, opponent, yourGoals, oppGoals, wentToPens, penScore }
}

export {
    getRawScore,
    buildPositionScores,
    percentileOf,
    calculateEffectiveRating,
    calculateEffectiveTeamRatings,
    calculateTeamRatings,
    generateScoreline,
    generateOpponent,
    simulateMatch
}