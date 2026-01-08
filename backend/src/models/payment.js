import mongoose from "mongoose";

const schema = new mongoose.Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    paymentMethod: String,
    transactionId: String,
    amountCents: Number,
    status: String,
    paidAt: Date,
    rawResponse: Object
});
export default mongoose.model("Payment", schema);

