import {useLocation, useNavigate} from "react-router-dom";

export default function Summary(){
    const location = useLocation();
    const navigate = useNavigate()
    const results = location.state.results
    const mode = location.state.mode
    const eliminated = location.state.eliminated
    const eliminatedAt = location.state.eliminatedAt
    const advanced = results.slice(0,3).filter(r => r.won).length * 3 >= 4
    const stages = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final']

    return(
        <div>
            {eliminated &&
                <div>
                    <h2>Eliminated in {eliminatedAt}</h2>
                    <h3>Ahhhh!!! You could not win the World Cup</h3>
                </div>
            }
            {!eliminated &&
                <h2>🏆 YOU WON THE WORLD CUP!</h2>
            }
            <h3>Tournament Run</h3>
            {stages.map((stage, i) => {
                let status
                if (i === 0) {
                    status = advanced ? 'Advanced' : 'Eliminated'
                } else if (i <= results.length - 3) {
                    const matchResult = results[i + 2]
                    status = matchResult.won ? 'Advanced' : 'Eliminated'
                } else {
                    status = 'Did Not Reach'
                }
                return (
                    <div key={i}>
                        <p>{stage}</p>
                        <p>{status}</p>
                    </div>
                )
            })}
            <button onClick={() => navigate('/')}>Play Again</button>
        </div>
    )
}