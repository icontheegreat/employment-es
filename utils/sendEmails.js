// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email notification with submission details.
 * @param {Object} formData - Object containing form field values.
 */
async function sendFormNotification(formData) {
  // Format the key-value pairs into HTML
  const formattedFields = Object.entries(formData)
    .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
    .join("");

  const mailOptions = {
    from: `"Form System" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: " New Form Submission Received",
    html: `
      <h2>New Submission Received</h2>
      <div>${formattedFields}</div>
      <hr />
      <p><small>Sent automatically from your app server.</small></p>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = sendFormNotification;