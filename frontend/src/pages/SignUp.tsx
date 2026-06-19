import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userService } from '../services/user.service'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = await userService.signup(name, email, password)
    if (data.session_id) {
      toast.success(' Check your email for the OTP.')
      navigate('/validate-otp', { state: { session_id: data.session_id, email } })
    } else {
      toast.error(data.message || 'Sign up failed')
    }
  }

  return (
    <div className="form-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="auth-subtitle">Join us and start blogging</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
        <p className="form-footer">Already have an account? <Link to="/signin">Sign in</Link></p>
      </div>
    </div>
  )
}
