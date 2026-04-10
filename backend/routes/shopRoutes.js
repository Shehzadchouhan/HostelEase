const express = require("express");
const router = express.Router();
const Shop = require("../models/shop");
const { getShops, getNearbyShops } = require("../controllers/shopController");

// 📥 Get All Shops (with search and category filters)
router.get("/", getShops);

// 🎯 Get Nearby Shops (within 2km radius)
router.get("/nearby", getNearbyShops);

// 📄 Get Single Shop by ID
router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found"
      });
    }

    res.json({
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

module.exports = router;