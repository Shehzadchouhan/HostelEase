import Navbar from "../components/Navbar";
import "../styles/landing.css";
import loginImage from "../assets/login.png";
import { useNavigate } from "react-router-dom";

function Landing() {
  const scrollToFeatures = () => {
    document.getElementById("features").scrollIntoView({
      behavior: "smooth",
    });
  };
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Find Essential Services <br />
            Around Your Hostel in Seconds
          </h1>

          <p>
            Discover trusted local services near your hostel quickly, easily and
            without asking anyone.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Explore Now
            </button>
            <button className="secondary-btn" onClick={scrollToFeatures}>
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src={loginImage} alt="Hero" />
        </div>
      </section>

      {/* FEATURES SECTION */}
<section className="features" id="features">
  <div className="features-header">
    <h2>Why Choose HostelEase?</h2>
    <p>Everything you need around your hostel — simplified.</p>
  </div>

  <div className="features-container">

    <div className="card">
      <div className="icon">📍</div>
      <h3>Find Everything Nearby</h3>
      <p>
        Food, laundry, medical, stationery and more — all within walking distance.
      </p>
    </div>

    <div className="card">
      <div className="icon">⭐</div>
      <h3>Student Verified Listings</h3>
      <p>
        Trusted services reviewed and rated by real hostel students.
      </p>
    </div>

    <div className="card">
      <div className="icon">🗺️</div>
      <h3>Quick & Easy Navigation</h3>
      <p>
        Get instant directions and reach your destination without confusion.
      </p>
    </div>

  </div>
</section>

{/* HOW IT WORKS SECTION */}
<section className="how-it-works">
  <div className="how-header">
    <h2>How It Works</h2>
    <p>Getting the services you need is simple and fast.</p>
  </div>

  <div className="steps-container">

    <div className="step">
      <div className="step-number">1</div>
      <h3>Login or Sign Up</h3>
      <p>Create your account and access services near your hostel.</p>
    </div>

    <div className="step">
      <div className="step-number">2</div>
      <h3>Choose a Service</h3>
      <p>Select from food, laundry, medical, stationery and more.</p>
    </div>

    <div className="step">
      <div className="step-number">3</div>
      <h3>Visit & Get Service</h3>
      <p>Get directions instantly and reach your destination easily.</p>
    </div>

  </div>
</section>


      {/* CTA SECTION */}
<section className="cta-section">
  <div className="cta-content">
    <h2>Simplify Your Hostel Life Today</h2>
    <p>
      Stop asking around. Discover nearby services instantly with HostelEase.
    </p>

    <div className="cta-buttons">
      <button 
        className="cta-primary"
        onClick={() => navigate("/login")}
      >
        Get Started
      </button>

      <button 
        className="cta-secondary"
        onClick={() => navigate("/register")}
      >
        Create Account
      </button>
    </div>
  </div>
</section>
      {/* FOOTER SECTION */}
<footer className="footer">
  <div className="footer-container">

    {/* ABOUT */}
    <div className="footer-column">
      <h3>HostelEase</h3>
      <p>
        Simplifying hostel life by connecting students to nearby essential 
        services quickly and easily.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div className="footer-column">
      <h4>Quick Links</h4>
      <p onClick={() => navigate("/")}>Home</p>
      <p onClick={() => navigate("/login")}>Login</p>
      <p onClick={() => navigate("/register")}>Register</p>
    </div>

    {/* TEAM CONTACT */}
    <div className="footer-column">
      <h4>Our Team</h4>
      <p>Mohd Shehzad</p>
      <p>Neha Mehta</p>
      <p>Khuspreet Kaur</p>
      <br />
      <h4>Contact</h4>
      <p>Email: hostelease.team@gmail.com</p>
      <p>GNDEC, Ludhiana</p>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 HostelEase. All Rights Reserved.
  </div>
</footer>
    </>
  );
}

export default Landing;
