import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

const steps = [
    {
        number: '01',
        title: 'SPIN THE POT',
        description: 'Each round reveals a random nation and World Cup year. You have no say in what you get — that\'s the whole point.',
    },
    {
        number: '02',
        title: 'PICK YOUR PLAYER',
        description: 'Choose one player from that nation\'s 23-man squad for the current position. Players who don\'t fit the position are greyed out.',
    },
    {
        number: '03',
        title: 'BUILD YOUR XI',
        description: 'Draft 11 players across GK, DEF, MID and FWD. Each round is a different position, chosen randomly at the start.',
    },
    {
        number: '04',
        title: 'SIMULATE',
        description: 'Your XI enters a full World Cup — 3 group games then knockouts. Win the Final to lift the trophy. Most people don\'t.',
    },
]

const tips = [
    'Midfield quality boosts both your attack and defence — it\'s the most important line.',
    'In Classic mode, check Goals/90 and Assists for forwards, not just the base rating.',
    'A nation\'s squad rating is averaged across all 23 players, not just the starters.',
    'The Final opponent is rated 88–93. You need a strong squad across every position to get there.',
    'Only a few of runs end in a trophy. Getting eliminated early is normal.',
]

export default function HowToPlay() {
    return (
        <div className="w-full overflow-x-hidden text-white flex flex-col" style={{backgroundColor: '#0a0a0f', minHeight: '100vh'}}>
            <Navbar />
            <div className="flex flex-col items-center px-6 py-12" style={{flex: 1, maxWidth: '750px', margin: '0 auto', width: '100%'}}>

                {/* header */}
                <div className="flex items-center gap-3 mb-3">
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #F5C518)'}} />
                    <p className="text-xs tracking-widest font-semibold" style={{color: '#F5C518'}}>THE BASICS</p>
                    <div style={{height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #F5C518)'}} />
                </div>
                <h1 className="font-black mb-2 text-center" style={{fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'white', letterSpacing: '-0.02em'}}>
                    HOW TO PLAY
                </h1>
                <p className="text-sm mb-12 text-center" style={{color: '#4b5563'}}>
                    Draft a World Cup XI. Simulate a tournament. Win the impossible.
                </p>

                {/* steps */}
                <div className="w-full mb-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>THE LOOP</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="flex items-start gap-6 px-7 py-6"
                                style={{borderBottom: i < steps.length - 1 ? '1px solid #ffffff08' : 'none'}}>
                                <span className="font-black shrink-0 mt-0.5" style={{color: '#F5C518', fontSize: '1.1rem', minWidth: '2rem'}}>{step.number}</span>
                                <div>
                                    <p className="font-black text-sm tracking-wider text-white mb-1">{step.title}</p>
                                    <p className="text-sm" style={{color: '#6b7280', lineHeight: 1.8}}>{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* modes */}
                <div className="w-full mb-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>GAME MODES</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            {
                                title: 'CLASSIC',
                                color: '#F5C518',
                                border: '#F5C51840',
                                bg: '#1c1400',
                                badge: 'RECOMMENDED',
                                points: [
                                    'Player stats are visible during the draft',
                                    'One skip available per draft',
                                    'Best for beginners and strategists',
                                ]
                            },
                            {
                                title: 'PURIST',
                                color: '#3b82f6',
                                border: '#3b82f640',
                                bg: '#060d1a',
                                badge: 'HARDCORE',
                                points: [
                                    'Names only — no stats, no ratings',
                                    'No skips available',
                                    'Pure football knowledge required',
                                ]
                            }
                        ].map((mode, i) => (
                            <div key={i} className="rounded-2xl p-6" style={{
                                background: `linear-gradient(145deg, ${mode.bg} 0%, #111827 100%)`,
                                border: `1px solid ${mode.border}`
                            }}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-black tracking-wider text-white">{mode.title}</h3>
                                    <span className="text-xs font-bold px-2 py-1 rounded" style={{
                                        backgroundColor: mode.color + '20',
                                        color: mode.color,
                                        border: `1px solid ${mode.color}40`
                                    }}>{mode.badge}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {mode.points.map((point, j) => (
                                        <div key={j} className="flex items-start gap-2">
                                            <span style={{color: mode.color, fontSize: '0.6rem', marginTop: '4px'}}>✦</span>
                                            <p className="text-xs" style={{color: '#6b7280', lineHeight: 1.6}}>{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* tips */}
                <div className="w-full mb-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div style={{height: '2px', width: '20px', backgroundColor: '#F5C518'}} />
                        <p className="text-xs tracking-widest font-bold" style={{color: '#9ca3af'}}>TIPS</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#111827', border: '1px solid #ffffff10'}}>
                        {tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-5 px-7 py-5"
                                style={{borderBottom: i < tips.length - 1 ? '1px solid #ffffff08' : 'none'}}>
                                <span className="shrink-0 font-black text-xs mt-0.5" style={{color: '#374151'}}>{String(i + 1).padStart(2, '0')}</span>
                                <p className="text-sm" style={{color: '#6b7280', lineHeight: 1.8}}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
