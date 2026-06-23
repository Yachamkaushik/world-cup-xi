import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { nationFlags } from '../utils/flags'


export default function Profile() {
    const navigate = useNavigate()
    const [runs, setRuns] = useState([])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('wcxi_runs') || '[]')
        setRuns(stored)
    }, [])

    const totalRuns = runs.length
    const totalWins = runs.filter(r => r.won).length
    const winRate = totalRuns > 0 ? Math.round((totalWins / totalRuns) * 100) : 0

    const favouriteNation = (() => {
        if (runs.length === 0) return null
        const counts = {}
        runs.forEach(r => r.nations.forEach(n => {
            counts[n] = (counts[n] || 0) + 1
        }))
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    })()

    const last5 = runs.slice(0, 5)

    return (
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12" style={{flex: 1, maxWidth: '750px', margin: '0 auto', width: '100%'}}>

                {/* header */}
                <div className="flex items-center gap-3 mb-3">
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #F5C518)'}} />
                    <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>YOUR PROFILE</p>
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #F5C518)'}} />
                </div>
                <h1 className="font-black mb-10 text-center" style={{fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'white', letterSpacing: '-0.02em'}}>
                    DRAFT HISTORY
                </h1>

                {totalRuns === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <span style={{fontSize: '3rem'}}>⚽</span>
                        <p className="font-bold text-lg text-white">No runs yet</p>
                        <p className="text-sm" style={{color: '#4b5563'}}>Complete a tournament to see your stats here</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 rounded-full font-black tracking-widest text-sm mt-4"
                            style={{backgroundColor: '#F5C518', color: '#0a0a0f'}}>
                            PLAY NOW
                        </button>
                    </div>
                ) : (
                    <>
                        {/* stats row */}
                        <div className="grid grid-cols-4 gap-3 w-full mb-10">
                            {[
                                { label: 'RUNS', value: totalRuns },
                                { label: 'WINS', value: totalWins },
                                { label: 'WIN RATE', value: `${winRate}%` },
                                { label: 'FAV NATION', value: favouriteNation ? nationFlags[favouriteNation] || '🏳️' : '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col items-center justify-center px-4 py-6 rounded-2xl" style={{
                                    backgroundColor: '#111827',
                                    border: '1px solid #ffffff10'
                                }}>
                                    <span className="text-3xl font-black text-white">{value}</span>
                                    <span className="text-xs tracking-widest mt-2" style={{color: '#4b5563'}}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* last 5 runs */}
                        <div className="w-full mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                                <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>RECENT RUNS</p>
                            </div>
                            <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                                {last5.map((run, i) => (
                                    <div key={i} className="flex justify-between items-center px-6 py-4" style={{
                                        borderBottom: i < last5.length - 1 ? '1px solid #ffffff08' : 'none'
                                    }}>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold" style={{color: '#374151'}}>0{i + 1}</span>
                                            <p className="font-bold text-white text-sm">{run.eliminatedAt}</p>
                                        </div>
                                        <p className="text-sm" style={{color: '#6b7280'}}>{run.goalsScored} goals</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs" style={{color: '#4b5563'}}>{run.date}</span>
                                            <span className="text-xs font-bold px-2 py-1 rounded" style={{
                                                backgroundColor: run.won ? '#1a9e5c20' : '#e6394620',
                                                color: run.won ? '#1a9e5c' : '#e63946',
                                                border: `1px solid ${run.won ? '#1a9e5c40' : '#e6394640'}`
                                            }}>{run.won ? 'W' : 'L'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* clear data */}
                        <button
                            onClick={() => {
                                localStorage.removeItem('wcxi_runs')
                                setRuns([])
                            }}
                            className="text-xs font-bold tracking-widest px-4 py-2 rounded"
                            style={{color: '#374151', border: '1px solid #1f2937', backgroundColor: 'transparent'}}>
                            CLEAR HISTORY
                        </button>
                    </>
                )}
            </div>
            <Footer />
        </div>
    )
}