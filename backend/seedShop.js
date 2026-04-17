import mongoose from "mongoose";
import dotenv from "dotenv";
import Shop from "./models/shop.js";

dotenv.config();

const sampleShops = [
  {
    name: "Ravindra Stationery",
    category: "Stationery",
    location: {
      type: "Point",
      coordinates: [75.8592224, 30.8609639],  // [longitude, latitude] - User location reference
      address: "In front of GNDEC College Gate, Gill Nehr, Ludhiana, Punjab"
    },
    phone: "9876543210",
    rating: 4.5,
    reviews: 45,
    description: "Complete stationery and office supplies with premium quality materials",
    pricing: [
      { title: "Notebooks (100 pages)", price: "₹50" },
      { title: "Pens Pack (10 pcs)", price: "₹100" },
      { title: "Sketch Pens Set (12)", price: "₹150" },
      { title: "A4 Papers (500 sheets)", price: "₹200" }
    ],
    paymentMethods: ["Cash (Offline)", "UPI / Online Payment"],
    highlights: ["Premium Quality", "Best Prices", "Wide Selection", "Fast Service"],
  },
  {
    name: "Clean & Dry Laundry",
    category: "Laundry",
    location: {
      type: "Point",
      coordinates: [75.8785, 30.5320],  // [longitude, latitude] - ~1km from user
      address: "Sector 5, Near Mall, Ludhiana"
    },
    phone: "9123456789",
    rating: 4.0,
    reviews: 120,
    description: "Professional laundry and dry cleaning services",
  },
  {
    name: "Fresh Grocery Store",
    category: "Grocery",
    location: {
      type: "Point",
      coordinates: [75.8765, 30.5295],  // [longitude, latitude] - ~0.8km from user
      address: "Market Square, Ludhiana"
    },
    phone: "9876541234",
    rating: 4.2,
    reviews: 89,
    description: "Fresh vegetables, fruits, and groceries",
  },
  {
    name: "Health Plus Pharmacy",
    category: "Pharmacy",
    location: {
      type: "Point",
      coordinates: [75.8800, 30.5330],  // [longitude, latitude] - ~1.5km from user
      address: "Main Street, Ludhiana"
    },
    phone: "9123457890",
    rating: 4.6,
    reviews: 156,
    description: "24/7 pharmacy with home delivery",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

    console.log("✅ Connected to MongoDB");

    // Clear existing shops
    await Shop.deleteMany({});
    console.log("🗑️  Cleared existing shops");

    // ⭐ IMPORTANT: Create geospatial index BEFORE inserting data
    await Shop.collection.dropIndex("location_2dsphere").catch(() => {
      console.log("ℹ️  No existing index to drop");
    });
    
    await Shop.collection.createIndex({ "location": "2dsphere" });
    console.log("✅ Created 2dsphere index for geospatial queries");

    // Insert sample shops
    const result = await Shop.insertMany(sampleShops);
    console.log(`✅ Inserted ${result.length} shops`);

    // ✅ Verify shops were inserted
    const allShops = await Shop.find({});
    console.log(`✅ Verification: ${allShops.length} shops in database`);
    
    allShops.forEach((shop, idx) => {
      console.log(`   Shop ${idx + 1}: ${shop.name}`);
      console.log(`      Coordinates: [${shop.location.coordinates[0]}, ${shop.location.coordinates[1]}]`);
      console.log(`      Location Type: ${shop.location.type}`);
    });

    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();