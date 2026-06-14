export default function Navbar() {
    return(
        <nav className="flex justify-between items-center px-8 py-4" style={{backgroundColor: '#0d1117', borderBottom: '1px solid #ffffff10'}}>
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{backgroundColor: '#F5C518', color: '#0a0a0f'}}>
                    XI
                </div>
                <span className="font-bold text-lg tracking-widest" style={{color: '#F5C518'}}>
                    WORLD CUP XI
                </span>
            </div>
            <div className="flex items-center gap-8">
                <span className="text-sm tracking-wider cursor-pointer transition-colors text-gray-400 hover:text-white">
                    HOW TO PLAY
                </span>
                <span className="text-sm tracking-wider cursor-pointer transition-colors text-gray-400 hover:text-white">
                    LEADERBOARD
                </span>
                <span className="text-sm tracking-wider cursor-pointer transition-colors text-gray-400 hover:text-white">
                    PROFILE
                </span>
                <button className="px-5 py-2 rounded-full text-sm font-bold tracking-wider transition-all hover:opacity-80" style={{backgroundColor: '#F5C518', color: '#0a0a0f'}}>
                    PLAY NOW
                </button>
            </div>
        </nav>
    )
}