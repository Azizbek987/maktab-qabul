import React from 'react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
      {/* Sayt Logosi */}
      <div className="text-xl font-bold tracking-wide text-blue-400">
        Maktab Qabul
      </div>

      {/* Menyular ro'yxati va Til tanlagich */}
      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-blue-400 transition">
          {t('home')}
        </a>
        <a href="#" className="hover:text-blue-400 transition">
          {t('apply')}
        </a>
        <a href="#" className="hover:text-blue-400 transition">
          {t('login')}
        </a>
        <a href="#" className="hover:text-blue-400 transition">
          {t('register')}
        </a>

        {/* 🌐 Tillar almashadigan chiroyli Select tugmasi */}
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