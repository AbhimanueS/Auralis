import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#e0f2f7] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-xl font-semibold text-auralis-green-dark mb-4">Forgot password</h1>
        <p className="text-gray-600 mb-6">Enter your email and we’ll send you a link to reset your password.</p>
        <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-sky-200 mb-4" />
        <button type="button" className="w-full py-3 rounded-xl bg-auralis-purple-dark text-white font-medium">Send reset link</button>
        <p className="mt-4 text-center"><Link to="/login" className="text-auralis-purple-dark">Back to Login</Link></p>
      </div>
    </div>
  );
}
