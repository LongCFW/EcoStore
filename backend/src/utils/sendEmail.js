import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (options) => {
  // 1. Tạo Transporter (Người vận chuyển)
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // false cho port 587, true cho port 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // 2. Định nghĩa nội dung email
  const message = {
    from: `"EcoStore 🌿" <${process.env.MAIL_USER}>`, // Tên người gửi hiển thị
    to: options.email,
    subject: options.subject,
    html: options.html, // Nội dung HTML
  };

  // 3. Gửi email
  const info = await transporter.sendMail(message);
  console.log("Email sent: %s", info.messageId);
};

export default sendEmail;