import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Boxes,
  Plus,
  List,
  TrendingUp,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  // Get user data from session storage
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const isAdmin = userData.roles?.includes('ROLE_ADMIN') || false;

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    navigate('/login');
  };

  const toggleExpanded = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Menu items for regular users
  const userMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/dashboard",
    },
    {
      title: "Inventory",
      icon: Package,
      items: [
        { title: "View Items", icon: List, url: "/inventory/view" },
        { title: "Add Item", icon: Plus, url: "/inventory/add" },
      ],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      url: "/orders",
    },
    {
      title: "Reports",
      icon: BarChart3,
      url: "/reports",
    },
  ];

  // Menu items for admin users
  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/dashboard",
    },
    {
      title: "Inventory",
      icon: Boxes,
      items: [
        { title: "All Items", icon: List, url: "/admin/inventory/all" },
        { title: "Add Item", icon: Plus, url: "/admin/inventory/add" },
        { title: "Categories", icon: Package, url: "/admin/categories" },
        { title: "Stock Alerts", icon: TrendingUp, url: "/admin/stock-alerts" },
      ],
    },
    {
      title: "Users",
      icon: Users,
      url: "/admin/users",
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      items: [
        { title: "All Orders", icon: List, url: "/admin/orders" },
        { title: "Pending", icon: Package, url: "/admin/orders/pending" },
      ],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      url: "/admin/analytics",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/admin/settings",
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50 flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex-shrink-0">
            <Package className="h-4 w-4" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col min-w-0 flex-1">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent truncate">
                Trackventory
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {isAdmin ? 'Admin Panel' : 'User Dashboard'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="truncate text-left flex-1">{item.title}</span>
                        <div className="flex-shrink-0">
                          {expandedItems[item.title] ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </div>
                      </>
                    )}
                  </button>
                  {sidebarOpen && expandedItems[item.title] && (
                    <div className="ml-5 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.url}
                          className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/30 rounded-lg transition-all duration-200"
                        >
                          <subItem.icon className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.url}
                  className={`flex items-center gap-2 px-2 py-2 text-sm rounded-lg transition-all duration-200 group ${
                    location.pathname === item.url 
                      ? 'text-white bg-slate-800/70 border border-blue-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-700/50">
        {sidebarOpen ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
                <User className="h-3 w-3" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">
                  {userData?.username || 'User'}
                </p>
                <p className="text-xs text-slate-400 capitalize truncate">
                  {isAdmin ? 'Admin' : 'User'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-500 h-8 text-xs"
            >
              <LogOut className="h-3 w-3" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <User className="h-3 w-3" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full p-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-500 h-8"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
