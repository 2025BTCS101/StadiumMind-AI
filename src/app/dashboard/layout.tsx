'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStadiumState } from '../../context/StadiumContext';
import { LayoutDashboard, Radio, Cpu, Bell, ArrowLeft, PlusCircle, ShieldAlert } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { matchInfo, triggerNextMatchMinute, emergencies } = useStadiumState();

  const activeIncidentCount = emergencies.filter(e => e.status !== 'resolved').length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow shadow-blue-500/25">
              <Cpu className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white uppercase tracking-tight">StadiumMind</h1>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest">CO-PILOT OS</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Landing</span>
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold transition-all duration-200 ${
                pathname === '/dashboard'
                  ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Command Center</span>
            </Link>

            <Link
              href="/fan"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-slate-250 transition-all duration-200"
            >
              <Radio className="h-4 w-4" />
              <span>Mobile Fan App</span>
            </Link>
          </nav>
        </div>

        {/* Branding badge footer */}
        <div className="border-t border-slate-900 pt-4 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/5 px-3 py-1 border border-blue-500/10 text-[9px] font-bold text-blue-400 uppercase tracking-widest">
            FIFA 2026 &bull; SECURE
          </div>
        </div>
      </aside>

      {/* 2. Main content side */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header bar */}
        <header className="h-16 border-b border-slate-900 bg-slate-950 px-6 flex items-center justify-between shrink-0 gap-4">
          
          {/* Live scoreboard details */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="rounded bg-slate-900 px-3 py-1.5 border border-slate-800 shrink-0 text-center">
              <span className="font-extrabold text-sm tracking-wide text-white font-mono">{matchInfo.score}</span>
              <span className="ml-2 font-bold text-xs text-blue-500 font-mono">{matchInfo.minute}&apos;</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 truncate hidden md:block">
              {matchInfo.timeline}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Advance minute timer */}
            <button
              onClick={triggerNextMatchMinute}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 transition-all duration-200 active:scale-95"
              title="Advance match timeline by 1 minute"
            >
              <PlusCircle className="h-3.5 w-3.5 text-blue-500" />
              +1 Min
            </button>

            {/* Notification alert badge */}
            <div className="relative">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 ${
                activeIncidentCount > 0 ? 'text-red-500 border-red-500/35 bg-red-950/10 animate-pulse' : ''
              }`}>
                <Bell className="h-4.5 w-4.5" />
              </div>
              {activeIncidentCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white">
                  {activeIncidentCount}
                </span>
              )}
            </div>

          </div>
        </header>

        {/* Active Emergency Alert Banner if incidents are reported */}
        {activeIncidentCount > 0 && (
          <div className="bg-red-950/20 border-b border-red-900/40 px-6 py-2 flex items-center justify-between gap-4 shrink-0 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <ShieldAlert className="h-4 w-4 animate-bounce" />
              <span>STADIUM RED ALERT: {activeIncidentCount} active security/medical incident(s) require dispatch!</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              AI Copilot routing active
            </div>
          </div>
        )}

        {/* Page Content area */}
        <main className="flex-1 p-6 relative">
          {children}
        </main>
      </div>

    </div>
  );
}
