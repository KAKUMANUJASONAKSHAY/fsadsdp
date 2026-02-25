import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AdminDashboard from './pages/AdminDashboard'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Portal from './pages/Portal'
import Reports from './pages/Reports'
import SignUp from './pages/SignUp'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfile from './pages/StudentProfile'
import { getSession } from './services/auth'

function RequireAuth({ children }) {
  const session = getSession()
  if (!session) {
    return <Navigate to="/login" replace />
  }
  return children
}

function RequireAdmin({ children }) {
  const session = getSession()
  if (!session || session.role !== 'admin' || !session.adminVerified) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const location = useLocation()
  const hideChrome = ['/','/login','/signup'].includes(location.pathname)

  return (
    <div className="appShell">
      {!hideChrome && <Navbar />}
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/portal"
            element={
              <RequireAuth>
                <Portal />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/student/:id"
            element={
              <RequireAuth>
                <StudentDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <RequireAuth>
                <StudentProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireAuth>
                <Reports />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  )
}
