import { useNavigate } from 'react-router-dom'
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const flags = [
    { flag: '🇧🇷', top: '12%', left: '2%', size: '3.5rem', opacity: 0.25, rotate: '-12deg' },
    { flag: '🇫🇷', top: '28%', left: '7%', size: '2rem', opacity: 0.18, rotate: '8deg' },
    { flag: '🇦🇷', top: '45%', left: '1%', size: '4rem', opacity: 0.2, rotate: '-5deg' },
    { flag: '🇩🇪', top: '62%', left: '9%', size: '2.5rem', opacity: 0.18, rotate: '15deg' },
    { flag: '🇪🇸', top: '78%', left: '3%', size: '3rem', opacity: 0.22, rotate: '-8deg' },
    { flag: '🇮🇹', top: '90%', left: '12%', size: '2rem', opacity: 0.18, rotate: '10deg' },
    { flag: '🇳🇱', top: '5%', left: '18%', size: '1.8rem', opacity: 0.15, rotate: '6deg' },
    { flag: '🇺🇾', top: '70%', left: '20%', size: '1.5rem', opacity: 0.15, rotate: '-14deg' },
    { flag: '🇨🇭', top: '38%', left: '14%', size: '1.6rem', opacity: 0.12, rotate: '9deg' },
    { flag: '🇵🇹', top: '8%', right: '3%', size: '3rem', opacity: 0.22, rotate: '10deg' },
    { flag: '🇧🇪', top: '22%', right: '10%', size: '2rem', opacity: 0.18, rotate: '-15deg' },
    { flag: '🇭🇷', top: '40%', right: '2%', size: '4rem', opacity: 0.2, rotate: '5deg' },
    { flag: '🇨🇴', top: '58%', right: '11%', size: '2.5rem', opacity: 0.18, rotate: '-10deg' },
    { flag: '🇸🇳', top: '74%', right: '4%', size: '3.5rem', opacity: 0.22, rotate: '12deg' },
    { flag: '🇯🇵', top: '88%', right: '14%', size: '2rem', opacity: 0.18, rotate: '-6deg' },
    { flag: '🇲🇦', top: '5%', right: '20%', size: '1.6rem', opacity: 0.15, rotate: '-10deg' },
    { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', top: '50%', right: '20%', size: '1.5rem', opacity: 0.15, rotate: '8deg' },
    { flag: '🇲🇽', top: '55%', left: '25%', size: '1.4rem', opacity: 0.12, rotate: '-7deg' },
    { flag: '🇰🇷', top: '18%', right: '25%', size: '1.4rem', opacity: 0.12, rotate: '11deg' },
    { flag: '🇨🇱', top: '83%', right: '22%', size: '1.6rem', opacity: 0.13, rotate: '-9deg' },
]

export default function Home() {
    const navigate = useNavigate()
    return(
        <div style={{backgroundColor: '#0a0a0f', minHeight: '100vh', color: 'white', position: 'relative', overflow: 'hidden'}}>
            <Navbar />

            {/* floating flags */}
            {flags.map((f, i) => (
                <div key={i} className="flag-float" style={{
                    position: 'absolute',
                    top: f.top,
                    left: f.left,
                    right: f.right,
                    fontSize: f.size,
                    opacity: f.opacity,
                    '--rotate': f.rotate,
                    animationDelay: `${i * 0.3}s`,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    zIndex: 0
                }}>{f.flag}</div>
            ))}

            {/* radial glow */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '900px',
                height: '700px',
                background: 'radial-gradient(ellipse, #F5C51810 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div className="flex flex-col items-center justify-center text-center px-6"
                 style={{minHeight: 'calc(100vh - 65px)', position: 'relative', zIndex: 1}}>

                {/* eyebrow */}
                <div className="flex items-center gap-3 mb-5">
                    <div style={{height: '1px', width: '50px', background: 'linear-gradient(to right, transparent, #F5C518)'}} />
                    <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>THE ULTIMATE FOOTBALL DRAFT</p>
                    <div style={{height: '1px', width: '50px', background: 'linear-gradient(to left, transparent, #F5C518)'}} />
                </div>

                {/* title — two line split */}
                <div className="mb-2">
                    <h1 className="font-black leading-none" style={{
                        fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                        color: 'white',
                        letterSpacing: '-0.02em'
                    }}>
                        THE WORLD
                    </h1>
                    <h1 className="font-black leading-none" style={{
                        fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                        color: '#F5C518',
                        letterSpacing: '-0.02em'
                    }}>
                        CUP XI.
                    </h1>
                </div>

                <p className="font-semibold mt-5 mb-2" style={{color: '#9ca3af', fontSize: 'clamp(1rem, 2vw, 1.25rem)'}}>
                    Draft legends. Build your XI. Win the impossible.
                </p>
                <p className="text-sm mb-14 max-w-md" style={{color: '#4b5563', lineHeight: 1.8}}>
                    Pick one player per round from historic World Cup squads.<br/>
                    Every spin is different. Most runs end in failure. That's the point.
                </p>

                {/* mode cards */}
                <div className="flex gap-5">
                    {/* Classic */}
                    <div
                        onClick={() => navigate('/draft', { state: { mode: 'classic' } })}
                        className="cursor-pointer rounded-2xl text-left"
                        style={{
                            background: 'linear-gradient(145deg, #1c1400 0%, #111827 100%)',
                            border: '1px solid #F5C51860',
                            width: '260px',
                            padding: '32px 32px',
                            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = '0 0 40px #F5C51835'
                            e.currentTarget.style.transform = 'scale(1.02)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = 'none'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <span style={{fontSize: '1.8rem'}}>🏆</span>
                            <span className="text-xs font-bold px-2 py-1 rounded" style={{
                                backgroundColor: '#F5C51820',
                                color: '#F5C518',
                                border: '1px solid #F5C51840'
                            }}>RECOMMENDED</span>
                        </div>
                        <h3 className="text-xl font-black tracking-wider mb-3" style={{color: 'white'}}>CLASSIC</h3>
                        <p className="text-sm mb-6" style={{color: '#6b7280', lineHeight: 1.7}}>
                            Stats visible. One skip available. Optimise your XI under pressure.
                        </p>
                        <div className="flex items-center gap-2">
                            <div style={{height: '1px', flex: 1, backgroundColor: '#F5C51840'}} />
                            <span className="text-xs font-black tracking-widest" style={{color: '#F5C518'}}>PLAY →</span>
                        </div>
                    </div>

                    {/* Purist */}
                    <div
                        onClick={() => navigate('/draft', { state: { mode: 'purist' } })}
                        className="cursor-pointer rounded-2xl text-left"
                        style={{
                            background: 'linear-gradient(145deg, #060d1a 0%, #111827 100%)',
                            border: '1px solid #3b82f660',
                            width: '260px',
                            padding: '32px 32px',
                            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = '0 0 40px #3b82f635'
                            e.currentTarget.style.transform = 'scale(1.02)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = 'none'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <span style={{fontSize: '1.8rem'}}>🎯</span>
                            <span className="text-xs font-bold px-2 py-1 rounded" style={{
                                backgroundColor: '#3b82f620',
                                color: '#3b82f6',
                                border: '1px solid #3b82f640'
                            }}>HARDCORE</span>
                        </div>
                        <h3 className="text-xl font-black tracking-wider mb-3" style={{color: 'white'}}>PURIST</h3>
                        <p className="text-sm mb-6" style={{color: '#6b7280', lineHeight: 1.7}}>
                            Names only. No stats. No skips. Pure football knowledge.
                        </p>
                        <div className="flex items-center gap-2">
                            <div style={{height: '1px', flex: 1, backgroundColor: '#3b82f640'}} />
                            <span className="text-xs font-black tracking-widest" style={{color: '#3b82f6'}}>PLAY →</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}