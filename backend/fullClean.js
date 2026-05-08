import dotenv from "dotenv";
import mongoose from "mongoose";
import Shop from "./models/shop.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostelease";

async function fullClean() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Delete ALL shops
    const result = await Shop.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} shops from database`);

    const remaining = await Shop.find({});
    console.log(`📋 Shops remaining: ${remaining.length}`);

  } catch (err) {
    console.error("❌ Clean failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDone!");
  }
}

fullClean();
