import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

export default function About() {
    const navigate = useNavigate()
    return (
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12" style={{flex: 1, maxWidth: '750px', margin: '0 auto', width: '100%'}}>

                {/* header */}
                <div className="flex items-center gap-3 mb-3">
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #F5C518)'}} />
                    <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>THE PROJECT</p>
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #F5C518)'}} />
                </div>
                <h1 className="font-black mb-2 text-center" style={{fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'white', letterSpacing: '-0.02em'}}>
                    ABOUT
                </h1>
                <p className="text-sm mb-12 text-center" style={{color: '#4b5563'}}>
                    What this is and why it exists.
                </p>

                {/* about text */}
                <div className="w-full mb-10 rounded-2xl p-8" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                    <p className="text-sm mb-5" style={{color: '#9ca3af', lineHeight: 1.9}}>
                        World Cup XI started as a simple question: what if you could build your dream squad from any World Cup in history, one player at a time?
                    </p>
                    <p className="text-sm mb-5" style={{color: '#9ca3af', lineHeight: 1.9}}>
                        You spin to reveal a random nation and year — Brazil 2002, France 1998, Germany 2006 — pick one player for the current position, and repeat across 11 rounds. Then you simulate a full World Cup tournament with your XI and see how far they go. Most runs end in failure. That's the point.
                    </p>
                    <p className="text-sm mb-8" style={{color: '#9ca3af', lineHeight: 1.9}}>
                        The game currently covers the 2002, 2006, 2010, 2014, and 2018 World Cups — over 1,000 players across 80 nation-year combinations, with real tournament stats and FIFA-style ratings used under the hood to simulate matches.
                    </p>

                    <div className="flex flex-col gap-5" style={{borderTop: '1px solid #ffffff08', paddingTop: '1.5rem'}}>
                        <div>
                            <p className="text-xs font-bold tracking-widest mb-2" style={{color: '#F5C518'}}>INSPIRED BY</p>
                            <p className="text-sm" style={{color: '#9ca3af', lineHeight: 1.9}}>
                                This project was directly inspired by <span style={{color: 'white', fontWeight: 600}}>82-0.com</span>, one of the most addictive sports draft games on the internet. If you haven't played it, go play it. The core loop of "spin, pick, survive" owes a lot to what they built.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest mb-2" style={{color: '#F5C518'}}>BUILT BY</p>
                            <p className="text-sm" style={{color: '#9ca3af', lineHeight: 1.9}}>
                                Kaushik, a CS student who wanted to build something fun and ended up spending way too long on balance testing.
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest mb-2" style={{color: '#F5C518'}}>BUILT WITH</p>
                            <p className="text-sm" style={{color: '#9ca3af', lineHeight: 1.9}}>
                                React, Vite, Tailwind CSS, Framer Motion.
                            </p>
                        </div>
                        <p className="text-xs" style={{color: '#374151', lineHeight: 1.8}}>
                            Not affiliated with FIFA. Player data is self-compiled. Stats may be slightly off — it's a game, not a database.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="px-10 py-4 rounded-full font-black tracking-widest text-sm"
                    style={{backgroundColor: '#F5C518', color: '#0a0a0f', transition: 'all 0.2s ease'}}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 40px #F5C51840'; e.currentTarget.style.transform = 'scale(1.03)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}>
                    PLAY NOW →
                </button>

            </div>
            <Footer />
        </div>
    )
}
