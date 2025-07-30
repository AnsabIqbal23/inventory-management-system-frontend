import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = sessionStorage.getItem('userData');
        console.log('ProtectedRoute: Checking userData from sessionStorage:', userData);
        
        if (!userData) {
          console.log('ProtectedRoute: No userData found, redirecting to login');
          navigate('/login');
          return;
        }

        const parsedData = JSON.parse(userData);
        console.log('ProtectedRoute: Parsed userData:', parsedData);
        
        if (!parsedData || !parsedData.success) {
          console.log('ProtectedRoute: Invalid userData structure, redirecting to login');
          sessionStorage.removeItem('userData');
          navigate('/login');
          return;
        }

        console.log('ProtectedRoute: Authentication successful, allowing access');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('ProtectedRoute: Error checking authentication:', error);
        sessionStorage.removeItem('userData');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
};

export default ProtectedRoute; 