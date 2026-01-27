import { sendContactService } from "../services/contact.service.js"; // Import Service

export const sendContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Vui lòng điền tên, email và nội dung tin nhắn." });
        }

        // 2. Gọi Service để xử lý Logic
        await sendContactService({ name, email, subject, message });

        // 3. Trả Response
        res.status(200).json({ 
            success: true, 
            message: "Gửi liên hệ thành công! Vui lòng kiểm tra email." 
        });

    } catch (error) {
        console.error("Lỗi gửi contact:", error);
        next(error);
    }
};