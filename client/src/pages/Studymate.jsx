import { useMemo, useState } from 'react';
import api from '../api/axios';

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsText(file);
  });
}

export default function Studymate() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => text.trim().length >= 30, [text]);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const contents = await readTextFile(file);
      setText(contents);
    } catch (err) {
      setError(err?.message || 'Could not read file.');
    } finally {
      e.target.value = '';
    }
  };

  const summarize = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/api/studymate/overview', { text });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate overview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-auralis-green-dark mb-2">Studymate</h1>
      <p className="text-gray-700/80 dark:text-gray-300 mb-6">
        Paste your syllabus/exam portions (or upload a text file) and I&apos;ll generate a short overview and key topics.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Your syllabus</div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 dark:bg-gray-700 border border-sky-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:bg-sky-100 dark:hover:bg-gray-600 cursor-pointer">
              <span>Upload .txt</span>
              <input type="file" accept=".txt,.md,.text" className="hidden" onChange={onUpload} />
            </label>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: Unit 1: Matrices, Unit 2: Differential Equations, ... (or paste exam portions)"
            className="mt-3 w-full min-h-[320px] resize-y px-4 py-3 rounded-xl border border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
          />

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={summarize}
              disabled={!canSubmit || loading}
              className="px-5 py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green disabled:opacity-60"
            >
              {loading ? 'Generating…' : 'Get overview'}
            </button>
            <button
              type="button"
              onClick={() => {
                setText('');
                setError('');
                setResult(null);
              }}
              className="px-5 py-3 rounded-xl border border-sky-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-gray-700"
            >
              Clear
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {text.trim().length} chars (min 30)
            </span>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-700 p-5">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Overview</div>

          {!result && !loading && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Your summary will appear here.
            </div>
          )}

          {loading && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Thinking…
            </div>
          )}

          {result && (
            <div className="mt-4 space-y-5">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Short overview</div>
                <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{result.overview}</p>
              </div>

              {Array.isArray(result.keyTopics) && result.keyTopics.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Key topics</div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-800 dark:text-gray-200 list-disc pl-5">
                    {result.keyTopics.slice(0, 12).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.examFocus && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Exam focus</div>
                  <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{result.examFocus}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

