import { useNavigate } from 'react-router-dom'
import Navbar from "../components/Navbar.jsx";

export default function Home() {
    const navigate = useNavigate()
    return(
        <div style={{backgroundColor: '#0d1117', minHeight: '100vh', color: 'white'}}>
            <Navbar />
            <div className="flex flex-col items-center justify-center text-center px-6" style={{minHeight: 'calc(100vh - 65px)'}}>
                <p className="text-sm tracking-widest mb-4" style={{color: '#F5C518'}}>THE ULTIMATE FOOTBALL DRAFT</p>
                <h1 className="text-7xl font-black tracking-wider mb-6" style={{color: 'white'}}>WORLD CUP XI</h1>
                <p className="text-xl font-semibold mb-3" style={{color: '#9ca3af'}}>Draft legends. Build your XI. Win the impossible.</p>
                <p className="text-sm mb-16 max-w-lg" style={{color: '#6b7280'}}>Pick one player per round from historic World Cup squads. Every spin is different. Most runs end in failure. That's the point.</p>

                <div className="flex gap-6">
                    <div
                        onClick={() => navigate('/draft', { state: { mode: 'classic' } })}
                        className="cursor-pointer px-10 py-8 rounded-2xl text-left transition-all hover:scale-105"
                        style={{backgroundColor: '#111827', border: '1px solid #F5C518', minWidth: '200px'}}>
                        <h3 className="text-xl font-bold mb-2" style={{color: '#F5C518'}}>CLASSIC</h3>
                        <p className="text-sm" style={{color: '#9ca3af'}}>Stats visible. One skip available.</p>
                    </div>
                    <div
                        onClick={() => navigate('/draft', { state: { mode: 'purist' } })}
                        className="cursor-pointer px-10 py-8 rounded-2xl text-left transition-all hover:scale-105"
                        style={{backgroundColor: '#111827', border: '1px solid #ffffff20', minWidth: '200px'}}>
                        <h3 className="text-xl font-bold mb-2" style={{color: 'white'}}>PURIST</h3>
                        <p className="text-sm" style={{color: '#9ca3af'}}>Names only. No stats. No skips.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}