import express from "express";
import { body } from "express-validator";
import { login, logout, register, sendOtp, resetPassword, updateProfile, changePassword, getMe } from "../controllers/auth.controller.js";
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
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
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

// Logout
router.post("/logout", logout);

// YÊU CẦU GỬI OTP
router.post("/send-otp", [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("type").isIn(['register', 'reset']).withMessage("Loại OTP không hợp lệ")
], validateRequest, sendOtp);

// Register 
router.post("/register", [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("phone").notEmpty().withMessage("Phone required"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP phải có 6 chữ số")
], validateRequest, register);

// Reset Password (Đã gộp chung check OTP và đổi pass vào đây)
router.post("/reset-password", [
    body("email").isEmail(),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP phải có 6 chữ số"),
    body("newPassword").isLength({ min: 6 })
], validateRequest, resetPassword);

// Các tính năng Profile
router.post('/upload-avatar', verifyToken, upload.single('avatar'), updateAvatar);
router.put('/profile/update', verifyToken, updateProfile);
router.put('/profile/change-password', verifyToken, changePassword);
router.get("/me", verifyToken, getMe);

export default router;