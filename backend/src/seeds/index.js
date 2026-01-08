import mongoose from "mongoose";
import dotenv from "dotenv";

import { seedRoles } from "./roles.seed.js";
import { seedUsers } from "./users.seed.js";
import { seedCategories } from "./categories.seed.js";
import { seedProducts } from "./products.seed.js";

dotenv.config();

const runSeeds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔗 MongoDB connected for seeding");

        const roles = await seedRoles();

        const rolesMap = {
            admin: roles.find(r => r.name === "admin"),
            staff: roles.find(r => r.name === "staff"),
            customer: roles.find(r => r.name === "customer")
        };

        await seedUsers(rolesMap);

        const categories = await seedCategories();
        await seedProducts(categories);

        console.log("🎉 SEEDING COMPLETED");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

runSeeds();

