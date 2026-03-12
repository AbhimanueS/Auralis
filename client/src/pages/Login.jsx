import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#9fd6f5] flex flex-col md:flex-row">
      <div className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 text-center">
        <div className="w-full max-w-xl flex flex-col items-center">
          <img
            src="/hand-head.png"
            alt="Auralis mental wellness illustration"
            className="w-full max-w-[520px] h-auto"
            loading="lazy"
            draggable="false"
          />
          <div className="mt-6">
            
            <div className="mt-2 text-sm md:text-base text-gray-700/80">
              Protect your mind
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold text-sky-600 mb-6">Login now</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              />
              <Link to="/forgot-password" className="text-sm text-auralis-purple-dark mt-1 inline-block hover:underline">Forgot password ?</Link>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-auralis-purple-dark text-white font-medium hover:bg-auralis-purple disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <div className="mt-6 flex items-center gap-4">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-500 text-sm">OR</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            type="button"
            className="mt-4 w-full py-3 rounded-xl border border-sky-200 bg-sky-50 text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-sky-100"
          >
            <span className="text-lg">G</span> Sign in with Google
          </button>
          <p className="mt-6 text-center text-gray-600">
            Don&apos;t have an account? <Link to="/register" className="text-auralis-purple-dark font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
