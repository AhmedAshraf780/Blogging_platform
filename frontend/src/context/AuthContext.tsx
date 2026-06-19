import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { userService } from '../services/user.service'

interface AuthContextType {
  user: unknown
  userId: string | null
  isAuthenticated: boolean
  loading: boolean
  refreshAuth: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<unknown>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshAuth = useCallback(async () => {
    const data = await userService.me()
    if (data.ok) {
      setUser(data)
      setUserId(data.user?._id || data._id || null)
    } else {
      setUser(null)
      setUserId(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refreshAuth()
  }, [refreshAuth])

  const logout = async () => {
    await userService.logout()
    setUser(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ user, userId, isAuthenticated: !!user, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
