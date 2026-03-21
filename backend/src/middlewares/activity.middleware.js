import User from '../models/user.js';

export const logActivity = async (req, res, next) => {
    // 1. Bỏ qua các hành động chỉ Xem dữ liệu (GET)
    if (req.method === 'GET') {
        return next();
    }

    // 2. Chờ cho Controller thực hiện xong và trả về kết quả
    res.on('finish', async () => {
        // 3. Nếu hành động THÀNH CÔNG (Mã 200 -> 299) thì mới ghi log
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                // Lấy ID của nhân viên đang thao tác (từ token)
                const userId = req.user?.userId || req.user?.id;
                if (!userId) return;

                // 4. "Dịch" phương thức thành Hành Động
                let actionName = "THAO TÁC HỆ THỐNG";
                if (req.method === 'POST') actionName = "THÊM MỚI";
                else if (req.method === 'PUT' || req.method === 'PATCH') actionName = "CẬP NHẬT";
                else if (req.method === 'DELETE') actionName = "XÓA";

                // 5. "Dịch" URL thành Tên Đối Tượng
                let targetName = "Dữ liệu";
                const url = req.originalUrl.toLowerCase();
                
                if (url.includes('/products')) targetName = "Sản phẩm";
                else if (url.includes('/categories')) targetName = "Danh mục";
                else if (url.includes('/orders')) targetName = "Đơn hàng";
                else if (url.includes('/users/status')) targetName = "Trạng thái User";
                else if (url.includes('/users/staff')) targetName = "Nhân sự";
                else if (url.includes('/users')) targetName = "Khách hàng";

                // 6. Ghi âm thầm vào Database
                await User.findByIdAndUpdate(userId, {
                    $push: {
                        activityLogs: {
                            action: `${actionName} ${targetName}`.toUpperCase(),
                            details: `Endpoint: ${req.method} ${req.originalUrl}`
                        }
                    }
                });

            } catch (error) {
                console.error("⚠️ Lỗi ghi log tự động:", error.message);
            }
        }
    });

    // Cho phép request đi tiếp vào Controller bình thường
    next();
};