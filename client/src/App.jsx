import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.jsx'; 
import VerifyPage from './pages/VerifyPage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';       
import CabinetPage from './pages/CabinetPage.jsx'; // 👈 Yangi sahifamizni olib keldik!

function App() {
  return (
    <Router>
      <div style={{ 
        width: '100vw', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f9fafb',
        margin: 0,
        padding: 0,
        fontFamily: 'sans-serif'
      }}>
        <Routes>
          
          {/* 1. ASOSIY SAHIFA */}
          <Route path="/" element={
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              textAlign: 'center',
              gap: '20px'
            }}>
              <h1>Maktab Qabul Tizimi</h1>
              <p>Davom etish uchun kerakli sahifaga o'ting:</p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/register" style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 25px', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                  Ro'yxatdan o'tish
                </Link>
                <Link to="/verify" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 25px', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                  Kodni tasdiqlash
                </Link>
                <Link to="/login" style={{ backgroundColor: '#10b981', color: 'white', padding: '10px 25px', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                  Tizimga kirish
                </Link>
              </div>
            </div>
          } />

          {/* SAHIFALAR URLLARI */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 📍 JONLI VA AKTUAL SHAXSIY KABINET SAHIFASI */}
          <Route path="/cabinet" element={<CabinetPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;