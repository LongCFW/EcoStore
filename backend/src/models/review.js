import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    variantId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    title: String,
    comment: String,
    isApproved: Boolean,
    createdAt: Date
});
export default mongoose.model("Review", schema);

