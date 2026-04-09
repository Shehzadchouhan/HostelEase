const express = require("express");
const router = express.Router();
const Shop = require("../models/shop");
const { getShops } = require("../controllers/shopController");

router.get("/", getShops);  // 👈 VERY IMPORTANT

module.exports = router;

// ➕ Add Shop
router.post("/add", async (req, res) => {
  try {
    const shop = new Shop(req.body);
    await shop.save();

    res.status(201).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 📥 Get All Shops
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // filter by category
    if (category) {
      filter.category = category;
    }

    // search by name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const shops = await Shop.find(filter);

    res.json({
      success: true,
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/near", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    });

    res.json({
      success: true,
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


module.exports = router;