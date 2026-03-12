import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from './ErrorBoundary';

const STORAGE_KEY = 'auralis_dark_mode';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/diary', label: 'Diary' },
  { to: '/ai-companion', label: 'AI companion' },
  { to: '/studymate', label: 'Studymate' },
  { to: '/routine', label: 'Routine' },
  { to: '/help', label: 'Help' },
  { to: '/about', label: 'About' },
];

function getInitialDark() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialDark);
  const settingsRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Could route to search results later
    }
  };

  const handleLogout = () => {
    setSettingsOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#9fd6f5] dark:bg-gray-900 transition-colors">
      {/* Top header */}
      <header className="bg-white/90 dark:bg-gray-800/90 shadow-sm border-b border-sky-100 dark:border-gray-700 sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-auralis-green to-auralis-green-dark flex items-center justify-center text-white text-lg">🧠</div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">Welcome back, {user?.name || 'User'}</span>
          </div>
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="What're you looking for?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-lg bg-auralis-green-dark text-white font-medium hover:bg-auralis-green">Search</button>
          </form>
          <div className="flex items-center gap-2 relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen((o) => !o)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-gray-700"
              aria-label="Settings"
            >
              ⚙️
            </button>
            <button type="button" className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-gray-700" aria-label="Notifications">🔔</button>

            {settingsOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 py-1 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-sky-100 dark:border-gray-700 z-40">
                <div className="px-4 py-3 border-b border-sky-100 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark mode</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={darkMode}
                    onClick={() => setDarkMode((d) => !d)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${darkMode ? 'bg-auralis-green-dark' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform mt-0.5 ${darkMode ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 pb-2 flex items-center justify-between gap-2">
          <nav className="flex flex-wrap gap-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-auralis-green-dark text-white' : 'bg-sky-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-auralis-green/30 dark:hover:bg-gray-600'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="md:hidden p-2 rounded-lg bg-sky-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-3 flex flex-col gap-1 border-t border-sky-100 dark:border-gray-700 pt-2">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className="px-3 py-2 rounded-lg bg-sky-50 dark:bg-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>
                {label}
              </NavLink>
            ))}
            <button type="button" onClick={handleLogout} className="text-left px-3 py-2 rounded-lg text-red-600 dark:text-red-400">
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
