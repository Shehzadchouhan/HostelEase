import mongoose from "mongoose";
import dotenv from "dotenv";
import Shop from "./models/shop.js";

dotenv.config();

const sampleShops = [
  // ✅ STATIONERY
  {
    name: "Ravindra Stationery & Gift Store",
    category: "Stationery",
    location: {
      type: "Point",
      coordinates: [75.8592224, 30.8609639],
      address: "In front of GNDEC College Gate, Gill Nehr, Ludhiana, Punjab 141001"
    },
    contact: "+91-9876-543-210",
    phone: "+91-9876-543-210",
    address: "In front of GNDEC College Gate, Gill Nehr, Ludhiana, Punjab 141001",
    rating: 4.5,
    reviews: 45,
    image: "/images/shops/stationery.jpg",
    description: "Premium stationery store offering high-quality notebooks, pens, art supplies, and gift items. Established in 2015 with a strong reputation for authentic products and excellent customer service. Serving students and professionals for over 8 years.",
    pricing: [
      { title: "Notebooks (100 pages)", price: "₹50-80" },
      { title: "Pens Pack (10 pcs)", price: "₹80-120" },
      { title: "Sketch Pens Set (12)", price: "₹140-200" },
      { title: "A4 Papers (500 sheets)", price: "₹180-250" },
      { title: "Gift Wrapping Services", price: "₹30-100" }
    ],
    paymentMethods: ["Cash (Offline)", "UPI / Online Payment", "Card Payment"],
    highlights: ["Premium Quality", "Best Prices", "Wide Selection", "Fast Service", "Online Orders Available"],
  },

  // ✅ LAUNDRY
  {
    name: "Clean & Dry Professional Laundry",
    category: "Laundry",
    location: {
      type: "Point",
      coordinates: [75.8785, 30.5320],
      address: "Sector 5, Near City Mall, Ratan Nagar, Ludhiana, Punjab 141001"
    },
    contact: "+91-9123-456-789",
    phone: "+91-9123-456-789",
    address: "Sector 5, Near City Mall, Ratan Nagar, Ludhiana, Punjab 141001",
    rating: 4.0,
    reviews: 120,
    image: "/images/shops/laundry.jpg",
    description: "Professional laundry service with eco-friendly washing methods and state-of-the-art equipment. Specializing in delicate garments, dry cleaning, and home delivery. ISO certified facility with trained staff.",
    pricing: [
      { title: "Shirt Washing & Ironing", price: "₹45-60" },
      { title: "Pant Washing & Ironing", price: "₹50-70" },
      { title: "Bedsheet Wash (per piece)", price: "₹35-50" },
      { title: "Dry Cleaning (Saree)", price: "₹180-250" },
      { title: "Blanket Washing", price: "₹120-150" },
      { title: "Pickup & Delivery Charge", price: "Free above ₹300" }
    ],
    paymentMethods: ["Cash (Offline)", "UPI / Online Payment", "Card Payment"],
    highlights: ["Express Service (24hrs)", "Professional Staff", "Hygienic Process", "Free Pickup & Delivery", "Eco-Friendly Methods"],
  },

  // ✅ SHOPPING (Fashion Mall)
  {
    name: "Style Hub Fashion & Lifestyle",
    category: "Shopping",
    location: {
      type: "Point",
      coordinates: [75.8750, 30.5310],
      address: "Gold Street Market, Near Central Bus Stand, Ludhiana, Punjab 141001"
    },
    contact: "+91-9654-321-098",
    phone: "+91-9654-321-098",
    address: "Gold Street Market, Near Central Bus Stand, Ludhiana, Punjab 141001",
    rating: 4.3,
    reviews: 203,
    image: "/images/shops/shopping.jpg",
    description: "One-stop destination for fashion and lifestyle products featuring curated collections from popular Indian and international brands. Offering latest trends with seasonal discounts and loyalty rewards.",
    pricing: [
      { title: "Casual T-Shirts", price: "₹299-699" },
      { title: "Formal Shirts", price: "₹799-1499" },
      { title: "Jeans & Trousers", price: "₹599-1299" },
      { title: "Ethnic Wear (Kurta/Suit)", price: "₹999-2999" },
      { title: "Accessories (Belts/Scarves)", price: "₹199-799" },
      { title: "Footwear", price: "₹499-2000" }
    ],
    paymentMethods: ["Cash (Offline)", "Card Payment", "UPI / Online Payment"],
    highlights: ["Original Brands", "Seasonal Discounts (Up to 50%)", "Free Alterations", "Loyalty Program", "Gift Cards Available"],
  },

  // ✅ FOOD
  {
    name: "Taste of India Food Court",
    category: "Food",
    location: {
      type: "Point",
      coordinates: [75.8770, 30.5325],
      address: "Food Street, Near College Gate, Ludhiana, Punjab 141001"
    },
    contact: "+91-9876-543-456",
    phone: "+91-9876-543-456",
    address: "Food Street, Near College Gate, Ludhiana, Punjab 141001",
    rating: 4.6,
    reviews: 289,
    image: "/images/shops/food.jpg",
    description: "Authentic Indian cuisine restaurant serving traditional Punjabi and North Indian delicacies. FSSAI certified with hygienic food preparation using fresh, organic ingredients. Perfect for students and families.",
    pricing: [
      { title: "North Indian Thali (Lunch/Dinner)", price: "₹140-180" },
      { title: "Butter Chicken with Rice/Bread", price: "₹190-220" },
      { title: "Biryani (Chicken/Veg)", price: "₹160-190" },
      { title: "Dosa & Sambar Combo", price: "₹70-90" },
      { title: "Breakfast Combo (Aloo Paratha)", price: "₹100-120" },
      { title: "Chai & Snacks (Samosa/Pakora)", price: "₹30-80" },
      { title: "Cold Beverages", price: "₹40-80" }
    ],
    paymentMethods: ["Cash (Offline)", "UPI / Online Payment", "Card Payment"],
    highlights: ["Hygienic Cooking", "Fresh Ingredients (Daily)", "Quick Delivery", "Student Discounts (10%)", "Catering Available"],
  },

  // ✅ MEDICAL
  {
    name: "City Hospital & Diagnostic Center",
    category: "Medical",
    location: {
      type: "Point",
      coordinates: [75.8800, 30.5340],
      address: "Hospital Road, Near City Center, Feroze Gandhi Market, Ludhiana, Punjab 141001"
    },
    contact: "+91-9123-454-321",
    phone: "+91-9123-454-321",
    address: "Hospital Road, Near City Center, Feroze Gandhi Market, Ludhiana, Punjab 141001",
    rating: 4.7,
    reviews: 312,
    image: "/images/shops/medical.jpg",
    description: "Multi-specialty hospital with 24/7 emergency services, ICU facilities, and experienced consultant doctors. Advanced diagnostic equipment including CT scan, ultrasound, and pathology lab on premises.",
    pricing: [
      { title: "General Consultation (Doctor)", price: "₹300-500" },
      { title: "Blood Test Package (Basic)", price: "₹250-500" },
      { title: "Ultrasound Scan", price: "₹500-800" },
      { title: "COVID Test (RT-PCR)", price: "₹350-450" },
      { title: "Vaccination Services (Full Course)", price: "₹150-2000" },
      { title: "Health Check-up Package", price: "₹1500-3000" }
    ],
    paymentMethods: ["Cash (Offline)", "Card Payment", "UPI / Online Payment", "Health Insurance Accepted"],
    highlights: ["24/7 Emergency", "Experienced Doctors", "Modern Equipment", "Home Service Available", "Lab on Premises"],
  },

  // ✅ TRANSPORT
  {
    name: "Quick Cabs & Premium Taxi Service",
    category: "Transport",
    location: {
      type: "Point",
      coordinates: [75.8810, 30.5350],
      address: "Central Transport Hub, Main Road, Ludhiana, Punjab 141001"
    },
    contact: "+91-9654-987-321",
    phone: "+91-9654-987-321",
    address: "Central Transport Hub, Main Road, Ludhiana, Punjab 141001",
    rating: 4.4,
    reviews: 156,
    image: "/images/shops/transport.jpg",
    description: "Professional taxi and transportation service with GPS-enabled vehicles and verified drivers. Available for local commute, inter-city travel, and corporate outings with flexible pricing options.",
    pricing: [
      { title: "Local Trip (5km)", price: "₹80-120" },
      { title: "Inter-City Ride (50km)", price: "₹400-600" },
      { title: "Airport Drop (Chandigarh)", price: "₹800-1200" },
      { title: "Hourly Rental (AC Vehicle)", price: "₹500-700/hour" },
      { title: "Full Day Rental (8 hours)", price: "₹2000-3000" },
      { title: "Outstation Package (per km)", price: "₹12-15/km" }
    ],
    paymentMethods: ["Cash (Offline)", "UPI / Online Payment", "Card Payment", "Pre-booking Discount"],
    highlights: ["Professional Drivers", "Safe & Hygienic", "Real-time GPS Tracking", "Budget Friendly", "Corporate Accounts Available"],
  },

  // ✅ GROCERY
  {
    name: "Fresh Grocery & Organic Store",
    category: "Grocery",
    location: {
      type: "Point",
      coordinates: [75.8765, 30.5295],
      address: "Market Square, Near Railway Station, Ludhiana, Punjab 141001"
    },
    contact: "+91-9876-541-234",
    phone: "+91-9876-541-234",
    address: "Market Square, Near Railway Station, Ludhiana, Punjab 141001",
    rating: 4.2,
    reviews: 89,
    image: "/images/shops/grocery.jpg",
    description: "Farm-fresh vegetables, fruits, and organic groceries sourced directly from local farmers. Delivering quality produce daily with same-day delivery available for orders above ₹300.",
    pricing: [
      { title: "Fresh Vegetables (1kg assorted)", price: "₹30-80" },
      { title: "Seasonal Fruits (1kg)", price: "₹60-150" },
      { title: "Dairy Products Bundle", price: "₹200-400" },
      { title: "Organic Spices & Condiments", price: "₹50-300" },
      { title: "Grains & Pulses (1kg)", price: "₹40-120" },
      { title: "Organic Milk (per liter)", price: "₹50-70" },
      { title: "Home Delivery Charge", price: "Free above ₹300" }
    ],
    paymentMethods: ["Cash (Offline)", "UPI / Online Payment"],
    highlights: ["Fresh Daily", "Organic & Pesticide-Free", "Free Home Delivery", "Best Prices", "Bulk Orders Accepted"],
  },

  // ✅ PHARMACY
  {
    name: "Health Plus Pharmacy & Wellness Center",
    category: "Pharmacy",
    location: {
      type: "Point",
      coordinates: [75.8800, 30.5330],
      address: "Main Street, Near City Center, Ludhiana, Punjab 141001"
    },
    contact: "+91-9123-457-890",
    phone: "+91-9123-457-890",
    address: "Main Street, Near City Center, Ludhiana, Punjab 141001",
    rating: 4.6,
    reviews: 156,
    image: "/images/shops/pharmacy.jpg",
    description: "24/7 pharmacy with licensed pharmacists providing expert consultation. Stocking authentic medicines, health supplements, medical devices, and home care products with home delivery service.",
    pricing: [
      { title: "Prescription Medicines", price: "₹100-500" },
      { title: "Over-the-Counter (OTC) Medicines", price: "₹50-300" },
      { title: "Health Supplements & Vitamins", price: "₹200-1500" },
      { title: "First Aid Kit (Complete)", price: "₹300-800" },
      { title: "Medical Devices (Thermometer/BP)", price: "₹400-1500" },
      { title: "Sunscreen & Skincare", price: "₹150-500" },
      { title: "Home Delivery", price: "Free above ₹300" }
    ],
    paymentMethods: ["Cash (Offline)", "UPI / Online Payment", "Card Payment"],
    highlights: ["24/7 Available", "Expert Staff", "Free Delivery", "Authentic Medicines", "Competitive Pricing"],
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