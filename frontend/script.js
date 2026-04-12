// Step 1: Create map
const map = L.map('map').setView([30.9, 75.85], 13);

// Step 2: Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let allShops = []; // Store all shops for searching
let markers = {}; // Store markers by shop id
let userLocation = null; // Store user location

// Step 3: Get user location and load nearby shops
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      userLocation = { lat: userLat, lng: userLng };

      console.log(`📍 User location: [${userLat}, ${userLng}]`);

      // Move map to user location
      map.setView([userLat, userLng], 15);

      // Add marker for user with blue icon
      L.marker([userLat, userLng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .addTo(map)
        .bindPopup("📍 You are here", { autoClose: false })
        .openPopup();

      // 🎯 Load nearby shops (2km radius)
      loadNearbyShops(userLat, userLng);
    },
    err => {
      console.log("❌ Geolocation error:", err);
      // Fallback: load all shops if geolocation fails
      loadAllShops();
    }
  );
} else {
  console.log("❌ Geolocation not supported");
  loadAllShops();
}

// Step 4: Load only nearby shops (within 2km)
async function loadNearbyShops(lat, lng) {
  try {
    const res = await fetch(`http://localhost:5000/api/shops/nearby?lat=${lat}&lng=${lng}`);
    const data = await res.json();

    console.log(`🎯 Nearby shops (within 2km):`, data);

    if (data.success) {
      allShops = data.data || [];
      console.log(`✅ Found ${allShops.length} nearby shops`);
      addMarkers(allShops);
    }
  } catch (error) {
    console.error("❌ Error loading nearby shops:", error);
    loadAllShops();
  }
}

// Step 5: Fallback - Load all shops
async function loadAllShops() {
  try {
    const res = await fetch("http://localhost:5000/api/shops");
    const data = await res.json();

    console.log("📥 All shops:", data);

    if (data.success) {
      allShops = data.data || [];
      console.log(`✅ Loaded ${allShops.length} shops`);
      addMarkers(allShops);
    }
  } catch (error) {
    console.error("❌ Error loading shops:", error);
  }
}

// Step 6: Add markers for each shop
function addMarkers(shops) {
  // Clear existing markers
  Object.values(markers).forEach(marker => map.removeLayer(marker));
  markers = {};

  shops.forEach(shop => {
    if (!shop.location || !shop.location.coordinates) return;

    const [lng, lat] = shop.location.coordinates;

    const marker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #333;">${shop.name}</h3>
          <p style="margin: 4px 0; font-size: 13px;">
            <strong>Category:</strong> ${shop.category}
          </p>
          <p style="margin: 4px 0; font-size: 13px;">
            <strong>Contact:</strong> ${shop.contact}
          </p>
          ${shop.distance ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Distance:</strong> ${(shop.distance / 1000).toFixed(2)} km</p>` : ''}
        </div>
      `);

    markers[shop._id || shop.id] = marker;
  });
}

// Step 7: Search functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (query.length === 0) {
    searchResults.classList.remove('show');
    return;
  }

  // Filter shops by name or category
  const filtered = allShops.filter(shop =>
    shop.name.toLowerCase().includes(query) ||
    shop.category.toLowerCase().includes(query)
  );

  // Display search results
  if (filtered.length > 0) {
    searchResults.innerHTML = filtered
      .map(shop => `
        <div class="search-item" onclick="selectShop('${shop._id || shop.id}', ${shop.location.coordinates[1]}, ${shop.location.coordinates[0]})">
          <div class="search-item-name">${shop.name}</div>
          <div class="search-item-info">
            ${shop.category} • ${shop.contact}
          </div>
        </div>
      `)
      .join('');
    searchResults.classList.add('show');
  } else {
    searchResults.innerHTML = '<div class="search-item" style="cursor: default;">No shops found</div>';
    searchResults.classList.add('show');
  }
});

// Step 8: Select shop from search results
function selectShop(shopId, lat, lng) {
  // Close search results
  searchResults.classList.remove('show');
  searchInput.value = '';

  // Find the shop
  const shop = allShops.find(s => (s._id || s.id) === shopId);

  if (shop) {
    // Center map on shop
    map.setView([lat, lng], 16);

    // Open popup
    if (markers[shopId]) {
      markers[shopId].openPopup();
    }

    // Show info box
    document.getElementById('infoBox').style.display = 'block';
    document.getElementById('selectedShopName').textContent = shop.name;
    document.getElementById('selectedShopCategory').textContent = `Category: ${shop.category}`;
    document.getElementById('selectedShopContact').textContent = `Contact: ${shop.contact}`;
  }
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container') && !e.target.closest('.search-results')) {
    searchResults.classList.remove('show');
  }
});

// Step 9: Add geocoder for address search
try {
  L.Control.geocoder({
    defaultMarkGeocode: true,
    position: 'topleft'
  }).addTo(map);
} catch (error) {
  console.log("⚠️ Geocoder not available:", error);
}