const Shop = require("../models/shop");

// 📥 Get All Shops (with optional filtering)
const getShops = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    // 🔍 Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 📂 Filter by category
    if (category) {
      query.category = category;
    }

    const shops = await Shop.find(query);

    res.json({
      success: true,
      data: shops,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎯 Get Nearby Shops (within 2km radius)
const getNearbyShops = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // ✅ Validate coordinates
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude required"
      });
    }

    console.log(`🎯 Finding shops near [${userLat}, ${userLng}]`);

    // 🌍 MongoDB Geospatial Query
    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userLng, userLat] // Note: [longitude, latitude]
          },
          $maxDistance: 2000 // 2km in meters
        }
      }
    });

    console.log(`✅ Found ${shops.length} nearby shops`);

    res.json({
      success: true,
      count: shops.length,
      data: shops,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { getShops, getNearbyShops };