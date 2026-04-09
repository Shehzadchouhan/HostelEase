import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import loginImage from "../assets/login.png";
import "../styles/login-module.css";

import { motion } from "framer-motion";
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
function Login() {
  const navigate = useNavigate();

  return (
    <>
      {/* Simple Navbar (only Login + Register) */}
      <Navbar simple={true} />

      <div className="login-container">
        {/* Left Side */}
        <div className="left-section">
          <img src={loginImage} alt="illustration" />
          <h1>Welcome to HostelEase</h1>
          <p>Discover nearby essential services for hostel residents.</p>
        </div>

        {/* Right Side */}
        <div className="right-section">
          <motion.div
  className="login-card"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
            <h2>Login to Your Account</h2>

            <form className="login-form">
              {/* Email */}
              <label>Email or Phone</label>
              <input type="text" placeholder="Enter your email or phone" />

              {/* Password */}
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />

              <div className="forgot-password">Forgot password?</div>

              <button
                type="button"
                className="login-btn"
                onClick={() => navigate("/")}
              >
                Login
              </button>

              <div className="divider">OR</div>

              {/* Google Button */}
              <button type="button" className="google-btn">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt="Google logo"
                  className="google-icon"
                />
                Continue with Google
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}


export default Login;
