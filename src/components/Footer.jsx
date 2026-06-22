export default function Footer() {
    return (
        <footer className="w-full px-8 py-6 flex justify-between items-center text-xs tracking-wider"
                style={{borderTop: '1px solid #ffffff10', color: '#374151'}}>
            <span>© 2026 WORLD CUP XI</span>
            <div className="flex gap-6">
                <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-gray-400 transition-colors">ABOUT</span>
                <span onClick={() => navigate('/how-to-play')} className="cursor-pointer hover:text-gray-400 transition-colors">HOW TO PLAY</span>
            </div>
            <span style={{color: '#1f2937'}}>NOT AFFILIATED WITH FIFA</span>
        </footer>
    )
}