import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '@/services/API';
import { Button } from "@/components/ui/button";
import { showBackendMessage } from '../utils/toast';
import ToastManager from './ToastManager';
import Layout from './Layout';
import {
  Settings as SettingsIcon,
  Lock,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Shield,
  User,
  Key
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentpassword: "",
    newpassword: "",
    confirmpassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get user data from session storage
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const token = userData.token;
  const isAdmin = userData.roles?.includes('ROLE_ADMIN') || false;

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newpassword !== passwordData.confirmpassword) {
      showBackendMessage({ success: false, message: "New passwords do not match" }, 'error');
      return;
    }

    if (passwordData.newpassword.length < 6) {
      showBackendMessage({ success: false, message: "New password must be at least 6 characters long" }, 'error');
      return;
    }

    if (passwordData.currentpassword === passwordData.newpassword) {
      showBackendMessage({ success: false, message: "New password must be different from current password" }, 'error');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Updating password...');
      const response = await updatePassword(
        passwordData.currentpassword,
        passwordData.newpassword,
        passwordData.confirmpassword,
        token
      );
      console.log('Update password response:', response);

      if (response && response.success !== false) {
        showBackendMessage({ success: true, message: 'Password updated successfully' }, 'success');
        setPasswordData({
          currentpassword: "",
          newpassword: "",
          confirmpassword: ""
        });
      } else {
        showBackendMessage(response, 'error');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showBackendMessage({ success: false, message: 'Failed to update password' }, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <ToastManager />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                <SettingsIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-slate-400">Manage your account preferences</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-md ${
              isAdmin 
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-600'
            }`}>
              {isAdmin ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{userData.username || 'User'}</p>
              <p className="text-xs text-slate-400">{isAdmin ? 'Administrator' : 'User'}</p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl">
            {/* Change Password Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-md">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Change Password</h2>
                  <p className="text-slate-400 text-sm">Update your account password</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentpassword"
                      value={passwordData.currentpassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newpassword"
                      value={passwordData.newpassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmpassword"
                      value={passwordData.confirmpassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Confirm your new password"
                      required
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

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Password...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Password Requirements:</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Minimum 6 characters long</li>
                <li>• Must be different from your current password</li>
                <li>• New password and confirmation must match</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
