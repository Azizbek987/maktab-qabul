import React from 'react';
import axios from 'axios';

function PaymentPage() {
  const makePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Iltimos, avval tizimga kiring (Logindan o'ting)!");
        return;
      }

      // Token ichidan user_id ni ajratib olish (JWT decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user_id = payload.id;

      // Backendga to'lov so'rovini yuborish
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create`,
        {
          user_id,
          amount: 50000 // Arizaning narxi: 50 000 so'm
        }
      );

      // Agar backend to'lov URL manzilini bersa, foydalanuvchini o'sha sahifaga otamiz
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("To'lov tizimida xatolik yuz berdi.");
      }

    } catch (error) {
      console.error("To'lov qilishda xato:", error);
      alert("To'lov sahifasiga o'tishda xatolik: " + error.message);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-5 text-gray-800">Online Payment</h1>
      
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-lg w-full text-center border border-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">Ariza to‘lovi</h2>
        <p className="text-3xl font-bold text-green-600 mb-8">50 000 so‘m</p>
        
        <button
          onClick={makePayment}
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-4 rounded-xl shadow-md transition-all w-full text-lg"
        >
          Click / Payme orqali to‘lash
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;