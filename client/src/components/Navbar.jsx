import { useState, memo } from 'react'; // memo qo'shildi
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const role = user.role || 'user';

  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-black text-blue-600 tracking-tight">
          Maktab<span className="text-gray-800 dark:text-white">Qabul</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center font-semibold text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition">Bosh sahifa</Link>
          <Link to="/cabinet" className="hover:text-blue-600 transition">Kabinet</Link>
          {role === 'super_admin' && (
            <>
              <Link to="/admin" className="hover:text-blue-600 transition">Admin</Link>
              <Link to="/analytics" className="hover:text-blue-600 transition">Analitika</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes className="text-red-500" /> : <FaBars className="text-blue-600" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white p-5 shadow-xl flex flex-col gap-4 font-bold animate-fadeIn">
          <Link to="/" onClick={() => setMenuOpen(false)} className="p-2 hover:bg-blue-50 rounded-xl">🏠 Bosh sahifa</Link>
          <Link to="/cabinet" onClick={() => setMenuOpen(false)} className="p-2 hover:bg-blue-50 rounded-xl">💼 Cabinet</Link>
          {role === 'super_admin' && (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="p-2 hover:bg-blue-50 rounded-xl">⚙️ Admin Panel</Link>
              <Link to="/analytics" onClick={() => setMenuOpen(false)} className="p-2 hover:bg-blue-50 rounded-xl">📊 Analytics</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// 🚀 5-QADAM: Navbar keraksiz joyda qayta render bo'lmasligi uchun memo ichiga o'raymirlar
export default memo(Navbar);