import express from "express";
import { body } from "express-validator"; // <--- Import body để định nghĩa luật
import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js"; // <--- Import middleware gom lỗi

const router = express.Router();

// Định nghĩa luật kiểm tra ngay trong Route
router.post(
  "/login",
  [
    // Luật 1: Email phải là email hợp lệ
    body("email").isEmail().withMessage("Email is invalid"),
    // Luật 2: Password không được để trống
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest, // <--- Chặn lại kiểm tra lỗi trước
  login            // <--- Nếu ok mới vào controller
);

// Route Đăng ký
router.post(
  "/register",
  [
    // Luật 1: Tên bắt buộc
    body("name").notEmpty().withMessage("Name is required"),
    // Luật 2: Email chuẩn
    body("email").isEmail().withMessage("Email is invalid"),
    // Luật 3: Pass tối thiểu 6 ký tự
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest, // Bảo vệ kiểm tra lỗi trước
  register         // Rồi mới vào Controller
);

export default router;