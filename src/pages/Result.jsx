import {useLocation,useNavigate} from 'react-router-dom'
import {useState} from "react";
export default function Result() {
    const location = useLocation()
    const navigate = useNavigate()
    const results=location.state.results
    const selectedPlayers=location.state.selectedPlayers
    const mode=location.state.mode
    const [currentMatch,setCurrentMatch]=useState(0)
    const [points,setPoints]=useState(0)
    const [eliminated,setEliminated]=useState(false)
    const [tournamentwon,setTournamentwon]=useState(false)
    const [phase, setPhase] = useState('group') // 'group' or 'knockout'
    const roundNames = ['Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final']
    let leagueWins=0;
    let leaguePoints=0;
    for(let i=0;i<3;i++){
        if(results[i].won){
            leagueWins+=1;
            leaguePoints+=3;
        }
    }
    const advanced = leaguePoints >= 4
    return(
        <div>
            {phase === 'group' && (
            <div>
            <h2>Group Stage</h2>
            {results.slice(0,3).map((item,i) => (
                <div key={i}>
                    <h3>Matchday {i+1}: {item.won ? 'Win' : 'Loss'}</h3>
                </div>
            ))}
            <h3>Group Stage Points: {leaguePoints}</h3>
            <h2>{advanced ? "You Advanced!" : "Eliminated in Group Stage"}</h2>
            {advanced &&
                <button onClick={() => { setPhase('knockout'); setCurrentMatch(3) }}>
                    Enter Knockouts
                </button>
            }
            </div>
            )}
            {phase === 'knockout' && (
                <div>
                    <h2>{roundNames[currentMatch-3]}</h2>
                    <h3>{results[currentMatch].won? 'Won' :'Loss'}</h3>
                    {results[currentMatch].won && currentMatch === 7 &&
                        <button onClick={() => navigate('/summary', { state: { results, mode, eliminated: false } })}>
                            🏆 You Won The World Cup!
                        </button>
                    }
                    {results[currentMatch].won && currentMatch < 7 &&
                        <button onClick={() => setCurrentMatch(currentMatch + 1)}>
                            Go to {roundNames[currentMatch - 3 + 1]}
                        </button>
                    }
                    {!results[currentMatch].won &&
                        <button onClick={() => navigate('/summary', { state: { results, mode, eliminated: true } })}>
                            See Results
                        </button>
                    }
                </div>
            )}
        </div>
    )
}