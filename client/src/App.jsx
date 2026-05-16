import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.jsx'; 
import VerifyPage from './pages/VerifyPage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';       

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

          {/* 📍 YANGILANGAN CHIROYLI SHAXSIY KABINET SAHIFASI */}
          <Route path="/cabinet" element={
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1, 
              padding: '20px' 
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>👨‍🎓</div>
                <h1 style={{ color: '#1e3a8a', margin: '0 0 10px 0' }}>O'quvchi Kabineti</h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>Maktab qabul tizimiga xush kelibsiz!</p>
                
                <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #e5e7eb' }} />
                
                {/* Profil ma'lumotlari bo'limi */}
                <div style={{ textAlign: 'left', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ margin: '5px 0' }}><strong>Ariza holati:</strong> <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>Hujjatlar kutilmoqda</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Telefon raqam:</strong> +998 88 346 12 02</p>
                  <p style={{ margin: '5px 0' }}><strong>Sinf:</strong> 1-sinf (Qabul)</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={() => alert("Hujjat topshirish tizimi tez kunda ishga tushadi!")} style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    📄 Onlayn Ariza Topshirish
                  </button>
                  
                  <Link to="/login" style={{ backgroundColor: '#ef4444', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer', textAlign: 'center' }}>
                    🚪 Tizimdan Chiqish
                  </Link>
                </div>
              </div>
            </div>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;