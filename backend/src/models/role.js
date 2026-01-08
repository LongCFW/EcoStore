import mongoose from "mongoose";
const { Schema } = mongoose;

const RoleSchema = new Schema({
    name: { type: String, unique: true },
    description: String,
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: "Permission"
    }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Role", RoleSchema);

