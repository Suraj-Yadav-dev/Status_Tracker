const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Root Test Route
app.get("/", (req, res) => {
  res.send("🚀 API Working Successfully...");
});

console.log("Trying to connect to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
      console.log(`📌 API Test: http://localhost:${PORT}/`);
      console.log(`🔐 Auth Login: http://localhost:${PORT}/api/auth/login`);
      console.log("=================================");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
