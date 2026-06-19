import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userService } from '../services/user.service'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = await userService.signin(email, password)
    if (data.ok) {
      toast.success('Signed in successfully')
      navigate('/')
    } else {
      toast.error(data.message || 'Sign in failed')
    }
  }

  return (
    <div className="form-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Sign In</button>
        </form>
        <p className="form-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  )
}
