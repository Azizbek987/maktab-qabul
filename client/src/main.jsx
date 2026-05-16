import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Agar sizda CSS fayl bo'lsa
import { Toaster } from 'react-hot-toast' // 👈 1. TEPADAN IMPORT QILINDI

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👈 2. TOASTER SHU YERGA, APP'DAN BITTA QATOR TEPAGA QO'YILDI */}
    <Toaster position="top-right" reverseOrder={false} /> 
    <App />
  </React.StrictMode>,
)