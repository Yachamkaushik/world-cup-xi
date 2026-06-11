import { useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Draft from './pages/Draft'
import Simulate from './pages/Simulate'
import Result from './pages/Result'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/draft" element={<Draft />} />
                <Route path="/simulate" element={<Simulate />} />
                <Route path="/result" element={<Result />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
