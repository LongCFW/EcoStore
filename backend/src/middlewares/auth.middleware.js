import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export const verifyToken = (req, res, next) => {
  // 1. Lấy token từ header (Dạng: Bearer <token>)
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
  }

  try {
    // 2. Xác thực token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Lưu thông tin user đã giải mã vào req để các route sau dùng
    req.user = verified; 
    
    next(); // Cho phép đi tiếp
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid Token" });
  }
};