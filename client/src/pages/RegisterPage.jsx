import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // 🚀 BACKEND MANZILI RENDERGA O'ZGARTIRILDI
      const res = await axios.post('https://maktab-qabul-1.onrender.com/api/auth/register', {
        name,
        phone,
        password
      });

      alert('OTP yuborildi!');
      
      // Muvaffaqiyatli bo'lsa, tasdiqlash sahifasiga o'tamiz
      navigate('/verify'); 

    } catch (err) {
      alert(err.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Ro'yxatdan o'tish</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input placeholder="Ism" onChange={(e) => setName(e.target.value)} style={{padding: '10px'}} />
        <input placeholder="Telefon" onChange={(e) => setPhone(e.target.value)} style={{padding: '10px'}} />
        <input type="password" placeholder="Parol" onChange={(e) => setPassword(e.target.value)} style={{padding: '10px'}} />
        <button onClick={handleRegister} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Ro'yxatdan o'tish
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;