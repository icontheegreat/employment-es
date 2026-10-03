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

// View Engine (EJS Setup)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection Handler
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

// Ensure database connection before handling requests
const ensureDbConnected = async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    res.status(500).render("login", {
      message: "Database connection failed. Please try again later.",
      messageType: "error",
      employerId: "general",
    });
  }
};

// Home Route - Captures ?ref= parameter from URL
app.get("/", ensureDbConnected, (req, res) => {
  const ref = req.query.ref || "general";

  res.render("login", {
    message: null,
    messageType: null,
    employerId: ref,
  });
});

// API Routes
app.use("/api", ensureDbConnected, authRoutes);

// Start server locally / on Render (bypassed on Vercel)
const PORT = process.env.PORT || 2000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;