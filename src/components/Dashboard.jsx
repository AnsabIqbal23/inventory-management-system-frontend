import React from 'react';
import Layout from './Layout';
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  User,
  Mail,
  Phone,
} from "lucide-react";

const Dashboard = () => {
  // Get user data from session storage
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const isAdmin = userData.roles?.includes('ROLE_ADMIN') || false;
  const userDetails = userData; // Extract user details directly from session storage

  return (
    <Layout title="Dashboard">
      <div className="p-4">
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-4 shadow-2xl">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h3>
          
          {/* Enhanced User Profile Section */}
          <div className="mb-8">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-800/30 via-slate-900/40 to-slate-950/50 border border-slate-700/30 p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-xl"></div>
              
              {userDetails ? (
                <div className="relative z-10">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b border-slate-700/30">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
                          <User className="h-8 w-8" />
                        </div>
                        {/* Online status indicator */}
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-slate-900 shadow-lg">
                          <div className="absolute inset-0.5 rounded-full bg-green-400 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                          {userDetails.username}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isAdmin 
                              ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30' 
                              : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {isAdmin ? '👑 Administrator' : '👤 User'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex justify-end">
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-sm text-green-300 font-medium">Online</span>
                        </div>
                        <p className="text-xs text-slate-400">Last active: Just now</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h6 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-400" />
                        Contact Info
                      </h6>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-blue-500/30 transition-all duration-300">
                          <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Email Address</p>
                            <p className="text-sm text-slate-200 truncate">{userDetails.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-green-500/30 transition-all duration-300">
                          <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Phone Number</p>
                            <p className="text-sm text-slate-200">{userDetails.phone || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-4">
                      <h6 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <User className="h-4 w-4 text-indigo-400" />
                        Account Details
                      </h6>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-indigo-500/30 transition-all duration-300">
                          <User className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">User ID</p>
                            <p className="text-sm text-slate-200 font-mono">{userDetails.userId}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-green-500/30 transition-all duration-300">
                          <div className={`h-4 w-4 rounded-full flex-shrink-0 ${userDetails.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Account Status</p>
                            <p className={`text-sm font-medium ${userDetails.success ? 'text-green-300' : 'text-red-300'}`}>
                              {userDetails.success ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Session Information */}
                    <div className="space-y-4">
                      <h6 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                        Session Info
                      </h6>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-purple-500/30 transition-all duration-300">
                          <BarChart3 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Last Login</p>
                            <p className="text-sm text-slate-200">{userDetails.message}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-blue-500/30 transition-all duration-300">
                          <div className={`h-4 w-4 rounded-full flex-shrink-0 ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Access Level</p>
                            <p className="text-sm text-slate-200">{isAdmin ? 'Full Access' : 'Standard Access'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800/50 text-slate-500 mx-auto mb-4">
                    <User className="h-10 w-10" />
                  </div>
                  <h5 className="text-lg font-semibold text-slate-300 mb-2">No User Data</h5>
                  <p className="text-slate-400">Please log in to view your profile information</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              Analytics Overview
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative rounded-2xl bg-gradient-to-br from-blue-600/10 via-blue-700/10 to-blue-800/20 border border-blue-500/20 p-6 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-all duration-300">
                      <Package className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-300/70 font-medium uppercase tracking-wider">Total Items</p>
                      <p className="text-3xl font-bold text-white group-hover:text-blue-100 transition-all duration-300">1,234</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-green-300">+12% from last month</span>
                  </div>
                </div>
              </div>
              
              <div className="group relative rounded-2xl bg-gradient-to-br from-emerald-600/10 via-emerald-700/10 to-emerald-800/20 border border-emerald-500/20 p-6 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-2xl group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-all duration-300">
                      <ShoppingCart className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-300/70 font-medium uppercase tracking-wider">Orders Today</p>
                      <p className="text-3xl font-bold text-white group-hover:text-emerald-100 transition-all duration-300">56</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-green-300">+8% from yesterday</span>
                  </div>
                </div>
              </div>
              
              <div className="group relative rounded-2xl bg-gradient-to-br from-orange-600/10 via-orange-700/10 to-orange-800/20 border border-orange-500/20 p-6 backdrop-blur-xl hover:border-orange-400/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-all duration-300">
                      <TrendingUp className="h-6 w-6 text-orange-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-orange-300/70 font-medium uppercase tracking-wider">Low Stock</p>
                      <p className="text-3xl font-bold text-white group-hover:text-orange-100 transition-all duration-300">23</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
                    <span className="text-xs text-red-300">Requires attention</span>
                  </div>
                </div>
              </div>
              
              <div className="group relative rounded-2xl bg-gradient-to-br from-violet-600/10 via-violet-700/10 to-violet-800/20 border border-violet-500/20 p-6 backdrop-blur-xl hover:border-violet-400/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-violet-500/20 group-hover:bg-violet-500/30 transition-all duration-300">
                      <Users className="h-6 w-6 text-violet-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-violet-300/70 font-medium uppercase tracking-wider">Active Users</p>
                      <p className="text-3xl font-bold text-white group-hover:text-violet-100 transition-all duration-300">89</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs text-green-300">Online now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Quick Actions */}
          <div className="mb-6">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Settings className="h-6 w-6 text-indigo-400" />
              Quick Actions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button className="group relative h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl text-base font-medium hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  Add New Item
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="group relative h-16 bg-slate-800/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-blue-500/50 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <BarChart3 className="h-5 w-5" />
                  View Reports
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="group relative h-16 bg-slate-800/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-indigo-500/50 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Settings className="h-5 w-5" />
                  Settings
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;