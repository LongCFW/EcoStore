// src/models/category.js
import mongoose from "mongoose";
import slugify from "slugify"; // <--- Import thư viện vừa cài

const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true }, // Tên là bắt buộc và không trùng
    slug: { type: String, unique: true },                 // Slug để làm đẹp URL
    description: String,
    // Dành cho danh mục con (Ví dụ: Điện tử -> Điện thoại)
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null }, 
    imageUrl: String,
    isActive: { type: Boolean, default: true }            // Để ẩn hiện danh mục
}, { timestamps: true }); // Tự động tạo createdAt, updatedAt

// --- MIDDLEWARE CỦA MONGOOSE (HOOK) ---
// Trước khi lưu (save), tự động tạo slug từ name
CategorySchema.pre("save", function(next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model("Category", CategorySchema);