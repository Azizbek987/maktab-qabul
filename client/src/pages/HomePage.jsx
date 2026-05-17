import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
        🏫 Birinchi Sinfga Elektron Qabul Tizimi
      </h1>
      <p className="text-gray-600 max-w-2xl text-lg mb-8">
        Farzandingizni maktabga berish endi yanada oson va tez. Onlayn ariza topshiring va holatni kuzatib boring.
      </p>

      {/* 🚀 4-QADAM: IMAGE OPTIMIZATION (loading="lazy" rasmni faqat ekran yaqinlashganda yuklaydi) */}
      <img 
        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" 
        alt="Maktab binosi" 
        loading="lazy" 
        className="w-full max-w-3xl h-64 md:h-96 object-cover rounded-3xl shadow-md mb-8"
      />

      <div className="flex gap-4">
        <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition">
          🚀 Tizimga kirish
        </Link>
        <Link to="/register" className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-2xl border transition">
          ✍️ Ro'yxatdan o'tish
        </Link>
      </div>
    </div>
  );
}

export default HomePage;