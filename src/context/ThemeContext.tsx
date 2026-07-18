'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (v: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Synchronize options with document class styling
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Set dynamic language code
    root.lang = language;

    // Theme classes
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    // High Contrast classes
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large Text classes
    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Dyslexic Font classes
    if (dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
  }, [theme, highContrast, largeText, dyslexicFont, language]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
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
      }}
    >
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useThemeSettings = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeSettings must be used within a ThemeProvider');
  }
  return context;
};
export default ThemeContext;
