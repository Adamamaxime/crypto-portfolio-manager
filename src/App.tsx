import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthRequired } from './components/auth/AuthRequired';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { MainLayout } from './components/MainLayout';
import Community from './components/Community';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/community"
          element={
            <AuthRequired>
              <Community />
            </AuthRequired>
          } />
          <Route path="/" element={
            <AuthRequired>
              <MainLayout />
            </AuthRequired>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;