import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { blogService } from '../services/blog.service'

export default function CreateBlog() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = await blogService.create(title, content)
    if (data.id) {
      toast.success('Blog published successfully')
      navigate('/')
    } else {
      toast.error(data.message || 'Failed to create blog')
    }
  }

  return (
    <div className="form-page">
      <div className="auth-card">
        <h1>New Blog</h1>
        <p className="auth-subtitle">Share your thoughts with the world</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Publish Blog</button>
        </form>
      </div>
    </div>
  )
}
