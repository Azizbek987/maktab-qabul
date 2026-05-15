import { useState, useEffect } from 'react'
import axios from 'axios'

function SchoolPage() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [schools, setSchools] = useState([])

  useEffect(() => {
    getSchools()
  }, [])

  const getSchools = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/schools/all')
      setSchools(res.data)
    } catch (err) {
      console.log("Xatolik:", err)
    }
  }

  const createSchool = async () => {
    if (!name || !address) return alert("Hamma maydonlarni to'ldiring")
    try {
      await axios.post('http://localhost:5000/api/schools/create', { name, address })
      getSchools()
      setName('')
      setAddress('')
    } catch (err) {
      alert("Qo'shishda xatolik!")
    }
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Maktablar Boshqaruvi</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-10 max-w-md">
        <h2 className="text-xl mb-4 font-semibold text-blue-600">Yangi maktab qo'shish</h2>
        <input
          placeholder="Maktab nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-2 border-gray-100 p-3 mb-3 w-full rounded-lg focus:border-blue-400 outline-none"
        />
        <input
          placeholder="Manzil"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border-2 border-gray-100 p-3 mb-4 w-full rounded-lg focus:border-blue-400 outline-none"
        />
        <button
          onClick={createSchool}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-all"
        >
          Maktabni Saqlash
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {schools.map((s) => (
          <div key={s.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🏫 {s.name}</h3>
            <p className="text-gray-600">📍 {s.address}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SchoolPage