import Shop from "../models/shop.js";

// 📥 Get All Shops (with optional filtering)
export const getAllShops = async (req, res) => {
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

// 📄 Get Shop By ID
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    res.json({ success: true, data: shop });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➕ Create Shop
export const createShop = async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    const shop = await newShop.save();
    res.status(201).json({ success: true, data: shop });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✏️ Update Shop
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findByIdAndUpdate(id, req.body, { new: true });

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    res.json({ success: true, data: shop });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🗑️ Delete Shop
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findByIdAndDelete(id);

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    res.json({ success: true, message: "Shop deleted successfully" });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🎯 Get Nearby Shops (within 2km radius)
export const getNearbyShops = async (req, res) => {
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

    console.log(`\n🎯 [getNearbyShops] Finding shops near [${userLat}, ${userLng}]`);

    let shops = [];
    
    // 🌍 Try MongoDB Geospatial Query first
    try {
      const geoQuery = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [userLng, userLat] // [longitude, latitude]
            },
            $maxDistance: 2000 // 2km in meters
          }
        }
      };
      
      console.log(`📍 Query: location.$near with maxDistance: 2000 meters`);
      shops = await Shop.find(geoQuery);
      console.log(`✅ Found ${shops.length} shops using geospatial query`);
      
      if (shops.length === 0) {
        console.log("⚠️ No shops found within 2km, returning all shops as fallback");
        shops = await Shop.find({});
        console.log(`📦 Returned ${shops.length} all shops`);
      }
    } catch (geoError) {
      // 🔄 Fallback: If geospatial query fails, return all shops
      console.error("❌ Geospatial query failed:", geoError.message);
      console.log("🔄 Falling back to returning all shops");
      shops = await Shop.find({});
      console.log(`📦 Returned ${shops.length} all shops (fallback)`);
    }

    res.json({
      success: true,
      count: shops.length,
      data: shops,
    });

  } catch (error) {
    console.error("❌ ERROR in getNearbyShops:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};