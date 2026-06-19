const API = `http://zippy-mercy-production.up.railway.app`

export const userService = {
  async signup(name: string, email: string, password: string) {
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
    }
  },

  async signin(email: string, password: string) {
    try {


      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
    }
  },

  async validateOtp(session_id: string, otp: string) {
    try {
      const res = await fetch(`${API}/api/v1/auth/validateotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, otp }),
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
    }
  },

  async me() {
    try {
      const res = await fetch(`${API}/api/v1/me`, {
        credentials: 'include',
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
      return { ok: false }
    }
  },

  async logout() {
    try {
      const res = await fetch(`${API}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      return { ok: res.ok }
    } catch (e) {
      console.log(e)
      return { ok: false }
    }
  },
}
