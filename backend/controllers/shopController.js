const Shop = require("../models/shop");
console.log("API HIT 🔥");
const getShops = async (req, res) => {
  try {
    const { search, category, lat, lng } = req.query;

    console.log("QUERY:", req.query);

    let query = {};

    // 🔍 Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 📂 Category
    if (category) {
      query.category = category;
    }

    let shops;

    // ✅ SAFE CHECK (IMPORTANT FIX)
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (!isNaN(userLat) && !isNaN(userLng)) {
      console.log("Using GEO NEAR ✅");

      shops = await Shop.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [userLng, userLat],
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: 5000,
          },
        },
        {
          $match: query,
        },
        {
          $addFields: {
            distance: { $divide: ["$distance", 1000] },
          },
        },
      ]);
    } else {
      console.log("Using NORMAL FIND ❌");

      shops = await Shop.find(query);
    }

    res.json({
      success: true,
      data: shops,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = { getShops };