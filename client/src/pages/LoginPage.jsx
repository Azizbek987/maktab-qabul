import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 📍 1-QADAM
  const [error, setError] = useState('');       // 📍 4-QADAM
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); // 📍 2-QADAM: Yuklash boshlandi
    setError('');     // Xatoni tozalash
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        phone,
        password
      });

      localStorage.setItem('token', res.data.token); // Tokenni saqlash
      setLoading(false);
      navigate('/cabinet'); // Muvaffaqiyatli bo'lsa kabinetga
    } catch (err) {
      setLoading(false);
      // 📍 4-QADAM: Xatoni ko'rsatish
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Kirish</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        
        {/* 📍 ERROR UI */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        <input placeholder="Telefon" onChange={(e) => setPhone(e.target.value)} style={{padding: '10px'}} />
        <input type="password" placeholder="Parol" onChange={(e) => setPassword(e.target.value)} style={{padding: '10px'}} />
        
        {/* 📍 BUTTON LOADING */}
        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={{ 
            padding: '10px', 
            backgroundColor: loading ? '#ccc' : '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Kutilmoqda...' : 'Kirish'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;