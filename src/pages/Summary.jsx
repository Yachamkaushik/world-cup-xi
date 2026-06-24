import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import confetti from "canvas-confetti";
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import { nationFlags } from '../utils/flags'


const twitterStyle = {backgroundColor: '#1d9bf020', color: '#1d9bf0', border: '1px solid #1d9bf040', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', textAlign: 'center'}
const waStyle = {backgroundColor: '#25d36620', color: '#25d366', border: '1px solid #25d36640', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', textAlign: 'center'}

export default function Summary(){
    const cardRef = useRef(null)
    const hasSaved = useRef(false)
    const location = useLocation();
    const navigate = useNavigate()
    const [showShareModal, setShowShareModal] = useState(false)
    const [shareImage, setShareImage] = useState(null)

    const hasState = !!location.state?.results
    const results = location.state?.results ?? []
    const selectedPlayers = location.state?.selectedPlayers ?? []
    const mode = location.state?.mode ?? ''
    const eliminated = location.state?.eliminated ?? true
    const eliminatedAt = location.state?.eliminatedAt ?? ''
    const accentColor = mode === 'purist' ? '#3b82f6' : '#F5C518'
    const accentGlow = mode === 'purist' ? '#3b82f640' : '#F5C51840'

    let leaguePoints = 0
    for(let i = 0; i < 3; i++){
        if(results[i].outcome === 'win') leaguePoints += 3
        else if(results[i].outcome === 'draw') leaguePoints += 1
    }
    const advanced = leaguePoints >= 4
    const stages = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final']

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
                detail = `${r.yourGoals} – ${r.oppGoals}${r.wentToPens ? ` (${r.penScore} pens)` : ''} vs ${r.opponent.nation}`
                stillAlive = r.won
            }
        }
        return { stage, status, detail }
    })

    const matchesPlayed = results.slice(0, tournamentRun.filter(t => t.status !== 'DID NOT PLAY').length)
    const fwds = selectedPlayers.filter(p => p.position === 'FWD')
    const totalGoalsScored = matchesPlayed.reduce((sum, m) => sum + m.yourGoals, 0)
    const topScorer = fwds.length > 0 ? [...fwds].sort((a, b) => (b.wc_stats?.goals ?? 0) - (a.wc_stats?.goals ?? 0))[0] : null
    const mvp = selectedPlayers ? [...selectedPlayers].sort((a, b) => b.base_rating - a.base_rating)[0] : null

    const handleShare = async () => {
        const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0a0a0f' })
        const image = canvas.toDataURL('image/png')
        setShareImage(image)
        if (navigator.share && navigator.canShare) {
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'worldcupxi.png', { type: 'image/png' })
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: 'World Cup XI' })
                } else {
                    setShowShareModal(true)
                }
            })
        } else {
            setShowShareModal(true)
        }
    }

    useEffect(() => {
        if (!hasState) { navigate('/'); return }
        if (hasSaved.current) return
        hasSaved.current = true

        const run = {
            date: new Date().toLocaleDateString(),
            eliminatedAt: eliminated ? eliminatedAt : 'Champion',
            won: !eliminated,
            goalsScored: totalGoalsScored,
            nations: [...new Set(selectedPlayers.map(p => p.nation))]
        }
        const existing = JSON.parse(localStorage.getItem('wcxi_runs') || '[]')
        const updated = [run, ...existing].slice(0, 20)
        localStorage.setItem('wcxi_runs', JSON.stringify(updated))

        if (!eliminated) {
            confetti({ particleCount: 200, spread: 180, origin: { y: 0.6 } })
        } else {
            const duration = 3000
            const end = Date.now() + duration
            const interval = setInterval(() => {
                if (Date.now() > end) { clearInterval(interval); return }
                confetti({
                    particleCount: 8, angle: 270, spread: 120,
                    origin: { x: Math.random(), y: 0 },
                    colors: ['#374151', '#1f2937', '#4b5563', '#6b7280', '#111827'],
                    gravity: 0.4, ticks: 300, scalar: 0.7, drift: 0.2
                })
            }, 80)
            return () => clearInterval(interval)
        }
    }, [])

    if (!hasState) return null

    const tweetText = encodeURIComponent(eliminated
        ? `I got eliminated in the ${eliminatedAt} of World Cup XI. Can you do better? world-cup-xi-one.vercel.app`
        : `I won the World Cup in World Cup XI! 🏆 world-cup-xi-one.vercel.app`)

    const waText = encodeURIComponent(eliminated
        ? `I got eliminated in the ${eliminatedAt} of World Cup XI. Can you do better? world-cup-xi-one.vercel.app`
        : `I won the World Cup in World Cup XI! 🏆 world-cup-xi-one.vercel.app`)

    return(
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12" style={{flex: 1}}>

                {eliminated ? (
                    <div className="flex flex-col items-center mb-10 text-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{fontSize: '3rem'}}>
                            💀
                        </motion.span>
                        <p className="text-xs tracking-widest font-bold mt-3 mb-2" style={{color: '#e63946'}}>TOURNAMENT RESULT</p>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="font-black mb-4" style={{fontSize: 'clamp(3rem, 9vw, 6rem)', letterSpacing: '-0.02em'}}>
                            <span style={{color: 'white'}}>ELIM</span><span style={{color: '#e63946'}}>INATED.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="text-base max-w-md" style={{color: '#6b7280'}}>
                            The dream ended in the <span style={{color: 'white', fontWeight: 700}}>{eliminatedAt}</span>. Glory is a cruel mistress. Run it back?
                        </motion.p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center mb-10 text-center">
                        <span style={{fontSize: '3rem'}}>🏆</span>
                        <p className="text-xs tracking-widest font-bold mt-3 mb-2" style={{color: accentColor}}>TOURNAMENT RESULT</p>
                        <motion.h1
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                            className="font-black mb-4" style={{fontSize: 'clamp(3rem, 9vw, 6rem)', color: accentColor, letterSpacing: '-0.02em'}}>
                            CHAMPION.
                        </motion.h1>
                        <p className="text-base max-w-md" style={{color: '#6b7280'}}>
                            You did the impossible. The trophy is yours.
                        </p>
                    </div>
                )}

                {/* tournament run */}
                <div className="w-full mb-10" style={{maxWidth: '750px'}}>
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{height: '2px', width: '20px', backgroundColor: accentColor}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>TOURNAMENT RUN</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                        {tournamentRun.map(({stage, status, detail}, i) => {
                            const color = status === 'ADVANCED' || status === 'WON' ? '#1a9e5c'
                                : status === 'ELIMINATED' ? '#e63946'
                                    : '#374151'
                            return (
                                <div key={i} className="grid items-center px-6 py-4" style={{
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    borderBottom: i < tournamentRun.length - 1 ? '1px solid #ffffff08' : 'none'
                                }}>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold" style={{color: '#374151'}}>{String(i+1).padStart(2,'0')}</span>
                                        <p className="font-bold text-white">{stage.toUpperCase()}</p>
                                    </div>
                                    <p className="text-sm text-center" style={{color: '#6b7280'}}>{detail}</p>
                                    <p className="text-xs font-bold tracking-wider text-right" style={{color}}>{status}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* stats row */}
                <div className="w-full mb-10" style={{maxWidth: '750px'}}>
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{height: '2px', width: '20px', backgroundColor: accentColor}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>CAMPAIGN STATS</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center justify-center px-4 py-6 rounded-2xl" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                            <span className="text-4xl font-black" style={{color: accentColor}}>{totalGoalsScored}</span>
                            <span className="text-xs tracking-widest mt-2" style={{color: '#4b5563'}}>GOALS SCORED</span>
                        </div>
                        {mvp && (
                            <div className="flex flex-col items-center justify-center px-4 py-6 rounded-2xl text-center" style={{backgroundColor: '#111827', border: `1px solid ${accentColor}30`}}>
                                <span style={{fontSize: '1.3rem'}}>{nationFlags[mvp.nation] || '🏳️'}</span>
                                <p className="font-bold text-sm text-white mt-2">{mvp.name}</p>
                                <span className="text-xs tracking-widest mt-1" style={{color: accentColor}}>TOURNAMENT MVP</span>
                            </div>
                        )}
                        {topScorer && (
                            <div className="flex flex-col items-center justify-center px-4 py-6 rounded-2xl text-center" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                                <span style={{fontSize: '1.3rem'}}>{nationFlags[topScorer.nation] || '🏳️'}</span>
                                <p className="font-bold text-sm text-white mt-2">{topScorer.name}</p>
                                <span className="text-xs tracking-widest mt-1" style={{color: '#4b5563'}}>BEST FWD</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-12 py-4 rounded-full font-black tracking-widest"
                        style={{backgroundColor: accentColor, color: '#0a0a0f', transition: 'all 0.2s ease'}}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 40px ${accentGlow}`; e.currentTarget.style.transform = 'scale(1.03)' }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}>
                        {eliminated ? 'BUILD ANOTHER' : 'PLAY AGAIN'}
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-10 py-4 rounded-full font-black tracking-widest"
                        style={{backgroundColor: '#111827', color: 'white', border: '1px solid #ffffff20', transition: 'all 0.2s ease'}}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ffffff50' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff20' }}>
                        SHARE CARD
                    </button>
                </div>
            </div>

            {/* hidden share card */}
            <div ref={cardRef} style={{
                position: 'fixed', top: '-9999px', width: '600px',
                backgroundColor: '#0a0a0f', padding: '40px',
                fontFamily: 'sans-serif', color: 'white'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px'}}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: accentColor, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 900, color: '#0a0a0f',
                        fontSize: '13px', letterSpacing: '0px', lineHeight: 1
                    }}>XI</div>
                    <span style={{fontWeight: 900, color: accentColor, letterSpacing: '2px', fontSize: '14px'}}>WORLD CUP XI</span>
                </div>
                <h2 style={{fontWeight: 900, fontSize: '48px', letterSpacing: '-1px', marginBottom: '8px'}}>
                    {eliminated
                        ? <><span style={{color: 'white'}}>ELIM</span><span style={{color: '#e63946'}}>INATED.</span></>
                        : <span style={{color: accentColor}}>CHAMPION.</span>
                    }
                </h2>
                <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '24px'}}>
                    {eliminated ? `Eliminated in the ${eliminatedAt}` : 'Won the World Cup'} · {mode.toUpperCase()} MODE · {totalGoalsScored} goals scored
                </p>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px'}}>
                    {selectedPlayers.map((p, i) => (
                        <div key={i} style={{display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111827', padding: '8px 12px', borderRadius: '8px'}}>
                            <span style={{fontSize: '10px', color: '#374151', width: '16px'}}>0{i+1}</span>
                            <span style={{fontSize: '12px', fontWeight: 700, color: 'white'}}>{p.name}</span>
                            <span style={{fontSize: '10px', color: '#4b5563', marginLeft: 'auto'}}>{p.position}</span>
                        </div>
                    ))}
                </div>
                <div style={{borderTop: '1px solid #ffffff10', paddingTop: '16px', display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{fontSize: '11px', color: '#374151'}}>world-cup-xi-one.vercel.app</span>
                    <span style={{fontSize: '11px', color: '#374151'}}>NOT AFFILIATED WITH FIFA</span>
                </div>
            </div>

            {/* share modal */}
            {showShareModal && (
                <div
                    onClick={() => setShowShareModal(false)}
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: '#000000aa',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                    }}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            backgroundColor: '#111827', border: '1px solid #ffffff15',
                            borderRadius: '16px', padding: '32px', width: '320px',
                            display: 'flex', flexDirection: 'column', gap: '12px'
                        }}>
                        <p className="font-black text-white text-lg tracking-wide mb-2">SHARE YOUR RUN</p>
                        <a href={`https://twitter.com/intent/tweet?text=${tweetText}`} target="_blank" rel="noreferrer" style={twitterStyle}>
                            Share on Twitter / X
                        </a>
                        <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noreferrer" style={waStyle}>
                            Share on WhatsApp
                        </a>
                        <button
                            onClick={() => {
                                const link = document.createElement('a')
                                link.download = 'worldcupxi.png'
                                link.href = shareImage
                                link.click()
                            }}
                            style={{backgroundColor: '#ffffff10', color: 'white', border: '1px solid #ffffff20', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, fontSize: '14px', cursor: 'pointer'}}>
                            Download Image
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText('world-cup-xi-one.vercel.app')
                                alert('Link copied!')
                            }}
                            style={{backgroundColor: '#ffffff10', color: '#9ca3af', border: '1px solid #ffffff10', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, fontSize: '14px', cursor: 'pointer'}}>
                            Copy Link
                        </button>
                        <button
                            onClick={() => setShowShareModal(false)}
                            style={{color: '#4b5563', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px'}}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}