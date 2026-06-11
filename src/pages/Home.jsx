import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()
    return(
        <div>
            <h1>WORLD CUP XI</h1>
            <h3>Can you go win the world cup?</h3>
            <h2>Select Your Mode</h2>
            <div>
            <button onClick={() => navigate('/draft', { state: { mode: 'classic' } })}>Classic Mode</button>
                <p>Draft with complete stats visible</p>
                <p>Made proper informed picks</p>
            </div>
            <div>
            <button onClick={() => navigate('/draft', { state: { mode: 'purist' } })}>Purist Mode</button>
                <p>Show Your Football knowledge</p>
                <p>Player Stats are hidden</p>
            </div>
        </div>
    )
}