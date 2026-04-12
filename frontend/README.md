# HostelEase Frontend

React + Vite frontend for HostelEase — a service discovery app for hostel students.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── assets/          ← images (logo.png, login.png, map-bg.png, services/)
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetails.jsx
│   │   ├── MapView.jsx
│   │   └── Contact.jsx
│   ├── styles/
│   │   ├── navbar.css
│   │   ├── landing.css
│   │   ├── login-module.css
│   │   ├── register.css
│   │   ├── services.css
│   │   ├── serviceDetails.css
│   │   ├── mapview.css
│   │   └── contact.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## Setup

```bash
npm install
npm run dev
```

## ⚠️ Assets Required
Make sure to add these files in `src/assets/`:
- `logo.png`
- `login.png`
- `map-bg.png`
- `services/laundry1.jpg`
- `services/laundry2.png`
- `services/laundry3.png`
