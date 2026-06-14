import {useLocation, useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";

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
        <div className="min-h-screen w-full overflow-x-hidden text-white" style={{backgroundColor: '#0d1117'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12">
                {eliminated ? (
                    <div className="flex flex-col items-center mb-10">
                        <p className="text-sm tracking-widest mb-2" style={{color: '#e63946'}}>CAMPAIGN OVER</p>
                        <h1 className="text-5xl font-black tracking-wider mb-3 text-white">ELIMINATED</h1>
                        <p className="text-xl font-bold mb-2" style={{color: '#e63946'}}>{eliminatedAt.toUpperCase()}</p>
                        <p className="text-sm" style={{color: '#6b7280'}}>You could not win the World Cup. Try again.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center mb-10">
                        <p className="text-sm tracking-widest mb-2" style={{color: '#F5C518'}}>WORLD CUP WINNER</p>
                        <h1 className="text-6xl font-black tracking-wider mb-3" style={{color: '#F5C518'}}>🏆 CHAMPION</h1>
                        <p className="text-sm" style={{color: '#9ca3af'}}>You did the impossible. The trophy is yours.</p>
                    </div>
                )}

                <div className="w-full max-w-lg mb-10">
                    <p className="text-sm tracking-widest mb-4" style={{color: '#9ca3af'}}>TOURNAMENT RUN</p>
                    <div className="flex flex-col gap-3">
                        {stages.map((stage, i) => {
                            let status
                            if (i === 0) {
                                status = advanced ? 'Advanced' : 'Eliminated'
                            } else if (!advanced) {
                                status = 'Did Not Reach'
                            } else if (i <= results.length - 3) {
                                const matchResult = results[i + 2]
                                status = matchResult.won ? 'Advanced' : 'Eliminated'
                            } else {
                                status = 'Did Not Reach'
                            }

                            const color = status === 'Advanced' ? '#1a9e5c'
                                : status === 'Eliminated' ? '#e63946'
                                    : '#374151'

                            return (
                                <div key={i} className="flex justify-between items-center px-6 py-4 rounded-xl"
                                     style={{backgroundColor: '#111827', border: `1px solid ${color}30`}}>
                                    <p className="text-sm font-semibold text-white">{stage.toUpperCase()}</p>
                                    <p className="text-xs font-bold tracking-wider" style={{color}}>{status.toUpperCase()}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="px-12 py-4 rounded-full font-black tracking-widest transition-all hover:opacity-80 hover:scale-105"
                    style={{backgroundColor: '#F5C518', color: '#0d1117'}}>
                    PLAY AGAIN
                </button>
            </div>
        </div>
    )
}