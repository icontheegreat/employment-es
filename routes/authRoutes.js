// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { submitLogin } = require("../controllers/authController.js");

router.post("/login", submitLogin);

module.exports = router;