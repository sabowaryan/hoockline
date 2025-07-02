import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Palette, Languages } from 'lucide-react';
import { PromptOptions, Format, Tone, Language, FormatType } from '../types/PromptOptions';

export interface PromptEditorProps {
  values: PromptOptions;
  setValues: (v: Partial<PromptOptions>) => void;
  formats: { value: FormatType; label: string; icon?: React.ComponentType<any>; color?: string; description?: string }[];
  tones: { value: Tone; label: string; icon?: React.ComponentType<any>; color?: string; description?: string }[];
  languages: { code: Language; name: string; flag: string }[];
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  values, setValues, formats, tones, languages
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      {/* Concept */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900">
              {t('generator.form.concept')}
            </label>
            <p className="text-sm text-gray-600">{t('generator.form.conceptDescription')}</p>
          </div>
        </div>
        <textarea
          value={values.concept}
          onChange={e => setValues({ concept: e.target.value })}
          placeholder={t('generator.form.conceptPlaceholder')}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none text-lg transition-all"
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-3 flex items-center space-x-2">
          <span>{t('generator.form.conceptHelp')}</span>
        </p>
      </div>

      {/* Tone */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900">
              {t('generator.form.tone')}
            </label>
            <p className="text-sm text-gray-600">{t('generator.form.toneDescription')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tones.map((tone) => {
            const IconComponent = tone.icon;
            const isSelected = values.tone === tone.value;
            return (
              <button
                key={tone.value}
                type="button"
                onClick={() => setValues({ tone: tone.value })}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? `border-purple-500 bg-gradient-to-r ${tone.color} text-white shadow-lg`
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {IconComponent && (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-r ${tone.color} text-white`
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-sm font-semibold">{t(tone.label)}</div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{tone.description && t(tone.description)}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Languages className="w-6 h-6 text-white" />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900">
              {t('generator.form.language')}
            </label>
            <p className="text-sm text-gray-600">{t('generator.form.languageDescription')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setValues({ targetLanguage: lang.code })}
              className={`group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                values.targetLanguage === lang.code
                  ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl">{lang.flag}</div>
                <div className="text-sm font-semibold">{t(`generator.form.languages.${lang.code}`)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900">
              {t('generator.form.format')}
            </label>
            <p className="text-sm text-gray-600">{t('generator.form.formatDescription')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {formats.map((format) => {
            const isSelected = values.format === format.value.id;
            const IconComponent = format.icon;
            return (
              <button
                key={format.value.id}
                type="button"
                onClick={() => setValues({ format: format.value.id })}
                className={`group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {IconComponent && <IconComponent className="w-6 h-6 mb-1" />}
                  <div className="text-sm font-semibold">{t(format.label)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 