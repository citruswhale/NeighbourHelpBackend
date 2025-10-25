import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    provider: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    serviceName: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    contactInfo: {phone: { type: String }, email: { type: String }},
    workingHours: {start: { type: String }, end: { type: String }},
    photo: {type: String, default: ""},
    rating: {type: Number, default: 0},
    totalReviews: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Service", serviceSchema);
