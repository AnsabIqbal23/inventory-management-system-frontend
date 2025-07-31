import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin, registerUser } from "@/services/API";
import Layout from './Layout';
import ToastManager from "./ToastManager";
import { showBackendMessage, showLoginErrorToast } from "../utils/toast";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Lock,
  UserPlus,
  Crown,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";

const AddNewUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    city: "",
    state: "",
    country: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("user");

  // Get current user data for authorization check
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const isAdmin = userData.roles?.includes('ROLE_ADMIN') || false;

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showLoginErrorToast(new Error("Passwords do not match"));
      setIsLoading(false);
      return;
    }

    try {
      let response;
      
      if (userType === "user") {
        console.log("Creating new user with:", { 
          username: formData.username, 
          email: formData.email, 
          userType: "Regular User"
        });
        response = await registerUser(
          formData.username, 
          formData.email, 
          formData.password, 
          formData.confirmPassword,
          formData.phone,
          formData.location,
          formData.city,
          formData.state,
          formData.country
        );
      } else {
        console.log("Creating new admin with:", { 
          username: formData.username, 
          email: formData.email, 
          userType: "Administrator"
        });
        response = await registerAdmin(
          formData.username, 
          formData.email, 
          formData.password, 
          formData.confirmPassword,
          formData.phone,
          formData.location,
          formData.city,
          formData.state,
          formData.country
        );
      }

      console.log("User creation response:", response);
      
      // Check if creation was successful
      if (response && response.success) {
        // Display backend success message
        showBackendMessage(response, 'success');
        
        // Clear form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          location: "",
          city: "",
          state: "",
          country: ""
        });
        
        // Navigate back to users page after successful creation
        setTimeout(() => {
          navigate('/admin/users');
        }, 2000);
      } else {
        // Display backend error message
        showBackendMessage(response, 'error');
      }
        
    } catch (error) {
      console.error("User creation error:", error);
      showLoginErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout title="Add New User">
      <ToastManager />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Add New User
              </h1>
              <p className="text-slate-400 mt-1">Create a new user or administrator account</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl">
            
            {/* User Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-400" />
                Account Type
              </h3>
              <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-slate-600/50">
                <button
                  type="button"
                  onClick={() => setUserType("user")}
                  className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    userType === "user"
                      ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-lg border border-blue-400/30 backdrop-blur-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/30"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Regular User
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    userType === "admin"
                      ? "bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white shadow-lg border border-purple-400/30 backdrop-blur-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/30"
                  }`}
                >
                  <Crown className="h-4 w-4" />
                  Administrator
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
                  Basic Information
                </h4>
                
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <User className="h-4 w-4 text-blue-400" />
                    Username <span className="text-red-400 text-xs">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Mail className="h-4 w-4 text-green-400" />
                    Email Address <span className="text-red-400 text-xs">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <Lock className="h-4 w-4 text-purple-400" />
                      Password <span className="text-red-400 text-xs">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter password"
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
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <Lock className="h-4 w-4 text-purple-400" />
                      Confirm Password <span className="text-red-400 text-xs">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
                  Contact Information
                </h4>
                
                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Phone className="h-4 w-4 text-emerald-400" />
                    Phone Number <span className="text-red-400 text-xs">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <MapPin className="h-4 w-4 text-orange-400" />
                    Location/Address <span className="text-red-400 text-xs">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter full address"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Location Details Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-2">
                  Location Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-slate-200">
                      <Building className="h-3 w-3 text-blue-400" />
                      City <span className="text-red-400 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-slate-200">
                      <MapPin className="h-3 w-3 text-indigo-400" />
                      State <span className="text-red-400 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-semibold text-slate-200">
                      <Globe className="h-3 w-3 text-emerald-400" />
                      Country <span className="text-red-400 text-xs">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 ${
                    userType === "admin" 
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500" 
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating {userType === "admin" ? "Administrator" : "User"}...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {userType === "admin" ? <Crown className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                      Create {userType === "admin" ? "Administrator" : "User"}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddNewUser;
