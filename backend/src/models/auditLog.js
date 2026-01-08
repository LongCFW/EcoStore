import mongoose from "mongoose";
const schema = new mongoose.Schema({
    actorId: mongoose.Schema.Types.ObjectId,
    action: String,
    objectType: String,
    objectId: mongoose.Schema.Types.ObjectId,
    diff: Object,
    createdAt: Date
});
export default mongoose.model("AuditLog", schema);

