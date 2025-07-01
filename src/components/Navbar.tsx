import React, { useState } from 'react';
import { Zap, Menu, X, Home, Wand2, HelpCircle, Mail, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './auth/AuthWrapper';
import LanguageSwitcher from './LanguageSwitcher';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Get auth context to check if user is admin
  let isAdmin = false;
  try {
    const { user, userProfile } = useAuth();
    isAdmin = Boolean(user && userProfile?.role === 'admin');
  } catch (error) {
    // useAuth will throw if not within AuthWrapper context
    // This is expected for public routes, so we silently handle it
    isAdmin = false;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    closeMobileMenu();
  };

  // Helper function to check if a route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Clicklone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActiveRoute('/')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('common.home')}</span>
            </Link>
            
            <Link
              to="/generator"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActiveRoute('/generator')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>{t('common.generator')}</span>
            </Link>

            <a
              href="#aide"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t('common.help')}</span>
            </a>

            <a
              href="#contact"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{t('common.contact')}</span>
            </a>

            {/* Admin link - only show for authenticated admin users */}
            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('common.admin')}</span>
              </button>
            )}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              to="/generator"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
            >
              {t('common.createNow')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  isActiveRoute('/')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>{t('common.home')}</span>
              </Link>
              
              <Link
                to="/generator"
                onClick={closeMobileMenu}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  isActiveRoute('/generator')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Wand2 className="w-5 h-5" />
                <span>{t('common.generator')}</span>
              </Link>

              <a
                href="#aide"
                onClick={closeMobileMenu}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span>{t('common.help')}</span>
              </a>

              <a
                href="#contact"
                onClick={closeMobileMenu}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{t('common.contact')}</span>
              </a>

              {/* Admin link - only show for authenticated admin users in mobile menu */}
              {isAdmin && (
                <button
                  onClick={handleAdminClick}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>{t('common.admin')}</span>
                </button>
              )}

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
                <Link
                  to="/generator"
                  onClick={closeMobileMenu}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{t('common.createNow')}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}