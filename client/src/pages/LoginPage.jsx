import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'import.meta.env.VITE_API_URL/api/auth/login',
        {
          phone,
          password
        }
      )

      localStorage.setItem('token', res.data.token)
      window.location.href = '/dashboard'

      alert('Login muvaffaqiyatli!')
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik')
    }
  }

  return (
    <div className="bg-blue-50 h-screen">
      <Navbar />

      <div className="flex items-center justify-center mt-20">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px]">
          
          <h1 className="text-3xl font-bold mb-6 text-center">
            Login
          </h1>

          <input
            type="text"
            placeholder="Telefon raqam"
            className="border w-full p-3 rounded mb-4"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Parol"
            className="border w-full p-3 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white w-full p-3 rounded-lg"
          >
            Kirish
          </button>

        </div>
      </div>
    </div>
  )
}

export default LoginPage