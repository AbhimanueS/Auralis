import { Link } from 'react-router-dom';

const cards = [
  { to: '/mood', title: 'Mood checking', image: '/dashboard/mood.jpeg' },
  { to: '/calm-corner', title: 'Calm Corner', image: '/dashboard/calm.jpeg' },
  { to: '/quizzes', title: 'Quizzes', image: '/dashboard/quizzes.jpeg' },
  { to: '/counselling', title: 'Counselling', image: '/dashboard/coun.jpeg' },
];

export default function Dashboard() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: hero illustration */}
      <div> 
        <img
          src="/dashboard/letstalk.png"
          alt="Let's talk about mental health"
          className="w-full max-w-[620px] h-auto object-contain"
          loading="lazy"
          draggable="false"
        />
      </div>

      {/* Right: 4 feature cards */}
      <div className="grid grid-cols-2 gap-6">
        {cards.map(({ to, title, image }) => (
          <Link
            key={to}
            to={to}
            className="group relative rounded-2xl shadow-lg overflow-hidden border border-white/30 dark:border-gray-700 bg-white/20 dark:bg-gray-800/40 hover:shadow-xl transition-shadow"
          >
            <div className="relative aspect-[4/3] w-full">
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
                draggable="false"
              />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="text-white font-semibold text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
                  {title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
