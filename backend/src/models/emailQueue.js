import mongoose from "mongoose";

const schema = new mongoose.Schema({
    toEmail: String,
    subject: String,
    body: String,
    status: String,
    attempts: Number,
    lastAttemptAt: Date,
    createdAt: Date
});
export default mongoose.model("EmailQueue", schema);

