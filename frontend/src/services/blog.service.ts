const API = `http://localhost:5000`

export const blogService = {
  async getAllBlogsOfUser() {
    try {
      const res = await fetch(`${API}/api/v1/blogs/me`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (Array.isArray(data)) return data
      if (data.blogs) return data.blogs
      return data
    } catch (e) {
      console.log(e)
    }
  },

  async getAll() {
    try {
      const res = await fetch(`${API}/api/v1/blogs`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (Array.isArray(data)) return data
      if (data.blogs) return data.blogs
      return data
    } catch (e) {
      console.log(e)
    }
  },

  async getById(id: string | number) {
    try {
      const res = await fetch(`${API}/api/v1/blogs/${id}`, {
        credentials: 'include',
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
    }
  },

  async create(title: string, content: string) {
    try {
      const res = await fetch(`${API}/api/v1/blogs`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
    }
  },

  async update(id: string | number, title: string, content: string) {
    try {
      const res = await fetch(`${API}/api/v1/blogs/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
    }
  },

  async delete(id: string | number) {
    try {
      const res = await fetch(`${API}/api/v1/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      return { ok: res.ok, ...data }
    } catch (e) {
      console.log(e)
    }
  },
}
