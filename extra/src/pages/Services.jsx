import Navbar from "../components/Navbar"
import "../styles/services.css"

import {
  FaStar,
  FaRegStar,
  FaSearch,
  FaMapMarkerAlt,
  FaFire,
} from "react-icons/fa"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Services() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("nearby")
  const [sortOption, setSortOption] = useState("")
  const [activeCategory, setActiveCategory] = useState("Laundry")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
const servicesPerPage = 3

  const navigate = useNavigate()

  // Fake loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])


  useEffect(() => {
  setCurrentPage(1)
}, [search, activeCategory, sortOption, activeFilter])


  const services = [
    {
      id: 1,
      name: "Clean & Dry Laundry",
      category: "Laundry",
      distance: "0.4 km",
      location: "Sandra",
      reviews: 120,
      rating: 4,
      price: 50,
      top: true,
    },
    {
      id: 2,
      name: "PressPlus Laundry",
      category: "Laundry",
      distance: "0.6 km",
      location: "Landra",
      reviews: 98,
      rating: 3,
      price: 40,
    },
    {
      id: 3,
      name: "Home Tiffin Service",
      category: "Tiffin",
      distance: "0.8 km",
      location: "Landra",
      reviews: 150,
      rating: 5,
      price: 70,
    },
    {
      id: 4,
      name: "City Medical Store",
      category: "Medical",
      distance: "1.1 km",
      location: "Landru",
      reviews: 60,
      rating: 4,
      price: 0,
    },
    {
      id: 5,
      name: "QuickFix Repairs",
      category: "Repair",
      distance: "1.3 km",
      location: "Sandra",
      reviews: 45,
      rating: 4,
      price: 100,
    },
  ]

  // Filtering + Sorting
  const filteredServices = services
    .filter((service) =>
      service.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((service) => service.category === activeCategory)
    .filter((service) =>
      activeFilter === "top" ? service.top : true
    )
    .sort((a, b) => {
      if (sortOption === "priceLow") return a.price - b.price
      if (sortOption === "priceHigh") return b.price - a.price
      if (sortOption === "ratingHigh") return b.rating - a.rating
      return 0
    })

    const indexOfLast = currentPage * servicesPerPage
const indexOfFirst = indexOfLast - servicesPerPage

const currentServices = filteredServices.slice(
  indexOfFirst,
  indexOfLast
)

const totalPages = Math.ceil(
  filteredServices.length / servicesPerPage
)



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

        {/* Category Tabs */}
        <div className="category-tabs">
          {["Laundry", "Tiffin", "Medical", "Repair"].map((category) => (
            <button
              key={category}
              className={`category-btn ${
                activeCategory === category ? "active-category" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="sort-container">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-dropdown"
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="ratingHigh">Rating: High to Low</option>
          </select>
        </div>

        {/* Filter */}
        <div className="filter-row">
          <button
            className={`filter-btn ${
              activeFilter === "nearby" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("nearby")}
          >
            Nearby
          </button>

          <button
            className={`filter-btn ${
              activeFilter === "top" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("top")}
          >
            Top Rated
          </button>
        </div>
{/* Services */}
<div className="services-list">
  {loading ? (
    Array(servicesPerPage).fill(0).map((_, index) => (
      <SkeletonCard key={index} />
    ))
  ) : currentServices.length > 0 ? (
    currentServices.map((service) => (
      <div
        className="service-card clickable"
        key={service.id}
        onClick={() => navigate(`/service/${service.id}`)}
      >
        <div className="service-left">
          <div className="service-icon">🧺</div>

          <div>
            <div className="service-header">
              <h3>{service.name}</h3>
              {service.top && (
                <span className="badge">
                  <FaFire /> Top Rated
                </span>
              )}
            </div>

            <div className="rating">
              {renderStars(service.rating)}
              <span>{service.reviews} reviews</span>
            </div>

            <div className="location">
              <FaMapMarkerAlt />
              <span>{service.location}</span>
            </div>
          </div>
        </div>

        <div className="service-right">
          <p className="distance">{service.distance}</p>
          <p className="price">
            ₹{service.price} {service.price ? "/ kg" : ""}
          </p>
          <button className="details-btn">
            View Details
          </button>
        </div>
      </div>
    ))
  ) : (
    <div className="no-results">
      No services found.
    </div>
  )}
</div>

{/* Pagination */}
{!loading && totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={currentPage === index + 1 ? "active-page" : ""}
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
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