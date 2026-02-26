import { useState } from 'react';
import api from '../api/axios';

export default function AiCompanion() {
  const [messages, setMessages] = useState([]);
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
      const reply = data.reply || "I'm here. How can I support you today?";
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-auralis-green-dark mb-6">AI companion</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[480px] border border-sky-100 dark:border-gray-700">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !loading && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Say hello. I’m here to listen.</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
              <span
                className={`inline-block px-4 py-2 rounded-2xl max-w-[85%] ${
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
            <div className="text-left">
              <span className="inline-block px-4 py-2 rounded-2xl bg-sky-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
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
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-auralis-green/50 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
