import { useEffect, useState } from 'react';
import axios from 'axios';

function AnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // 🚀 6-QADAM: API CACHE (force-cache orqali ma'lumotlar qayta-qayta yuklanmaydi, keshdan tez olinadi)
        const res = await axios.get(
          `https://maktab-qabul-1.onrender.com/api/application/all`,
          {
            headers: { 'Cache-Control': 'max-age=3600' }, // Standard cache header
            cache: 'force-cache' // Brauzerga keshdan o'qishni buyuradi
          }
        );
        
        const apps = res.data || [];
        setStats({
          total: apps.length,
          approved: apps.filter(a => a.status === 'approved').length,
          pending: apps.filter(a => a.status === 'pending').length,
          rejected: apps.filter(a => a.status === 'rejected').length,
        });
      } catch (err) {
        console.error("Analitikada xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center p-10 font-bold text-blue-600">Statistika hisoblanmoqda...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black mb-6 text-gray-800">📊 Tizim Analitikasi (Real-vaqt)</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-5 rounded-2xl border text-center">
          <p className="text-sm font-semibold text-blue-600">Jami Arizalar</p>
          <h2 className="text-3xl font-black text-blue-900 mt-1">{stats.total}</h2>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl border text-center">
          <p className="text-sm font-semibold text-green-600">Tasdiqlandi</p>
          <h2 className="text-3xl font-black text-green-900 mt-1">{stats.approved}</h2>
        </div>
        <div className="bg-yellow-50 p-5 rounded-2xl border text-center">
          <p className="text-sm font-semibold text-yellow-600">Kutilmoqda</p>
          <h2 className="text-3xl font-black text-yellow-900 mt-1">{stats.pending}</h2>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border text-center">
          <p className="text-sm font-semibold text-red-600">Rad etildi</p>
          <h2 className="text-3xl font-black text-red-900 mt-1">{stats.rejected}</h2>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;