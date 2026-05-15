import { useEffect, useState } from 'react'
import axios from 'axios'

function CabinetPage() {

  const [apps, setApps] = useState([])

  useEffect(() => {
    getMyApplications()
  }, [])

  const getMyApplications = async () => {

    const token = localStorage.getItem('token')

    const payload = JSON.parse(
      atob(token.split('.')[1])
    )

    const userId = payload.id

    const res = await axios.get(
      `http://localhost:5000/api/application/my/${userId}`
    )

    setApps(res.data)
  }

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Student Cabinet
      </h1>

      <div className="grid gap-5">

        {apps.map((item) => (

          <div
            key={item.id}
            className="bg-white p-5 rounded-xl shadow"
          >

            <h2 className="text-2xl font-bold">
              {item.child_name}
            </h2>

            <p>
              <b>Maktab:</b> {item.school_name}
            </p>

            <p>
              <b>Status:</b> {item.status}
            </p>

            <a
              href={`http://localhost:5000/uploads/${item.document}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              Hujjatni ko‘rish
            </a>

          </div>

        ))}

      </div>

    </div>
  )
}

export default CabinetPage