import Navbar from "../components/Navbar"
import "../styles/services.css"
import { FaStar, FaRegStar, FaSearch, FaMapMarkerAlt } from "react-icons/fa"

function Services() {
  const services = [
    {
      name: "Clean & Dry Laundry",
      distance: "0.4 km",
      location: "Sandra",
      reviews: 120,
      rating: 4
    },
    {
      name: "PressPlus Laundry",
      distance: "0.6 km",
      location: "Landra",
      reviews: 98,
      rating: 3
    },
    {
      name: "RapidWash Laundry",
      distance: "0.9 km",
      location: "Landra",
      reviews: 76,
      rating: 4
    },
    {
      name: "QuickWash Laundry",
      distance: "1.2 km",
      location: "Landru",
      reviews: 85,
      rating: 3
    }
  ]

  const renderStars = (rating) => {
    return (
      <>
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <FaStar key={index} className="star filled" />
          ) : (
            <FaRegStar key={index} className="star" />
          )
        )}
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="services-container">
        <h1 className="page-title">Laundry Services</h1>

        {/* Search */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search laundry services..." />
        </div>

        {/* Filter Row */}
        <div className="filter-row">
          <button className="nearby-btn">Nearby</button>
          <button className="filter-btn">Filter</button>
        </div>

        {/* Cards */}
        <div className="services-list">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-left">
                <div className="service-icon">🧺</div>

                <div>
                  <h3>{service.name}</h3>

                  <div className="rating">
                    {renderStars(service.rating)}
                    <span>({service.reviews} reviews)</span>
                  </div>

                  <div className="location">
                    <FaMapMarkerAlt />
                    <span>{service.location}</span>
                  </div>
                </div>
              </div>

              <div className="service-right">
                <p className="distance">{service.distance}</p>
                <button className="details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Services