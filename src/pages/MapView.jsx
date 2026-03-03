import "../styles/mapview.css"
import { FaSearch, FaStar, FaRegStar, FaMapMarkerAlt } from "react-icons/fa"
import mapImage from "../assets/map-bg.png"

function MapView() {

  const services = [
    {
      name: "Clean & Dry Laundry",
      distance: "0.4 km",
      location: "Sandru",
      reviews: 120,
      rating: 4
    },
    {
      name: "PressPlus Laundry",
      distance: "0.6 km",
      location: "Landru",
      reviews: 98,
      rating: 3
    }
  ]

  const renderStars = (rating) => {
    return (
      <>
        {[...Array(5)].map((_, i) =>
          i < rating
            ? <FaStar key={i} className="star filled" />
            : <FaRegStar key={i} className="star" />
        )}
      </>
    )
  }

  return (
    <div className="map-page">

      {/* Search Bar */}
      <div className="map-search">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search services..." />
      </div>

      {/* Map Background */}
      <div className="map-container">
        <img src={mapImage} alt="Map" />
      </div>

      {/* Service Cards Overlay */}
      <div className="map-cards">
        {services.map((service, index) => (
          <div className="map-card" key={index}>
            <div className="card-left">
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

            <div className="card-right">
              <p>{service.distance}</p>
              <button>View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div>🏠<p>Home</p></div>
        <div className="active">📍<p>Map</p></div>
        <div>❤️<p>Saved</p></div>
        <div>👤<p>Profile</p></div>
      </div>

    </div>
  )
}

export default MapView