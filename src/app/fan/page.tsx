'use client';

import React from 'react';
import Link from 'next/link';
import { AICompanion } from '../../components/AICompanion';
import { ArrowLeft, Sparkles, Languages, Volume2, Mic } from 'lucide-react';
import { useThemeSettings } from '../../context/ThemeContext';
import { t } from '../../utils/translations';

export default function FanPage() {
  const { language } = useThemeSettings();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      
      {/* Background Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-350 hover:bg-slate-850 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('exit_hub', language)}</span>
          </Link>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-sm text-white uppercase tracking-tight">StadiumMind</h1>
            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest">{t('fan_portal', language)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-500/15 px-2.5 py-0.5 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase tracking-widest">
            Fan Tier Simulation
          </span>
        </div>
      </header>

      {/* Main smartphone frame viewport container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
        
        {/* Left Side: Instructions and description */}
        <div className="max-w-md text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-600/10 px-3.5 py-1 text-xs font-bold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            FIFA World Cup 2026 Spectator Suite
          </div>
          
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            {t('ai_fan_assistant', language)}<br />
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              {t('in_pocket', language)}
            </span>
          </h2>
          
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            {t('mobile_desc', language)}
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-900 text-xs">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400">
                <Mic className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-slate-200">{t('voice_support', language)}</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">{t('voice_support_desc', language)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400">
                <Volume2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-slate-200">{t('voice_read', language)}</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">{t('voice_read_desc', language)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-900 border border-slate-800 text-indigo-400">
                <Languages className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-slate-200">{t('lang_integrations', language)}</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">{t('lang_integrations_desc', language)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Phone simulator */}
        <div className="shrink-0 flex items-center justify-center">
          <AICompanion />
        </div>

      </main>

      {/* Footer bar */}
      <footer className="relative w-full border-t border-slate-900 bg-slate-950/80 px-6 py-5 z-10 text-center text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
        <span>StadiumMind AI Mobile Sandbox &copy; 2026. SECURE GATEWAY ENABLED.</span>
      </footer>

    </div>
  );
}
