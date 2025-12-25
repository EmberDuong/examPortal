
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { LanguageProvider } from './i18n';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ExamDetailPage from './pages/ExamDetailPage';
import ExamScreen from './pages/ExamScreen';
import ResultPage from './pages/ResultPage';
import StudentResultsPage from './pages/StudentResultsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import CandidateManagement from './pages/CandidateManagement';
import QuestionManagement from './pages/QuestionManagement';
import ExamManagement from './pages/ExamManagement';
import ResultsManagement from './pages/ResultsManagement';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);

        // Determine role - handle both string ('admin') and enum (UserRole.ADMIN) formats
        let userRole = UserRole.STUDENT;
        if (userData.role === 'admin' || userData.role === UserRole.ADMIN) {
          userRole = UserRole.ADMIN;
        }

        // Convert stored data to User type
        const restoredUser: User = {
          id: userData._id || userData.id,
          name: userData.name,
          email: userData.email,
          role: userRole,
          avatar: userData.avatar || `https://i.pravatar.cc/150?u=${userData.email}`
        };

        console.log('Session restored:', restoredUser.name, 'Role:', restoredUser.role === UserRole.ADMIN ? 'admin' : 'student');
        setUser(restoredUser);
      } catch (e) {
        console.error('Error restoring user session:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Show loading spinner while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - Student */}
          <Route
            path="/dashboard"
            element={user?.role === UserRole.STUDENT ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/exam/:examId"
            element={user?.role === UserRole.STUDENT ? <ExamDetailPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/exam/:examId/start"
            element={user?.role === UserRole.STUDENT ? <ExamScreen user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/result"
            element={user?.role === UserRole.STUDENT ? <ResultPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/results"
            element={user?.role === UserRole.STUDENT ? <StudentResultsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user?.role === UserRole.STUDENT ? <ProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin"
            element={user?.role === UserRole.ADMIN ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/candidates"
            element={user?.role === UserRole.ADMIN ? <CandidateManagement user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/questions"
            element={user?.role === UserRole.ADMIN ? <QuestionManagement user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/exams"
            element={user?.role === UserRole.ADMIN ? <ExamManagement user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/results"
            element={user?.role === UserRole.ADMIN ? <ResultsManagement user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Catch All */}
          <Route path="*" element={<Navigate to={user ? (user.role === UserRole.ADMIN ? "/admin" : "/dashboard") : "/login"} />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
