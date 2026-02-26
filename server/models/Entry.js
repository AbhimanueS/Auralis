import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: Number, min: 1, max: 5 }, // 1-5 scale; optional if only diary
  moodEmoji: { type: String }, // optional emoji key
  tags: [{ type: String, trim: true }],
  diaryText: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

entrySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Entry', entrySchema);
