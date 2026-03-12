import mongoose from 'mongoose';

const routineEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  sleepHours: { type: Number, min: 0, max: 24, default: null },
  makeBed: { type: Boolean, default: false },
  breakfast: { type: Boolean, default: false },
  school: { type: Boolean, default: false },
  lunch: { type: Boolean, default: false },
  drinkWater: { type: Boolean, default: false },
  dinner: { type: Boolean, default: false },
  study: { type: Boolean, default: false },
  aloneTime: { type: Boolean, default: false },
  familyTime: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
}, { timestamps: true });

routineEntrySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('RoutineEntry', routineEntrySchema);
