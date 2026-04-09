const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // <-- this line is required
const shopRoutes = require("./routes/shopRoutes");

app.use("/api/shops", shopRoutes);


app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));