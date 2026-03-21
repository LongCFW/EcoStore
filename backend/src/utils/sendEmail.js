import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: process.env.MAIL_PORT || 587,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: `"EcoStore" <${process.env.MAIL_USER}>`,
            to: options.email, // Nhận email của bất kỳ ai nhập vào
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully. Message ID:", info.messageId);
        return true;
    } catch (err) {
        console.error("Lỗi hệ thống gửi mail:", err);
        throw new Error("Không thể gửi email lúc này.");
    }
};

export default sendEmail;