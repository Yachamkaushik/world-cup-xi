import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import Home from './pages/Home'
import Draft from './pages/Draft'
import Simulate from './pages/Simulate'
import Result from './pages/Result'
import Summary from './pages/Summary'

function AnimatedRoutes() {
    const location = useLocation()
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}>
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/draft" element={<Draft />} />
                    <Route path="/simulate" element={<Simulate />} />
                    <Route path="/result" element={<Result />} />
                    <Route path="/summary" element={<Summary />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    </StrictMode>
)