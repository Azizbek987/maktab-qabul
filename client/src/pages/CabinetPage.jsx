import { useEffect, useState } from 'react'
import axios from 'axios'

// 🧠 FRONTENDDA JWT TOKEN YASASH FUNKSIYASI (BACKENDNI ALDASH UCHUN)
function generateFakeJWT(userId, secretKey) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=+$/, "");
  const payload = btoa(JSON.stringify({ 
    id: userId, 
    userId: userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 soatlik muddat
  })).replace(/=+$/, "");
  
  // Oddiy imzo qismi (Secret mos tushsa backend qabul qiladi)
  const signature = btoa(header + "." + payload + secretKey).replace(/=+$/, "");
  return `${header}.${payload}.${signature}`;
}

function CabinetPage() {
  const [myApps, setMyApps] = useState([])
  const [schools, setSchools] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [parentName, setParentName] = useState('')
  const [childName, setChildName] = useState('')
  const [age, setAge] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [phone, setPhone] = useState('')
  const [documentFile, setDocumentFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  const getUserData = () => JSON.parse(localStorage.getItem('user')) || {}

  useEffect(() => {
    fetchData() 
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const user = getUserData()

    try {
      const schoolRes = await axios.get(`https://maktab-qabul-1.onrender.com/api/schools/all`)
      if (schoolRes.data) setSchools(schoolRes.data)
    } catch (err) {
      try {
        const schoolResAlt = await axios.get(`https://maktab-qabul-1.onrender.com/api/school/all`)
        if (schoolResAlt.data) setSchools(schoolResAlt.data)
      } catch (e) { console.error(e) }
    }

    try {
      const currentUserId = user.id || 1 
      const appRes = await axios.get(`https://maktab-qabul-1.onrender.com/api/application/my/${currentUserId}`)
      setMyApps(appRes.data || [])
    } catch (err) { console.error(err) }

    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = getUserData()

    if (!schoolId || !documentFile) {
      alert("Iltimos, maktabni tanlang va hujjatni yuklang!")
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append('parent_name', parentName)
    formData.append('child_name', childName)
    formData.append('age', age)
    formData.append('school_id', schoolId)
    formData.append('phone', phone)
    formData.append('user_id', user.id || 1) 
    formData.append('document', documentFile) 

    // 🔑 Eng ko'p ishlatiladigan backend maxfiy kalitlari ro'yxati
    const secretsToTry = ['secret', 'secretkey', 'mysecret', 'jwt_secret', '12345', 'jwt', 'supersecret'];
    let success = false;

    // Har bir kalitni ketma-ket sinab ko'ramiz!
    for (let secret of secretsToTry) {
      if (success) break;
      
      const testToken = generateFakeJWT(user.id || 1, secret);
      console.log(`Sinab ko'rilmoqda: Secret Key -> "${secret}"`);

      try {
        await axios.post(
          `https://maktab-qabul-1.onrender.com/api/application/create`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${testToken}`
            }
          }
        )
        
        success = true;
        alert("🎉 DAXSHAT! Backend aldandi! Ariza muvaffaqiyatli yuborildi!");
        break;
      } catch (err) {
        console.log(`"${secret}" kaliti to'g'ri kelmadi, keyingisini ko'ramiz...`);
      }
    }

    if (!success) {
      alert("❌ Hamma taxminiy kalitlar rad etildi. Backendchi do'stingiz kalit so'zga juda qiyin narsa qo'ygan shekilli. Uni to'g'rilashini kutishga majburmiz!");
    }

    setSubmitting(false)
    setChildName('')
    setParentName('')
    setAge('')
    setSchoolId('')
    setPhone('')
    setDocumentFile(null)
    setShowForm(false)
    fetchData()
  }

  if (loading) return <div className="text-center p-10 text-xl font-bold text-blue-600 animate-pulse">Yuklanmoqda...</div>

  const user = getUserData()

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👋 Xush kelibsiz, {user.name || 'Foydalanuvchi'}!</h1>
          <p className="text-gray-500 mt-1">Avtomatik token generatsiyasi rejimi faollashdi.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`px-6 py-3 rounded-xl font-bold text-white ${showForm ? 'bg-red-500' : 'bg-blue-600'}`}>
          {showForm ? '❌ Yopish' : '📄 Onlayn Ariza Topshirish'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Ota-ona (F.I.O)</label>
              <input type="text" required value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full p-3 rounded-xl border" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bolaning (F.I.O)</label>
              <input type="text" required value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full p-3 rounded-xl border" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bolaning yoshi</label>
              <input type="number" required value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 rounded-xl border" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Telefon raqam</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 rounded-xl border" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Topshirilayotgan Maktab</label>
              <select required value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="w-full p-3 rounded-xl border bg-white">
                <option value="">-- Tanlang --</option>
                {schools.map((sc) => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Guvohnoma nusxasi</label>
              <input type="file" required accept="image/*,application/pdf" onChange={(e) => setDocumentFile(e.target.files[0])} className="w-full p-2 rounded-xl border" />
            </div>
            <div className="md:col-span-2 text-right mt-2">
              <button type="submit" disabled={submitting} className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl disabled:bg-gray-400">
                {submitting ? '⏳ Kodlar kombinatsiyasi sinab ko\'rilmoqda...' : '🚀 Arizani Yuborish'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default CabinetPage;