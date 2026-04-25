import Navbar from "../components/Navbar"
import "../styles/services.css"
import { getShops } from "../api/api"
import { FaStar, FaRegStar, FaMapMarkerAlt, FaFire } from "react-icons/fa"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"

const defaultShopImages = [
  "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Shop+1",
  "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Shop+2",
  "https://via.placeholder.com/150/45B7D1/FFFFFF?text=Shop+3",
  "https://via.placeholder.com/150/FFA07A/FFFFFF?text=Shop+4",
  "https://via.placeholder.com/150/98D8C8/FFFFFF?text=Shop+5",
  "https://via.placeholder.com/150/F7DC6F/FFFFFF?text=Shop+6",
]

// ✅ Move calculateDistance outside component to prevent recreating
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

  // ✅ Combine location and data fetching
  useEffect(() => {
    const getLocationAndServices = async () => {
      try {
        // Get user location
        const location = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              })
            },
            () => {
              resolve({ lat: 30.9000, lng: 75.8573 })
            }
          )
        })

        setUserLocation(location)

        // Fetch shops
        const response = await getShops()
        const shops = response.data.data || []

        const transformedServices = shops.map((shop, index) => {
          const lat = shop.location?.coordinates ? shop.location.coordinates[1] : 30.9
          const lng = shop.location?.coordinates ? shop.location.coordinates[0] : 75.8573
          
          return {
            id: shop._id,
            name: shop.name,
            category: shop.category,
            lat,
            lng,
            rating: shop.rating || 0,
            reviews: shop.reviews?.length || 0,
            address: shop.address || shop.category || "Nearby Area",
            basePrice: shop.pricing?.[0]?.price?.replace(/[^0-9]/g, "") || "0",
            contact: shop.contact || "",
            image: shop.image || defaultShopImages[index % defaultShopImages.length],
            distance: calculateDistance(location.lat, location.lng, lat, lng),
          }
        })

        // Sort by distance
        transformedServices.sort((a, b) => a.distance - b.distance)
        setServices(transformedServices)
      } catch (error) {
        console.error("Error fetching services:", error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    getLocationAndServices()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeCategory, sortOption, activeFilter])

  // ✅ Memoize filtered and sorted services
  const filteredServices = useMemo(() => {
    return services
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
  }, [services, search, activeCategory, sortOption, activeFilter])

  // ✅ Memoize pagination calculation
  const { indexOfLast, indexOfFirst, currentServices, totalPages } = useMemo(() => {
    const last = currentPage * servicesPerPage
    const first = last - servicesPerPage
    const current = filteredServices.slice(first, last)
    const total = Math.ceil(filteredServices.length / servicesPerPage)
    return { indexOfLast: last, indexOfFirst: first, currentServices: current, totalPages: total }
  }, [filteredServices, currentPage, servicesPerPage])

  // ✅ Memoize star rendering
  const renderStars = useCallback((rating = 3) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} className="star filled" />
      ) : (
        <FaRegStar key={i} className="star" />
      )
    ),
    []
  )

  const SkeletonCard = () => (
    <div className="service-card skeleton">
      <div className="skeleton-img"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text small"></div>
    </div>
  )

  // ✅ Memoize event handlers
  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(category)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const handleFilterClick = useCallback((filter) => {
    setActiveFilter(filter)
  }, [])

  const handleServiceClick = useCallback((serviceId) => {
    navigate(`/service/${serviceId}`)
  }, [navigate])

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage)
  }, [])

  // ✅ Memoize skeleton cards array
  const skeletonCards = useMemo(() => 
    Array(servicesPerPage).fill(0).map((_, i) => <SkeletonCard key={i} />), 
    [servicesPerPage]
  )

  // ✅ Memoize page buttons
  const pageButtons = useMemo(() => 
    [...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        className={currentPage === i + 1 ? "active-page" : ""}
        onClick={() => handlePageChange(i + 1)}
      >
        {i + 1}
      </button>
    )), 
    [totalPages, currentPage, handlePageChange]
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
              onClick={() => handleCategoryClick(category)}
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
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-row">
          <button
            className={`filter-btn ${activeFilter === "nearby" ? "active" : ""}`}
            onClick={() => handleFilterClick("nearby")}
          >
            📍 Nearby
          </button>
          <button
            className={`filter-btn ${activeFilter === "top" ? "active" : ""}`}
            onClick={() => handleFilterClick("top")}
          >
            ⭐ Top Rated (4+)
          </button>
        </div>

        <div className="services-list">
          {loading ? (
            skeletonCards
          ) : currentServices.length > 0 ? (
            currentServices.map((service, index) => (
              <div
                className="service-card clickable"
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="service-left">
                  <div className="service-icon-circle">
                    <img src={service.image} alt={service.name} loading="lazy" />
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
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Prev
            </button>
            {pageButtons}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
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