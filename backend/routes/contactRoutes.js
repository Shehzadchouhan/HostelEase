const express = require("express");
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactByTicketId,
  respondToContact,
  deleteContact,
} = require("../controllers/contactController");

// Submit a new contact message
router.post("/submit", submitContact);

// Get all contact messages (admin)
router.get("/all", getAllContacts);

// Get contact by ticket ID (user tracking)
router.get("/ticket/:ticketId", getContactByTicketId);

// Respond to contact (admin)
router.put("/respond/:ticketId", respondToContact);

// Delete contact (admin)
router.delete("/:ticketId", deleteContact);

module.exports = router;
