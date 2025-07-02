import React from 'react';
import { useTranslation } from 'react-i18next';

export interface LanguageSelectorProps {
  language: string;
  setLanguage: (lang: string) => void;
  languages: { value: string; label: string; flag: string }[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage, languages }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex space-x-2">
      {languages.map(lang => (
        <button
          key={lang.value}
          onClick={() => setLanguage(lang.value)}
          className={`px-3 py-1 rounded-lg border ${language === lang.value ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
        >
          <span className="mr-1">{lang.flag}</span>
          {t(`languages.${lang.label}`)}
        </button>
      ))}
    </div>
  );
}; 