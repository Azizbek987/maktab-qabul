import { useState, useEffect } from 'react'
import axios from 'axios'

function ApplicationPage() {
  const [data, setData] = useState({
    parent_name: '',
    child_name: '',
    age: '',
    phone: ''
  })
  
  const [schools, setSchools] = useState([]) // Barcha maktablar uchun
  const [schoolId, setSchoolId] = useState('') // Tanlangan maktab ID si uchun
  const [file, setFile] = useState(null)

  // 1. MAKTABLARNI BACKENDDAN OLIB KELISH
  useEffect(() => {
    getSchools()
  }, [])

  const getSchools = async () => {
    try {
      const res = await axios.get('import.meta.env.VITE_API_URL/api/schools/all')
      setSchools(res.data)
    } catch (err) {
      console.log("Maktablarni yuklashda xatolik:", err)
    }
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Sahifa yangilanib ketishini oldini oladi

    if (!schoolId) {
      return alert("Iltimos, maktabni tanlang!")
    }

    try {
      // 📍 2-QADAM — TOKENDAN USER ID OLISH
      const token = localStorage.getItem('token')
      
      if (!token) {
        return alert("Tizimga kirmagansiz! Iltimos, avval login qiling.")
      }

      // Tokenni decode qilish
      const payload = JSON.parse(atob(token.split('.')[1]))
      const user_id = payload.id

      // 📍 3-QADAM — FORMDATA YARATISH VA USER_ID QO'SHISH
      const formData = new FormData()
      formData.append('parent_name', data.parent_name)
      formData.append('child_name', data.child_name)
      formData.append('age', data.age)
      formData.append('phone', data.phone)
      formData.append('school_id', schoolId) 
      formData.append('document', file)
      
      // User ID ni formData ga biriktiramiz
      formData.append('user_id', user_id) 

      await axios.post(
        'import.meta.env.VITE_API_URL/api/application/create',
        formData
      )

      alert('Ariza muvaffaqiyatli yuborildi!')
      
      // Formani tozalash
      window.location.reload() 

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-10 bg-white shadow-xl rounded-2xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Ariza yuborish</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ota-ona ismi:</label>
          <input 
            name="parent_name" 
            placeholder="F.I.SH" 
            onChange={handleChange} 
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bola ismi:</label>
          <input 
            name="child_name" 
            placeholder="F.I.SH" 
            onChange={handleChange} 
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Yoshi:</label>
            <input 
              name="age" 
              type="number"
              placeholder="Masalan: 7" 
              onChange={handleChange} 
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon:</label>
            <input 
              name="phone" 
              placeholder="+998" 
              onChange={handleChange} 
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Maktabni tanlang:</label>
          <select 
            value={schoolId} 
            onChange={(e) => setSchoolId(e.target.value)}
            className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">-- Tanlang --</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.address})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hujjat yuklash (PDF/Rasm):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg mt-4"
        >
          Yuborish
        </button>
      </div>
    </div>
  )
}

export default ApplicationPage