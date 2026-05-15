import { Link } from 'react-router-dom'

function Navbar() {

  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="bg-white shadow-md px-10 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-blue-600">
        Maktab Qabul
      </h1>

      <div className="flex gap-5 items-center">

        <Link to="/">
          Bosh sahifa
        </Link>

        <Link to="/apply">
          Ariza
        </Link>

        <Link to="/admin">
          Admin
        </Link>

        {!token ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        )}

      </div>
    </div>
  )
}

export default Navbar