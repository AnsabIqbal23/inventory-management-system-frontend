import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import AddNewUser from './components/AddNewUser';
import Settings from './components/Settings';
import Store from './components/Store';
import { validateSession, setupSessionMonitoring, setupActivityListeners } from './utils/sessionManager';
import './App.css';

// Protected Route Component with Session Management
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Validate session on component mount
    if (!validateSession(navigate)) {
      return;
    }
    
    // Set up session monitoring
    const monitoringInterval = setupSessionMonitoring(navigate);
    
    // Set up activity listeners
    const cleanupActivityListeners = setupActivityListeners();
    
    // Cleanup on unmount
    return () => {
      clearInterval(monitoringInterval);
      cleanupActivityListeners();
    };
  }, [navigate]);
  
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
          <Route 
            path="/admin/add-user" 
            element={
              <ProtectedRoute>
                <AddNewUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stores" 
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
