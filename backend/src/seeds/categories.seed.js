import Category from "../models/category.js";

export const seedCategories = async () => {
    await Category.deleteMany();

    const categories = await Category.insertMany([
        {
            name: "Organic Food",
            slug: "organic-food",
            description: "Clean and organic products"
        },
        {
            name: "Eco Household",
            slug: "eco-household",
            description: "Eco-friendly household items"
        }
    ]);

    console.log("✅ Categories seeded");
    return categories;
};

