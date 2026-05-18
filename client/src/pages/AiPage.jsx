import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AiPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { sender: 'AI', text: 'Salom! Men sizning virtual yordamchingizman. Maktabga qabul bo\'yicha savollaringiz bo\'lsa yozing!' }
  ]);
  const messagesEndRef = useRef(null);

  // Har safar yangi xabar kelganda avtomatik pastga tushirish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: 'User', text: message };
    setChat((prev) => [...prev, userMessage]);
    const currentInput = message;
    setMessage('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/chat`,
        { message: currentInput }
      );

      setChat((prev) => [
        ...prev,
        { sender: 'AI', text: res.data.reply }
      ]);
    } catch (error) {
      console.error("AI bilan aloqada xato:", error);
      setChat((prev) => [
        ...prev,
        { sender: 'AI', text: "Kechirasiz, aloqa uzildi. Iltimos qayta urinib ko'ring." }
      ]);
    }
  };

  return (
    <div className="p-4 sm:p-10 bg-slate-50 min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 flex items-center gap-2">
          🤖 AI Support Assistant
        </h1>
        <p className="text-slate-500 mb-6">Tizim bo'yicha savollaringizga real-vaqt rejimida javob oling.</p>

        {/* Chat Oynasi */}
        <div className="bg-white h-[450px] overflow-y-auto p-5 rounded-3xl shadow-md border border-slate-100 flex flex-col gap-4">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col max-w-[80%] ${
                msg.sender === 'User' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <span className="text-xs text-slate-400 font-medium mb-1 px-1">
                {msg.sender === 'User' ? 'Siz' : 'AI Assistant'}
              </span>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'User'
                    ? 'bg-purple-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Xabar yuborish qismi */}
        <div className="flex gap-3 mt-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Savolingizni yozing va Enter bosing..."
            className="border border-slate-200 p-4 rounded-2xl w-full text-sm focus:outline-none focus:border-purple-500 bg-white shadow-sm transition-all"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 rounded-2xl shadow-md transition-all active:scale-95"
          >
            Yuborish
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiPage;