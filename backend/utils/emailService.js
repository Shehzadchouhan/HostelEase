import nodemailer from "nodemailer";

console.log("Email Configuration:");
console.log("  USER:", process.env.EMAIL_USER);
console.log("  PASSWORD:", process.env.EMAIL_PASSWORD ? "Set" : "Missing");
console.log("  SUPPORT_EMAIL:", process.env.SUPPORT_EMAIL);

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "supporthostelease@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "", // Use Gmail App Password
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error.message);
  } else {
    console.log("Email transporter ready to send messages");
  }
});

// Send email to support
const sendSupportEmail = async (contactData) => {
  const { name, email, subject, message, phone, ticketId } = contactData;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { background-color: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 20px auto; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .header h2 { margin: 0; }
        .ticket-id { background-color: #e0ebff; padding: 10px; margin: 10px 0; border-radius: 4px; font-weight: bold; color: #2563eb; }
        .details { margin: 20px 0; }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #333; width: 100px; display: inline-block; }
        .message-box { background-color: #f9fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; border-radius: 4px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Support Message from HostelEase</h2>
        </div>
        
        <div class="ticket-id">Ticket ID: ${ticketId}</div>
        
        <div class="details">
          <div class="detail-row">
            <span class="label">Name:</span> ${name}
          </div>
          <div class="detail-row">
            <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
          </div>
          <div class="detail-row">
            <span class="label">Phone:</span> ${phone || "Not provided"}
          </div>
          <div class="detail-row">
            <span class="label">Subject:</span> ${subject}
          </div>
          <div class="detail-row">
            <span class="label">Time:</span> ${new Date().toLocaleString()}
          </div>
        </div>
        
        <h3>Message:</h3>
        <div class="message-box">
          ${message.replace(/\n/g, "<br>")}
        </div>
        
        <div class="footer">
          <p>Please reply to this ticket with Ticket ID: ${ticketId}</p>
          <p>© 2026 HostelEase. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log("Sending support email to:", process.env.SUPPORT_EMAIL);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || "supporthostelease@gmail.com",
      to: process.env.SUPPORT_EMAIL || "supporthostelease@gmail.com",
      subject: `[${ticketId}] New Support Ticket: ${subject}`,
      html: htmlContent,
      replyTo: email,
    });
    console.log("Support email sent successfully - MessageID:", info.messageId);
  } catch (error) {
    console.error("Error sending support email:", error.message);
    // Don't throw - let contact be saved even if email fails
  }
};

// Send confirmation email to user
const sendConfirmationEmail = async (contactData) => {
  const { name, email, ticketId } = contactData;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { background-color: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 20px auto; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .header h2 { margin: 0; }
        .content { margin: 20px 0; }
        .ticket-box { background-color: #e0ebff; padding: 15px; border-radius: 4px; text-align: center; margin: 15px 0; }
        .ticket-box .label { color: #666; display: block; margin-bottom: 5px; }
        .ticket-box .id { color: #2563eb; font-weight: bold; font-size: 18px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ We Received Your Message!</h2>
        </div>
        
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for contacting HostelEase! We have received your message and our team will get back to you soon.</p>
          
          <div class="ticket-box">
            <span class="label">Your Ticket ID:</span>
            <div class="id">${ticketId}</div>
            <p style="margin: 5px 0; color: #666; font-size: 12px;">Save this ID to track your support request</p>
          </div>
          
          <p>We typically respond within 24-48 hours. Keep your ticket ID handy for reference when checking on your request status.</p>
          <p><strong>Best regards,<br>HostelEase Support Team</strong></p>
        </div>
        
        <div class="footer">
          <p>If you have any urgent concerns, please call us at +91 79736 37236 or +91 77101 58529</p>
          <p>© 2026 HostelEase. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log("🔄 Sending confirmation email to:", email);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || "supporthostelease@gmail.com",
      to: email,
      subject: `Ticket Confirmation: ${ticketId} - HostelEase Support`,
      html: htmlContent,
    });
    console.log("✅ Confirmation email sent successfully - MessageID:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error.message);
    // Don't throw - let contact be saved even if email fails
  }
};

export { sendSupportEmail, sendConfirmationEmail };
