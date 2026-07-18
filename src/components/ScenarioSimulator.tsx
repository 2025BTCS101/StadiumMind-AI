'use client';

import React from 'react';
import { useStadiumState } from '../context/StadiumContext';
import { CloudRain, Train, AlertOctagon, Zap, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { SIMULATION_SCENARIOS } from '../data/mockStadiumData';

export const ScenarioSimulator: React.FC = () => {
  const { currentScenario, triggerScenario, resetScenario, liveStats } = useStadiumState();

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'rain': return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'metro_strike': return <Train className="h-5 w-5 text-amber-400" />;
      case 'gate_closure': return <AlertOctagon className="h-5 w-5 text-rose-500" />;
      case 'power_failure': return <Zap className="h-5 w-5 text-yellow-400" />;
      default: return <AlertCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100/10 bg-slate-900/40 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100/10 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            AI &quot;What-If&quot; Scenario Simulator
          </h2>
          <p className="text-xs text-slate-400">Model event disruptions and pre-emptively forecast impacts.</p>
        </div>
        
        {currentScenario && (
          <button
            onClick={resetScenario}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Base Simulation
          </button>
        )}
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.values(SIMULATION_SCENARIOS).map((scenario) => {
          const isActive = currentScenario?.id === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => {
                if (isActive) resetScenario();
                else triggerScenario(scenario.id);
              }}
              className={`flex flex-col rounded-xl p-4 text-left border transition-all duration-300 ${
                isActive
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isActive ? 'bg-indigo-500/20' : 'bg-slate-900'
                  }`}>
                    {getScenarioIcon(scenario.id)}
                  </div>
                  <h3 className="font-semibold text-sm text-slate-100">{scenario.name}</h3>
                </div>
                {isActive && (
                  <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider animate-pulse">
                    Active simulation
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">{scenario.description}</p>
            </button>
          );
        })}
      </div>

      {/* Simulation forecast outcome panel */}
      {currentScenario && (
        <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-950/15 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">AI Predictive Forecast (Forecast vs Baseline)</h3>
          
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-slate-950/50 p-3 border border-slate-900">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Crowd Flow Rate</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-red-400">{currentScenario.impactMetrics.crowdFlowRate}%</span>
                <span className="text-[9px] text-slate-500">vs 100%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-red-400 rounded-full transition-all duration-500" 
                  style={{ width: `${currentScenario.impactMetrics.crowdFlowRate}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/50 p-3 border border-slate-900">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Queue Time Index</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-amber-400">{currentScenario.impactMetrics.queueTimeMultiplier}x</span>
                <span className="text-[9px] text-slate-500">vs 1.0x</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, currentScenario.impactMetrics.queueTimeMultiplier * 25)}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/50 p-3 border border-slate-900">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Transit Delays</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-yellow-400">+{currentScenario.impactMetrics.transitDelayMinutes}m</span>
                <span className="text-[9px] text-slate-500">egress delay</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, currentScenario.impactMetrics.transitDelayMinutes * 2)}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/50 p-3 border border-slate-900">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Risk Severity</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-red-500">{liveStats.riskIndex}/100</span>
                <span className="text-[9px] text-slate-500">critical index</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500" 
                  style={{ width: `${liveStats.riskIndex}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-indigo-500/20 pt-4 text-xs">
            <span className="font-bold text-indigo-400 uppercase">AI Recommended Mitigation Actions:</span>
            <p className="mt-1.5 text-slate-300 font-medium leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
              {currentScenario.actionRecommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ScenarioSimulator;
