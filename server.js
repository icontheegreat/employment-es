const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes.js");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Home Route
app.get("/", (req, res) => {
  res.render("login", {
    message: null,
    messageType: null,
  });
});

// API Routes
app.use("/api", authRoutes);

// MongoDB connection
let mongoConnected = false;

async function connectMongoDB() {
  if (mongoConnected || mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI is missing. Add it to your environment variables."
    );
  }

  await mongoose.connect(process.env.MONGO_URI);

  mongoConnected = true;
  console.log("✅ MongoDB connected");
}

// Connect to MongoDB for every environment
connectMongoDB().catch((error) => {
  console.error("❌ MongoDB connection failed:", error.message);
});

// Start server locally / on Render
const PORT = process.env.PORT || 2000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;