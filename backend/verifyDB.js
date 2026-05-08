import dotenv from "dotenv";
import mongoose from "mongoose";
import Shop from "./models/shop.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostelease";

async function verify() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const shop = await Shop.findOne({ name: "Ravindra Stationery & Gift Store" });
    if (!shop) {
      console.log("❌ Shop not found");
    } else {
      console.log("\n📦 Shop Data:");
      console.log(JSON.stringify(shop, null, 2));
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDone!");
  }
}

verify();
