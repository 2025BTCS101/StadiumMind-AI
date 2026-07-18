import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useThemeSettings } from './ThemeContext';

const ThemeTestComponent = () => {
  const { theme, toggleTheme, language, setLanguage, dyslexicFont, setDyslexicFont } = useThemeSettings();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="lang-val">{language}</span>
      <span data-testid="dyslexic-val">{dyslexicFont ? 'on' : 'off'}</span>
      <button data-testid="theme-btn" onClick={toggleTheme}>Toggle Theme</button>
      <button data-testid="lang-btn" onClick={() => setLanguage('es')}>Spanish</button>
      <button data-testid="dyslexic-btn" onClick={() => setDyslexicFont(true)}>Dyslexic On</button>
    </div>
  );
};

describe('ThemeContext Provider Tests', () => {
  it('should initialize with default states', () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-val')).toHaveTextContent('dark');
    expect(screen.getByTestId('lang-val')).toHaveTextContent('en');
    expect(screen.getByTestId('dyslexic-val')).toHaveTextContent('off');
  });

  it('should toggle parameters when functions are executed', () => {
    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    const themeBtn = screen.getByTestId('theme-btn');
    const langBtn = screen.getByTestId('lang-btn');
    const dyslexicBtn = screen.getByTestId('dyslexic-btn');

    act(() => {
      themeBtn.click();
      langBtn.click();
      dyslexicBtn.click();
    });

    expect(screen.getByTestId('theme-val')).toHaveTextContent('light');
    expect(screen.getByTestId('lang-val')).toHaveTextContent('es');
    expect(screen.getByTestId('dyslexic-val')).toHaveTextContent('on');
  });
});
