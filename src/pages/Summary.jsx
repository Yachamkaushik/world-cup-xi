import {useLocation, useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const nationFlags = {
    'Brazil': '🇧🇷', 'France': '🇫🇷', 'Argentina': '🇦🇷', 'Germany': '🇩🇪',
    'Spain': '🇪🇸', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Portugal': '🇵🇹', 'Belgium': '🇧🇪',
    'Croatia': '🇭🇷', 'Uruguay': '🇺🇾', 'Colombia': '🇨🇴', 'Senegal': '🇸🇳',
    'Japan': '🇯🇵', 'Morocco': '🇲🇦', 'Russia': '🇷🇺', 'Sweden': '🇸🇪'
}

export default function Summary(){
    const location = useLocation();
    const navigate = useNavigate()
    const results = location.state.results
    const selectedPlayers = location.state.selectedPlayers
    const mode = location.state.mode
    const eliminated = location.state.eliminated
    const eliminatedAt = location.state.eliminatedAt

    let leaguePoints = 0
    for(let i = 0; i < 3; i++){
        if(results[i].won) leaguePoints += 3
    }
    const advanced = leaguePoints >= 4
    const stages = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final']

    // tournament run with cascading elimination
    let stillAlive = true
    const tournamentRun = stages.map((stage, i) => {
        let status, detail
        if (i === 0) {
            status = advanced ? 'ADVANCED' : 'ELIMINATED'
            detail = `${leaguePoints} pts`
            stillAlive = advanced
        } else {
            const matchIndex = i + 2
            const r = results[matchIndex]
            if (!stillAlive || !r) {
                status = 'DID NOT PLAY'
                detail = '—'
            } else {
                status = r.won ? 'WON' : 'ELIMINATED'
                detail = `${r.yourGoals} – ${r.oppGoals} vs ${r.opponent.nation}`
                stillAlive = r.won
            }
        }
        return { stage, status, detail }
    })

    // matches actually played (have a valid result)
    const matchesPlayed = results.slice(0, tournamentRun.filter(t => t.status !== 'DID NOT PLAY').length)

    // total goals scored — split across FWDs roughly using their share of base_rating, simple approx for now
    const fwds = selectedPlayers.filter(p => p.position === 'FWD')
    const totalGoalsScored = matchesPlayed.reduce((sum, m) => sum + m.yourGoals, 0)
    const topScorer = fwds.length > 0 ? [...fwds].sort((a, b) => b.base_rating - a.base_rating)[0] : null

    // MVP — highest base_rating overall
    const mvp = selectedPlayers ? [...selectedPlayers].sort((a, b) => b.base_rating - a.base_rating)[0] : null

    return(
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12" style={{flex: 1}}>

                {eliminated ? (
                    <div className="flex flex-col items-center mb-10 text-center">
                        <span style={{fontSize: '3rem'}}>💀</span>
                        <p className="text-xs tracking-widest font-bold mt-3 mb-2" style={{color: '#e63946'}}>TOURNAMENT RESULT</p>
                        <h1 className="font-black mb-4" style={{fontSize: 'clamp(3rem, 9vw, 6rem)', letterSpacing: '-0.02em'}}>
                            <span style={{color: 'white'}}>ELIM</span><span style={{color: '#e63946'}}>INATED.</span>
                        </h1>
                        <p className="text-base max-w-md" style={{color: '#6b7280'}}>
                            The dream ended in the <span style={{color: 'white', fontWeight: 700}}>{eliminatedAt}</span>. Glory is a cruel mistress. Run it back?
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center mb-10 text-center">
                        <span style={{fontSize: '3rem'}}>🏆</span>
                        <p className="text-xs tracking-widest font-bold mt-3 mb-2" style={{color: '#F5C518'}}>TOURNAMENT RESULT</p>
                        <h1 className="font-black mb-4" style={{fontSize: 'clamp(3rem, 9vw, 6rem)', color: '#F5C518', letterSpacing: '-0.02em'}}>
                            CHAMPION.
                        </h1>
                        <p className="text-base max-w-md" style={{color: '#6b7280'}}>
                            You did the impossible. The trophy is yours.
                        </p>
                    </div>
                )}

                {/* tournament run */}
                <div className="w-full mb-10" style={{maxWidth: '750px'}}>
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>TOURNAMENT RUN</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                        {tournamentRun.map(({stage, status, detail}, i) => {
                            const color = status === 'ADVANCED' || status === 'WON' ? '#1a9e5c'
                                : status === 'ELIMINATED' ? '#e63946'
                                    : '#374151'
                            return (
                                <div key={i} className="flex justify-between items-center px-6 py-4" style={{
                                    borderBottom: i < tournamentRun.length - 1 ? '1px solid #ffffff08' : 'none'
                                }}>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold" style={{color: '#374151'}}>0{i+1}</span>
                                        <p className="font-bold text-white">{stage.toUpperCase()}</p>
                                    </div>
                                    <p className="text-sm" style={{color: '#6b7280'}}>{detail}</p>
                                    <p className="text-xs font-bold tracking-wider" style={{color}}>{status}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* stats row — goals scored + MVP + top scorer */}
                <div className="w-full mb-10" style={{maxWidth: '750px'}}>
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>CAMPAIGN STATS</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center justify-center px-4 py-6 rounded-2xl" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                            <span className="text-4xl font-black" style={{color: '#F5C518'}}>{totalGoalsScored}</span>
                            <span className="text-xs tracking-widest mt-2" style={{color: '#4b5563'}}>GOALS SCORED</span>
                        </div>
                        {mvp && (
                            <div className="flex flex-col items-center justify-center px-4 py-6 rounded-2xl text-center" style={{backgroundColor: '#111827', border: '1px solid #F5C51830'}}>
                                <span style={{fontSize: '1.3rem'}}>{nationFlags[mvp.nation] || '🏳️'}</span>
                                <p className="font-bold text-sm text-white mt-2">{mvp.name}</p>
                                <span className="text-xs tracking-widest mt-1" style={{color: '#F5C518'}}>TOURNAMENT MVP</span>
                            </div>
                        )}
                        {topScorer && (
                            <div className="flex flex-col items-center justify-center px-4 py-6 rounded-2xl text-center" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                                <span style={{fontSize: '1.3rem'}}>{nationFlags[topScorer.nation] || '🏳️'}</span>
                                <p className="font-bold text-sm text-white mt-2">{topScorer.name}</p>
                                <span className="text-xs tracking-widest mt-1" style={{color: '#4b5563'}}>TOP SCORER</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-12 py-4 rounded-full font-black tracking-widest"
                        style={{backgroundColor: '#F5C518', color: '#0a0a0f', transition: 'all 0.2s ease'}}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px #F5C51840'; e.currentTarget.style.transform = 'scale(1.03)' }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}>
                        {eliminated ? 'BUILD ANOTHER' : 'PLAY AGAIN'}
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'World Cup XI',
                                    text: eliminated ? `I got eliminated in the ${eliminatedAt} of World Cup XI. Can you do better?` : `I won the World Cup in World Cup XI! 🏆`,
                                })
                            }
                        }}
                        className="px-10 py-4 rounded-full font-black tracking-widest"
                        style={{backgroundColor: '#111827', color: 'white', border: '1px solid #ffffff20', transition: 'all 0.2s ease'}}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff50' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff20' }}>
                        SHARE
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    )
}