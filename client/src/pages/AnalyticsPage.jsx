import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

function AnalyticsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
  }, [])

  const getAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')

      // API dan arizalarni token bilan birga xavfsiz tortib olish
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/all`,
        {
          headers: {
            Authorization: `Bearer ${token}` // Bearer formati to'g'rilandi
          }
        }
      )

      // Status bo'yicha arizalarni sanash
      const approved = res.data.filter((i) => i.status === 'approved').length
      const rejected = res.data.filter((i) => i.status === 'rejected').length
      const pending = res.data.filter((i) => i.status === 'pending').length

      // Grafik uchun ma'lumotni tayyorlash
      setData([
        { name: 'Tasdiqlangan', value: approved, fill: '#10B981' }, // Yashil
        { name: 'Rad etilgan', value: rejected, fill: '#EF4444' },   // Qizil
        { name: 'Kutilmoqda', value: pending, fill: '#F59E0B' }     // Sariq
      ])
      setLoading(false)
    } catch (err) {
      console.error("Analitika yuklashda xatolik:", err)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-10 text-xl font-bold">Grafik yuklanmoqda...</div>
  }

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
        📊 Tahlillar paneli (Analytics)
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-5 text-gray-600">Arizalar holati jadvali</h3>
        
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis allowDecimals={false} tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', shadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#F3F4F6' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage