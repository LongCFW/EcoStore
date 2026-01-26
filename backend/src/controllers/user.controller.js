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

// 1. Thêm địa chỉ mới
export const addAddress = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { fullName, phone, addressLine, city, province, isDefault } = req.body;

        // Validation cơ bản
        if (!fullName || !phone || !addressLine || !city || !province) {
            return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin: Tên, SĐT, Địa chỉ, Quận, Tỉnh" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Logic Default:
        // Nếu user tick chọn mặc định -> set tất cả cái cũ thành false
        // Hoặc nếu đây là địa chỉ đầu tiên -> auto set true
        if (isDefault || user.addresses.length === 0) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        const newAddress = {
            fullName, 
            phone, 
            addressLine, 
            city, 
            province, 
            country: "Vietnam", // Mặc định
            isDefault: isDefault || user.addresses.length === 0
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({ 
            success: true, 
            message: "Thêm địa chỉ thành công", 
            data: user.addresses 
        });
    } catch (error) {
        next(error);
    }
};

// 2. Cập nhật địa chỉ
export const updateAddress = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { addressId } = req.params; // ID của address cần sửa
        const { fullName, phone, addressLine, city, province, isDefault } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const address = user.addresses.id(addressId); // Tìm subdocument theo ID
        if (!address) return res.status(404).json({ success: false, message: "Địa chỉ không tồn tại" });

        // Nếu set default = true -> Reset các cái khác trước
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        // Cập nhật thông tin
        if (fullName) address.fullName = fullName;
        if (phone) address.phone = phone;
        if (addressLine) address.addressLine = addressLine;
        if (city) address.city = city;
        if (province) address.province = province;
        if (isDefault !== undefined) address.isDefault = isDefault;

        await user.save();

        res.json({ 
            success: true, 
            message: "Cập nhật địa chỉ thành công", 
            data: user.addresses 
        });
    } catch (error) {
        next(error);
    }
};

// 3. Xóa địa chỉ
export const deleteAddress = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Kiểm tra xem address có tồn tại không trước khi xóa
        const addressExists = user.addresses.id(addressId);
        if (!addressExists) return res.status(404).json({ success: false, message: "Địa chỉ không tồn tại" });

        // Xóa address
        user.addresses.pull({ _id: addressId });

        // Logic thông minh: Nếu xóa mất cái mặc định -> set cái đầu tiên còn lại làm mặc định
        if (addressExists.isDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.json({ 
            success: true, 
            message: "Đã xóa địa chỉ", 
            data: user.addresses 
        });
    } catch (error) {
        next(error);
    }
};

// 4. Thiết lập địa chỉ mặc định
export const setDefaultAddress = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const address = user.addresses.id(addressId);
        if (!address) return res.status(404).json({ success: false, message: "Địa chỉ không tồn tại" });

        // Reset tất cả về false
        user.addresses.forEach(addr => addr.isDefault = false);
        
        // Set cái được chọn thành true
        address.isDefault = true;

        await user.save();

        res.json({ 
            success: true, 
            message: "Đã đặt làm địa chỉ mặc định", 
            data: user.addresses 
        });
    } catch (error) {
        next(error);
    }
};