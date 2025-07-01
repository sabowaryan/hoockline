import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-600" />
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => changeLanguage('fr')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              currentLanguage === 'fr'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            FR
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              currentLanguage === 'en'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 