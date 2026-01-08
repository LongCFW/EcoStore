import Product from "../models/product.js";

export const seedProducts = async (categories) => {
    await Product.deleteMany();

    const organicCategory = categories.find(
        c => c.slug === "organic-food"
    );

    const products = [
        {
            name: "Organic Brown Rice",
            slug: "organic-brown-rice",
            sku: "RICE-001",
            categoryId: organicCategory._id,
            is_active: true,
            variants: [
                {
                    sku: "RICE-001-1KG",
                    price_cents: 50000,
                    stock: 100,
                    attributes: { weight: "1kg" }
                }
            ]
        }
    ];

    await Product.insertMany(products);
    console.log("✅ Products seeded");
};

