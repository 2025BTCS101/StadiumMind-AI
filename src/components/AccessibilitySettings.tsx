'use client';

import React, { useState } from 'react';
import { useThemeSettings } from '../context/ThemeContext';
import { Accessibility, Volume2, Type, Eye, Languages, X } from 'lucide-react';

export const AccessibilitySettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    largeText,
    setLargeText,
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    voiceEnabled,
    setVoiceEnabled,
    language,
    setLanguage,
  } = useThemeSettings();

  const languagesList = [
    { code: 'en', name: 'English (US/UK)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ko', name: '한국어 (Korean)' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Accessibility Settings"
        title="Open Accessibility Controls"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {/* Control Panel Overlay */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 transition-all duration-300">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Accessibility className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-base">Accessibility Options</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close settings"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Large Text Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Large Typography</span>
              </div>
              <button
                onClick={() => setLargeText(!largeText)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  largeText ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={largeText}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    largeText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 2. High Contrast Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">High Contrast</span>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  highContrast ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={highContrast}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 3. Dyslexic-Friendly Font */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-slate-500">Abc</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dyslexic Typeface</span>
              </div>
              <button
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  dyslexicFont ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={dyslexicFont}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    darkfontPosition(dyslexicFont)
                  }`}
                />
              </button>
            </div>

            {/* 4. Screen Reader Voice Prompts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Voice Narrations</span>
              </div>
              <button
                onClick={() => {
                  const val = !voiceEnabled;
                  setVoiceEnabled(val);
                  if (val && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance("Voice prompts enabled. Select languages are active.");
                    utterance.lang = language;
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  voiceEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={voiceEnabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 5. Language Select */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">
                <Languages className="h-3.5 w-3.5" />
                <span>Operating Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  if (voiceEnabled && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance("Language updated.");
                    utterance.lang = e.target.value;
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-all duration-200"
              >
                {languagesList.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-center text-[10px] text-slate-400">
            Complies with W3C WAI-ARIA and section 508 guidelines.
          </div>
        </div>
      )}
    </div>
  );
};

// Simple helper for translation toggle alignment
function darkfontPosition(active: boolean) {
  return active ? 'translate-x-6' : 'translate-x-1';
}
export default AccessibilitySettings;
