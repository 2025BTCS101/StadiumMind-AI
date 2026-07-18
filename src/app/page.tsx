'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Activity, Users, Truck, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden flex flex-col justify-between">
      
      {/* Background Neon Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-15 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/35">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white uppercase">StadiumMind <span className="text-blue-500">AI</span></h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Smart Stadium OS</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="rounded bg-blue-500/15 px-2.5 py-0.5 text-blue-400 border border-blue-500/30 uppercase tracking-widest text-[9px]">FIFA 2026 EDITION</span>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative flex-1 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center z-10">
        
        {/* Pitch badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-600/10 px-4 py-1.5 text-xs font-bold text-blue-400 animate-float mb-6">
          <Sparkles className="h-4 w-4" />
          The World&apos;s First Predictive AI Operating System for Smart Stadiums
        </div>

        {/* Hero Title */}
        <h2 className="max-w-3xl text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-white">
          Predict Disruption. Optimize Crowds.<br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">
            Automate Operations.
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-base text-slate-400 font-medium">
          StadiumMind AI is an enterprise-grade AI Command Center engineered for the FIFA World Cup 2026. It models spectator flows, simulates emergency scenarios in real time, and auto-dispatches volunteers to secure stadiums.
        </p>

        {/* Access Links Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/dashboard"
            className="flex-1 min-w-[200px] text-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-95 transition-all duration-200"
          >
            Access AI Command Center
          </Link>
          <Link
            href="/fan"
            className="flex-1 min-w-[200px] text-center rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white hover:scale-[1.01] active:scale-95 transition-all duration-200"
          >
            Launch Fan Companion Portal
          </Link>
        </div>

        {/* Live System Statistics */}
        <div className="mt-16 w-full max-w-4xl grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="glass-panel rounded-xl p-5 border border-slate-900 bg-slate-950/20 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">99.4%</div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Predictive Accuracy</div>
          </div>
          <div className="glass-panel rounded-xl p-5 border border-slate-900 bg-slate-950/20 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">&lt;90s</div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">AI Emergency dispatch</div>
          </div>
          <div className="glass-panel rounded-xl p-5 border border-slate-900 bg-slate-950/20 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">50+</div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Supported Languages</div>
          </div>
          <div className="glass-panel rounded-xl p-5 border border-slate-900 bg-slate-950/20 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">100%</div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">W3C WCAG Accessible</div>
          </div>
        </div>

        {/* Platform Pillars Section */}
        <div className="mt-24 w-full">
          <h3 className="text-xs font-bold tracking-widest text-blue-500 uppercase">Core Architecture Modules</h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="rounded-xl border border-slate-900 bg-slate-900/25 p-6 hover:border-slate-800 transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white">Crowd Flow Diagnostics</h4>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-medium">
                Tracks gate flow occupancy and queue delays in real time. Predicts safety threat scores based on local density spikes and transit frequencies.
              </p>
            </div>
            
            <div className="rounded-xl border border-slate-900 bg-slate-900/25 p-6 hover:border-slate-800 transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 mb-4">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white">&quot;What-If&quot; Scenario Simulator</h4>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-medium">
                Simulates localized disruptions—heavy storms, public transit suspends, or gate breaches. Models egress delay multipliers and offers actionable AI recommendations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-900 bg-slate-900/25 p-6 hover:border-slate-800 transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-400 mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-white">AI Resource Dispatcher</h4>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-medium">
                Automatically checks staff distance, experience parameters, and languages spoken to assign them to active bottlenecks and reported medical alerts.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer bar */}
      <footer className="relative w-full border-t border-slate-900 bg-slate-950/80 px-6 py-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          <span>StadiumMind AI &copy; 2026. Engineered for FIFA Venue Operations.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-350 cursor-pointer">Security Ledger</span>
            <span>&bull;</span>
            <span className="hover:text-slate-350 cursor-pointer">Privacy Guidelines</span>
            <span>&bull;</span>
            <span className="hover:text-slate-350 cursor-pointer">WAI-ARIA Accessibility</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
