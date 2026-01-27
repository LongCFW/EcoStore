export const requireRole = (allowedRoles = []) => {
    return (req, res, next) => {
        // 1. Kiểm tra xem user có tồn tại và có role không
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found."
            });
        }

        if (!req.user.role) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: User has no role assigned."
            });
        }

        // 2. Lấy tên Role
        // trong DB bảng Roles có trường 'name': "manager", "admin"...
        // Và trong auth.middleware đã .populate('role') nên req.user.role là 1 Object.
        const userRoleName = req.user.role.name || req.user.role;

        // console.log(`[CHECK ROLE] User: ${req.user.email} | Role: ${userRoleName} | Required: ${allowedRoles}`);

        // 3. Kiểm tra quyền
        if (allowedRoles.includes(userRoleName)) {
            next(); // Đủ quyền -> Cho qua
        } else {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You do not have permission to access this resource."
            });
        }
    };
};