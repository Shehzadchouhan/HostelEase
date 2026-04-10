const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json()); // <-- this line is required

// Debug middleware (must be before routes)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/shops", shopRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

// const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));