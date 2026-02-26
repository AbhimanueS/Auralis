import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { sanitizeHtml, isHtml } from '../utils/sanitizeHtml';

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DiaryEntryContent({ text }) {
  if (!text) return null;
  if (isHtml(text)) {
    return (
      <div
        className="text-gray-800 dark:text-gray-200 prose prose-sm max-w-none diary-content"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
      />
    );
  }
  return <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{text}</p>;
}

export default function Diary() {
  const [diaryText, setDiaryText] = useState('');
  const [useRichText, setUseRichText] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deletingId, setDeletingId] = useState(null);
  const richTextRef = useRef(null);

  const fetchEntries = async () => {
    try {
      const res = await api.get('/api/entries?limit=30');
      const data = res?.data;
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const getDiaryContent = () => {
    if (useRichText && richTextRef.current) {
      return richTextRef.current.innerHTML.trim();
    }
    return diaryText.trim();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const content = getDiaryContent();
    if (!content) {
      setMessage({ type: 'error', text: 'Write something to save.' });
      return;
    }
    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      await api.post('/api/entries', {
        diaryText: content,
      });
      setMessage({ type: 'success', text: 'Entry saved.' });
      setDiaryText('');
      if (richTextRef.current) richTextRef.current.innerHTML = '';
      fetchEntries();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const applyFormat = (cmd) => {
    if (!useRichText || !richTextRef.current) return;
    document.execCommand(cmd, false, null);
    richTextRef.current.focus();
  };

  const handleDelete = async (entryId) => {
    if (!entryId) return;
    setDeletingId(entryId);
    try {
      await api.delete(`/api/entries/${entryId}`);
      setEntries((prev) => prev.filter((e) => e._id !== entryId));
    } catch {
      setMessage({ type: 'error', text: 'Could not delete entry.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-[60vh]">
      <h1 className="text-2xl font-semibold text-auralis-green-dark mb-2">Daily journal</h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Today&apos;s entry. Each save creates a single journal entry.</p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-sky-100 dark:border-gray-700">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Today&apos;s entry</label>
              <button
                type="button"
                onClick={() => setUseRichText((u) => !u)}
                className="text-xs text-auralis-green-dark hover:underline"
              >
                {useRichText ? 'Plain text' : 'Simple formatting'}
              </button>
            </div>
            {useRichText ? (
              <div className="border border-sky-200 dark:border-gray-600 rounded-xl overflow-hidden bg-sky-50/50 dark:bg-gray-700/50 focus-within:ring-2 focus-within:ring-auralis-green/50">
                <div className="flex gap-1 p-2 border-b border-sky-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                  <button type="button" onClick={() => applyFormat('bold')} className="px-3 py-1 rounded hover:bg-sky-100 dark:hover:bg-gray-600 font-bold text-sm text-gray-800 dark:text-gray-200" title="Bold">B</button>
                  <button type="button" onClick={() => applyFormat('italic')} className="px-3 py-1 rounded hover:bg-sky-100 dark:hover:bg-gray-600 italic text-sm text-gray-800 dark:text-gray-200" title="Italic">I</button>
                </div>
                <div
                  ref={richTextRef}
                  contentEditable
                  className="empty min-h-[180px] px-4 py-3 text-gray-800 dark:text-gray-200 outline-none [&_p]:mb-2 [&_p:last-child]:mb-0"
                  data-placeholder="Write what's on your mind..."
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.classList.toggle('empty', !el.textContent.trim());
                  }}
                />
              </div>
            ) : (
              <textarea
                value={diaryText}
                onChange={(e) => setDiaryText(e.target.value)}
                placeholder="Write what's on your mind..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-auralis-green/50 resize-y min-h-[180px]"
              />
            )}
          </div>

          {message.text && (
            <p className={`text-sm ${message.type === 'success' ? 'text-auralis-green-dark' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save entry'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Recent entries</h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No entries yet. Write above to create one.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry, index) => (
            <li key={entry._id || index} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-sky-100 dark:border-gray-700">
              <div className="flex items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <div className="flex items-center gap-2">
                  {entry.moodEmoji && <span>{entry.moodEmoji}</span>}
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(entry._id)}
                  disabled={deletingId === entry._id}
                  className="text-red-500 hover:text-red-700 hover:underline disabled:opacity-50 text-xs"
                >
                  {deletingId === entry._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              {entry.diaryText ? (
                <DiaryEntryContent text={entry.diaryText} />
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">Mood logged</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
