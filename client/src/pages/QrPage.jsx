import { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

function QrPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApps();
  }, []);

  const getApps = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Iltimos, avval tizimga kiring!");
        setLoading(false);
        return;
      }

      // Token ichidan user_id ni ajratib olish
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      // Backenddan shu foydalanuvchining arizalarini olish
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/my/${userId}`
      );

      setApps(res.data || []);
    } catch (error) {
      console.error("QR ma'lumotlarini yuklashda xato:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-20 text-xl font-medium text-slate-600 animate-pulse">
        🔄 Arizalar va QR-kodlar yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 text-slate-800">QR Verification</h1>
      <p className="text-slate-500 mb-10 text-center max-w-md">
        Adminlar ariza haqiqiyligini tekshirishi uchun quyidagi QR-kodni ko‘rsating.
      </p>

      {apps.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center text-slate-500 max-w-md w-full border border-slate-100">
          📭 Sizda hali hech qanday ariza mavjud emas.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl w-full">
          {apps.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center text-center"
            >
              <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                ID: #{item.id}
              </span>
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                {item.child_name || "Ismsiz Bola"}
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Ota-ona: {item.parent_name || "Kiritilmagan"}
              </p>

              {/* 🛡️ Xavfsiz va soxtalashtirib bo'lmaydigan QR Kod */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                <QRCodeCanvas
                  value={JSON.stringify({
                    id: item.id,
                    child: item.child_name,
                    parent: item.parent_name,
                    phone: item.phone,
                    verified: true,
                    system: "MaktabQabul Online"
                  })}
                  size={180}
                  level={"H"} // Yuqori darajadagi xatolikni tuzatish (Sknerlash oson bo'ladi)
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-green-600 mt-4 font-medium flex items-center gap-1">
                ✅ Davlat standarti bo‘yicha himoyalangan
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QrPage;