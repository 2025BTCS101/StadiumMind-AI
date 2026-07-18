import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { StadiumProvider } from '../context/StadiumContext';
import { AccessibilitySettings } from '../components/AccessibilitySettings';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'StadiumMind AI — Predictive Operating System for Smart Stadiums',
  description: 'The World\'s First Predictive AI Operating System for Smart Stadiums, safety routing, computer vision threat analysis, and automated operations dispatch for the FIFA World Cup 2026.',
  keywords: 'FIFA World Cup 2026, Smart Stadiums, Generative AI, Crowd Management, Predictive Analytics, Event Operations, Vercel',
  authors: [{ name: 'StadiumMind AI Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="font-sans antialiased min-h-full flex flex-col">
        <ThemeProvider>
          <StadiumProvider>
            {children}
            <AccessibilitySettings />
          </StadiumProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
