import { useEffect, useState } from 'react'
import axios from 'axios'

function CabinetPage() {
  const [myApps, setMyApps] = useState([])
  const [loading, setLoading] = useState(true)
  
  // LocalStorage'dan user ma'lumotlarini olish
  const user = JSON.parse(localStorage.getItem('user')) || {}

  useEffect(() => {
    if (user.id) {
      getMyApplications()
    }
  }, [])

  const getMyApplications = async () => {
    try {
      const token = localStorage.getItem('token')

      // 🔐 TOKEN Bearer formati bilan xavfsiz jo'natildi
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/my/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      )
      setMyApps(res.data)
      setLoading(false)
    } catch (err) {
      console.error("Arizalarni yuklashda xatolik:", err)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-10 text-xl font-bold">Yuklanmoqda...</div>
  }

  return (
    <div className="p-5 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👋 Xush kelibsiz, {user.name || 'Foydalanuvchi'}!</h1>
      <p className="text-gray-600 mb-8">Bu yerda siz yuborgan arizalar holatini (statusini) kuzatib borishingiz mumkin.</p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sizning arizalaringiz:</h2>

      {myApps.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-5 rounded-xl border border-blue-200">
          Siz hali hech qanday ariza yubormagansiz.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myApps.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-blue-600">{item.child_name}</h3>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p><strong>🏫 Maktab:</strong> {item.school_name || `ID: ${item.school_id}`}</p>
                  <p><strong>👤 Ota-ona:</strong> {item.parent_name}</p>
                  <p><strong>📞 Telefon:</strong> {item.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CabinetPage