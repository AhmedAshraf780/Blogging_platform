import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { blogService } from '../services/blog.service'
import BlogCard from '../components/BlogCard'

interface Blog {
  id: number
  title: string
  content: string
  author_id: number
  author_name: string
  created_at?: string
  updated_at?: string
}

export default function Home() {
  const { isAuthenticated, userId } = useAuth()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreator, setShowCreator] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchBlogs = () => {
    blogService.getAll().then(data => {
      if (Array.isArray(data)) {
        setBlogs(data)
      } else if (data.blogs) {
        setBlogs(data.blogs)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return
    setSubmitting(true)
    const data = await blogService.create(newTitle, newContent)
    if (data.blog?.id || data.id) {
      toast.success('Blog published')
      setNewTitle('')
      setNewContent('')
      setShowCreator(false)
      fetchBlogs()
    } else {
      toast.error(data.message || 'Failed to publish')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: number) => {
    await blogService.delete(id)
    toast.success('Blog deleted')
    fetchBlogs()
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading blogs...</span>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="home">
        {isAuthenticated && (
          <div className="creator-card">
            {!showCreator ? (
              <div className="creator-trigger" onClick={() => setShowCreator(true)}>
                What's on your mind?
              </div>
            ) : (
              <form className="creator-form" onSubmit={handleCreate}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Content"
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                />
                <div className="creator-actions">
                  <button type="button" className="btn" onClick={() => { setShowCreator(false); setNewTitle(''); setNewContent('') }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="home-header">
          <h1>Feed</h1>
        </div>

        {blogs.length === 0 ? (
          <div className="empty">
            No blogs yet.
          </div>
        ) : (
          <div className="blog-list">
            {blogs.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onDelete={handleDelete}
                isOwner={userId === String(blog.author_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
