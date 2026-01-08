import Role from "../models/role.js";

export const seedRoles = async () => {
    const roles = [
        { name: "admin", description: "Administrator" },
        { name: "manager", description: "Management" },
        { name: "staff", description: "Staff" },
        { name: "customer", description: "Customer" }
    ];

    await Role.deleteMany();
    const insertedRoles = await Role.insertMany(roles);

    console.log("✅ Roles seeded");
    return insertedRoles;
};

