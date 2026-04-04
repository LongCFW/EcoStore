import Category from "../models/category.js";

export const seedCategories = async () => {
    await Category.deleteMany();

    const categories = await Category.insertMany([
        {
            name: "Rau Củ Quả",
            slug: "rau-cu-qua",
            description: "Rau Củ Quả Tươi Sống",
            parentId: null,
            isActive: true,
            imageUrl: ""
        },
        {
            name: "Tươi Sống",
            slug: "tuoi-song",
            description: "Đồ Tươi Xanh - Sạch",
            parentId: null,
            isActive: true,
            imageUrl: ""
        },
        {
            name: "Thực Phẩm Khô",
            slug: "thuc-pham-kho",
            description: "Thực Phẩm Lành Mạnh",
            parentId: null,
            isActive: true,
            imageUrl: ""
        },
        {
            name: "Thực Phẩm Chế Biến",
            slug: "thuc-pham-che-bien",
            description: "Thực Phẩm Chế Biến Sẵn",
            parentId: null,
            isActive: true,
            imageUrl: ""
        },
        {
            name: "Đồ Uống",
            slug: "do-uong",
            description: "Đồ Uống Tự Nhiên",
            parentId: null,
            isActive: true,
            imageUrl: ""
        },
        {
            name: "Chăm Sóc Sức Khỏe",
            slug: "cham-soc-suc-khoe",
            description: "Sản Phẩm Chăm Sóc Sức Khỏe",
            parentId: null,
            isActive: true,
            imageUrl: ""
        }
    ]);

    console.log(`Categories seeded (${categories.length} categories)`);
    return categories;
};