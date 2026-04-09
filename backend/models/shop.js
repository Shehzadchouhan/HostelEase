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
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// 👇 IMPORTANT for location search
shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Shop", shopSchema);