import mongoose from "mongoose";

const schema = new mongoose.Schema({
    variantId: mongoose.Schema.Types.ObjectId,
    changeQty: Number,
    reason: String,
    refTable: String,
    refId: mongoose.Schema.Types.ObjectId,
    createdBy: mongoose.Schema.Types.ObjectId,
    createdAt: Date
});
export default mongoose.model("InventoryTransaction", schema);

