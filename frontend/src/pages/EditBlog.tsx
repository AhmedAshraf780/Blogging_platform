import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { blogService } from '../services/blog.service'

export default function EditBlog() {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    blogService.getById(id).then(data => {
      const blog = data.blog || data
      setTitle(blog.title || '')
      setContent(blog.content || '')
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const data = await blogService.update(id, title, content)
    if (data.id) {
      toast.success('Blog updated successfully')
      navigate('/')
    } else {
      toast.error(data.message || 'Failed to update blog')
    }
  }

  return (
    <div className="form-page">
      <div className="auth-card">
        <h1>Edit Blog</h1>
        <p className="auth-subtitle">Make your post even better</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Update Blog</button>
        </form>
      </div>
    </div>
  )
}
