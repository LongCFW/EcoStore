import bcrypt from "bcrypt";
import User from "../models/user.js";

export const seedUsers = async (rolesMap) => {
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
        {
            email: "admin@ecostore.com",
            password_hash: hashedPassword,
            name: "Bảo Long",
            phone: "0979797979",
            role: rolesMap.admin._id,
            status: 1,
            email_Verified: true,
            wishlist: [],
            addresses: [
                {
                    fullName: "Bảo Long",
                    phone: "0979797979",
                    addressLine: "78/2",
                    city: "Tân Phú",
                    province: "HCM",
                    isDefault: true
                }
            ],
            cart: [],
            activityLogs: []
        },
        {
            email: "staff@ecostore.com",
            password_hash: hashedPassword,
            name: "Nhân Viên",
            phone: "0911111111",
            role: rolesMap.staff._id,
            status: 1,
            email_Verified: true,
            wishlist: [],
            addresses: [],
            cart: [],
            activityLogs: []
        },
        {
            email: "customer@ecostore.com",
            password_hash: hashedPassword,
            name: "Khách Hàng",
            phone: "0922222222",
            role: rolesMap.customer._id,
            status: 1,
            email_Verified: true,
            wishlist: [],
            addresses: [
                {
                    fullName: "Khách Hàng",
                    phone: "0922222222",
                    addressLine: "123 Nguyễn Văn A",
                    city: "Quận 1",
                    province: "HCM",
                    isDefault: true
                }
            ],
            cart: [],
            activityLogs: []
        }
    ];

    await User.insertMany(users);
    console.log(`Users seeded (${users.length} users)`);
    console.log("admin@ecostore.com / 123456");
    console.log("staff@ecostore.com / 123456");
    console.log("customer@ecostore.com / 123456");
};