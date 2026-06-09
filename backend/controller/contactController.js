const nodemailer = require("nodemailer");

const submitContactform = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    console.log("EMAIL:", process.env.SMTP_EMAIL);
    console.log("PASSWORD EXISTS:", !!process.env.SMTP_PASSWORD);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      replyTo: email,
      to: process.env.SMTP_EMAIL,
      subject: `Production Lead: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("MAIL ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { submitContactform };