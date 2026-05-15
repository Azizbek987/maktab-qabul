import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// 📍 VERIFY PAGENI IMPORT QILISH
import VerifyPage from './pages/VerifyPage.jsx'; 

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
              textAlign: 'center'
            }}>
              <h1>Maktab Qabul Tizimi</h1>
              <p>Davom etish uchun tasdiqlash sahifasiga o'ting:</p>
              <Link 
                to="/verify" 
                style={{ 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  padding: '10px 25px', 
                  textDecoration: 'none', 
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                Verify sahifasiga o'tish
              </Link>
            </div>
          } />

          {/* 📍 2. VERIFY SAHIFASI ROUTERGA ULANDI */}
          <Route path="/verify" element={<VerifyPage />} />

          {/* 3. LOGIN SAHIFASI (Muvaffaqiyatli verifydan keyin keladi) */}
          <Route path="/login" element={
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <h1>Login sahifasi (Tez kunda...)</h1>
            </div>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;