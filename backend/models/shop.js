import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Stationery", "Laundry", "Shopping", "Food", "Medical", "Transport", "Grocery", "Pharmacy"]
    },
    // ✅ Change location to GeoJSON Point format
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.1025, 28.7041]
      },
      address: {
        type: String,
        default: ""
      }
    },
    phone: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1488459716781-6e3100ce3ce0?w=200&h=200&fit=crop"
    },
    pricing: [
      {
        title: String,
        price: String
      }
    ],
    paymentMethods: [String],
    highlights: [String]
  },
  { timestamps: true }
);

// ✅ This index is REQUIRED for $near geospatial queries to work
shopSchema.index({ location: "2dsphere" });

export default mongoose.model("Shop", shopSchema);