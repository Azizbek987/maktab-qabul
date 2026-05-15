import { useEffect, useState } from 'react'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function AdminPage() {
  const [apps, setApps] = useState([])
  const [stats, setStats] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    getData()
    getStats()
  }, [])

  // 1. ARIZALARNI OLISH
  const getData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/application/all')
      setApps(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // 2. STATISTIKA
  const getStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/application/stats')
      setStats(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // 3. STATUSNI YANGILASH
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/application/status/${id}`, { status })
      getData()
      getStats()
    } catch (err) {
      alert('Xatolik yuz berdi')
    }
  }

  // 4. PDF YUKLASH FUNKSIYASI
  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Maktab Qabul Arizalari', 14, 15)

    const tableData = apps.map((item, index) => [
      index + 1,
      item.parent_name,
      item.child_name,
      item.age,
      item.school_name || `ID: ${item.school_id}`, 
      item.phone,
      item.status
    ])

    autoTable(doc, {
      startY: 25,
      head: [['#', 'Ota-ona', 'Bola', 'Yosh', 'Maktab', 'Telefon', 'Status']],
      body: tableData
    })

    doc.save('applications.pdf')
  }

  return (
    <div className="p-5 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800 text-center md:text-left">
        Admin Panel
      </h1>

      {/* STATISTIKA BLOCKI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        <div className="bg-white p-5 rounded shadow border-l-4 border-blue-500">
          📊 Total: <span className="font-bold">{stats.total || 0}</span>
        </div>
        <div className="bg-yellow-100 p-5 rounded shadow border-l-4 border-yellow-500 text-yellow-700">
          🟡 Pending: <span className="font-bold">{stats.pending || 0}</span>
        </div>
        <div className="bg-green-100 p-5 rounded shadow border-l-4 border-green-500 text-green-700">
          🟢 Approved: <span className="font-bold">{stats.approved || 0}</span>
        </div>
        <div className="bg-red-100 p-5 rounded shadow border-l-4 border-red-500 text-red-700">
          🔴 Rejected: <span className="font-bold">{stats.rejected || 0}</span>
        </div>
      </div>

      {/* PDF BUTTON */}
      <button
        onClick={downloadPDF}
        className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded mb-5 shadow-lg transition-all flex items-center justify-center gap-2"
      >
        📄 PDF Yuklash
      </button>

      {/* QIDIRUV INPUTI */}
      <input
        type="text"
        placeholder="Ism yoki telefon orqali qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-2 p-3 rounded-lg w-full mb-8 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
      />

      {/* APPLICATIONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {apps
          .filter((item) => {
            const text = `${item.child_name} ${item.parent_name} ${item.phone}`.toLowerCase()
            return text.includes(search.toLowerCase())
          })
          .map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-700 leading-tight">
                  {item.child_name}
                </h3>
                <span className={`font-bold uppercase text-[10px] p-1 px-2 rounded ${
                  item.status === 'approved' ? 'bg-green-100 text-green-600' : 
                  item.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.status}
                </span>
              </div>
              
              <div className="text-gray-600 mb-6 space-y-1 text-sm">
                <p><strong>👤 Ota-ona:</strong> {item.parent_name}</p>
                <p><strong>📞 Telefon:</strong> {item.phone}</p>
                
                {/* 📍 7-QADAM — MAKTAB NOMI VA ID SHU YERDA */}
                <p><strong>🏫 Maktab:</strong> {item.school_name || "Yuklanmoqda..."}</p>
                
                <p><strong>📄 Hujjat:</strong> 
                   <a 
                     href={`http://localhost:5000/uploads/${item.document}`} 
                     target="_blank" 
                     rel="noreferrer" 
                     className="text-blue-500 ml-2 hover:underline font-medium"
                   >
                     Ko‘rish
                   </a>
                </p>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => updateStatus(item.id, 'approved')}
                  disabled={item.status === 'approved'}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-400 font-semibold"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(item.id, 'rejected')}
                  disabled={item.status === 'rejected'}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-400 font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* QIDIRUVDA TOPILMASA */}
      {apps.length > 0 && apps.filter(i => `${i.child_name} ${i.phone}`.toLowerCase().includes(search.toLowerCase())).length === 0 && (
        <div className="text-center py-10 text-gray-500 italic">
          Hech qanday ariza topilmadi...
        </div>
      )}
    </div>
  )
}

export default AdminPage