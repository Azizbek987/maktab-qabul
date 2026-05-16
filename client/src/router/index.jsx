import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from '../utils/ProtectedRoute'
import ApplicationPage from '../pages/ApplicationPage'
import AdminPage from '../pages/AdminPage'
// 📍 8-QADAM — CABINET PAGE IMPORTI
import CabinetPage from '../pages/CabinetPage' 
import ChatPage from '../pages/ChatPage' // 💬 Chat sahifasini import qilish
import { getUser } from '../utils/auth'

const AdminRoute = ({ children }) => {
  const user = getUser()

  if (!user || user.role !== 'admin') {
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

        {/* 📍 8-QADAM — CABINET SAHIFASI (Faqat login qilganlar uchun) */}
        <Route
          path="/cabinet"
          element={
            <ProtectedRoute>
              <CabinetPage />
            </ProtectedRoute>
          }
        />

        {/* 💬 REALTIME SUPPORT CHAT SAHIFASI (Faqat login qilganlar uchun) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Admin sahifasi */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
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