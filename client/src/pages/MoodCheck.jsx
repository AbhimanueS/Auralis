import { useState } from 'react';
import api from '../api/axios';

const moods = [
  { value: 1, emoji: '1️', label: 'Very low' },
  { value: 2, emoji: '2', label: 'Low' },
  { value: 3, emoji: '3', label: 'Okay' },
  { value: 4, emoji: '4', label: 'Good' },
  { value: 5, emoji: '5', label: 'Great' },
  
];

export default function MoodCheck() {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async () => {
    if (selected == null) {
      setMessage({ type: 'error', text: 'Please select a mood.' });
      return;
    }
    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      await api.post('/api/entries', {
        mood: selected,
        moodEmoji: moods.find((m) => m.value === selected)?.emoji,
        diaryText: note.trim(),
      });
      setMessage({ type: 'success', text: 'Mood saved.' });
      setNote('');
      setSelected(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-auralis-green-dark mb-6">Mood checking</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <p className="text-gray-600">How are you feeling right now?</p>
        <p className="text-gray-600">1-extreme sad, 5-extreme happy</p>
        <div className="flex flex-wrap gap-3">
          {moods.map(({ value, emoji, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={`p-4 rounded-xl border-2 text-2xl transition-colors ${selected === value ? 'border-auralis-green-dark bg-auralis-green/20' : 'border-sky-200 hover:border-auralis-green/50'}`}
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
          />
        </div>
        {message.text && (
          <p className={`text-sm ${message.type === 'success' ? 'text-auralis-green-dark' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save mood'}
        </button>
      </div>
    </div>
  );
}
