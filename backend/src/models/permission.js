import mongoose from "mongoose";
const { Schema } = mongoose;

const PermissionSchema = new Schema({
    name: { type: String, unique: true },
    description: String
});

export default mongoose.model("Permission", PermissionSchema);

