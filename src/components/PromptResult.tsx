import React from 'react';
import { CheckCircle, Copy, Download, Star, TrendingUp, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface PromptResultProps {
  results: { id: string; text: string; score?: number }[]; // Made score optional
  onCopy: (text: string, id: string) => void;
  copiedPhrases: Set<string>;
  onDownload: () => void;
}

export const PromptResult: React.FC<PromptResultProps> = ({ results, onCopy, copiedPhrases, onDownload }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {t('generator.results.title')}
          </h3>
        </div>
        <button
          onClick={onDownload}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          <span>{t('generator.results.download')}</span>
        </button>
      </div>
      <div className="space-y-6">
        {results.map((phrase, index) => (
          <div
            key={phrase.id}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between space-x-3 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xs sm:text-sm font-medium text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
                    {index + 1}
                  </span>
                </div>
                <blockquote className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed break-words group-hover:text-purple-700 transition-colors">
                  {phrase.text}
                </blockquote>
                {phrase.score !== undefined && (
                  <div className="mt-4 flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full px-3 py-1.5">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < Math.floor((phrase.score || 0) / 20) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-yellow-700">
                        {phrase.score}/100
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full px-3 py-1.5">
                      <TrendingUp className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-700">
                        {(phrase.score || 0) >= 80 ? 'Excellent' : 
                         (phrase.score || 0) >= 60 ? 'Bon' : 
                         (phrase.score || 0) >= 40 ? 'Moyen' : 'À améliorer'}
                      </span>
                    </div>
                    
                    {(phrase.score || 0) >= 90 && (
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-3 py-1.5">
                        <Award className="w-3 h-3 text-purple-500" />
                        <span className="text-xs font-semibold text-purple-700">
                          Top
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => onCopy(phrase.text, phrase.id)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 text-base shadow-md ml-0 sm:ml-6 mt-2 sm:mt-0
                  ${copiedPhrases.has(phrase.id)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 border border-gray-200 hover:border-purple-300'}
                `}
              >
                {copiedPhrases.has(phrase.id)
                  ? <CheckCircle className="w-5 h-5" />
                  : <Copy className="w-5 h-5" />}
                <span>{copiedPhrases.has(phrase.id) ? t('generator.results.copied') : t('generator.results.copy')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};