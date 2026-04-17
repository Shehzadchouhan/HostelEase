import mongoose from "mongoose";
import dotenv from "dotenv";
import Shop from "./models/shop.js";

dotenv.config();

async function testGeospatial() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Test coordinates (user location in Ludhiana/Delhi area)
    const testLat = 30.530769999999993;  // Same as browser request
    const testLng = 75.87753099999999;   // Same as browser request
    
    console.log(`🧪 Testing geospatial query with user location:`);
    console.log(`   Latitude: ${testLat}`);
    console.log(`   Longitude: ${testLng}\n`);

    // Get all shops first
    const allShops = await Shop.find({});
    console.log(`📦 Total shops in database: ${allShops.length}\n`);

    if (allShops.length === 0) {
      console.log("❌ No shops in database! Please run seedShop.js first.");
      process.exit(1);
    }

    // List all shops and their coordinates
    console.log("📍 All shops with coordinates:");
    allShops.forEach((shop, idx) => {
      console.log(`   ${idx + 1}. ${shop.name}`);
      console.log(`      Coordinates: [${shop.location.coordinates[0]}, ${shop.location.coordinates[1]}] (lon, lat)`);
      console.log(`      Location Type: ${shop.location.type}`);
    });
    console.log("");

    // Test 1: Try geospatial query
    console.log("🔍 Test 1: Geospatial query with $near (2km radius)");
    const geoShops = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [testLng, testLat]
          },
          $maxDistance: 2000
        }
      }
    });
    console.log(`   Result: Found ${geoShops.length} shops\n`);

    // Test 2: Try with larger radius
    console.log("🔍 Test 2: Geospatial query with $near (10km radius)");
    const geoShops10 = await Shop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [testLng, testLat]
          },
          $maxDistance: 10000
        }
      }
    });
    console.log(`   Result: Found ${geoShops10.length} shops\n`);

    // Test 3: Check index
    console.log("🔍 Test 3: Checking database indexes");
    const indexes = await Shop.collection.getIndexes();
    console.log(`   Indexes: ${JSON.stringify(Object.keys(indexes))}\n`);

    // Test 4: Simple query (no geo)
    console.log("🔍 Test 4: Simple query (non-geospatial)");
    const simpleShops = await Shop.find({});
    console.log(`   Result: Found ${simpleShops.length} shops\n`);

    console.log("✅ All tests completed!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testGeospatial();
