import { useState } from 'react';
import api from '../api/axios';

const OPENING_MESSAGE = "Hey! How are you feeling today?";

function CompanionIcon({ className = 'w-8 h-8' }) {
  return (
    <div className={`flex-shrink-0 ${className}`} aria-hidden>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="10" cy="10" r="6" fill="#93c5fd" opacity="0.9" />
        <circle cx="22" cy="10" r="6" fill="#f9a8d4" opacity="0.9" />
        <path d="M7 22c0-4 2.5-6 6-6s6 2 6 6" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
        <path d="M19 22c0-4 2.5-6 6-6s6 2 6 6" stroke="#f9a8d4" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
        <ellipse cx="16" cy="18" rx="12" ry="4" fill="#c4b5fd" opacity="0.35" />
      </svg>
    </div>
  );
}

export default function AiCompanion() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError('');
    const userMessage = { role: 'user', text };
    setMessages((m) => [...m, userMessage]);
    setLoading(true);
    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));
      const { data } = await api.post('/api/ai/chat', {
        messages: [...history, { role: 'user', content: text }],
      });
      const reply = data.reply || "I'm here for you. How are you feeling right now?";
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <CompanionIcon className="w-9 h-9" />
        <h1 className="text-2xl font-semibold text-auralis-green-dark">MoodMate</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[480px] border border-sky-200 dark:border-gray-700">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'flex flex-row-reverse items-end gap-2' : 'flex items-end gap-2'}>
              {msg.role === 'assistant' && <CompanionIcon className="w-7 h-7 flex-shrink-0" />}
              <span
                className={`inline-block px-4 py-2.5 rounded-2xl max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-auralis-green/30 text-gray-800 dark:text-gray-200'
                    : 'bg-sky-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-2">
              <CompanionIcon className="w-7 h-7 flex-shrink-0" />
              <span className="inline-block px-4 py-2.5 rounded-2xl bg-sky-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                ...
              </span>
            </div>
          )}
        </div>
        {error && (
          <p className="px-4 pb-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <div className="p-4 border-t border-sky-100 dark:border-gray-700 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type your message here"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-auralis-green/50 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green disabled:opacity-60"
            aria-label="Send"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
