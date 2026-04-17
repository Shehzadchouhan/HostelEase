import { useState } from "react"
import Navbar from "../components/Navbar"
import "../styles/contact.css"
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa"
import API from "../api/api"

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await API.post("/contact/submit", formData)

      setTicketId(res.data.ticketId)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      })

      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to send message. Please try again."
      )
      console.error("Contact form error:", err)
    } finally {
      setLoading(false)
    }
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
                <p>HostelEase, Gill Road, Ludhiana, Punjab</p>
              </div>
            </div>

            <div className="info-card">
              <FaPhoneAlt className="info-icon" />
              <div>
                <h3>Phone Numbers</h3>
                <p>+91 99880 59280</p>
                <p>+91 79736 17236</p>
                <p>+91 77101 58529</p>
              </div>
            </div>

            <div className="info-card">
              <FaEnvelope className="info-icon" />
              <div>
                <h3>Email</h3>
                <p>supporthosteleaze@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="contact-form">
            <form onSubmit={handleSubmit}>

              <div className="input-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label>Your Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number (optional)"
                />
              </div>

              <div className="input-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="input-group">
                <label>Message *</label>
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>

              {error && (
                <p style={{ color: "red", fontSize: "14px", margin: "0" }}>
                  ⚠️ {error}
                </p>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>

              {submitted && (
                <div className="success-container">
                  <p className="success-msg">
                    ✅ Message sent successfully!
                  </p>
                  {ticketId && (
                    <p className="ticket-msg">
                      Your Ticket ID: <strong>{ticketId}</strong>
                    </p>
                  )}
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default Contact