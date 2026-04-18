import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import API from "../api/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", { token, newPassword });
      setSuccess(res.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar simple={true} />
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#f8fafc", padding: "16px"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "white", borderRadius: "12px", padding: "40px",
            width: "100%", maxWidth: "420px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>🔐 Reset Password</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px 0" }}>
            Enter your new password below.
          </p>

          {success ? (
            <div style={{
              background: "#f0fdf4", border: "1px solid #86efac",
              borderRadius: "8px", padding: "20px", textAlign: "center"
            }}>
              <p style={{ color: "#16a34a", margin: "0 0 8px 0", fontWeight: "500" }}>
                ✅ {success}
              </p>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "0" }}>
                Redirecting to login in 3 seconds...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                  required
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
                    borderRadius: "6px", fontSize: "14px", marginTop: "6px",
                    boxSizing: "border-box", outline: "none"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  required
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
                    borderRadius: "6px", fontSize: "14px", marginTop: "6px",
                    boxSizing: "border-box", outline: "none"
                  }}
                />
              </div>

              {error && (
                <p style={{ color: "red", fontSize: "13px", margin: "0 0 16px 0" }}>
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                style={{
                  width: "100%", padding: "12px", border: "none",
                  borderRadius: "6px", background: "#2563eb", color: "white",
                  cursor: "pointer", fontSize: "15px", fontWeight: "500"
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
                <Link to="/login" style={{ color: "#2563eb" }}>← Back to Login</Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default ResetPassword;