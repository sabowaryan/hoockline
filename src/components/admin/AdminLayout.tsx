import React, { ReactNode, useState, useCallback, memo } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut,
  Shield,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthWrapper';

interface AdminLayoutProps {
  children: ReactNode;
  user: User;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: Home,
    active: true
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: Users,
    badge: '12'
  },
  {
    id: 'orders',
    label: 'Commandes',
    icon: CreditCard,
    badge: '3'
  },
  {
    id: 'analytics',
    label: 'Analytiques',
    icon: TrendingUp
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings
  }
];

// Memoized sidebar component to prevent unnecessary re-renders
const Sidebar = memo(({ 
  sidebarOpen, 
  activeItem, 
  onItemClick, 
  onToggle, 
  user, 
  userProfile, 
  onSignOut 
}: {
  sidebarOpen: boolean;
  activeItem: string;
  onItemClick: (id: string) => void;
  onToggle: () => void;
  user: User;
  userProfile: any;
  onSignOut: () => void;
}) => (
  <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  }`}>
    {/* Sidebar Header - Fixed */}
    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-500">Clicklone</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Scrollable Navigation Area */}
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeItem === item.id
                ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-l-4 border-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 transition-colors ${
                activeItem === item.id ? 'text-purple-600' : 'text-gray-400'
              }`} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile Section - Fixed at bottom */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-medium">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 capitalize flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {userProfile?.role || 'admin'}
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  </div>
));

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const { userProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleItemClick = useCallback((id: string) => {
    setActiveItem(id);
    // Close mobile sidebar when item is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar
            sidebarOpen={true}
            activeItem={activeItem}
            onItemClick={handleItemClick}
            onToggle={toggleSidebar}
            user={user}
            userProfile={userProfile}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        onToggle={toggleSidebar}
        user={user}
        userProfile={userProfile}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden sm:block">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tableau de bord
                </h2>
                <p className="text-sm text-gray-500">
                  Gestion administrative de Clicklone
                </p>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    Admin
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}