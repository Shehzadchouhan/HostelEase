import { useParams } from "react-router-dom";
import {
  FaStar, FaMapMarkerAlt, FaFire, FaComment,
  FaChevronLeft, FaChevronRight, FaMapPin,
  FaCreditCard, FaMoneyBillWave, FaGlobe,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../styles/serviceDetails.css";
import { useState, useEffect } from "react";
import { getShopById } from "../api/api";

// Fallback pricing if shop has none stored
const fallbackPricing = {
  "Barber Shop": [
    { title: "Haircut", price: "₹100" },
    { title: "Beard Trim", price: "₹50" },
    { title: "Hair Styling", price: "₹150" },
    { title: "Face Cleanup", price: "₹200" },
  ],
  Laundry: [
    { title: "Shirt Washing", price: "₹20" },
    { title: "Pant Washing", price: "₹25" },
    { title: "Bedsheet Wash", price: "₹40" },
    { title: "Iron Service", price: "₹10 per piece" },
  ],
  Food: [
    { title: "Breakfast Meal", price: "₹80" },
    { title: "Lunch Meal", price: "₹150" },
    { title: "Snacks", price: "₹30–50" },
    { title: "Beverages", price: "₹20–40" },
  ],
};

const fallbackPayments = {
  "Barber Shop": ["Cash (Offline)", "UPI / Online Payment", "Card Payment"],
  Laundry: ["Cash (Offline)", "UPI / Online Payment"],
  Medical: ["Cash (Offline)", "Card Payment"],
  Food: ["Cash (Offline)", "UPI / Online Payment", "Card Payment"],
};

const dummyReviews = [
  { name: "Rajesh Kumar", rating: 5, comment: "Excellent service! Very professional.", date: "2 days ago" },
  { name: "Priya Singh", rating: 4, comment: "Great experience. Staff is friendly.", date: "1 week ago" },
  { name: "Amit Patel", rating: 5, comment: "Outstanding quality. Highly recommended!", date: "10 days ago" },
];

const galleryImages = [
  "https://via.placeholder.com/800x500?text=Shop+Image+1",
  "https://via.placeholder.com/800x500?text=Shop+Image+2",
  "https://via.placeholder.com/800x500?text=Shop+Image+3",
  "https://via.placeholder.com/800x500?text=Shop+Image+4",
];

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await getShopById(id);
        const shop = response.data.data;

        setService({
          id: shop._id,
          name: shop.name,
          category: shop.category,
          coordinates: shop.location?.coordinates,
          location: shop.location?.coordinates
            ? `${shop.location.coordinates[1]}, ${shop.location.coordinates[0]}`
            : "Unknown Location",
          // ✅ Real data first, fallback only if empty
          rating: shop.rating || 4.5,
          top: (shop.rating || 4.5) >= 4,
          image: shop.image || null,
          images: galleryImages,
          pricing:
            shop.pricing?.length > 0
              ? shop.pricing
              : fallbackPricing[shop.category] || [{ title: "Basic Service", price: "₹100" }],
          minimumOrder: shop.minimumOrder || "₹0",
          phone: shop.contact || "Not available",
          address: shop.address || "Address not available",
          description:
            shop.description ||
            `${shop.name} is a trusted ${shop.category.toLowerCase()} service provider in your area.`,
          paymentMethods:
            shop.paymentMethods?.length > 0
              ? shop.paymentMethods
              : fallbackPayments[shop.category] || ["Cash (Offline)", "UPI / Online Payment"],
          highlights:
            shop.highlights?.length > 0
              ? shop.highlights
              : ["Quality Service", "Professional Staff", "Hygienic Environment", "Fast Service"],
          reviewsList:
            shop.reviews?.length > 0 ? shop.reviews : dummyReviews,
          reviews: shop.reviews?.length > 0 ? shop.reviews.length : dummyReviews.length,
        });
        setCurrentImageIndex(0);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Service not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
  }, [id]);

  const handlePrevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? service.images.length - 1 : prev - 1));
  const handleNextImage = () =>
    setCurrentImageIndex((prev) => (prev === service.images.length - 1 ? 0 : prev + 1));

  if (loading)
    return (
      <>
        <Navbar />
        <div style={{ padding: "60px", textAlign: "center", color: "#666" }}>
          <h2>⏳ Loading service details...</h2>
        </div>
      </>
    );

  if (error || !service)
    return (
      <>
        <Navbar />
        <div style={{ padding: "60px", textAlign: "center", color: "#d32f2f" }}>
          <h2>❌ {error || "Service not found"}</h2>
        </div>
      </>
    );

  // Generate proper map links
  const getMapLink = () => {
    if (!service.coordinates || service.coordinates.length < 2) {
      // Fallback location (Delhi)
      return "https://www.openstreetmap.org/?mlat=28.7041&mlon=77.1025&zoom=15";
    }
    const [lng, lat] = service.coordinates;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16&marker=${lat},${lng}`;
  };

  const openStreetMapLink = getMapLink();
  const googleMapsLink = service.coordinates && service.coordinates.length === 2
    ? `https://www.google.com/maps/?q=${service.coordinates[1]},${service.coordinates[0]}`
    : "https://www.google.com/maps";

  return (
    <>
      <Navbar />
      <div className="service-details-container">
        {/* IMAGE CAROUSEL */}
        <div className="image-gallery">
          <div className="carousel-container">
            <img
              src={service.images[currentImageIndex]}
              alt={`${service.name} - ${currentImageIndex + 1}`}
              className="carousel-image"
            />
            <button className="carousel-btn prev-btn" onClick={handlePrevImage}><FaChevronLeft /></button>
            <button className="carousel-btn next-btn" onClick={handleNextImage}><FaChevronRight /></button>
            <div className="carousel-dots">
              {service.images.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="service-hero">
          <div className="hero-content">
            <h1 className="service-title">{service.name}</h1>
            <div className="service-meta">
              <div className="service-rating">
                <FaStar className="star-icon" />
                <span className="rating-value">{service.rating.toFixed(1)}/5</span>
                <span className="reviews-count">({service.reviews} reviews)</span>
              </div>
              <div className="service-category-badge">{service.category}</div>
              {service.top && <div className="top-badge"><FaFire /> Top Rated</div>}
            </div>
          </div>
        </div>

        {/* PRICING */}
        {service.pricing?.length > 0 && (
          <div className="services-section">
            <h2 className="section-title">💰 Services & Pricing</h2>
            <div className="services-grid">
              {service.pricing.map((item, index) => (
                <div key={index} className="service-card">
                  <div className="service-card-content">
                    <h3 className="service-name">{item.title}</h3>
                    <div className="service-price">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENT METHODS */}
        <div className="payment-methods-section">
          <h2 className="section-title">💳 Payment Methods</h2>
          <div className="payment-badges">
            {service.paymentMethods.map((method, index) => {
              let icon = <FaMoneyBillWave />;
              if (method.includes("UPI") || method.includes("Online")) icon = <FaGlobe />;
              else if (method.includes("Card")) icon = <FaCreditCard />;
              return (
                <div key={index} className="payment-badge">
                  {icon} <span>{method}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTACT */}
        <div className="contact-section">
          <h2 className="section-title">📍 Contact & Location</h2>
          <div className="contact-card">
            <div className="contact-item">
              <span className="label">📍 Address:</span>
              <span className="value">{service.address}</span>
            </div>
            <div className="contact-item">
              <span className="label">📱 Phone:</span>
              <a href={`tel:${service.phone}`} className="contact-link">{service.phone}</a>
            </div>
          </div>
          <div className="map-cta">
            <div className="map-buttons-container">
              <a href={googleMapsLink} target="_blank" rel="noreferrer" className="btn map-btn-google">
                <FaMapPin /> Google Maps
              </a>
              <a href={openStreetMapLink} target="_blank" rel="noreferrer" className="btn map-btn-osm">
                <FaMapPin /> OpenStreetMap
              </a>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        {service.description && (
          <div className="description-section">
            <h2 className="section-title">ℹ️ About This Service</h2>
            <div className="description-card">
              <p className="service-description">{service.description}</p>
              {service.highlights?.length > 0 && (
                <div className="highlights">
                  <h3>✨ Why Choose Us?</h3>
                  <div className="highlights-list">
                    {service.highlights.map((item, index) => (
                      <div key={index} className="highlight-item">
                        <span className="checkmark">✓</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {service.reviewsList?.length > 0 && (
          <div className="reviews-section">
            <h2 className="section-title">⭐ Customer Reviews ({service.reviewsList.length})</h2>
            <div className="reviews-container">
              {service.reviewsList.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="review-name">{review.name}</div>
                    <div className="review-rating">{Array(review.rating).fill("⭐").join("")}</div>
                  </div>
                  <p className="review-comment"><FaComment /> "{review.comment}"</p>
                  <div className="review-date">📅 {review.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ServiceDetails;