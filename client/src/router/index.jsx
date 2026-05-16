import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from '../utils/ProtectedRoute'
import ApplicationPage from '../pages/ApplicationPage'
import AdminPage from '../pages/AdminPage'
import CabinetPage from '../pages/CabinetPage' 
import ChatPage from '../pages/ChatPage' 
import AnalyticsPage from '../pages/AnalyticsPage' // 📊 Analitika sahifasi import qilindi
import { getUser } from '../utils/auth'

// 🔐 Admin rollarini tekshiruvchi funksiya (Yangilandi)
const AdminRoute = ({ children }) => {
  const user = getUser()

  // Agar user tizimga kirmagan bo'lsa yoki roli admin bo'lmasa, bosh sahifaga otadi
  if (!user || (user.role !== 'super_admin' && user.role !== 'school_admin')) {
    return <Navigate to="/" />
  }

  return children
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ochiq sahifalar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/apply" element={<ApplicationPage />} />

        {/* Shaxsiy kabinet sahifasi */}
        <Route
          path="/cabinet"
          element={
            <ProtectedRoute>
              <CabinetPage />
            </ProtectedRoute>
          }
        />

        {/* Chat sahifasi */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Admin panel sahifasi */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* 📊 ANALYTICS DASHBOARD SAHIFASI (Faqat adminlar kira oladi) */}
        <Route
          path="/analytics"
          element={
            <AdminRoute>
              <AnalyticsPage />
            </AdminRoute>
          }
        />

        {/* Dashboard sahifasi */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router