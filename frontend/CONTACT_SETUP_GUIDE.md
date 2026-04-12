# Contact Page Setup Guide

## What's New

Your contact page now has a fully functional support ticket system where:
- Users can submit contact/support messages
- Each message gets a unique Ticket ID for tracking
- Confirmation emails are sent to users
- Support emails are sent to your team
- Messages are stored in MongoDB database
- Support team can view, respond, and track tickets

---

## Setup Steps

### 1. Install Required Package

```bash
cd backend
npm install nodemailer
```

### 2. Generate Gmail App Password

Since Gmail doesn't allow regular passwords for third-party apps:

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password (you'll need it in step 3)

### 3. Setup Environment Variables

Create/Update your `.env` file in the backend folder:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hostelease
FRONTEND_URL=http://localhost:5173

EMAIL_USER=supporthostelease@gmail.com
EMAIL_PASSWORD=your_16_char_password_here
SUPPORT_EMAIL=supporthostelease@gmail.com
```

**Important**: Replace `your_16_char_password_here` with the actual Gmail app password you generated!

### 4. Restart Backend Server

```bash
cd backend
npm run dev
# or
node server.js
```

---

## Features

### For Users:
- Submit contact queries with name, email, phone, subject, message
- Receive confirmation email immediately
- Get unique Ticket ID to track their request
- Copy ticket ID easily with one click

### For Support Team:
- Receive ALL contact submissions on: `supporthostelease@gmail.com`
- View all tickets: `GET /api/contact/all`
- Track specific ticket: `GET /api/contact/ticket/:ticketId`
- Add response to ticket: `PUT /api/contact/respond/:ticketId`
- Delete ticket: `DELETE /api/contact/:ticketId`

---

## API Endpoints

### Submit Contact Form
```
POST /api/contact/submit
Body: {
  name: "User Name",
  email: "user@email.com",
  phone: "1234567890",  // optional
  subject: "My Issue",
  message: "Detailed message..."
}
Response: {
  success: true,
  ticketId: "TICKET-1712957234-1",
  data: { ...contact document }
}
```

### Get All Contacts (Admin)
```
GET /api/contact/all
Response: {
  success: true,
  data: [{ ...contact1 }, { ...contact2 }]
}
```

### Get Specific Ticket
```
GET /api/contact/ticket/:ticketId
Response: {
  success: true,
  data: { ...contact document }
}
```

### Respond to Ticket (Admin)
```
PUT /api/contact/respond/:ticketId
Body: {
  response: "We have resolved your issue...",
  status: "resolved",  // or "in-progress"
  respondedBy: "Support Team Name"
}
```

### Delete Ticket
```
DELETE /api/contact/:ticketId
```

---

## Email Templates

### Confirmation Email to User
- Shows: Ticket ID, response time expectations
- Sent to: User's email
- Includes: Phone numbers for urgent issues

### Support Email to Team
- Shows: Full contact details, message, ticket ID
- Sent to: supporthostelease@gmail.com
- Professional HTML formatting
- Reply-To: User's email for easy responses

---

## Contact Information

**Location**: Gill HostelEaze, Gill Road, Ludhiana, Punjab

**Phone Numbers**:
- +91 79736 37236
- +91 77101 58529

**Email**: supporthostelease@gmail.com

---

## Troubleshooting

### Emails not sending?
1. Check if EMAIL_USER and EMAIL_PASSWORD are correct in .env
2. Verify the Gmail app password (not your regular password)
3. Check backend console for error messages
4. Ensure MongoDB is running

### Tickets not saving?
1. Ensure MongoDB connection is active
2. Check if Contact model is properly created
3. Restart backend server

### Still having issues?
- Check backend console for error logs
- Verify all routes are registered in server.js
- Ensure nodemailer is installed

---

## Files Created/Updated

**Backend:**
- `models/Contact.js` - Contact message schema
- `controllers/contactController.js` - Contact form logic
- `routes/contactRoutes.js` - API endpoints
- `utils/emailService.js` - Email sending configuration
- `.env.example` - Environment variables template
- `server.js` - Updated with contact routes

**Frontend:**
- `frontend/src/pages/contact.jsx` - Updated with full functionality
- `frontend/src/styles/contact.css` - Enhanced styling

---

## Testing the System

### 1. Frontend Test
- Go to: http://localhost:5173/contact
- Fill in form with: name, email, phone, subject, message
- Click "Send Message"
- You should see success message with Ticket ID

### 2. Email Verification
- Check the email provided in form
- Should receive confirmation email
- Check supporthostelease@gmail.com
- Should receive support email with full details

### 3. Database Check
- Open MongoDB Compass or terminal
- Check `hostelease` > `contacts` collection
- Should see your newly created message

### 4. API Testing (Postman/Thunder Client)
```bash
# Test endpoint
POST http://localhost:5000/api/contact/submit
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "1234567890",
  "subject": "Test Subject",
  "message": "This is a test message"
}
```

---

## Tips

1. **Ticket ID Format**: `TICKET-{timestamp}-{count}`
   - Example: `TICKET-1712957234-1`
   - Auto-generated, unique for each message

2. **Response Tracking**:
   - `status`: pending → in-progress → resolved
   - `response`: Add your reply here
   - `respondedBy`: Name of support person
   - `respondedAt`: When reply was added

3. **Email Customization**: Edit email templates in `utils/emailService.js`

---

## You're All Set!

Your contact form is now fully functional with:
- Real email notifications
- Ticket tracking system
- Database storage
- Admin response management
- Professional UI/UX

**Questions?** Check the console logs or error messages for debugging!
