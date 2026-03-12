import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Counselling from './pages/Counselling';
import AiCompanion from './pages/AiCompanion';
import CalmCorner from './pages/CalmCorner';
import MoodCheck from './pages/MoodCheck';
import Diary from './pages/Diary';
import Quizzes from './pages/Quizzes';
import Help from './pages/Help';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import Studymate from './pages/Studymate';
import Routine from './pages/Routine';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-sky-50"><div className="text-auralis-green-dark">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="mood" element={<MoodCheck />} />
        <Route path="diary" element={<Diary />} />
        <Route path="calm-corner" element={<CalmCorner />} />
        <Route path="studymate" element={<Studymate />} />
        <Route path="routine" element={<Routine />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="counselling" element={<Counselling />} />
        <Route path="ai-companion" element={<AiCompanion />} />
        <Route path="help" element={<Help />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
