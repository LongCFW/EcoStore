import Product from "../models/product.js";

export const seedProducts = async (categories) => {
    await Product.deleteMany();

    const rauCuQua = categories.find(c => c.slug === "rau-cu-qua");
    const tuoiSong = categories.find(c => c.slug === "tuoi-song");
    const thucPhamKho = categories.find(c => c.slug === "thuc-pham-kho");
    const doUong = categories.find(c => c.slug === "do-uong");

    const products = [
        // ── Rau Củ Quả ──────────────────────────────────────────
        {
            name: "Cải Thìa Hữu Cơ Sunny Harvest",
            slug: "cai-thia-huu-co-sunny-harvest",
            sku: "PROD-001",
            description: "Cải thìa hữu cơ Sunny Harvest là loại rau xanh organic đóng gói tiện lợi, sạch và an toàn.",
            categoryId: rauCuQua._id,
            brand: "Sunny Harvest",
            is_active: true,
            isFeatured: false,
            price_cents: 19000,
            variants: [
                {
                    sku: "SUNNY-CAITHIA-250",
                    name: "250g",
                    price_cents: 19000,
                    stock: 50,
                    is_active: true
                },
                {
                    sku: "SUNNY-CAITHIA-500",
                    name: "500g",
                    price_cents: 38000,
                    stock: 50,
                    is_active: true
                }
            ],
            images: [
                {
                    imageUrl: "https://cdn.hstatic.net/products/200000423303/c_i_th_a_28c8ef4358c84db.jpg",
                    position: 0
                }
            ]
        },
        {
            name: "Cải Ngồng Hữu Cơ Sunny Harvest Organic",
            slug: "cai-ngong-huu-co-sunny-harvest-organic",
            sku: "PROD-002",
            description: "Cải ngồng hữu cơ Sunny Harvest là loại rau xanh organic đóng gói tiện lợi.",
            categoryId: rauCuQua._id,
            brand: "Sunny Harvest",
            is_active: true,
            isFeatured: false,
            price_cents: 19000,
            variants: [
                {
                    sku: "SUNNY-CAINGONG-250",
                    name: "250g",
                    price_cents: 19000,
                    stock: 48,
                    is_active: true
                },
                {
                    sku: "SUNNY-CAINGONG-500",
                    name: "500g",
                    price_cents: 38000,
                    stock: 50,
                    is_active: true
                }
            ],
            images: [
                {
                    imageUrl: "https://cdn.hstatic.net/products/200000423303/c_i_ng_ng_e504c3cb919b4a.jpg",
                    position: 0
                }
            ]
        },
        // ── Tươi Sống ────────────────────────────────────────────
        {
            name: "Cải Xanh Hữu Cơ Sunny Harvest",
            slug: "cai-xanh-huu-co-sunny-harvest",
            sku: "PROD-003",
            description: "Cải xanh hữu cơ sạch, tươi ngon, đóng gói tiện lợi.",
            categoryId: tuoiSong._id,
            brand: "Sunny Harvest",
            is_active: true,
            isFeatured: true,
            price_cents: 19000,
            variants: [
                {
                    sku: "SUNNY-CAIXANH-250",
                    name: "250g",
                    price_cents: 19000,
                    stock: 60,
                    is_active: true
                },
                {
                    sku: "SUNNY-CAIXANH-500",
                    name: "500g",
                    price_cents: 36000,
                    stock: 40,
                    is_active: true
                }
            ],
            images: [
                {
                    imageUrl: "https://cdn.hstatic.net/products/200000423303/c_i_xanh.jpg",
                    position: 0
                }
            ]
        },
        // ── Thực Phẩm Khô ────────────────────────────────────────
        {
            name: "Gạo Lứt Hữu Cơ",
            slug: "gao-lut-huu-co",
            sku: "PROD-004",
            description: "Gạo lứt hữu cơ nguyên cám, giàu dinh dưỡng, tốt cho sức khỏe.",
            categoryId: thucPhamKho._id,
            brand: "EcoStore",
            is_active: true,
            isFeatured: true,
            price_cents: 45000,
            variants: [
                {
                    sku: "GAOLUT-1KG",
                    name: "1kg",
                    price_cents: 45000,
                    stock: 100,
                    is_active: true
                },
                {
                    sku: "GAOLUT-2KG",
                    name: "2kg",
                    price_cents: 85000,
                    stock: 80,
                    is_active: true
                }
            ],
            images: [
                {
                    imageUrl: "https://cdn.hstatic.net/products/gao-lut-huu-co.jpg",
                    position: 0
                }
            ]
        },
        // ── Đồ Uống ──────────────────────────────────────────────
        {
            name: "Nước Ép Táo Organic",
            slug: "nuoc-ep-tao-organic",
            sku: "PROD-005",
            description: "Nước ép táo 100% tự nhiên, không đường, không chất bảo quản.",
            categoryId: doUong._id,
            brand: "EcoStore",
            is_active: true,
            isFeatured: false,
            price_cents: 35000,
            variants: [
                {
                    sku: "NUOCEPTAO-330ML",
                    name: "330ml",
                    price_cents: 35000,
                    stock: 200,
                    is_active: true
                },
                {
                    sku: "NUOCEPTAO-1L",
                    name: "1 lít",
                    price_cents: 89000,
                    stock: 100,
                    is_active: true
                }
            ],
            images: [
                {
                    imageUrl: "https://cdn.hstatic.net/products/nuoc-ep-tao.jpg",
                    position: 0
                }
            ]
        }
    ];

    await Product.insertMany(products);
    console.log(`Products seeded (${products.length} products)`);
};