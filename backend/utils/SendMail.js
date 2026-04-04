const nodemailer = require("nodemailer");

const sendMail = async (email, subject, html) => {
  try {
    if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASS) {
      console.log("-----------------------------------------");
      console.log("⚠️ WARNING: Email credentials not set in .env");
      console.log(`📧 SIMULATED EMAIL TO: ${email}`);
      console.log(`📝 SUBJECT: ${subject}`);
      console.log(`📄 BODY: ${html}`);
      console.log("-----------------------------------------");
      return; // Simulate success
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

module.exports = sendMail;
