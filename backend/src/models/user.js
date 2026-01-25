import mongoose from "mongoose";
const { Schema } = mongoose;

const AddressSchema = new Schema({
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
    isDefault: Boolean
}, { _id: false });

const UserSchema = new Schema({
    email: { type: String, unique: true },
    password_hash: String,
    name: String,
    phone: String,
    avatarUrl: String,

    role: { type: Schema.Types.ObjectId, ref: "Role" },
    status: { type: Number, default: 1 },

    addresses: [AddressSchema],    
    wishlist: [{ type: Schema.Types.ObjectId }],

    googleId: String,
    email_Verified: Boolean,
    lastLoginAt: Date,
    metadata: Object,

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);

