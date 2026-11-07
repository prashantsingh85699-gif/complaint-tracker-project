import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
