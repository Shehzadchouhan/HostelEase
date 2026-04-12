const mongoose = require("mongoose");
const Shop = require("./models/shop");
require("dotenv").config();

async function addSampleShop() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Sample shops with images
    const sampleShops = [
      {
        name: "Clean & Dry Laundry",
        category: "Laundry",
        location: {
          type: "Point",
          coordinates: [77.5946, 12.9716]
        },
        contact: "9876543210",
        address: "123 Main Street, Bangalore 560001",
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        description: "Professional laundry service with eco-friendly detergents. Fast turnaround time with premium care for all fabric types.",
        pricing: [
          { title: "Regular Wash", price: "₹50" },
          { title: "Premium Wash", price: "₹80" },
          { title: "Dry Clean", price: "₹120" }
        ],
        minimumOrder: "₹100",
        paymentMethods: ["UPI", "Cash", "Card"],
        highlights: ["Express Service", "Quality Care", "Eco-Friendly", "Same Day Delivery"],
        reviews: [
          { name: "Rahul Kumar", rating: 5, comment: "Excellent service! Very clean & fast.", date: "10 Apr 2026" },
          { name: "Priya Singh", rating: 4, comment: "Good quality, reasonable price.", date: "08 Apr 2026" },
          { name: "Amit Patel", rating: 5, comment: "Best in area, highly recommended!", date: "05 Apr 2026" }
        ]
      },
      {
        name: "Spice Street Food",
        category: "Food",
        location: {
          type: "Point",
          coordinates: [77.6005, 12.9698]
        },
        contact: "9876543211",
        address: "456 Food Court, Bangalore 560002",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1495969686556-8a9d468ab517?w=400&h=400&fit=crop",
        description: "Authentic Indian cuisine with homemade recipes. Delicious meals prepared fresh daily for hungry students.",
        pricing: [
          { title: "Lunch Box", price: "₹150" },
          { title: "Dinner Combo", price: "₹200" },
          { title: "Snacks Pack", price: "₹80" }
        ],
        minimumOrder: "₹100",
        paymentMethods: ["UPI", "Cash", "Card"],
        highlights: ["Fresh Food", "Quick Delivery", "Hygiene First", "Student Friendly"],
        reviews: [
          { name: "Sneha Rao", rating: 5, comment: "Tasty and hygienic food!", date: "09 Apr 2026" },
          { name: "Vikram Roy", rating: 4, comment: "Good taste, timely delivery.", date: "07 Apr 2026" },
          { name: "Neha Sharma", rating: 5, comment: "My favorite food spot!", date: "04 Apr 2026" }
        ]
      },
      {
        name: "MediCare Pharmacy",
        category: "Medical",
        location: {
          type: "Point",
          coordinates: [77.5880, 12.9730]
        },
        contact: "9876543212",
        address: "789 Health Plaza, Bangalore 560003",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
        description: "24/7 medical pharmacy with licensed pharmacists. Prescription consultation and home delivery available.",
        pricing: [
          { title: "Consultation", price: "Free" },
          { title: "Home Delivery", price: "₹30" },
          { title: "Wellness Packages", price: "₹500" }
        ],
        minimumOrder: "₹50",
        paymentMethods: ["UPI", "Cash", "Online"],
        highlights: ["24/7 Service", "Licensed Staff", "Home Delivery", "Affordable"],
        reviews: [
          { name: "Dr. Ankit", rating: 5, comment: "Reliable pharmacy, quick service.", date: "08 Apr 2026" },
          { name: "Sanjana", rating: 5, comment: "Always available when needed.", date: "06 Apr 2026" },
          { name: "Karan Singh", rating: 4, comment: "Good service, helpful staff.", date: "03 Apr 2026" }
        ]
      },
      {
        name: "Tech Fix Repair",
        category: "Repair",
        location: {
          type: "Point",
          coordinates: [77.6020, 12.9750]
        },
        contact: "9876543213",
        address: "321 Tech Hub, Bangalore 560004",
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1517420879835-d4990acf53b5?w=400&h=400&fit=crop",
        description: "Expert repair services for smartphones, laptops, and electronics. 30-day warranty on repairs.",
        pricing: [
          { title: "Screen Repair", price: "₹2000" },
          { title: "Battery Replacement", price: "₹1500" },
          { title: "Software Service", price: "₹500" }
        ],
        minimumOrder: "₹500",
        paymentMethods: ["UPI", "Cash", "Card"],
        highlights: ["Expert Technicians", "30-Day Warranty", "Quick Service", "Original Parts"],
        reviews: [
          { name: "Rohan Verma", rating: 5, comment: "Fixed my phone perfectly!", date: "09 Apr 2026" },
          { name: "Angela Smith", rating: 4, comment: "Good work, fair prices.", date: "05 Apr 2026" },
          { name: "Deepak Nair", rating: 4, comment: "Professional service.", date: "02 Apr 2026" }
        ]
      },
      {
        name: "Sharp Cuts Barber",
        category: "Barber",
        location: {
          type: "Point",
          coordinates: [77.5920, 12.9680]
        },
        contact: "9876543214",
        address: "654 Style Street, Bangalore 560005",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1585747860715-cd4628902d4a?w=400&h=400&fit=crop",
        description: "Premium barbering services with experienced stylists. Latest trends and classic cuts available.",
        pricing: [
          { title: "Regular Haircut", price: "₹200" },
          { title: "Premium Cut + Shave", price: "₹400" },
          { title: "Beard Grooming", price: "₹300" }
        ],
        minimumOrder: "₹200",
        paymentMethods: ["UPI", "Cash"],
        highlights: ["Expert Stylists", "Hygiene Standard", "Latest Trends", "Quick Service"],
        reviews: [
          { name: "Arjun Kapoor", rating: 5, comment: "Best haircut in town!", date: "10 Apr 2026" },
          { name: "Nikhil Sharma", rating: 5, comment: "Professional and friendly.", date: "07 Apr 2026" },
          { name: "Varun Malhotra", rating: 4, comment: "Good service, clean place.", date: "04 Apr 2026" }
        ]
      }
    ];

    // Add shops to database
    for (const shopData of sampleShops) {
      const existingShop = await Shop.findOne({ name: shopData.name });
      
      if (existingShop) {
        console.log(`Shop already exists: ${shopData.name}`);
      } else {
        const newShop = new Shop(shopData);
        await newShop.save();
        console.log(`Added shop: ${shopData.name} (ID: ${newShop._id})`);
      }
    }

    console.log("\nAll sample shops processed successfully");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
  }
}

addSampleShop();