import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

// Schema cho biến thể (Ví dụ: Size M, Màu Đỏ)
const VariantSchema = new Schema({
    sku: String,
    name: String,
    price_cents: Number,
    compareAtPriceCents: Number, // Giá gốc (để gạch đi khi giảm giá)
    stock: Number,
    weightGrams: Number,
    attributes: Object, // { color: "Red", size: "M" }
    is_active: { type: Boolean, default: true }
}, { _id: true }); // _id: true để mỗi variant có ID riêng, dễ quản lý giỏ hàng

// Schema cho hình ảnh
const ImageSchema = new Schema({
    imageUrl: String,
    altText: String,
    position: { type: Number, default: 0 }
}, { _id: false });

const ProductSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    sku: { type: String, unique: true }, // Mã sản phẩm chung
    
    description: String,
    shortDescription: String,

    // Liên kết với Category
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    variants: [VariantSchema],
    images: [ImageSchema],

    price_cents: { type: Number, required: true }, // Giá hiển thị mặc định
    is_active: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }, // Sản phẩm nổi bật
    
    meta: Object, // Chứa các thông tin SEO thêm nếu cần
}, { timestamps: true }); // Tự động có createdAt, updatedAt

// --- HOOK TẠO SLUG TỰ ĐỘNG ---
ProductSchema.pre("save", async function() {
    // Nếu tên thay đổi, cập nhật slug
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    // Logic: Nếu chưa có SKU, tự động sinh SKU ngẫu nhiên (Optional)
    if (!this.sku) {
        this.sku = `PROD-${Date.now()}`;
    }
});

export default mongoose.model("Product", ProductSchema);