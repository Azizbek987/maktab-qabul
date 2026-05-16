import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // 🔍 Tekshirish uchun linkni konsolga chiqaramiz
    console.log("Yuborilayotgan API manzili:", `${import.meta.env.VITE_API_URL}/api/auth/register`);
    console.log("Yuborilayotgan ma'lumotlar:", { name, phone, password });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        phone,
        password
      });

      console.log("Serverdan kelgan javob:", res.data);
      alert('OTP yuborildi!');
      navigate('/verify'); 

    } catch (err) {
      // 📍 SHPION: Xatoni to'liq konsolga chiqarish
      console.error("Axios so'rovida xatolik yuz berdi:", err);
      console.log("Server yuborgan xato teksti:", err.response?.data);

      alert(err.response?.data?.message || "Xatolik yuz berdi. Konsolni tekshiring!");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Ro'yxatdan o'tish</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input placeholder="Ism" value={name} onChange={(e) => setName(e.target.value)} style={{padding: '10px'}} />
        <input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} style={{padding: '10px'}} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{padding: '10px'}} />
        <button onClick={handleRegister} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Ro'yxatdan o'tish
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;