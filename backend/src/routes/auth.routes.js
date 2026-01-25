import express from "express";
import { body } from "express-validator";
import { login, register, verifyReset, resetPassword } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { updateAvatar } from '../controllers/auth.controller.js';
import multer from 'multer';
import path from 'path';
import { verifyToken } from "../middlewares/auth.middleware.js";
import fs from 'fs';

const router = express.Router();
// 1. Cấu hình Multer (Lưu ảnh vào thư mục 'uploads')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/';
        // Kiểm tra xem thư mục có tồn tại không, nếu không thì tạo mới
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Đặt tên file an toàn (tránh trùng lặp)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Lấy đuôi file gốc (ví dụ .jpg, .png)
        const ext = path.extname(file.originalname);
        cb(null, 'avatar-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

// Login
router.post("/login", [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
], validateRequest, login);

// Register 
router.post("/register", [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("phone").notEmpty().withMessage("Phone required"),
], validateRequest, register);


// Verify Identity
router.post("/verify-reset", [
    body("email").isEmail(),
    body("phone").notEmpty()
], validateRequest, verifyReset);

// Reset Password
router.post("/reset-password", [
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("newPassword").isLength({ min: 6 })
], validateRequest, resetPassword);

router.post('/upload-avatar', verifyToken, upload.single('avatar'), updateAvatar);

export default router;