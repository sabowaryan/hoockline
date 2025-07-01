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
  ChevronDown,
  BarChart3,
  Globe
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthWrapper';
import { Breadcrumb } from '../components/Breadcrumb';

interface AdminLayoutProps {
  children: ReactNode;
  user: User;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: Home,
    path: '/admin'
  },
  {
    id: 'traffic',
    label: 'Trafic',
    icon: BarChart3,
    path: '/admin/traffic',
    badge: 'Nouveau'
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: Users,
    path: '/admin/users',
    badge: '12'
  },
  {
    id: 'orders',
    label: 'Commandes',
    icon: CreditCard,
    path: '/admin/orders',
    badge: '3'
  },
  {
    id: 'analytics',
    label: 'Analytiques',
    icon: TrendingUp,
    path: '/admin/analytics'
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: Globe,
    path: '/admin/seo',
    badge: 'Nouveau'
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    path: '/admin/settings'
  }
];

// Get section info based on active item
const getSectionInfo = (activeItem: string) => {
  switch (activeItem) {
    case 'dashboard':
      return {
        title: 'Tableau de bord',
        description: 'Gestion administrative de Clicklone'
      };
    case 'traffic':
      return {
        title: 'Statistiques de trafic',
        description: 'Analyse du trafic et des performances du site'
      };
    case 'users':
      return {
        title: 'Gestion des utilisateurs',
        description: 'Administration des comptes et permissions'
      };
    case 'orders':
      return {
        title: 'Gestion des commandes',
        description: 'Suivi des transactions et paiements'
      };
    case 'analytics':
      return {
        title: 'Analytiques avancées',
        description: 'Rapports et statistiques détaillées'
      };
    case 'seo':
      return {
        title: 'Gestion SEO',
        description: 'Configuration des paramètres de référencement'
      };
    case 'settings':
      return {
        title: 'Paramètres système',
        description: 'Configuration de l\'application'
      };
    default:
      return {
        title: 'Administration',
        description: 'Gestion de Clicklone'
      };
  }
};

// Memoized sidebar component to prevent unnecessary re-renders
const Sidebar = memo(({ 
  activeItem, 
  onToggle, 
  user, 
  userProfile, 
  onSignOut,
  isMobile = false
}: {
  activeItem: string;
  onToggle: () => void;
  user: User;
  userProfile: any;
  onSignOut: () => void;
  isMobile?: boolean;
}) => {
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarItem) => {
    navigate(item.path);
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
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
        {isMobile && (
          <button
            onClick={onToggle}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
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
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.badge === 'Nouveau' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800 animate-pulse'
                }`}>
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
  );
});

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const { userProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active item based on current path
  const getActiveItem = () => {
    const currentPath = location.pathname;
    const item = sidebarItems.find(item => item.path === currentPath);
    return item ? item.id : 'dashboard';
  };

  const activeItem = getActiveItem();
  const sectionInfo = getSectionInfo(activeItem);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          activeItem={activeItem}
          onToggle={() => setSidebarOpen(false)}
          user={user}
          userProfile={userProfile}
          onSignOut={handleSignOut}
          isMobile={false}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar - Fixed */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Breadcrumb for mobile */}
              <div className="lg:hidden flex-1 ml-4">
                <Breadcrumb />
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-4 ml-auto">
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500">Administrateur</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb for desktop - Fixed below header */}
        <div className="hidden lg:block fixed top-16 right-0 left-64 z-20 bg-gray-50 border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <Breadcrumb />
          </div>
        </div>

        {/* Page content - With proper spacing for fixed elements */}
        <main className="pt-16 lg:pt-24">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Page header */}
              <div className="mb-8">
                <div className="md:flex md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                      {sectionInfo.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {sectionInfo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Page content */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}