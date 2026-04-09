import { useState } from "react"
import Navbar from "../components/Navbar"
import "../styles/contact.css"
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa"

function Contact() {

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
    }, 4000)
  }

  return (
    <>
      <Navbar />

      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have questions? We're here to help Hostel students anytime.</p>
        </div>

        <div className="contact-wrapper">

          {/* Left Info Section */}
          <div className="contact-info">
            <div className="info-card">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h3>Our Location</h3>
                <p>HostelEase HQ, Landran, Punjab</p>
              </div>
            </div>

            <div className="info-card">
              <FaPhoneAlt className="info-icon" />
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="info-card">
              <FaEnvelope className="info-icon" />
              <div>
                <h3>Email</h3>
                <p>support@hostelease.com</p>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="contact-form">
            <form onSubmit={handleSubmit}>

              <div className="input-group">
                <label>Your Name</label>
                <input type="text" required />
              </div>

              <div className="input-group">
                <label>Your Email</label>
                <input type="email" required />
              </div>

              <div className="input-group">
                <label>Your Message</label>
                <textarea rows="5" required></textarea>
              </div>

              <button type="submit">Send Message</button>

              {submitted && (
                <p className="success-msg">
                  ✅ Message sent successfully!
                </p>
              )}

            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default Contact