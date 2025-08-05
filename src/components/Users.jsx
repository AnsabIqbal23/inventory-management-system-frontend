import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getUserById, deleteUser } from '@/services/API';
import { Button } from "@/components/ui/button";
import ToastManager from './ToastManager';
import { showBackendMessage } from '../utils/toast';
import Layout from './Layout';
import {
  Users as UsersIcon,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  User,
  Crown,
  Shield,
  RefreshCw,
  ArrowLeft,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2
} from "lucide-react";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Get user data from session storage for authentication
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const token = userData.token;
  const isAdmin = userData.roles?.includes('ROLE_ADMIN') || false;

  // Fetch all users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching all users with token:', token ? 'Present' : 'Missing');
      const response = await getAllUsers(token);
      console.log('Get all users response:', response);
      
      if (response && response.success !== false) {
        setUsers(Array.isArray(response) ? response : []);
        showBackendMessage({ success: true, message: 'Users loaded successfully' }, 'success');
      } else {
        console.error('Failed to fetch users:', response);
        showBackendMessage(response, 'error');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showBackendMessage({ success: false, message: 'Failed to load users' }, 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (userId) => {
    setUserDetailsLoading(true);
    try {
      console.log('Fetching user details for ID:', userId);
      const response = await getUserById(userId, token);
      console.log('Get user by ID response:', response);
      
      if (response && response.success !== false) {
        setSelectedUser(response);
        setShowUserDetails(true);
        showBackendMessage({ success: true, message: 'User details loaded' }, 'success');
      } else {
        console.error('Failed to fetch user details:', response);
        showBackendMessage(response, 'error');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      showBackendMessage({ success: false, message: 'Failed to load user details' }, 'error');
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleRefresh = () => {
    fetchAllUsers();
  };

  const handleViewDetails = (userId) => {
    fetchUserById(userId);
  };

  const handleCloseDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Deleting user with ID:', userId);
      const response = await deleteUser(userId, token);
      console.log('Delete user response:', response);
      
      if (response && response.success !== false) {
        showBackendMessage({ success: true, message: 'User deleted successfully' }, 'success');
        // Refresh the users list
        fetchAllUsers();
      } else {
        console.error('Failed to delete user:', response);
        showBackendMessage(response, 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showBackendMessage({ success: false, message: 'Failed to delete user' }, 'error');
    }
  };

  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
      (user.status && user.status.toLowerCase() === statusFilter.toLowerCase()) ||
      (statusFilter === 'active' && user.success === true) ||
      (statusFilter === 'inactive' && user.success === false);
    
    return matchesSearch && matchesStatus;
  });

  const isUserAdmin = (userRoles) => {
    return userRoles && Array.isArray(userRoles) && userRoles.includes('ROLE_ADMIN');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">You need administrator privileges to access this page.</p>
          <Button onClick={handleBackToDashboard} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout title="User Management">
      <ToastManager />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-slate-400 mt-1">Manage and view all system users</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/admin/add-user')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <User className="h-4 w-4 mr-2" />
              Add New User
            </Button>
            
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {!showUserDetails ? (
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl">
            {/* Search and Controls */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-slate-800/50 border border-slate-600/50 text-white px-4 py-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <UsersIcon className="h-4 w-4" />
                <span>{filteredUsers.length} users found</span>
              </div>
            </div>

            {/* Users List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-3 text-slate-300">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No Users Found</h3>
                <p className="text-slate-400">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No users available in the system.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.userId || user.id}
                    className="group relative rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                  >
                    {/* User Avatar and Badge */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg ${
                          isUserAdmin(user.roles) 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                            : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                        }`}>
                          {isUserAdmin(user.roles) ? (
                            <Crown className="h-6 w-6" />
                          ) : (
                            <User className="h-6 w-6" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {user.username || 'Unknown User'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isUserAdmin(user.roles)
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {isUserAdmin(user.roles) ? 'Admin' : 'User'}
                          </span>
                          {user.status && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.status.toLowerCase() === 'active'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : user.status.toLowerCase() === 'inactive'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : user.status.toLowerCase() === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : user.status.toLowerCase() === 'suspended'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                              {user.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Hash className="h-4 w-4 text-slate-400" />
                        <span>ID: {user.userId || user.id || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Mail className="h-4 w-4 text-blue-400" />
                        <span className="truncate">{user.email || 'No email'}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Phone className="h-4 w-4 text-green-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewDetails(user.userId || user.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-300 hover:from-blue-600/30 hover:to-indigo-600/30 hover:text-white transition-all duration-300"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteUser(user.userId || user.id)}
                        className="flex-1 bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 text-red-300 hover:from-red-600/30 hover:to-red-700/30 hover:text-white transition-all duration-300"
                        variant="outline"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* User Details Modal */
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <Button
                onClick={handleCloseDetails}
                variant="outline"
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </div>

            {userDetailsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-3 text-slate-300">Loading user details...</span>
              </div>
            ) : selectedUser ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400">Username</label>
                        <p className="text-white font-medium">{selectedUser.username || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">User ID</label>
                        <p className="text-white font-mono">{selectedUser.userId || selectedUser.id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Email</label>
                        <p className="text-white">{selectedUser.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Phone</label>
                        <p className="text-white">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      Account Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Status</span>
                        {selectedUser.status ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedUser.status.toLowerCase() === 'active'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : selectedUser.status.toLowerCase() === 'inactive'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : selectedUser.status.toLowerCase() === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : selectedUser.status.toLowerCase() === 'suspended'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                            {selectedUser.status.toLowerCase() === 'active' && <CheckCircle className="h-4 w-4 mr-1" />}
                            {selectedUser.status.toLowerCase() === 'inactive' && <XCircle className="h-4 w-4 mr-1" />}
                            {selectedUser.status.toLowerCase() === 'pending' && <Loader2 className="h-4 w-4 mr-1" />}
                            {selectedUser.status.toLowerCase() === 'suspended' && <XCircle className="h-4 w-4 mr-1" />}
                            {selectedUser.status}
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedUser.success
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {selectedUser.success ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Role</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          isUserAdmin(selectedUser.roles)
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {isUserAdmin(selectedUser.roles) ? (
                            <>
                              <Crown className="h-4 w-4 mr-1" />
                              Administrator
                            </>
                          ) : (
                            <>
                              <User className="h-4 w-4 mr-1" />
                              User
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  {/* Session Information */}
                  <div className="rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      Session Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400">Last Login Message</label>
                        <p className="text-white">{selectedUser.message || 'N/A'}</p>
                      </div>
                      {selectedUser.token && (
                        <div>
                          <label className="text-sm text-slate-400">Has Active Token</label>
                          <p className="text-green-300">Yes</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Information (if available) */}
                  {(selectedUser.location || selectedUser.city || selectedUser.state || selectedUser.country) && (
                    <div className="rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-400" />
                        Location Information
                      </h3>
                      <div className="space-y-3">
                        {selectedUser.location && (
                          <div>
                            <label className="text-sm text-slate-400">Address</label>
                            <p className="text-white">{selectedUser.location}</p>
                          </div>
                        )}
                        {selectedUser.city && (
                          <div>
                            <label className="text-sm text-slate-400">City</label>
                            <p className="text-white">{selectedUser.city}</p>
                          </div>
                        )}
                        {selectedUser.state && (
                          <div>
                            <label className="text-sm text-slate-400">State</label>
                            <p className="text-white">{selectedUser.state}</p>
                          </div>
                        )}
                        {selectedUser.country && (
                          <div>
                            <label className="text-sm text-slate-400">Country</label>
                            <p className="text-white">{selectedUser.country}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">User Not Found</h3>
                <p className="text-slate-400">Unable to load user details.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
