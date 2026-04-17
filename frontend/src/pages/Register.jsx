import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";
import registerImage from "../assets/login.png";
import API from "../api/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    cityName: "",
    stateName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const res = await API.post("/auth/register", dataToSend);
      const { token, user } = res.data.data;

      // ✅ Save token and user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Account created successfully! Redirecting...");

      // ✅ Redirect to services after registration
      setTimeout(() => navigate("/services"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      {/* LEFT SECTION */}
      <div className="left-section">
        <img src={registerImage} alt="illustration" />
        <h1>Join HostelEase</h1>
        <p>Create your account and explore nearby services easily.</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <form className="register-card" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
          />

          {/* ✅ Changed from hostelName to collegeName */}
          <input
            type="text"
            name="collegeName"
            placeholder="College Name"
            required
            value={formData.collegeName}
            onChange={handleChange}
          />

          {/* ✅ Added cityName */}
          <input
            type="text"
            name="cityName"
            placeholder="City"
            required
            value={formData.cityName}
            onChange={handleChange}
          />

          {/* ✅ Added stateName */}
          <input
            type="text"
            name="stateName"
            placeholder="State"
            required
            value={formData.stateName}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {/* ✅ Error / Success messages */}
          {error && (
            <p style={{ color: "red", fontSize: "14px", margin: "0" }}>
              ⚠️ {error}
            </p>
          )}
          {success && (
            <p style={{ color: "green", fontSize: "14px", margin: "0" }}>
              ✅ {success}
            </p>
          )}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>
      </div>

    </div>
  );
};

export default Register; 