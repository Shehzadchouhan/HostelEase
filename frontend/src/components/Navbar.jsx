import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoImg from "../assets/logo.png"
import "../styles/navbar.css"

function Navbar({ simple }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setMenuOpen(false)
    navigate("/login")
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src={logoImg} alt="HostelEase Logo" />
          <span>HostelEaze</span>
        </div>

        {/* Desktop nav */}
        <ul className="nav-links">
          {simple ? (
            <>
              {!user ? (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li>|</li>
                  <li><Link to="/register">Register</Link></li>
                </>
              ) : (
                <li><span style={{ color: "#666" }}>Welcome, {user.name || user.email}</span></li>
              )}
            </>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/map">Map</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </>
          )}
        </ul>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          ) : (
            <>
              <span style={{ color: "#666", marginRight: "12px" }}>
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger button - only visible on mobile */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {!simple && (
          <>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link to="/map" onClick={() => setMenuOpen(false)}>Map</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </>
        )}
        {!user ? (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="register-btn" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        ) : (
          <>
            <span style={{ color: "#666", display: "block", padding: "12px" }}>
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default Navbar