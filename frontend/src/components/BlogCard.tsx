import { Link } from 'react-router-dom'

interface Blog {
  id: number
  title: string
  content: string
  author_id: number
  author_name: string
  created_at?: string
  updated_at?: string
}

interface Props {
  blog: Blog
  onDelete: (id: number) => void
  isOwner: boolean
}

export default function BlogCard({ blog, onDelete, isOwner }: Props) {
  const date = blog.created_at
    ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <div className="blog-card">
      <div className="blog-card-body">
        <h2><Link to={`/edit/${blog.id}`}>{blog.title}</Link></h2>
        <p>{blog.content.slice(0, 250)}{blog.content.length > 250 ? '...' : ''}</p>
        <div className="blog-meta">
          <span>{blog.author_name}</span>
          {date && <span className="dot" />}
          {date && <span>{date}</span>}
        </div>
      </div>
      {isOwner && (
        <div className="blog-card-actions">
          <Link to={`/edit/${blog.id}`} className="btn-sm">Edit</Link>
          <button className="btn-sm btn-danger" onClick={() => onDelete(blog.id)}>Delete</button>
        </div>
      )}
    </div>
  )
}
