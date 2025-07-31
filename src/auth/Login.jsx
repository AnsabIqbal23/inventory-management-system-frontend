import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, userLogin } from "@/services/API";
import ToastManager from "../components/ToastManager";
import { showBackendMessage, showLoginErrorToast } from "../utils/toast";
import { initializeSession } from "../utils/sessionManager";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    password: "", 
    username: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("user");

  // Check for existing session data on component mount
  useEffect(() => {
    try {
      const userData = sessionStorage.getItem('userData');
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log("User already logged in:", parsedData);
        
        // Check if the session data is valid
        if (parsedData && parsedData.success) {
          // User is already logged in, redirect to dashboard
          console.log("Redirecting already logged in user to dashboard...");
          navigate('/dashboard');
          return;
        } else {
          // Clear invalid session data
          sessionStorage.removeItem('userData');
          console.log("Cleared invalid session data");
        }
      }
    } catch (error) {
      // Clear corrupted session data
      sessionStorage.removeItem('userData');
      console.log("Cleared corrupted session data:", error);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === "user") {
        console.log("Attempting user login with:", { username: formData.username, password: "***" });
        const response = await userLogin(formData.username, formData.password);
        console.log("User login response:", response);
        
        // Check if login was successful
        if (response && response.success) {
          // Store only userData in session storage
          sessionStorage.setItem('userData', JSON.stringify(response));
          console.log('User login successful, stored data:', response);
          
          // Initialize session tracking
          initializeSession();
          
          // Display backend success message
          showBackendMessage(response, 'success');
          
          // Redirect to dashboard after successful login
          console.log('Redirecting to dashboard in 500ms...');
          setTimeout(() => {
            console.log('Navigating to dashboard now...');
            navigate('/dashboard');
          }, 500);
        } else {
          // Display backend error message
          showBackendMessage(response, 'error');
        }
        
      } else {
        console.log("Attempting admin login with:", { username: formData.username, password: "***" });
        const response = await adminLogin(formData.username, formData.password);
        console.log("Admin login response:", response);
        
        // Check if login was successful
        if (response && response.success) {
          // Store only userData in session storage
          sessionStorage.setItem('userData', JSON.stringify(response));
          console.log('Admin login successful, stored data:', response);
          
          // Initialize session tracking
          initializeSession();
          
          // Display backend success message
          showBackendMessage(response, 'success');
          
          // Redirect to dashboard after successful login
          console.log('Redirecting to dashboard in 500ms...');
          setTimeout(() => {
            console.log('Navigating to dashboard now...');
            navigate('/dashboard');
          }, 500);
        } else {
          // Display backend error message
          showBackendMessage(response, 'error');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      showLoginErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const clearSessionData = () => {
    try {
      sessionStorage.removeItem('userData');
      console.log("Session data cleared");
    } catch (error) {
      console.log("Error clearing session data:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 px-4 font-sans relative overflow-hidden">
      {/* Custom Toast Manager */}
      <ToastManager />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-white p-6 rounded-2xl shadow-2xl relative z-10 transform hover:scale-105 transition-all duration-300">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight mb-2">
            Trackventory
          </h1>
          <p className="text-slate-300 font-medium">
            Keep your stock smartly tracked 🚀
          </p>
        </div>

        {/* Tab Trigger */}
        <div className="mb-4">
          <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-slate-600/50">
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "user"
                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-lg border border-blue-400/30 backdrop-blur-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "admin"
                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-lg border border-blue-400/30 backdrop-blur-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              {activeTab === "user" ? "Username" : "Admin Username"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="username"
                placeholder={activeTab === "user" ? "Enter your username" : "Enter admin username"}
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-slate-400 hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-slate-400 hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-slate-300">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {activeTab === "user" ? "Signing in..." : "Admin signing in..."}
              </div>
            ) : (
              activeTab === "user" ? "Sign In" : "Admin Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <button
              onClick={handleSignupClick}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
