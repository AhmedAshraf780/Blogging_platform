import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/signin')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo" onClick={closeMenu}>BlogApp</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link" onClick={closeMenu}>Feed</Link>
          {isAuthenticated && (
            <Link to="/my-blogs" className="nav-link" onClick={closeMenu}>My Blogs</Link>
          )}
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <button className="nav-link" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/signin" className="nav-link" onClick={closeMenu}>Sign In</Link>
              <Link to="/signup" className="nav-link primary" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Feed</Link>
        {isAuthenticated && (
          <Link to="/my-blogs" className="nav-link" onClick={closeMenu}>My Blogs</Link>
        )}
        {isAuthenticated ? (
          <button className="nav-link" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/signin" className="nav-link" onClick={closeMenu}>Sign In</Link>
            <Link to="/signup" className="nav-link primary" onClick={closeMenu}>Sign Up</Link>
          </>
        )}
      </div>
    </>
  )
}
