import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import loginImage from "../assets/login.png";
import "../styles/login-module.css";
import { motion } from "framer-motion";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", formData);
      const { token, user } = res.data.data;

      // ✅ Save token and user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect to services after login
      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

            <form className="login-form" onSubmit={handleLogin}>

              <label>Email or Phone</label>
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Enter your email or phone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <div className="forgot-password">Forgot password?</div>

              {/* ✅ Error Message */}
              {error && (
                <p style={{ color: "red", fontSize: "14px", margin: "0" }}>
                  ⚠️ {error}
                </p>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="divider">OR</div>

              <p style={{ textAlign: "center", fontSize: "14px", margin: "0" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#2563eb", fontWeight: "500" }}>
                  Register here
                </Link>
              </p>

            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Login;