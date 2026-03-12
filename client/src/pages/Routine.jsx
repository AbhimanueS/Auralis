import { useState, useEffect } from 'react';
import api from '../api/axios';

const ACTIVITIES = [
  { key: 'makeBed', label: 'Make bed', emoji: '🛏️' },
  { key: 'breakfast', label: 'Breakfast', emoji: '🥣' },
  { key: 'school', label: 'School', emoji: '📚' },
  { key: 'lunch', label: 'Lunch', emoji: '🥗' },
  { key: 'drinkWater', label: 'Drink water', emoji: '💧' },
  { key: 'dinner', label: 'Dinner', emoji: '🍽️' },
  { key: 'study', label: 'Study', emoji: '✏️' },
  { key: 'aloneTime', label: 'Alone time', emoji: '🧘' },
  { key: 'familyTime', label: 'Family time', emoji: '👨‍👩‍👧' },
];

export default function Routine() {
  const [sleepHours, setSleepHours] = useState('');
  const [activities, setActivities] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const { data } = await api.get('/api/routine');
        setTotalPoints(data.totalPoints ?? 0);
        setStreak(data.streak ?? 0);
        const entry = data.entry;
        if (entry) {
          setSleepHours(entry.sleepHours != null ? String(entry.sleepHours) : '');
          const act = {};
          ACTIVITIES.forEach(({ key }) => {
            act[key] = Boolean(entry[key]);
          });
          setActivities(act);
          setTodayPoints(entry.points ?? 0);
        } else {
          const act = {};
          ACTIVITIES.forEach(({ key }) => { act[key] = false; });
          setActivities(act);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load routine');
      } finally {
        setLoading(false);
      }
    };
    fetchRoutine();
  }, []);

  const toggleActivity = (key) => {
    setActivities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        sleepHours: sleepHours.trim() === '' ? null : Number(sleepHours),
        ...activities,
      };
      const { data } = await api.post('/api/routine', payload);
      setTodayPoints(data.points ?? 0);
      const res = await api.get('/api/routine');
      setTotalPoints(res.data.totalPoints ?? 0);
      setStreak(res.data.streak ?? 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save routine');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-auralis-green-dark mb-6">Routine</h1>
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-auralis-green-dark mb-2">Routine</h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        Track your day. Check off what you did and log sleep — earn points and build your streak.
      </p>

      {/* Points & Streak */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-auralis-green-dark">{todayPoints}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Today&apos;s points</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-auralis-green-dark">{totalPoints}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total points</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 p-4 text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">🔥 {streak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Day streak</div>
        </div>
      </div>

      {/* Sleep */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Sleep schedule</h2>
        <div className="flex items-center gap-3">
          <span className="text-xl">😴</span>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            placeholder="Hours slept"
            className="w-28 px-4 py-2 rounded-xl border border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">hours (7–9 = max points)</span>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Activities</h2>
        <ul className="space-y-3">
          {ACTIVITIES.map(({ key, label, emoji }) => (
            <li key={key} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleActivity(key)}
                className={`flex-shrink-0 w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg transition-colors ${
                  activities[key]
                    ? 'bg-auralis-green border-auralis-green-dark text-white'
                    : 'border-sky-200 dark:border-gray-600 text-gray-400 hover:border-auralis-green/50'
                }`}
                aria-pressed={activities[key]}
                aria-label={label}
              >
                {activities[key] ? '✓' : emoji}
              </button>
              <span className="text-gray-800 dark:text-gray-200">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save routine'}
      </button>
    </div>
  );
}
