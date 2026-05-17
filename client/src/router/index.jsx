import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // O'z yo'lingizga qarab tekshiring

// 🚀 1 va 2-QADAM: Barcha sahifalarni Lazy Loading qilish (Faqat ochilganda yuklanadi)
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CabinetPage = lazy(() => import('./pages/CabinetPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

function App() {
  return (
    <Router>
      {/* Navbar har doim tepada turadi */}
      <Navbar /> 

      {/* 🚀 3-QADAM: Sahifalar yuklanayotgan paytda chiroyli "Yuklanmoqda..." chiqib turishi uchun Suspense */}
      <Suspense fallback={
        <div className="text-center p-20 text-2xl font-bold text-blue-600 animate-pulse">
          ⚡ Sahifa yuklanmoqda...
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;