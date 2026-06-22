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
                    <p className="text-sm mb-4" style={{color: '#9ca3af', lineHeight: 1.9}}>
                        World Cup XI is a browser-based football draft game built for fun. The idea is simple — spin to reveal a nation, pick one player per round, build an XI from historic World Cup squads, and simulate a full tournament. Most runs end in failure. That's the point.
                    </p>
                    <p className="text-sm mb-4" style={{color: '#9ca3af', lineHeight: 1.9}}>
                        The game currently uses 2018 World Cup squads — 368 players across 16 nations, with real tournament stats and FIFA-style ratings used to simulate matches. More seasons are coming in v2.
                    </p>
                    <p className="text-sm" style={{color: '#9ca3af', lineHeight: 1.9}}>
                        Built with React, Vite, and Tailwind CSS. Player data is self-compiled. Not affiliated with FIFA.
                    </p>
                </div>

                {/* stack */}
                <div className="w-full mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>BUILT WITH</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { name: 'React 18 + Vite', desc: 'Frontend framework and build tool' },
                            { name: 'Tailwind CSS', desc: 'Styling and layout' },
                            { name: 'Framer Motion', desc: 'Animations and page transitions' },
                            { name: 'canvas-confetti', desc: 'Champion and elimination effects' },
                        ].map(({ name, desc }) => (
                            <div key={name} className="px-5 py-4 rounded-xl" style={{backgroundColor: '#0a0a0f', border: '1px solid #ffffff08'}}>
                                <p className="font-black text-sm text-white mb-1">{name}</p>
                                <p className="text-xs" style={{color: '#4b5563'}}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* v2 teaser */}
                <div className="w-full mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>WHAT'S NEXT</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            'More World Cup seasons — 2014, 2010, 2006, 2002 and beyond',
                            'Daily mode — everyone gets the same squads for 24 hours',
                            'Share card — screenshot your XI and result',
                            'Deeper simulation — positions, form, tactics',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 px-5 py-4 rounded-xl" style={{
                                backgroundColor: '#111827', border: '1px solid #ffffff08'
                            }}>
                                <span style={{color: '#F5C518', fontSize: '0.6rem', marginTop: '4px'}}>✦</span>
                                <p className="text-sm" style={{color: '#6b7280', lineHeight: 1.7}}>{item}</p>
                            </div>
                        ))}
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