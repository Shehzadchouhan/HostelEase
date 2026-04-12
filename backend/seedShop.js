require("dotenv").config();
const mongoose = require("mongoose");
const Shop = require("./models/shop");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostelease";
const tuckShop = {
  name: "Ravinder Stationery Shop",
  category: "Stationery",
  location: {
    type: "Point",
    //          longitude    latitude
    coordinates: [75.859212, 30.860891],  // ✅ [lng, lat]
  },
  contact: "9XXXXXXXXX", // ⚠️ Add real contact number
    address: "Ravinder Stationory Store,Gill Road,Gill village,Ludhiana(west) Tahsil,Ludhiana, Punjab 141006",
  rating: 4.3,
  description:
    "Ravinder Stationery Shop is the most popular stationery store right outside the Engineering Gate. We provide all academic and office supplies needed by students and faculty — from notebooks and pens to printing and photocopying services.",
  pricing: [
    { title: "A4 Photocopy", price: "₹1" },
    { title: "Spiral Binding", price: "₹30" },
    { title: "Notebook (200 pages)", price: "₹60" },
    { title: "Pen", price: "₹10" },
    { title: "Highlighters", price: "₹20" },
    { title: "Printing (per page)", price: "₹5" },
  ],
  minimumOrder: "₹5",
  paymentMethods: ["Cash (Offline)", "UPI / Online Payment"],
  highlights: [
    "Right outside Engineering Gate",
    "Photocopying & printing",
    "All stationery items",
    "Affordable prices",
    "Open all college hours",
  ],
  reviews: [
    {
      name: "Harpreet Singh",
      rating: 5,
      comment: "Best place for last minute printouts before exams!",
      date: "2 days ago",
    },
    {
      name: "Simran Kaur",
      rating: 4,
      comment: "Always has every stationery item you need. Very helpful.",
      date: "5 days ago",
    },
    {
      name: "Rohit Sharma",
      rating: 4,
      comment: "Cheap and quick photocopying. Highly recommended.",
      date: "1 week ago",
    },
  ],
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // ✅ Delete ALL Ravinder entries (cleans duplicates too)
    await Shop.deleteMany({ name: "Ravinder Stationery Shop" });

    const shop = await Shop.create(tuckShop);
    console.log("✅ Shop inserted! ID:", shop._id);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();