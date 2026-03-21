import User from "../models/user.js";
import Role from "../models/role.js";
import bcrypt from "bcrypt";
import Order from "../models/order.js";

// ===== USER =====
export const findUsers = async ({ page, limit, search, status, roleType, specificRole }) => {
    const dataQuery = {};  
    const statsQuery = {}; 

    if (roleType) {
        if (roleType === 'customer') {
            const customerRole = await Role.findOne({ name: 'customer' });
            if (customerRole) {
                dataQuery.role = customerRole._id;
                statsQuery.role = customerRole._id; 
            }
        } else if (roleType === 'staff') {
            // Thống kê: LUÔN đếm tất cả nhân sự (Admin, Manager, Staff)
            const allStaffRoles = await Role.find({ name: { $in: ['admin', 'manager', 'staff'] } });
            const allStaffIds = allStaffRoles.map(r => r._id);
            statsQuery.role = { $in: allStaffIds }; 

            // Bảng Data: Lọc theo cấp bậc cụ thể nếu người dùng chọn
            let queryRoleNames = ['admin', 'manager', 'staff'];
            if (specificRole && specificRole !== 'All') {
                queryRoleNames = [specificRole];
            }
            const queryRoles = await Role.find({ name: { $in: queryRoleNames } });
            dataQuery.role = { $in: queryRoles.map(r => r._id) };
        }
    }

    if (search) {
        dataQuery.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } }
        ];
    }

    if (status !== "All") {
        dataQuery.status = status === "Active" ? 1 : 0;
    }

    const users = await User.find(dataQuery)
        .populate("role", "name")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const count = await User.countDocuments(dataQuery); 

    const globalTotal = await User.countDocuments(statsQuery);
    const globalActive = await User.countDocuments({ ...statsQuery, status: 1 });
    const globalLocked = globalTotal - globalActive;

    return { users, count, globalTotal, globalActive, globalLocked };
};

export const findUserById = async (id) => {
    return await User.findById(id).populate("role", "name");
};

export const toggleUserStatusById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    user.status = user.status === 1 ? 0 : 1;
    await user.save();
    return user;
};

export const deleteUserById = async (id) => {
    // 1. Kiểm tra xem khách hàng này đã từng đặt hàng chưa
    const hasOrders = await Order.exists({ userId: id });
    if (hasOrders) {
        throw new Error("Không thể xóa: Khách hàng này đã có dữ liệu đơn hàng trong hệ thống.");
    }
    
    // 2. Nếu an toàn, tiến hành xóa
    return await User.findByIdAndDelete(id);
};

// ===== ADDRESS =====
export const addUserAddress = async (userId, addressData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (addressData.isDefault || user.addresses.length === 0) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
        ...addressData,
        country: "Vietnam",
        isDefault: addressData.isDefault || user.addresses.length === 0
    });

    await user.save();
    return user.addresses;
};

export const updateUserAddress = async (userId, addressId, data) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const address = user.addresses.id(addressId);
    if (!address) throw new Error("Address not found");

    if (data.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, data);
    await user.save();

    return user.addresses;
};

export const deleteUserAddress = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const address = user.addresses.id(addressId);
    if (!address) throw new Error("Address not found");

    const wasDefault = address.isDefault;
    user.addresses.pull({ _id: addressId });

    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();
    return user.addresses;
};

export const setDefaultUserAddress = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const address = user.addresses.id(addressId);
    if (!address) throw new Error("Address not found");

    user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;

    await user.save();
    return user.addresses;
};

// ===== WISHLIST =====
export const getUserWishlist = async (userId) => {
    const user = await User.findById(userId).populate("wishlist");
    if (!user) throw new Error("User not found");
    return user.wishlist || [];
};

export const toggleUserWishlist = async (userId, productId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const index = user.wishlist.findIndex(id => id.toString() === productId);
    let type = "";
    
    if (index === -1) {
        user.wishlist.push(productId);
        type = "added";
        // GHI LOG: THÊM
        user.activityLogs.push({
            action: "THÊM YÊU THÍCH",
            details: `Đã thêm sản phẩm (ID: ${productId}) vào danh sách yêu thích.`
        });
    } else {
        user.wishlist.splice(index, 1);
        type = "removed";
        // GHI LOG: XÓA
        user.activityLogs.push({
            action: "BỎ YÊU THÍCH",
            details: `Đã xóa sản phẩm (ID: ${productId}) khỏi danh sách yêu thích.`
        });
    }

    await user.save();
    return { wishlist: user.wishlist, type };
};

// --- ADMIN SỬA THÔNG TIN KHÁCH HÀNG ---
export const adminUpdateUser = async (id, updateData) => {
    const user = await User.findById(id).populate('role');
    if (!user) throw new Error("Không tìm thấy người dùng");

    if (updateData.email && updateData.email !== user.email) {
        const existingEmail = await User.findOne({ email: updateData.email });
        if (existingEmail) throw new Error("Email này đã được sử dụng bởi một tài khoản khác");
        user.email = updateData.email;
    }

    if (updateData.name) user.name = updateData.name;
    if (updateData.phone) user.phone = updateData.phone;
    
    // CẬP NHẬT ROLE (CẤP BẬC)
    if (updateData.role) {
        // Chặn hạ cấp Admin tối cao (Hardcode bảo vệ)
        if (user.role?.name === 'admin' && updateData.role !== 'admin') {
            throw new Error("Không thể giáng cấp Quản trị viên cấp cao!");
        }
        const targetRole = await Role.findOne({ name: updateData.role });
        if (targetRole) user.role = targetRole._id;
    }
    
    if (updateData.newPassword && updateData.newPassword.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(updateData.newPassword, salt);
    }

    await user.save();
    return user;
};

// --- ADMIN TẠO TÀI KHOẢN NHÂN VIÊN ---
export const createStaffService = async (data) => {
    // 1. Kiểm tra email
    const existingEmail = await User.findOne({ email: data.email });
    if (existingEmail) throw new Error("Email này đã tồn tại trong hệ thống");

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Tìm Role tương ứng (chỉ cho phép tạo admin, manager, staff)
    if (!['admin', 'manager', 'staff'].includes(data.role)) {
        throw new Error("Vai trò không hợp lệ");
    }
    const targetRole = await Role.findOne({ name: data.role });
    if (!targetRole) throw new Error(`Không tìm thấy Role: ${data.role} trong CSDL`);

    // 4. Tạo User
    const newUser = await User.create({
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: targetRole._id,
        status: 1,
        email_Verified: true // Nhân viên nội bộ coi như đã verified
    });

    return newUser;
};