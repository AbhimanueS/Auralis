import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#9fd6f5] flex flex-col md:flex-row">
      {/* Left: Branding */}
      <div className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 text-center">
        <div className="max-w-xs">
          <div className="text-6xl mb-4">🧠</div>
          <p className="font-cursive text-4xl text-auralis-blue-dark">Auralis</p>
        </div>
      </div>

      {/* Right: Sign up form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Get Started</h1>
          <p className="text-gray-600 mb-6">Already have an account? <Link to="/login" className="text-auralis-purple-dark font-medium hover:underline">Login</Link></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-28 text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-28 text-sm font-medium text-gray-700">Date Of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="flex-1 px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-28 text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="flex-1 px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-28 text-sm font-medium text-gray-700">Email ID</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-28 text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="flex-1 px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-auralis-purple-dark text-white font-medium hover:bg-auralis-purple disabled:opacity-60"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
