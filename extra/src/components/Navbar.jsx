import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import "../styles/navbar.css"

function Navbar({ simple }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="HostelEase Logo" />
        HostelEase
      </div>

      <ul className="nav-links">
        {simple ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li>|</li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar