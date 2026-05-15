import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerifyPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const verify = async () => {
    try {
      // 🚀 LINK ENV O'ZGARUVCHISIGA O'ZGARTIRILDI
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify`,
        { phone, otp }
      );

      alert(res.data.message);
      navigate('/login'); 
    } catch (err) {
      alert(err.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      width: '100vw',
      backgroundColor: '#f3f4f6',
      position: 'fixed',
      top: 0,
      left: 0,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '20px', color: '#1f2937' }}>OTP Tasdiqlash</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #d1d5db',
              fontSize: '16px',
              textAlign: 'left'
            }}
          />

          <input
            type="text"
            placeholder="6 xonali kodni kiriting"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #d1d5db',
              fontSize: '16px',
              textAlign: 'left'
            }}
          />

          <button 
            onClick={verify}
            style={{ 
              padding: '12px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background 0.3s'
            }}
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;