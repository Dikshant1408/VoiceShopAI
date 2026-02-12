import React, { useState } from 'react';
import { speechService } from '../services/speechService';

interface LanguageSelectorProps {
  onLanguageChange?: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(speechService.getLanguage());
  const languages = speechService.getSupportedLanguages();

  const handleSelect = (code: string) => {
    speechService.setLanguage(code);
    setCurrentLang(code);
    setIsOpen(false);
    onLanguageChange?.(code);
  };

  const currentLangName = languages.find(l => l.code === currentLang)?.name || 'English (US)';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 transition-all text-sm font-medium text-gray-700"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>{currentLangName}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors text-sm font-medium ${
                  lang.code === currentLang ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
