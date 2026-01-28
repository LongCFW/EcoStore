import sendEmail from "../utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const sendContactService = async ({ name, email, subject, message }) => {
    // --- 1. GỬI EMAIL CHO ADMIN (Để bạn đọc) ---
    const ADMIN_EMAIL = process.env.MAIL_USER;
    
    sendEmail({
        email: ADMIN_EMAIL, 
        subject: `[Liên hệ mới] Từ ${name}: ${subject || 'Không tiêu đề'}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                <h3 style="color: #2e7d32;">📩 Có tin nhắn mới từ Website</h3>
                <p><strong>Người gửi:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <hr/>
                <p><strong>Nội dung:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #2e7d32; margin: 0;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
            </div>
        `
    }).catch(err => console.error("Lỗi gửi contact admin:", err.message));

    // --- 2. GỬI EMAIL AUTO-REPLY (NON-BLOCKING) ---
    sendEmail({
        email: email, 
        subject: "EcoStore đã nhận được tin nhắn của bạn",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h3 style="color: #2e7d32;">Chào ${name},</h3>
                <p>Cảm ơn bạn đã liên hệ với EcoStore.</p>
                <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.</p>
                <br/>
                <p>Trân trọng,<br/><strong>Đội ngũ EcoStore</strong></p>
            </div>
        `
    }).catch(err => console.error("Lỗi gửi auto-reply:", err.message));

    // Trả về kết quả NGAY LẬP TỨC, không đợi email
    return { success: true, message: "Gửi liên hệ thành công" };
};