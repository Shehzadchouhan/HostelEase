const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  contact: {
    type: String
  },
  address: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ""
  },
  pricing: [{
    title: String,
    price: String
  }],
  minimumOrder: {
    type: String,
    default: "₹0"
  },
  paymentMethods: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
  reviews: [{
    name: String,
    rating: Number,
    comment: String,
    date: String
  }]
}, { timestamps: true });

// 👇 IMPORTANT for location search
shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Shop", shopSchema);