import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  expiresAt: { type: Date }, // optional bonus
});

export default mongoose.model("Url", urlSchema);
