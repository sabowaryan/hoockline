import React from 'react';
import { Zap, Mail, Twitter, Linkedin, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import BoltBadge from './BoltBadge';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Clicklone
                </span>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {t('footer.slogan1')}
                <br/>
                {t('footer.slogan2')}
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
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.productTitle')}</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.home')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/generator"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.generator')}
                  </Link>
                </li>
                <li>
                  <a
                    href="#exemples"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.examples')}
                  </a>
                </li>
                <li>
                  <a
                    href="#tarifs"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.pricing')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.supportTitle')}</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#aide"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.helpCenter')}
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.faq')}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.contact')}
                  </a>
                </li>
                <li>
                  <a
                    href="#guide"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.guide')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t('footer.legalTitle')}</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#confidentialite"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.privacy')}
                  </a>
                </li>
                <li>
                  <a
                    href="#conditions"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.terms')}
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.cookies')}
                  </a>
                </li>
                <li>
                  <a
                    href="#mentions"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  >
                    {t('footer.mentions')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-100 py-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-gray-900 mb-2">{t('footer.newsletterTitle')}</h3>
            <p className="text-gray-600 text-sm mb-4">{t('footer.newsletterDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-100 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>© {year} Clicklone.</span>
              <span>{t('footer.rights')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <BoltBadge />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}