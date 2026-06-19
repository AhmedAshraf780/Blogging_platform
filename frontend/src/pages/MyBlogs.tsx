import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { blogService } from '../services/blog.service'
import BlogCard from '../components/BlogCard'
import { userService } from '../services/user.service'
import { useNavigate } from 'react-router-dom'

interface Blog {
  id: number
  title: string
  content: string
  author_id: number
  author_name: string
  created_at?: string
  updated_at?: string
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const fetchMyBlogs = () => {
    blogService.getAllBlogsOfUser().then(data => {
      setBlogs(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    (async () => {
      const res = await userService.me();
      if (!res.ok) {
        navigate('/signin');
        return;
      }
    })()
    fetchMyBlogs()
  }, [])

  const handleDelete = async (id: number) => {
    await blogService.delete(id)
    toast.success('Blog deleted')
    fetchMyBlogs()
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="home">
        <div className="home-header">
          <h1>My Blogs</h1>
        </div>

        {blogs.length === 0 ? (
          <div className="empty">
            You haven't written any blogs yet.
          </div>
        ) : (
          <div className="blog-list">
            {blogs.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onDelete={handleDelete}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
