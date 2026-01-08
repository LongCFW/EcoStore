import mongoose from "mongoose";
const { Schema } = mongoose;

const VariantSchema = new Schema({
    sku: String,
    name: String,
    price_cents: Number,
    compareAtPriceCents: Number,
    stock: Number,
    weightGrams: Number,
    attributes: Object,
    is_active: Boolean
}, { _id: false });

const ImageSchema = new Schema({
    imageUrl: String,
    altText: String,
    position: Number
}, { _id: false });

const ProductSchema = new Schema({
    sku: String,
    name: String,
    slug: String,
    description: String,
    shortDescription: String,

    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },

    variants: [VariantSchema],
    images: [ImageSchema],

    is_active: Boolean,
    isFeatured: Boolean,
    meta: Object,

    createdAt: Date
});

export default mongoose.model("Product", ProductSchema);

