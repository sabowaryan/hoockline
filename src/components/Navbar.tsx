import React, { useState } from 'react';
import { Zap, Menu, X, Home, Wand2, HelpCircle, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const { state, navigateToHome, navigateToGenerator } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigateToHome();
    closeMobileMenu();
  };

  const handleGeneratorClick = () => {
    navigateToGenerator();
    closeMobileMenu();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Clicklone
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleHomeClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                state.currentStep === 'home'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>
            
            <button
              onClick={handleGeneratorClick}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                state.currentStep === 'generator'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Générateur</span>
            </button>

            <a
              href="#aide"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Aide</span>
            </a>

            <a
              href="#contact"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <button
              onClick={handleGeneratorClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
            >
              Créer maintenant
            </button>
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
              <button
                onClick={handleHomeClick}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  state.currentStep === 'home'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Accueil</span>
              </button>
              
              <button
                onClick={handleGeneratorClick}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  state.currentStep === 'generator'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Wand2 className="w-5 h-5" />
                <span>Générateur</span>
              </button>

              <a
                href="#aide"
                onClick={closeMobileMenu}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Aide</span>
              </a>

              <a
                href="#contact"
                onClick={closeMobileMenu}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </a>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleGeneratorClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Créer maintenant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}