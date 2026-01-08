import { loginService } from "../services/auth.service.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);

        res.json({
            success: true,
            data: result,
            message: "Login successful"
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

