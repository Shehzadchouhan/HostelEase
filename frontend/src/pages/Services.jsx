import Navbar from "../components/Navbar"
import "../styles/services.css"
import { getShops } from "../api/api"
import { FaStar, FaRegStar, FaMapMarkerAlt, FaFire } from "react-icons/fa"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"

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

  // Default location (Chandigarh)
  const DEFAULT_LOCATION = { lat: 30.7333, lng: 76.7794 }

  // ✅ Fetch services with default location (no geolocation on mount)
  useEffect(() => {
    const getServices = async () => {
      try {
        // Use default location initially
        const location = DEFAULT_LOCATION

        setUserLocation(location)

        // Fetch shops
        const response = await getShops()
        const shops = response.data.data || []

        if (!shops || shops.length === 0) {
          console.warn("No shops found in database")
          setServices([])
          setLoading(false)
          return
        }

        const transformedServices = shops.map((shop, index) => {
          const lat = shop.location?.coordinates ? shop.location.coordinates[1] : DEFAULT_LOCATION.lat
          const lng = shop.location?.coordinates ? shop.location.coordinates[0] : DEFAULT_LOCATION.lng
          
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
            image: shop.image || "https://images.unsplash.com/photo-1488459716781-6e3100ce3ce0?w=200&h=200&fit=crop",
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

    getServices()
  }, [])

  // ✅ Get user's actual location (only when user clicks button - OPTIONAL)
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation is not supported by your browser")
      return
    }

    console.log("📍 Requesting user location...")

    // Use geolocation with options
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(newLocation)
        
        // Recalculate distances with new location
        setServices((prevServices) =>
          prevServices
            .map((service) => ({
              ...service,
              distance: calculateDistance(
                newLocation.lat,
                newLocation.lng,
                service.lat,
                service.lng
              ),
            }))
            .sort((a, b) => a.distance - b.distance)
        )
        console.log("✅ Location updated:", newLocation)
        alert(`✅ Location updated! Your coordinates: ${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)}`)
      },
      (error) => {
        console.error("❌ Geolocation error:", error)
        let errorMsg = "Could not get your location. "
        
        // Provide detailed error message
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg += "You denied permission. To fix: Go to browser settings > Privacy > Site permissions > Location and allow access."
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg += "Your position data is unavailable."
        } else if (error.code === error.TIMEOUT) {
          errorMsg += "The request timed out."
        } else {
          errorMsg += error.message || "Unknown error"
        }
        
        errorMsg += "\n\nUsing default location (Chandigarh) for now."
        alert(errorMsg)
        console.warn("Geolocation error details:", error)
      },
      {
        enableHighAccuracy: false,  // Use WiFi/IP geolocation (faster, less accurate)
        timeout: 10000,             // 10 second timeout
        maximumAge: 0               // Don't use cached location
      }
    )
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
          {["All", "Stationery", "Laundry", "Shopping", "Food", "Medical", "Transport", "Grocery", "Pharmacy"].map((category) => (
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
          <button
            className="filter-btn location-btn"
            onClick={getUserLocation}
            title="Click to use your current location for better distance calculation"
          >
            🌍 Use My Location
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