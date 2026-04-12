require("dotenv").config();
const mongoose = require("mongoose");
const Shop = require("./models/shop");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostelease";

async function clean() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Delete all duplicate Laptop Fix Center (keep none — they have no real data)
    await Shop.deleteMany({ name: "Laptop Fix Center" });
    console.log("✅ Deleted all Laptop Fix Center duplicates");

    // Delete old Ravinder entries with WRONG coordinates
    await Shop.deleteMany({ 
      name: "Ravinder Stationery Shop",
      "location.coordinates": { $ne: [75.859212, 30.860891] }
    });
    console.log("✅ Deleted old Ravinder entries with wrong coordinates");

    // Show what's left
    const remaining = await Shop.find({}, { name: 1, "location.coordinates": 1 });
    console.log("\n📋 Remaining shops in DB:");
    remaining.forEach(s => console.log(`  - ${s.name}: [${s.location.coordinates}]`));

  } catch (err) {
    console.error("❌ Clean failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDone!");
  }
}

clean();