import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  
  let role = ''
  
  // Token ichidan rolni aniqlab olish (Decode qilish)
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      role = payload.role
    } catch (e) {
      console.error("Tokenni o'qishda xatolik:", e)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center px-10">
      <Link to="/" className="text-xl font-bold text-blue-600">🏫 Maktab Qabul</Link>
      
      <div className="flex gap-5 items-center">
        <Link to="/" className="text-gray-600 hover:text-blue-600">Bosh sahifa</Link>
        
        {token && <Link to="/cabinet" className="text-gray-600 hover:text-blue-600">Shaxsiy Kabinet</Link>}
        {token && <Link to="/chat" className="text-gray-600 hover:text-blue-600">Chat</Link>}

        {/* 🔐 FAQAT SUPER_ADMIN YOKI SCHOOL_ADMIN'GARGINA ADMIN PANEL KO'RINADI */}
        {(role === 'super_admin' || role === 'school_admin') && (
          <Link to="/admin" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition-colors">
            Admin Panel
          </Link>
        )}

        {token ? (
          <button onClick={handleLogout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            Chiqish
          </button>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Kirish
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar