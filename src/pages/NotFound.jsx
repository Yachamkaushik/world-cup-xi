import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
    const navigate = useNavigate()
    return (
        <div className="w-full text-white flex flex-col" style={{ backgroundColor: '#0a0a0f', minHeight: '100vh' }}>
            <Navbar />
            <div className="flex flex-col items-center justify-center text-center px-6" style={{ flex: 1 }}>
                <p className="font-black" style={{ fontSize: '6rem', color: '#1f2937', lineHeight: 1 }}>404</p>
                <h1 className="font-black text-2xl text-white mt-4 mb-3">Page not found</h1>
                <p className="text-sm mb-10" style={{ color: '#4b5563' }}>This page doesn't exist. Head back and build your XI.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-10 py-3 rounded-full font-black tracking-widest text-sm"
                    style={{ backgroundColor: '#F5C518', color: '#0a0a0f' }}>
                    GO HOME
                </button>
            </div>
            <Footer />
        </div>
    )
}
