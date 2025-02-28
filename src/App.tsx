import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthRequired } from './components/auth/AuthRequired';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { MainLayout } from './components/MainLayout';
import Community from './components/Community';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected Routes */}
          <Route
            path="/community"
            element={
              <AuthRequired fallback={<LoadingSpinner />}>
                <Community />
              </AuthRequired>
            }
          />
          <Route
            path="/"
            element={
              <AuthRequired fallback={<LoadingSpinner />}>
                <MainLayout />
              </AuthRequired>
            }
          />

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;