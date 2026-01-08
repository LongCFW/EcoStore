import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    orderNumber: String,

    items: [{
        variantId: Schema.Types.ObjectId,
        productSnapshot: Object,
        quantity: Number,
        unitPriceCents: Number,
        totalPriceCents: Number
    }],

    statusHistory: [{
        status: String,
        note: String,
        changedAt: Date
    }],

    coupons: [{
        couponId: Schema.Types.ObjectId,
        appliedAmountCents: Number
    }],

    totalCents: Number,
    paymentStatus: String,
    placedAt: Date,
    closedAt: Date,

    createdAt: Date
});

export default mongoose.model("Order", OrderSchema);

