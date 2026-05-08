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
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid reset link. Please request a new one.");
        setValidating(false);
        return;
      }

      try {
        setValidating(true);
        await API.get(`/auth/validate-reset-token/${token}`);
        setValidating(false);
        setError("");
      } catch (err) {
        setValidating(false);
        setError(err.response?.data?.message || "Invalid or expired reset link. Please request a new one.");
      }
    };

    validateToken();
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
          ) : validating ? (
            <div style={{
              background: "#f0f9ff", border: "1px solid #bfdbfe",
              borderRadius: "8px", padding: "20px", textAlign: "center"
            }}>
              <p style={{ color: "#1e40af", margin: "0", fontWeight: "500" }}>
                🔄 Validating reset link...
              </p>
            </div>
          ) : error ? (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "8px", padding: "20px", textAlign: "center"
            }}>
              <p style={{ color: "#991b1b", margin: "0 0 12px 0", fontWeight: "500" }}>
                ❌ {error}
              </p>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 12px 0" }}>
                The reset link has expired or is invalid.
              </p>
              <Link to="/login" style={{
                display: "inline-block", color: "#2563eb", textDecoration: "none",
                fontWeight: "500", fontSize: "14px"
              }}>
                Back to Login
              </Link>
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
                disabled={loading || validating || !token || !!error}
                style={{
                  width: "100%", padding: "12px", border: "none",
                  borderRadius: "6px", background: loading ? "#94a3b8" : "#2563eb", 
                  color: "white", cursor: loading ? "not-allowed" : "pointer", 
                  fontSize: "15px", fontWeight: "500"
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