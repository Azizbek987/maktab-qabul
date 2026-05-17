import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPage() {
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      const res = await axios.get(`https://maktab-qabul-1.onrender.com/api/application/all`);
      setAllApps(res.data || []);
    } catch (err) {
      console.error("Arizalarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://maktab-qabul-1.onrender.com/api/application/status/${id}`, { status: newStatus });
      alert(`Ariza holati muvaffaqiyatli o'zgardi!`);
      fetchAllApplications(); // Ro'yxatni yangilash
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  };

  if (loading) {
    return <div className="text-center p-10 font-bold text-blue-600 animate-pulse">Admin Panel Yuklanmoqda...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">🛠️ Admin Boshqaruv Paneli</h1>
        <p className="text-gray-500 mt-1">Kelib tushgan barcha onlayn arizalarni real vaqt rejimida boshqaring.</p>
      </div>

      {/* 🔥 MOBILE GRID FIX: Telefonda 1ta, planshetda 2ta, kompyuterda 3ta kolonka */}
      {allApps.length === 0 ? (
        <div className="text-center bg-gray-50 p-10 rounded-2xl border border-dashed text-gray-500">
          Hozircha hech qanday ariza kelib tushmagan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allApps.map((item) => (
            /* 🔥 PREMIUM CARD ANIMATION */
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:scale-105 hover:shadow-xl transition-all duration-300 transform"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.child_name}</h3>
                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'pending' ? 'Kutilmoqda' : item.status === 'approved' ? 'Tasdiqlandi' : 'Rad etildi'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                  <p><strong>🏫 Maktab ID:</strong> {item.school_id}</p>
                  <p><strong>👤 Ota-ona:</strong> {item.parent_name} ({item.age} yosh)</p>
                  <p><strong>📞 Telefon:</strong> {item.phone}</p>
                  {item.document && (
                    <p>
                      <strong>📄 Hujjat:</strong>{' '}
                      <a href={item.document} target="_blank" rel="noreferrer" className="text-blue-500 underline font-semibold">
                        Faylni ochish
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button 
                  onClick={() => handleStatusChange(item.id, 'approved')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-xs rounded-xl transition"
                >
                  ✅ Tasdiqlash
                </button>
                <button 
                  onClick={() => handleStatusChange(item.id, 'rejected')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-xs rounded-xl transition"
                >
                  ❌ Rad etish
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;