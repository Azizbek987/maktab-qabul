import { useEffect, useState } from 'react'
import axios from 'axios'

function CabinetPage() {
  const [myApps, setMyApps] = useState([])
  const [schools, setSchools] = useState([]) // Maktablar ro'yxati uchun
  const [loading, setLoading] = useState(true)
  
  // Ariza formasini ochish/yopish uchun state
  const [showForm, setShowForm] = useState(false)

  // Ariza inputlari uchun state
  const [parentName, setParentName] = useState('')
  const [childName, setChildName] = useState('')
  const [age, setAge] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [phone, setPhone] = useState('')
  const [documentFile, setDocumentFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  // LocalStorage'dan user ma'lumotlarini olish
  const user = JSON.parse(localStorage.getItem('user')) || {}
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (user.id) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      // 1. Arizalarni yuklash
      const appRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/my/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMyApps(appRes.data)

      // 2. Maktablar ro'yxatini yuklash (Formada tanlash uchun)
      const schoolRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/school/all`)
      setSchools(schoolRes.data || [])

      setLoading(false)
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err)
      setLoading(false)
    }
  }

  // 📝 ARIZA YUBORISH FUNKSIYASI (Supabase Storage'ga fayl ketadi)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!schoolId || !documentFile) {
      alert("Iltimos, maktabni tanlang va hujjatni yuklang!")
      return
    }

    setSubmitting(true)

    // Fayl va matnlarni bitta paket (FormData) qilish
    const formData = new FormData()
    formData.append('parent_name', parentName)
    formData.append('child_name', childName)
    formData.append('age', age)
    formData.append('school_id', schoolId)
    formData.append('phone', phone)
    formData.append('user_id', user.id)
    formData.append('document', documentFile) // 📄 Fayl mana shu yerda ketadi

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/application/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("🎉 Ariza muvaffaqiyatli yuborildi va Supabase'ga yuklandi!")
      
      // Formani tozalash va yopish
      setChildName('')
      setParentName('')
      setAge('')
      setSchoolId('')
      setPhone('')
      setDocumentFile(null)
      setShowForm(false)
      
      // Ro'yxatni yangilash
      fetchData()
    } catch (err) {
      console.error("Ariza yuborishda xatolik:", err)
      alert("Xatolik yuz berdi: " + (err.response?.data?.error || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center p-10 text-xl font-bold text-blue-600 animate-pulse">Yuklanmoqda...</div>
  }

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto">
      {/* Profil qismi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👋 Xush kelibsiz, {user.name || 'Foydalanuvchi'}!</h1>
          <p className="text-gray-500 mt-1">Bu yerda arizalar holatini kuzatishingiz va yangi ariza topshirishingiz mumkin.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-xl font-bold text-white transition list-none ${
            showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {showForm ? '❌ Formani yopish' : '📄 Onlayn Ariza Topshirish'}
        </button>
      </div>

      {/* 📝 ONLAYN ARIZA TOPSHIRISH FORMASI */}
      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-blue-100 mb-8 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            ✍️ Birinchi sinfga qabul uchun ariza to'ldirish
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ota-ona (F.I.O)</label>
              <input
                type="text"
                required
                placeholder="Masalan: Alimov Abror"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bolaning (F.I.O)</label>
              <input
                type="text"
                required
                placeholder="Masalan: Alimova Soliha"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bolaning yoshi</label>
              <input
                type="number"
                required
                placeholder="Masalan: 7"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon raqam</label>
              <input
                type="text"
                required
                placeholder="Masalan: +998901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Topshirilayotgan Maktab</label>
              <select
                required
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">-- Maktabni tanlang --</option>
                {schools.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.name} ({sc.address})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guvohnoma nusxasi (Rasm yoki PDF)</label>
              <input
                type="file"
                required
                accept="image/*,application/pdf"
                onChange={(e) => setDocumentFile(e.target.files[0])}
                className="w-full p-2 rounded-xl border border-gray-200 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="md:col-span-2 text-right mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition disabled:bg-gray-400"
              >
                {submitting ? '⏳ Supabase bulutiga yuklanmoqda...' : '🚀 Arizani Yuborish'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📂 ARIZALAR RO'YXATI */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sizning arizalaringiz tarixi:</h2>

      {myApps.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-6 rounded-2xl border border-blue-100 text-center font-medium">
          📭 Siz hali hech qanday ariza yubormagansiz. Tepadagi yashil yoki ko'k tugmani bosib birinchi arizangizni topshiring!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myApps.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blue-600">{item.child_name}</h3>
                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'pending' ? 'Kutilmoqda ⏳' : item.status === 'approved' ? 'Tasdiqlandi ✅' : 'Rad etildi ❌'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  <p><strong>🏫 Maktab:</strong> {item.school_name || `ID: ${item.school_id}`}</p>
                  <p><strong>👤 Ota-ona:</strong> {item.parent_name} (Yoshi: {item.age})</p>
                  <p><strong>📞 Telefon:</strong> {item.phone}</p>
                  {item.document && (
                    <p>
                      <strong>📄 Yuklangan hujjat:</strong>{' '}
                      <a 
                        href={item.document} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-500 underline font-semibold hover:text-blue-700"
                      >
                        Faylni ko'rish (Supabase Link)
                      </a>
                    </p>
                  )}
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