import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    toggleUserStatus, 
    deleteUser 
} from '../controllers/user.controller.js';
// Middleware kiểm tra login và quyền Admin
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// Tất cả các route này đều cần Login + Quyền Admin
// (Giả sử bạn đã có middleware isAdmin, nếu chưa thì tạm thời dùng verifyToken thôi)
router.use(verifyToken); 
// router.use(isAdmin); // Uncomment sau khi làm xong phân quyền

// 1. Lấy danh sách user (có phân trang, search)
router.get('/', getAllUsers);

// 2. Lấy chi tiết 1 user
router.get('/:id', getUserById);

// 3. Khóa / Mở khóa user
router.put('/:id/status', toggleUserStatus);

// 4. Xóa user (Optional)
router.delete('/:id', deleteUser);

export default router;