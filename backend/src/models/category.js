import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: String,
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    imageUrl: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

CategorySchema.pre("save", async function () {
    // Nếu tên (name) có thay đổi, cập nhật lại slug
    if (this.isModified("name")) {
        // Tạo slug từ tên (ví dụ: "Rau Củ" -> "rau-cu")
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    // Trong async function của Mongoose, không cần gọi next()
});

export default mongoose.model("Category", CategorySchema);