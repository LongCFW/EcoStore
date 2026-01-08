import bcrypt from "bcrypt";
import User from "../models/user.js";

export const seedUsers = async (rolesMap) => {
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
        {
            email: "admin@ecostore.com",
            password_hash: hashedPassword,
            name: "Admin",
            role: rolesMap.admin._id,
            email_Verified: true
        },
        {
            email: "customer@ecostore.com",
            password_hash: hashedPassword,
            name: "Customer",
            role: rolesMap.customer._id
        }
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded");
};

