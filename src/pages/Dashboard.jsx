import Navbar from "../components/Navbar"
import "../styles/dashboard.css"

function Dashboard() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-left">
          <h1>
            Find Essential Services <br />
            Around Your Hostel in Seconds
          </h1>
          <p>
            Discover local services near your hostel quickly and easily.
          </p>
        </div>

        <div className="hero-right">
          <img src="/hero-image.png" alt="Hero" />
        </div>
      </section>

      <section className="features">
        <div className="card">
          <h3>Nearby Services</h3>
          <p>Find shops & services close to you.</p>
        </div>

        <div className="card">
          <h3>Verified Listings</h3>
          <p>Trusted and verified providers.</p>
        </div>

        <div className="card">
          <h3>Easy Navigation</h3>
          <p>Get directions with just a tap.</p>
        </div>
      </section>

      <div className="cta">
        <button>Get Started</button>
      </div>
    </>
  )
}

export default Dashboard