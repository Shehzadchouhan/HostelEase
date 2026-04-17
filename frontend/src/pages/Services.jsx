import Navbar from "../components/Navbar"
import "../styles/services.css"
import { getShops } from "../api/api"
import { FaStar, FaRegStar, FaMapMarkerAlt, FaFire } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const defaultShopImages = [
  "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Shop+1",
  "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Shop+2",
  "https://via.placeholder.com/150/45B7D1/FFFFFF?text=Shop+3",
  "https://via.placeholder.com/150/FFA07A/FFFFFF?text=Shop+4",
  "https://via.placeholder.com/150/98D8C8/FFFFFF?text=Shop+5",
  "https://via.placeholder.com/150/F7DC6F/FFFFFF?text=Shop+6",
]

function Services() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("nearby")
  const [sortOption, setSortOption] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [services, setServices] = useState([])
  const [userLocation, setUserLocation] = useState(null)

  const servicesPerPage = 3

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setUserLocation({ lat: 30.9000, lng: 75.8573 })
      }
    )
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await getShops()
        const shops = response.data.data || []

        const transformedServices = shops.map((shop, index) => ({
          id: shop._id,
          name: shop.name,
          category: shop.category,
          lat: shop.location?.coordinates ? shop.location.coordinates[1] : 30.9,
          lng: shop.location?.coordinates ? shop.location.coordinates[0] : 75.8573,
          // ✅ Use real data from DB — no more random values
          rating: shop.rating || 0,
          reviews: shop.reviews?.length || 0,
          address: shop.address || shop.category || "Nearby Area",
          basePrice: shop.pricing?.[0]?.price?.replace(/[^0-9]/g, "") || "0",
          contact: shop.contact || "",
          image: shop.image || defaultShopImages[index % defaultShopImages.length],
          distance: 0,
        }))

        setServices(transformedServices)
      } catch (error) {
        console.error("Error fetching services:", error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (!userLocation || services.length === 0) return

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLng = (lng2 - lng1) * Math.PI / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
          Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2)
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }

    const updated = services.map((s) => ({
      ...s,
      distance: calculateDistance(userLocation.lat, userLocation.lng, s.lat, s.lng),
    }))
    updated.sort((a, b) => a.distance - b.distance)
    setServices(updated)
  }, [userLocation])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeCategory, sortOption, activeFilter])

  const filteredServices = services
    .filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        activeCategory === "All" ||
        s.category.toLowerCase() === activeCategory.toLowerCase()
      const matchesFilter = activeFilter === "top" ? s.rating >= 4 : true
      return matchesSearch && matchesCategory && matchesFilter
    })
    .sort((a, b) => {
      if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0)
      if (sortOption === "priceHigh") return (b.basePrice || 0) - (a.basePrice || 0)
      return 0
    })

  const indexOfLast = currentPage * servicesPerPage
  const indexOfFirst = indexOfLast - servicesPerPage
  const currentServices = filteredServices.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage)

  const renderStars = (rating = 3) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} className="star filled" />
      ) : (
        <FaRegStar key={i} className="star" />
      )
    )

  const SkeletonCard = () => (
    <div className="service-card skeleton">
      <div className="skeleton-img"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text small"></div>
    </div>
  )

  return (
    <>
      <Navbar />
      <div className="services-container">
        <div className="category-tabs">
          {["All", "Laundry", "Food", "Medical", "Repair", "Barber", "Stationery"].map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? "active-category" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === "All" ? "All Services" : category}
            </button>
          ))}
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <button
            className={`filter-btn ${activeFilter === "nearby" ? "active" : ""}`}
            onClick={() => setActiveFilter("nearby")}
          >
            📍 Nearby
          </button>
          <button
            className={`filter-btn ${activeFilter === "top" ? "active" : ""}`}
            onClick={() => setActiveFilter("top")}
          >
            ⭐ Top Rated (4+)
          </button>
        </div>

        <div className="services-list">
          {loading ? (
            Array(servicesPerPage).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : currentServices.length > 0 ? (
            currentServices.map((service, index) => (
              <div
                className="service-card clickable"
                key={service.id}
                onClick={() => navigate(`/service/${service.id}`)}
              >
                <div className="service-left">
                  <div className="service-icon-circle">
                    <img src={service.image} alt={service.name} />
                  </div>
                  <div className="service-info">
                    <div className="service-header">
                      <h3>{service.name}</h3>
                      {index === 0 && activeFilter === "nearby" && (
                        <span className="badge nearest">🎯 Nearest</span>
                      )}
                      {service.rating >= 4 && (
                        <span className="badge toprated">
                          <FaFire /> {service.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="rating">
                      {renderStars(service.rating)}
                      <span className="review-count">{service.reviews} reviews</span>
                    </div>
                    <div className="location">
                      <FaMapMarkerAlt />
                      <span>{service.address}</span>
                    </div>
                  </div>
                </div>
                <div className="service-right">
                  <p className="distance">
                    {typeof service.distance === "number"
                      ? `${service.distance.toFixed(1)} km`
                      : "Calculating..."}
                  </p>
                  <p className="price">
                    Starting at <br /> ₹{service.basePrice}
                  </p>
                  <button className="details-btn">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No services found. Try adjusting your filters.</div>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Services