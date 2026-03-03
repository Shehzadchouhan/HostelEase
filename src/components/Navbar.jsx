import { Link } from "react-router-dom"
import "../styles/navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">HostelEase</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/services">Nearby Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="auth-buttons">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/register" className="register-btn">Register</Link>
      </div>
    </nav>
  )
}

export default Navbar