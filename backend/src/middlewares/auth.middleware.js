import jwt from "jsonwebtoken";
import User from "../models/user.js"; 

/**
 * LOGIC CỐT LÕI (CORE LOGIC)
 * 1. Lấy token (Cookie hoặc Header)
 * 2. Verify Token
 * 3. Lấy User từ DB + Populate Role (Để phân quyền hoạt động)
 * 4. Gán userId vào req.user để Controller cũ không bị lỗi
 */
const coreAuthLogic = async (req, res, next) => {
    try {
        let token;

        // 1. Ưu tiên lấy Token từ Cookie (An toàn & Tự động cho trình duyệt)
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } 
        // 2. Nếu không có Cookie, kiểm tra Header Authorization (Cho Postman/Mobile)
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Nếu không tìm thấy token
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Không tìm thấy token xác thực. Vui lòng đăng nhập." 
            });
        }

        // 3. Giải mã Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Lấy ID an toàn (Xử lý cả trường hợp token lưu 'userId' hoặc 'id')
        const tokenUserId = decoded.userId || decoded.id;
        
        // 5. Tìm User và Populate Role
        const user = await User.findById(tokenUserId).populate("role");

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User không tồn tại hoặc đã bị xóa." 
            });
        }

        // 6. Gán user vào request (Object Mongoose)
        req.user = user;

        // --- DÒNG QUAN TRỌNG ĐỂ FIX LỖI CART & AUTH ---
        // Gán thêm thuộc tính .userId trỏ về ._id để các Controller cũ (Cart, Auth) 
        // gọi req.user.userId vẫn chạy đúng mà không cần sửa code Controller.
        req.user.userId = user._id; 
        // ----------------------------------------------

        next(); // Cho phép đi tiếp
    } catch (error) {
        console.error("❌ Auth Error:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Phiên đăng nhập hết hạn hoặc token không hợp lệ." 
        });
    }
};

// --- XUẤT RA 2 TÊN ĐỂ TƯƠNG THÍCH VỚI MỌI FILE ---

// 1. Dành cho các file: auth.routes, order.routes, user.routes
export const verifyToken = coreAuthLogic;

// 2. Dành cho các file: cart.routes, product.routes, category.routes
export const authMiddleware = coreAuthLogic;
