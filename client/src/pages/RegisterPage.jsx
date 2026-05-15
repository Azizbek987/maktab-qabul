import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate-ni import qilamiz

function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 2. navigate funksiyasini e'lon qilamiz

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        phone,
        password
      });

      // 📍 4-QADAM — SHU YERNI O'ZGARTIRAMIZ
      alert('OTP yuborildi (Terminalni tekshiring!)');
      
      // Sahifani yangilamasdan /verify sahifasiga o'tkazish
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
        <button onClick={handleRegister} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          Ro'yxatdan o'tish
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;