import Navbar from '../components/Navbar'

function HomePage() {

  return (
    <div>

      <Navbar />

      <div className="flex flex-col items-center justify-center h-[80vh] text-center">

        <h1 className="text-6xl font-bold text-blue-600 mb-6">
          Maktab Qabul Tizimi
        </h1>

        <p className="text-gray-600 text-xl mb-10 max-w-[700px]">
          Bolalarni maktabga online qabul qilish
          platformasi.
        </p>

        <a
          href="/apply"
          className="bg-blue-500 text-white px-8 py-4 rounded-2xl text-xl"
        >
          Ariza Topshirish
        </a>

      </div>

    </div>
  )
}

export default HomePage