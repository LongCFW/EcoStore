import User from "../models/user.js";

// --- 1. LẤY DANH SÁCH USER ---
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = "", status = "All" } = req.query;
        
        // Query cơ bản
        const query = {};

        // Tìm kiếm theo tên, email, sđt
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // Lọc theo trạng thái (status trong DB là Number: 1=Active, 0=Locked)
        if (status !== 'All') {
            query.status = status === 'Active' ? 1 : 0;
        }

        // Thực hiện query
        const users = await User.find(query)
            .populate('role', 'name') // Lấy tên Role
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 }); // Mới nhất lên đầu

        const count = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalUsers: count
        });
    } catch (error) {
        next(error);
    }
};

// --- 2. LẤY CHI TIẾT USER ---
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('role', 'name');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// --- 3. KHÓA / MỞ KHÓA ---
export const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Đảo trạng thái: 1 -> 0, 0 -> 1
        user.status = user.status === 1 ? 0 : 1;
        await user.save();

        res.json({ 
            success: true, 
            message: `User is now ${user.status === 1 ? 'Active' : 'Locked'}`,
            newStatus: user.status 
        });
    } catch (error) {
        next(error);
    }
};

// --- 4. XÓA USER (OPTIONAL) ---
export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};