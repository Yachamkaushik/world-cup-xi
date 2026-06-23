import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    return(
        <>
        <nav className="flex justify-between items-center px-8 py-4 fixed top-0 left-0 right-0 z-50" style={{
            backgroundColor: '#0a0a0fcc',
            borderBottom: '1px solid #ffffff10',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{backgroundColor: '#F5C518', color: '#0a0a0f'}}>
                    XI
                </div>
            </div>
            <div className="flex items-center gap-8">
                <span onClick={() => navigate('/how-to-play')} className="text-sm tracking-wider cursor-pointer transition-colors text-gray-400 hover:text-white">
                    HOW TO PLAY
                </span>
                <span onClick={() => navigate('/profile')} className="text-sm tracking-wider cursor-pointer transition-colors text-gray-400 hover:text-white">
                    PROFILE
                </span>
            </div>
        </nav>
        <div style={{height: '64px'}} />
        </>
    )
}