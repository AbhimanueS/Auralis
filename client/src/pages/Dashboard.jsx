import { Link } from 'react-router-dom';

const cards = [
  { to: '/mood', title: 'Mood checking', emoji: '🧠', desc: 'Track how you feel' },
  { to: '/calm-corner', title: 'Calm Corner', emoji: '🌿', desc: 'Breathe and relax' },
  { to: '/quizzes', title: 'Quizzes', emoji: '📋', desc: 'Reflect and learn' },
  { to: '/counselling', title: 'Counselling', emoji: '💬', desc: 'Book an appointment' },
];

export default function Dashboard() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: Let's talk about mental health */}
      <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-lg overflow-hidden flex items-center justify-center min-h-[600px] p-8">
        <div className="text-center">
          <div className="text-5xl md:text-6xl mb-4">🧠</div>
          <h2 className="text-xl md:text-2xl font-bold text-auralis-green-dark leading-tight">
            AURALIS
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Your space to reflect and grow.</p>
        </div>
      </div>

      {/* Right: 4 feature cards */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map(({ to, title, emoji, desc }) => (
          <Link
            key={to}
            to={to}
            className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col items-center justify-center p-6 min-h-[140px] border border-sky-100 dark:border-gray-700"
          >
            <span className="text-4xl mb-2">{emoji}</span>
            <h3 className="font-semibold text-auralis-green-dark text-center">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
