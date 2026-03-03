import Navbar from "../components/Navbar";
import loginImage from "../assets/login-image.png";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <div className="login-container">
        {/* Left Side */}
        <div className="left-section">
          <img src={loginImage} alt="illustration" />
          <h1>Welcome to HostelEase</h1>
          <p>Discover nearby essential services for hostel residents.</p>
        </div>

        {/* Right Side */}
        <div className="right-section">
          <div className="login-card">
            <h2>Login to Your Account</h2>

            <input type="text" placeholder="Email or Phone" />
            <input type="password" placeholder="Password" />

            <div className="forgot-password">Forgot password?</div>

            <button
              className="login-btn"
              onClick={() => navigate("/dashboard")}
            >
              Login
            </button>

            <p className="register-text">
              New user? <span>Register</span>
            </p>

            <div className="divider">OR</div>

            <button className="google-btn">Continue with Google</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
