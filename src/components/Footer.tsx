import React from 'react';
import { Zap, Mail, Twitter, Linkedin, Github, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BoltBadge from './BoltBadge';

export function Footer() {
  const { navigateToHome, navigateToGenerator } = useApp();

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Clicklone
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Le générateur IA qui transforme vos idées en phrases d'accroche percutantes. 
                Créez des slogans irrésistibles en quelques secondes.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#twitter"
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#linkedin"
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#github"
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Produit</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={navigateToHome}
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Accueil
                  </button>
                </li>
                <li>
                  <button
                    onClick={navigateToGenerator}
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Générateur
                  </button>
                </li>
                <li>
                  <a
                    href="#exemples"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Exemples
                  </a>
                </li>
                <li>
                  <a
                    href="#tarifs"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Tarifs
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#aide"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#guide"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Guide d'utilisation
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Légal</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#confidentialite"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#conditions"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Politique des cookies
                  </a>
                </li>
                <li>
                  <a
                    href="#mentions"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    Mentions légales
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-100 py-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              Restez informé des nouveautés
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Recevez nos conseils en copywriting et les dernières fonctionnalités
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-100 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>© 2024 Clicklone. Fait avec</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>pour les créateurs.</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-6 text-sm">
                <a
                  href="#status"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Statut du service
                </a>
                <a
                  href="#api"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  API
                </a>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Tous systèmes opérationnels</span>
                </div>
              </div>
              
              {/* Bolt Badge */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 rounded-full">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                  <BoltBadge />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}