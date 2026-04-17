import Contact from "../models/Contact.js";
import { sendSupportEmail, sendConfirmationEmail } from "../utils/emailService.js";

// Submit a new contact message
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, subject, and message",
      });
    }

    // Create new contact document
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      phone: phone || "",
      status: "pending",
    });

    // Save to database
    await newContact.save();
    console.log("Contact saved to database:", newContact.ticketId);

    // Send emails
    try {
      console.log("Attempting to send support email..."); 
      await sendSupportEmail(newContact);
      console.log("Support email sent successfully");
    } catch (emailError) {
      console.error("Error sending support email:", emailError.message);
    }

    try {
      console.log("Attempting to send confirmation email...");
      await sendConfirmationEmail(newContact);
      console.log("Confirmation email sent successfully");
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Your message has been submitted successfully!",
      ticketId: newContact.ticketId,
      data: newContact,
    });
  } catch (error) {
    console.error("❌ Error submitting contact form:", error.message);
    console.error("❌ Full error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to submit message. Please try again.",
      error: error.message,
    });
  }
};

// Get all contact messages (for admin dashboard)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Get contact by ticket ID (for tracking)
const getContactByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const contact = await Contact.findOne({ ticketId });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
      error: error.message,
    });
  }
};

// Update contact status and add response (for admin)
const respondToContact = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { response, status, respondedBy } = req.body;

    if (!response || !status) {
      return res.status(400).json({
        success: false,
        message: "Please provide response and status",
      });
    }

    const contact = await Contact.findOneAndUpdate(
      { ticketId },
      {
        response,
        status,
        respondedBy: respondedBy || "Support Team",
        respondedAt: new Date(),
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Response added successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error responding to contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add response",
      error: error.message,
    });
  }
};

// Delete contact message
const deleteContact = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const contact = await Contact.findOneAndDelete({ ticketId });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};

export {
  submitContact,
  getAllContacts,
  getContactByTicketId,
  respondToContact,
  deleteContact,
};
