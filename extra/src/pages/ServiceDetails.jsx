import { useParams } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaFire } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../styles/serviceDetails.css";
import { useState } from "react";
import laundry1 from "../assets/services/laundry1.jpg"
import laundry2 from "../assets/services/laundry2.png"
import laundry3 from "../assets/services/laundry3.png"

function ServiceDetails() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  // Temporary static data (later we will connect backend)
  const services = [
    {
      id: 1,
      name: "Clean & Dry Laundry",
      category: "Laundry",
      distance: "0.4 km",
      location: "Sandra",
      reviews: 120,
      rating: 4.2,
      top: true,
      images: [laundry1, laundry2, laundry3],
      pricing: [
        { title: "Wash & Fold", price: "₹50/kg" },
        { title: "Dry Cleaning", price: "₹80/item" },
        { title: "Ironing", price: "₹10/item" },
      ],
      minimumOrder: "₹100",

      phone: "9876543210",
      address: "Shop 12, Main Road, Near Sandra Hostel",
      mapLink: "https://www.google.com/maps",
      whatsapp: "9876543210",
      paymentMethods: ["UPI", "Cash"],


      description: `
Clean & Dry Laundry offers affordable and fast laundry services 
near the Sandra hostel area. We provide same-day delivery, 
free pickup for hostel students, and professional fabric care.

With over 3 years of experience, we have served 500+ students 
in the area. Our services are reliable, hygienic, and student-budget friendly.
`,
highlights: [
  "Free Pickup",
  "Same-Day Delivery",
  "Student Discount Available",
  "500+ Students Served",
],


reviewsList: [
  {
    name: "Riya S.",
    rating: 5,
    comment: "Very fast service and affordable for students!",
    date: "12 Feb 2026",
  },
  {
    name: "Aman K.",
    rating: 4,
    comment: "Pickup from hostel was super convenient.",
    date: "8 Feb 2026",
  },
  {
    name: "Neha P.",
    rating: 5,
    comment: "Clothes came back fresh and neatly packed.",
    date: "2 Feb 2026",
  },
],

    },
    {
      id: 2,
      name: "PressPlus Laundry",
      category: "Laundry",
      distance: "0.6 km",
      location: "Landra",
      reviews: 98,
      rating: 3.8,
      top: false,
    },
  ];

  const service = services.find((item) => item.id === Number(id));

  if (!service) {
    return <h2 style={{ padding: "40px" }}>Service not found</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="service-details-container">
        {/* HERO SECTION */}
        <div className="service-hero">
          <div className="hero-left">
            <h1 className="service-title">{service.name}</h1>

            <div className="service-rating">
              <FaStar className="star-icon" />
              <span>
                {service.rating} ({service.reviews} reviews)
              </span>
            </div>

            <div className="service-location">
              <FaMapMarkerAlt />
              <span>
                {service.location} | {service.distance} away
              </span>
            </div>

            <div className="service-category">{service.category} Service</div>

            {service.top && (
              <div className="top-badge">
                <FaFire /> Top Rated
              </div>
            )}
          </div>
        </div>
        {/* IMAGE GALLERY */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={service.images[activeImage]} alt="service" />
          </div>

          <div className="thumbnail-row">
            {service.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumbnail"
                className={
                  activeImage === index ? "thumbnail active" : "thumbnail"
                }
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="pricing-section">
          <h2 className="section-title">Pricing</h2>

          <div className="pricing-card">
            {service.pricing.map((item, index) => (
              <div key={index} className="pricing-row">
                <span className="pricing-title">{item.title}</span>
                <span className="pricing-price">{item.price}</span>
              </div>
            ))}

            <div className="minimum-order">
              Minimum Order: {service.minimumOrder}
            </div>
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="contact-section">
          <h2 className="section-title">Contact & Booking</h2>

          <div className="contact-card">
            <p className="service-address">📍 {service.address}</p>

            <div className="action-buttons">
              <a href={`tel:${service.phone}`} className="btn call-btn">
                📞 Call Now
              </a>

              <a
                href={`https://wa.me/${service.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn whatsapp-btn"
              >
                💬 WhatsApp
              </a>

              <a
                href={service.mapLink}
                target="_blank"
                rel="noreferrer"
                className="btn map-btn"
              >
                🗺 View on Map
              </a>
            </div>

            <div className="payment-methods">
              <strong>Payment Methods:</strong>{" "}
              {service.paymentMethods.join(", ")}
            </div>
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
<div className="description-section">

  <h2 className="section-title">About This Service</h2>

  <div className="description-card">

    <p className="service-description">
      {service.description}
    </p>

    <div className="highlights">
      {service.highlights.map((item, index) => (
        <div key={index} className="highlight-item">
          ✔ {item}
        </div>
      ))}
    </div>

  </div>

</div>

{/* STUDENT REVIEWS SECTION */}
<div className="reviews-section">

  <h2 className="section-title">
    Student Reviews ({service.reviewsList.length})
  </h2>

  <div className="reviews-container">

    {service.reviewsList.map((review, index) => (
      <div key={index} className="review-card">

        <div className="review-header">
          <div className="review-name">
            {review.name}
          </div>

          <div className="review-rating">
            {"⭐".repeat(review.rating)}
          </div>
        </div>

        <p className="review-comment">
          "{review.comment}"
        </p>

        <div className="review-date">
          {review.date}
        </div>

      </div>
    ))}

  </div>

</div>


      </div>
    </>
  );
}

export default ServiceDetails;
