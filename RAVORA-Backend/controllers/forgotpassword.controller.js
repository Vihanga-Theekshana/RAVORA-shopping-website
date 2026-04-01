const db = require("../db");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

async function email(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?",
      [otp, expiry, email],
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "RAVORA Password Reset OTP",
      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes</p>
      `,
    });

    return res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("send-otp error:", error.message);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
}

async function veryfyotp(req,res){
    try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = users[0];

    if (new Date(user.otp_expires) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("verify-otp error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function resetpassword(req,res) {
    try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password_hash = ?, otp = NULL, otp_expires = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("reset-password error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
    
}

module.exports = {email,veryfyotp,resetpassword}
