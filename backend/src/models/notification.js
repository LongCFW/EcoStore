import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    title: String,
    message: String,
    isRead: Boolean,
    metadata: Object,
    createdAt: Date
});
export default mongoose.model("Notification", schema);

