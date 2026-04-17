import express from "express";
import {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  getNearbyShops
} from "../controllers/shopController.js";

const router = express.Router();

// Public routes
router.get("/", getAllShops);
router.get("/nearby", getNearbyShops);  // 🎯 Get nearby shops with geospatial query
router.get("/:id", getShopById);

// Protected routes (Admin only)
router.post("/", createShop);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);

export default router;