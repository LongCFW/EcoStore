import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    toggleUserStatus, 
    deleteUser,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress 
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

// 1. Thêm địa chỉ: POST /api/users/address
router.post('/address', addAddress);

// 2. Cập nhật địa chỉ: PUT /api/users/address/:addressId
router.put('/address/:addressId', updateAddress);

// 3. Xóa địa chỉ: DELETE /api/users/address/:addressId
router.delete('/address/:addressId', deleteAddress);

// 4. Đặt mặc định: PUT /api/users/address/:addressId/default
router.put('/address/:addressId/default', setDefaultAddress);

export default router;