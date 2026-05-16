import { useEffect, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

function ChatPage() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    getMessages()

    // 🔌 Serverga ulanish (Sizning Render backend manzilingiz)
    const socket = io('https://maktab-qabul.onrender.com')

    // Yangi kelgan xabarni real-vaqtda qabul qilib, massivga qo'shish
    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.disconnect() // Sahifadan chiqqanda tarmoqni uzish
    }
  }, [])

  const getMessages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/all`)
      setMessages(res.data)
    } catch (err) {
      console.log("Xabarlarni yuklashda xato:", err)
    }
  }

  const sendMessage = async () => {
    if (!text.trim()) return

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/chat/send`, {
        sender: 'Parent', // Keyinchalik buni avtorizatsiyadan olingan ismga almashtirish mumkin
        text
      })
      setText('')
    } catch (err) {
      console.log("Xabar yuborishda xato:", err)
    }
  }

  return (
    <div className="p-5 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-5 text-gray-800">Yordam Markazi (Chat)</h1>

      <div className="bg-white h-[450px] overflow-y-auto p-5 rounded-xl shadow border border-gray-200 mb-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 p-3 rounded-lg max-w-[80%] ${msg.sender === 'Parent' ? 'bg-blue-50 ml-auto text-right' : 'bg-gray-100'}`}>
            <p className="text-xs font-bold text-gray-500">{msg.sender}</p>
            <p className="text-gray-800 mt-1">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Xabar yozing..."
          className="border border-gray-300 p-3 rounded-xl w-full outline-none focus:border-blue-500 transition-all"
        />
        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-xl font-semibold transition-colors">
          Yuborish
        </button>
      </div>
    </div>
  )
}

export default ChatPage