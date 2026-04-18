import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import loginImage from "../assets/login.png";
import "../styles/login-module.css";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

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
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const res = await API.post("/auth/forgot-password", { email: forgotEmail });
      setForgotMessage(res.data.message || "Reset link sent! Check your email.");
      setForgotEmail("");
    } catch (err) {
      setForgotError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotMessage("");
    setForgotError("");
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

              {/* ✅ Forgot Password - now clickable */}
              <div
                className="forgot-password"
                onClick={() => setShowForgotModal(true)}
                style={{ cursor: "pointer", color: "#2563eb" }}
              >
                Forgot password?
              </div>

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

      {/* ✅ Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.5)", display: "flex",
              alignItems: "center", justifyContent: "center", zIndex: 1000
            }}
            onClick={closeForgotModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "white", borderRadius: "12px", padding: "32px",
                width: "100%", maxWidth: "400px", margin: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", color: "#1e293b" }}>
                🔐 Forgot Password
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px 0" }}>
                Enter your registered email and we'll send you a reset link.
              </p>

              {forgotMessage ? (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #86efac",
                  borderRadius: "8px", padding: "16px", textAlign: "center"
                }}>
                  <p style={{ color: "#16a34a", margin: "0 0 16px 0", fontSize: "14px" }}>
                    ✅ {forgotMessage}
                  </p>
                  <button
                    onClick={closeForgotModal}
                    style={{
                      background: "#2563eb", color: "white", border: "none",
                      borderRadius: "6px", padding: "10px 20px", cursor: "pointer",
                      fontSize: "14px", fontWeight: "500"
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => { setForgotEmail(e.target.value); setForgotError(""); }}
                    required
                    style={{
                      width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
                      borderRadius: "6px", fontSize: "14px", marginTop: "6px",
                      marginBottom: "16px", boxSizing: "border-box", outline: "none"
                    }}
                  />

                  {forgotError && (
                    <p style={{ color: "red", fontSize: "13px", margin: "0 0 12px 0" }}>
                      ⚠️ {forgotError}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      style={{
                        flex: 1, padding: "10px", border: "1px solid #d1d5db",
                        borderRadius: "6px", background: "white", cursor: "pointer",
                        fontSize: "14px", color: "#374151"
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      style={{
                        flex: 1, padding: "10px", border: "none",
                        borderRadius: "6px", background: "#2563eb", color: "white",
                        cursor: "pointer", fontSize: "14px", fontWeight: "500"
                      }}
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Login;