import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userService } from '../services/user.service'

export default function ValidateOtp() {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { session_id?: string; email?: string } | null
  const session_id = state?.session_id || ''
  const email = state?.email || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = await userService.validateOtp(session_id, otp)
    if (data.ok) {
      toast.success('Email verified successfully')
      navigate('/signin')
    } else {
      toast.error(data.message || 'Validation failed')
    }
  }

  return (
    <div className="form-page">
      <div className="auth-card">
        <h1>Check your email</h1>
        <p className="auth-subtitle">Enter the OTP sent to {email}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>OTP Code</label>
            <input type="text" placeholder="000000" value={otp} onChange={e => setOtp(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Verify Email</button>
        </form>
      </div>
    </div>
  )
}
