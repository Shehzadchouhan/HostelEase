import Navbar from "../components/Navbar";
import "../styles/mapview.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaPhone, FaStar, FaArrowRight, FaMapPin } from "react-icons/fa";
import { getShops, getNearbyShops } from "../api/api";

function MapView() {
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Combine geolocation and data fetching
  useEffect(() => {
    const getLocationAndServices = async () => {
      try {
        // Get user location
        let location = null;

        if (navigator.geolocation) {
          location = await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                resolve({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                });
              },
              () => {
                resolve(null);
              }
            );
          });
        }

        setUserLocation(location);

        // Fetch shops
        let response;
        if (location) {
          response = await getNearbyShops(location.lat, location.lng);
        } else {
          response = await getShops();
        }

        const shops = response.data.data || [];
        const transformedServices = shops.map((shop) => ({
          id: shop._id,
          name: shop.name,
          category: shop.category,
          location: shop.location?.coordinates
            ? `${shop.location.coordinates[1].toFixed(4)}, ${shop.location.coordinates[0].toFixed(4)}`
            : "Unknown",
          lat: shop.location?.coordinates ? shop.location.coordinates[1] : 0,
          lng: shop.location?.coordinates ? shop.location.coordinates[0] : 0,
          coordinates: shop.location?.coordinates || null,
          rating: shop.rating || 4.5,
          contact: shop.contact || "+91 XXXXXXXXXX",
          distance: "Calculating...",
          address: shop.location?.address || "Address not available",
        }));

        setServices(transformedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    getLocationAndServices();
  }, []);

  // ✅ Memoize filtered services
  const filteredServices = useMemo(() => 
    services.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    ),
    [services, search]
  );

  // ✅ Memoize map link functions
  const getUserMapLink = useCallback(() => {
    if (!userLocation) return null;
    return `https://www.google.com/maps/?q=${userLocation.lat},${userLocation.lng}`;
  }, [userLocation]);

  const getUserOSMLink = useCallback(() => {
    if (!userLocation) return null;
    return `https://www.openstreetmap.org/?mlat=${userLocation.lat}&mlon=${userLocation.lng}&zoom=16`;
  }, [userLocation]);

  const getShopGoogleMapsLink = useCallback((shop) => {
    if (!shop.coordinates || shop.coordinates.length < 2) {
      return "https://www.google.com/maps";
    }
    const [lng, lat] = shop.coordinates;
    return `https://www.google.com/maps/?q=${lat},${lng}`;
  }, []);

  const getShopOSMLink = useCallback((shop) => {
    if (!shop.coordinates || shop.coordinates.length < 2) {
      return "https://www.openstreetmap.org/?zoom=15";
    }
    const [lng, lat] = shop.coordinates;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16&marker=${lat},${lng}`;
  }, []);

  // ✅ Memoize handlers
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleServiceDetails = useCallback((serviceId) => {
    navigate(`/services/${serviceId}`);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="mapview-container">
        <div className="mapview-header">
          <div className="header-content">
            <h1>Nearby Services</h1>
            <p>Discover services around your location</p>
          </div>
        </div>

          <div className="mapview-search-section">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {userLocation && (
          <div className="user-location-section">
            <div className="location-card">
              <div className="location-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="location-details">
                <h3>Your Current Location</h3>
                <p>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
              </div>
              <div className="map-buttons-group">
                <a 
                  href={getUserMapLink()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="view-map-btn"
                >
                  <FaMapPin /> Google Maps
                </a>
                <a 
                  href={getUserOSMLink()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="view-map-btn osm-btn"
                >
                  <FaMapPin /> OSM
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="services-section">
          <div className="services-header">
            <h2>Available Services</h2>
            <span className="service-count">{filteredServices.length} found</span>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="services-grid">
              {filteredServices.map((service) => (
                <div key={service.id} className="service-card-modern">
                  <div className="card-header">
                    <div className="card-title-group">
                      <h3>{service.name}</h3>
                      <span className="category-badge">{service.category}</span>
                    </div>
                    <div className="rating-badge">
                      <FaStar className="star-icon" />
                      {service.rating}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <FaMapMarkerAlt className="info-icon" />
                      <span className="info-text">{service.location}</span>
                    </div>
                    <div className="info-row">
                      <FaPhone className="info-icon" />
                      <span className="info-text">{service.contact}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <a 
                      href={getShopGoogleMapsLink(service)} 
                      target="_blank" 
                      rel="noreferrer"
                      className="direction-btn-modern"
                    >
                      <FaArrowRight /> Directions
                    </a>
                    <button
                      className="details-btn-modern"
                      onClick={() => handleServiceDetails(service.id)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results-container">
              <div className="no-results-icon">🔍</div>
              <h3>No Services Found</h3>
              <p>Try adjusting your search keywords or check nearby areas</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MapView;