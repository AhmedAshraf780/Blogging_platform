import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { userService } from './services/user.service'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ValidateOtp from './pages/ValidateOtp'
import MyBlogs from './pages/MyBlogs'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import './App.css'

function App() {
  const [auth, setAuth] = useState<{ ok: boolean; user?: { _id?: string }; _id?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.me().then(data => {
      setAuth(data)
      setLoading(false)
    })
  }, [])

  const isAuthenticated = auth?.ok ?? false
  const userId = (auth?.user?._id || auth?._id) ?? null

  return (
    <>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#12141e',
            color: '#f1f5f9',
            border: '1px solid #1e2030',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#12141e',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#12141e',
            },
          },
        }}
      />
      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home isAuthenticated={isAuthenticated} userId={userId} /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/validate-otp" element={<ValidateOtp />} />
          <Route path="/my-blogs" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MyBlogs /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CreateBlog /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditBlog /></ProtectedRoute>} />
        </Routes>
      )}
    </>
  )
}

export default App
