import mongoose from "mongoose";
const { Schema } = mongoose;

const CouponSchema = new Schema({
    code: { type: String, unique: true },
    type: String,
    value: Number,
    minOrderCents: Number,
    usageLimit: Number,
    usedCount: Number,
    startsAt: Date,
    endsAt: Date,
    appliesToCategoryIds: [Schema.Types.ObjectId],
    createdAt: Date
});

export default mongoose.model("Coupon", CouponSchema);

