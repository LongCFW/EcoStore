import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: 'EcoStore <onboarding@resend.dev>', // Mail mặc định của Resend (hoặc domain riêng nếu có)
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
    
    console.log("Email sent API Success:", data.id);
    return data;
  } catch (error) {
    console.error("Email API Error:", error);
    // Không throw error để tránh crash app nếu gửi mail lỗi
  }
};

export default sendEmail;