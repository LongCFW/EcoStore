import mongoose from "mongoose";
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: String,
    slug: { type: String, unique: true },
    description: String,
    parentId: { type: Schema.Types.ObjectId, ref: "Category" },
    imageUrl: String,
    createdAt: Date
});

export default mongoose.model("Category", CategorySchema);

