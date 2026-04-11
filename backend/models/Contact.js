const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    response: {
      type: String,
      default: null,
    },
    respondedBy: {
      type: String,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate ticket ID before saving
contactSchema.pre("save", async function () {
  if (!this.ticketId) {
    const count = await mongoose.model("Contact").countDocuments();
    this.ticketId = `TICKET-${Date.now()}-${count + 1}`;
  }
});

module.exports = mongoose.model("Contact", contactSchema);
