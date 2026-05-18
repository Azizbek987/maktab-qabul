import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 

// Barcha sahifalarni Lazy Loading qilish
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CabinetPage = lazy(() => import('./pages/CabinetPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const QrPage = lazy(() => import('./pages/QrPage'));

// 🤖 YANGI: AI Sahifasini import qilish
const AiPage = lazy(() => import('./pages/AiPage'));

function App() {
  return (
    <Router>
      <Navbar /> 

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
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/qr" element={<QrPage />} />
          
          {/* 🤖 YANGI: AI sahifasining eshigi */}
          <Route path="/ai" element={<AiPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;