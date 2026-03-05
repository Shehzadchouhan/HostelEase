import React, { useState } from "react";
import "../styles/register.css";
import registerImage from "../assets/login.png"; // use same illustration

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    hostelName: "",
    roomNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registered Data:", formData);
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
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="hostelName"
            placeholder="Hostel Name"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          <button type="submit" className="register-btn">
            Register
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>

    </div>
  );
};

export default Register;