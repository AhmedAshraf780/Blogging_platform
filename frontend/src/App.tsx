import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ValidateOtp from './pages/ValidateOtp'
import MyBlogs from './pages/MyBlogs'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import './App.css'

function App() {

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
      (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/validate-otp" element={<ValidateOtp />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/edit/:id" element={<EditBlog />} />
      </Routes>
      )
    </>
  )
}

export default App
