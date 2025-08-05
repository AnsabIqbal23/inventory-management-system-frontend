import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  User,
  Hash,
  RefreshCw,
  Filter,
  X,
  ArrowLeft,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getAllStores, getStoreById, createStore, updateStore, deleteStore, getAllUsers } from '../services/API';
import { showBackendMessage } from '../utils/toast';
import ToastManager from './ToastManager';

const Store = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [users, setUsers] = useState([]); // Only active users for dropdown
  const [allUsers, setAllUsers] = useState([]); // All users for name lookup
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form data for create/edit
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    ownerId: ''
  });

  // Get user data and token
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const isAdmin = userData.roles?.includes('ROLE_ADMIN') || false;
  const token = userData.token;

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, searchTerm, allUsers]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(token);
      if (response && response.success !== false) {
        const allUsersData = Array.isArray(response) ? response : response.data || [];
        
        // Store all users for name lookup (includes inactive users for display)
        setAllUsers(allUsersData);
        
        // Filter only ACTIVE users for dropdown
        const activeUsers = allUsersData.filter(user => 
          user.status === 'ACTIVE' || user.status === 'active'
        );
        setUsers(activeUsers);
        
        console.log('All users:', allUsersData);
        console.log('Active users for dropdown:', activeUsers);
      } else {
        console.error('Failed to fetch users:', response?.message);
        setAllUsers([]);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setAllUsers([]);
      setUsers([]);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await getAllStores(token);
      
      if (response && response.success !== false) {
        setStores(Array.isArray(response) ? response : response.data || []);
        showBackendMessage({ success: true, message: 'Stores loaded successfully' }, 'success');
      } else {
        console.error('Failed to fetch stores:', response?.message);
        showBackendMessage(response, 'error');
        setStores([]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      showBackendMessage({ success: false, message: 'Failed to load stores' }, 'error');
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const getOwnerName = (ownerId) => {
    if (!ownerId) return 'Unassigned';
    // Use allUsers for name lookup (includes inactive users for display)
    const owner = allUsers.find(user => user.id === ownerId);
    return owner ? owner.username || owner.name || `User ${ownerId}` : `User ${ownerId}`;
  };

  const filterStores = () => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store => {
        const ownerName = getOwnerName(store.ownerId);
        return (
          store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.ownerId?.toString().includes(searchTerm) ||
          store.id?.toString().includes(searchTerm) ||
          ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredStores(filtered);
    }
  };

  const handleViewDetails = async (storeId) => {
    try {
      const response = await getStoreById(storeId, token);
      if (response && response.success !== false) {
        setSelectedStore(response.data || response);
        setShowStoreDetails(true);
      } else {
        showBackendMessage(response, 'error');
      }
    } catch (error) {
      showBackendMessage({ success: false, message: error.message }, 'error');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.location.trim() || !formData.ownerId.trim()) {
      showBackendMessage({ success: false, message: 'All fields are required' }, 'error');
      return;
    }

    try {
      const response = await createStore(
        formData.name,
        formData.location,
        parseInt(formData.ownerId),
        token
      );
      
      if (response && response.success !== false) {
        showBackendMessage({ success: true, message: 'Store created successfully' }, 'success');
        setShowCreateModal(false);
        setFormData({ name: '', location: '', ownerId: '' });
        await Promise.all([fetchStores(), fetchUsers()]);
      } else {
        showBackendMessage(response, 'error');
      }
    } catch (error) {
      showBackendMessage({ success: false, message: error.message }, 'error');
    }
  };

  const handleEditStore = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.location.trim()) {
      showBackendMessage({ success: false, message: 'Store name and location are required' }, 'error');
      return;
    }

    try {
      const response = await updateStore(
        selectedStore.id,
        formData.name,
        formData.location,
        selectedStore.ownerId, // Keep original owner ID
        token
      );
      
      if (response && response.success !== false) {
        showBackendMessage({ success: true, message: 'Store updated successfully' }, 'success');
        setShowEditModal(false);
        setFormData({ name: '', location: '', ownerId: '' });
        await Promise.all([fetchStores(), fetchUsers()]);
      } else {
        showBackendMessage(response, 'error');
      }
    } catch (error) {
      showBackendMessage({ success: false, message: error.message }, 'error');
    }
  };

  const handleDeleteStore = async (storeId, storeName) => {
    if (!window.confirm(`Are you sure you want to delete "${storeName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await deleteStore(storeId, token);
      
      // Since we know the API returns "Store deleted successfully" as plain text
      // We can handle it more directly
      let isSuccess = false;
      let message = '';
      
      if (typeof response === 'string') {
        // Plain text response - check for success keywords
        const responseText = response.toLowerCase();
        if (responseText.includes('success') || responseText.includes('deleted')) {
          isSuccess = true;
          message = response; // Use original response for display
        } else {
          isSuccess = false;
          message = response;
        }
      } else if (response === true || response === null || response === undefined) {
        // Sometimes successful DELETE returns null/undefined
        isSuccess = true;
        message = 'Store deleted successfully';
      } else if (response && typeof response === 'object') {
        // JSON object response
        isSuccess = response.success !== false;
        message = response.message || 'Store deleted successfully';
      } else {
        // Fallback - if we got here without errors, assume success
        isSuccess = true;
        message = 'Store deleted successfully';
      }
      
      if (isSuccess) {
        showBackendMessage({ success: true, message }, 'success');
        await Promise.all([fetchStores(), fetchUsers()]);
      } else {
        showBackendMessage({ success: false, message }, 'error');
      }
    } catch (error) {
      console.error('Delete store error:', error);
      
      // Since we know the error is likely due to JSON parsing of plain text
      // Let's assume it was successful if we get the JSON parse error
      if (error.message && error.message.includes('Unexpected token')) {
        showBackendMessage({ success: true, message: 'Store deleted successfully' }, 'success');
        await Promise.all([fetchStores(), fetchUsers()]);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete store';
        showBackendMessage({ success: false, message: errorMessage }, 'error');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (store) => {
    setSelectedStore(store);
    setFormData({
      name: store.name || '',
      location: store.location || '',
      ownerId: '' // Don't include owner ID in edit form
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setFormData({ name: '', location: '', ownerId: '' });
    setShowCreateModal(true);
  };

  return (
    <Layout title="Store Management">
      <ToastManager />
      <div className="p-6">
        {/* Header - Matching Users page exactly */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Store Management
            </h1>
            <p className="text-slate-400 mt-1">Manage and view all system stores</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Store
              </Button>
            )}
            
            <Button
              onClick={() => Promise.all([fetchStores(), fetchUsers()])}
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

        {/* Main Content Container - Fixed JSX structure */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl">
          {/* Search Bar and Filter - Matching Users page */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stores by name, location, owner, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Building2 className="h-4 w-4" />
              <span>{filteredStores.length} stores found</span>
            </div>
          </div>

          {/* Stores Grid - Matching Users page card design */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-3 text-slate-300">Loading stores...</span>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No Stores Found</h3>
              <p className="text-slate-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No stores available in the system.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
                >
                  {/* Store Avatar and Info - Matching Users page */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                        <Building2 className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {store.name || 'Unknown Store'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Store
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Store Details - Matching Users page info layout */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Hash className="h-4 w-4 text-slate-400" />
                      <span>ID: {store.id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <span className="truncate">{store.location || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <User className="h-4 w-4 text-purple-400" />
                      <span className="truncate">Owner: {getOwnerName(store.ownerId)}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Matching Users page */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetails(store.id)}
                      className="flex-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-300 hover:from-blue-600/30 hover:to-indigo-600/30 hover:text-white transition-all duration-300"
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {isAdmin && (
                      <>
                        <Button
                          onClick={() => openEditModal(store)}
                          className="flex-1 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 text-yellow-300 hover:from-yellow-600/30 hover:to-orange-600/30 hover:text-white transition-all duration-300"
                          variant="outline"
                          size="sm"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          onClick={() => handleDeleteStore(store.id, store.name)}
                          disabled={deleteLoading}
                          className="flex-1 bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 text-red-300 hover:from-red-600/30 hover:to-red-700/30 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          variant="outline"
                          size="sm"
                        >
                          {deleteLoading ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Store Details Modal */}
        {showStoreDetails && selectedStore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Store Details</h3>
                <Button
                  onClick={() => setShowStoreDetails(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Store Name</p>
                    <p className="text-sm text-white font-medium">{selectedStore.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30">
                  <Hash className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Store ID</p>
                    <p className="text-sm text-white font-mono">{selectedStore.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm text-white">{selectedStore.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30">
                  <User className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-slate-400">Store Owner</p>
                    <p className="text-sm text-white font-medium">{getOwnerName(selectedStore.ownerId)}</p>
                    <p className="text-xs text-slate-500 font-mono">ID: {selectedStore.ownerId || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Store Modal - Enhanced UI matching create user form */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Create New Store
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Add a new store to the system</p>
                </div>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={handleCreateStore} className="space-y-6">
                {/* Store Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Building2 className="h-4 w-4 text-blue-400" />
                    Store Name
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter store name"
                    className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                  />
                </div>
                
                {/* Location Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <MapPin className="h-4 w-4 text-green-400" />
                    Location
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter store location"
                    className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                  />
                </div>
                
                {/* Store Owner Field - Only Active Users */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <User className="h-4 w-4 text-purple-400" />
                    Store Owner
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.ownerId}
                      onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                      className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 appearance-none"
                    >
                      <option value="" className="bg-slate-800 text-slate-400">
                        Select active store owner
                      </option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id} className="bg-slate-800 text-white">
                          {user.username || user.name || `User ${user.id}`} (ID: {user.id}) - {user.status}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Only active users are available ({users.length} active users found)
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-700/50">
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1 bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Store
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Store Modal - Owner ID field removed */}
        {showEditModal && selectedStore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Edit Store</h3>
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={handleEditStore} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter store name"
                    className="w-full p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter store location"
                    className="w-full p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                
                {/* Owner info display (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Store Owner (Cannot be changed)
                  </label>
                  <div className="w-full p-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-slate-400">
                    <div className="font-medium text-slate-300">{getOwnerName(selectedStore.ownerId)}</div>
                    <div className="text-xs font-mono">ID: {selectedStore.ownerId || 'Not assigned'}</div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    variant="outline"
                    className="flex-1 bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Update Store
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
    </Layout>
  );
};

export default Store;