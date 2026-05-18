import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
      {/* Sayt Logosi */}
      <Link to="/" className="text-xl font-bold tracking-wide text-blue-400 cursor-pointer">
        Maktab Qabul
      </Link>

      {/* Menyular ro'yxati va Til tanlagich */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-blue-400 transition">
          {t('home')}
        </Link>
        <Link to="/apply" className="hover:text-blue-400 transition">
          {t('apply')}
        </Link>
        <Link to="/login" className="hover:text-blue-400 transition">
          {t('login')}
        </Link>
        <Link to="/register" className="hover:text-blue-400 transition">
          {t('register')}
        </Link>

        {/* 💵 To'lov tugmasi */}
        <Link 
          to="/payment" 
          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-md"
        >
          {t('payment') || '📭 To\'lov'}
        </Link>

        {/* 📱 QR Code sahifasi */}
        <Link 
          to="/qr" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-md"
        >
          {t('qr_code') || '📱 QR Code'}
        </Link>

        {/* 🤖 YANGI QO'SHILGAN: AI ASSISTANT TUGMASI */}
        <Link 
          to="/ai" 
          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-md animate-bounce-short"
        >
          {t('ai_assistant') || '🤖 AI Assistant'}
        </Link>

        {/* 🌐 Tillar selecti */}
        <select
          onChange={changeLanguage}
          value={i18n.language}
          className="bg-slate-800 text-white border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer transition"
        >
          <option value="uz">🇺🇿 UZ</option>
          <option value="ru">🇷🇺 RU</option>
          <option value="en">🇬🇧 EN</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;