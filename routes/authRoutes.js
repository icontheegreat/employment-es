const express = require("express");
const { submitLogin } = require("../controllers/authController.js");

const router = express.Router();

router.post("/login", submitLogin);

module.exports = router;