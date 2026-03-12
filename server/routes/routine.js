import express from 'express';
import RoutineEntry from '../models/RoutineEntry.js';

const router = express.Router();

const ACTIVITY_KEYS = [
  'makeBed', 'breakfast', 'school', 'lunch', 'drinkWater',
  'dinner', 'study', 'aloneTime', 'familyTime',
];
const POINTS_PER_ACTIVITY = 10;

function getSleepPoints(hours) {
  if (hours == null || hours === '') return 0;
  const h = Number(hours);
  if (h >= 7 && h <= 9) return 15;
  if (h >= 6 && h < 7) return 10;
  if (h > 9 && h <= 10) return 10;
  if (h >= 5 && h < 6) return 5;
  if (h > 10 && h <= 11) return 5;
  return 0;
}

function computePoints(payload) {
  let total = 0;
  total += getSleepPoints(payload.sleepHours);
  ACTIVITY_KEYS.forEach((key) => {
    if (payload[key]) total += POINTS_PER_ACTIVITY;
  });
  return total;
}

function todayDateStr() {
  return new Date().toISOString().slice(0, 10);
}

// GET /api/routine — get today's entry + total points + streak
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const date = req.query.date || todayDateStr();

    const today = await RoutineEntry.findOne({ user: userId, date }).lean();

    const allEntries = await RoutineEntry.find({ user: userId })
      .sort({ date: -1 })
      .limit(365)
      .lean();

    let totalPoints = 0;
    const datesByDesc = [];
    allEntries.forEach((e) => {
      totalPoints += e.points || 0;
      datesByDesc.push(e.date);
    });

    let streak = 0;
    const sortedDates = [...new Set(datesByDesc)].sort((a, b) => b.localeCompare(a));
    const todayStr = todayDateStr();
    let expected = todayStr;
    for (const d of sortedDates) {
      if (d !== expected) break;
      streak += 1;
      expected = new Date(new Date(d).getTime() - 86400000).toISOString().slice(0, 10);
    }

    res.json({
      entry: today || null,
      totalPoints,
      streak,
      date,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch routine' });
  }
});

// POST /api/routine — upsert today's routine
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const date = req.query.date || todayDateStr();
    const body = req.body || {};

    const payload = {
      sleepHours: body.sleepHours != null ? Number(body.sleepHours) : null,
      makeBed: Boolean(body.makeBed),
      breakfast: Boolean(body.breakfast),
      school: Boolean(body.school),
      lunch: Boolean(body.lunch),
      drinkWater: Boolean(body.drinkWater),
      dinner: Boolean(body.dinner),
      study: Boolean(body.study),
      aloneTime: Boolean(body.aloneTime),
      familyTime: Boolean(body.familyTime),
    };
    payload.points = computePoints(payload);

    const entry = await RoutineEntry.findOneAndUpdate(
      { user: userId, date },
      { $set: payload },
      { new: true, upsert: true }
    ).lean();

    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to save routine' });
  }
});

export default router;
