import express from "express";
import { body } from "express-validator";
import { login, register, verifyReset, resetPassword } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

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

export default router;