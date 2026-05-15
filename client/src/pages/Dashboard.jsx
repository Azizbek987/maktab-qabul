import Navbar from '../components/Navbar'

function Dashboard() {
  return (
    <div className="bg-gray-100 h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-40">
        <h1 className="text-4xl font-bold text-green-600">
          Dashboard
        </h1>

        <p className="text-gray-600 mt-3">
          Siz tizimga muvaffaqiyatli kirdingiz 🎉
        </p>
      </div>
    </div>
  )
}

export default Dashboard