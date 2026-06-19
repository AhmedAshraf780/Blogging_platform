import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo" onClick={closeMenu}>BlogApp</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link" onClick={closeMenu}>Feed</Link>
          <Link to="/my-blogs" className="nav-link" onClick={closeMenu}>My Blogs</Link>
        </div>
        <div className="nav-right">
          <Link to="/signin" className="nav-link" onClick={closeMenu}>Sign In</Link>
          <Link to="/signup" className="nav-link primary" onClick={closeMenu}>Sign Up</Link>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Feed</Link>
        <Link to="/my-blogs" className="nav-link" onClick={closeMenu}>My Blogs</Link>
        <Link to="/signin" className="nav-link" onClick={closeMenu}>Sign In</Link>
        <Link to="/signup" className="nav-link primary" onClick={closeMenu}>Sign Up</Link>
      </div>
    </>
  )
}
