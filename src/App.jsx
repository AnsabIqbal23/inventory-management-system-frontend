import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userData = sessionStorage.getItem('userData');
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const parsedData = JSON.parse(userData);
    if (!parsedData || !parsedData.success) {
      sessionStorage.removeItem('userData');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    sessionStorage.removeItem('userData');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
