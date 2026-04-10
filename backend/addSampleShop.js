const mongoose = require("mongoose");
const Shop = require("./models/shop");
require("dotenv").config();

async function addSampleShop() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if sample shop already exists
    const existingShop = await Shop.findOne({ name: "Clean & Dry Laundry" });
    if (existingShop) {
      console.log("Sample shop already exists:", existingShop._id);
      return existingShop._id;
    }

    // Create sample shop
    const sampleShop = new Shop({
      name: "Clean & Dry Laundry",
      category: "Laundry",
      location: {
        type: "Point",
        coordinates: [77.5946, 12.9716] // Bangalore coordinates
      },
      contact: "9876543210",
      rating: 4.2
    });

    await sampleShop.save();
    console.log("Sample shop added with ID:", sampleShop._id);
    return sampleShop._id;

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
  }
}

addSampleShop();