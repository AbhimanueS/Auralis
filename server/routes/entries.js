import express from 'express';
import Entry from '../models/Entry.js';

const router = express.Router();

// POST /api/entries – create a new mood/diary entry (protected)
router.post('/', async (req, res) => {
  try {
    const { mood, moodEmoji, tags, diaryText } = req.body;
    const entry = await Entry.create({
      user: req.user._id,
      mood: mood != null ? Number(mood) : undefined,
      moodEmoji: moodEmoji || undefined,
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      diaryText: diaryText || '',
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create entry' });
  }
});

// GET /api/entries – list recent entries for the logged-in user (protected)
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const entries = await Entry.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch entries' });
  }
});

// DELETE /api/entries/:id – delete one entry (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ deleted: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete entry' });
  }
});

export default router;
