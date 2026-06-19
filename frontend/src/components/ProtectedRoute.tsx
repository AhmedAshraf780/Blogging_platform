import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Checking authentication...</span>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/signin" replace />

  return <>{children}</>
}
