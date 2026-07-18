'use client';

import React, { useState } from 'react';
import { useStadiumState } from '../context/StadiumContext';
import { Play, CheckCircle2, AlertTriangle, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { exportMatchReport } from '../utils/pdfGenerator';

interface DemoStage {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  actionLabel: string;
  runAction: (state: ReturnType<typeof useStadiumState>) => void;
}

export const GuidedDemoController: React.FC = () => {
  const state = useStadiumState();
  const { currentScenario, resetScenario, matchInfo, volunteers, emergencies, transit, concessions, zones, liveStats } = state;
  const [currentStep, setCurrentStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const stages: DemoStage[] = [
    {
      step: 1,
      title: 'Phase 1: Normal Ingress',
      subtitle: '80,000 Fans Entering Stadium',
      description: 'Stadium is filling. Ingress flows are normal. Smart grids, transit, and concessions are green. Security is at standard baseline surveillance.',
      actionLabel: 'Trigger Disruption Chain',
      runAction: (s) => {
        s.resetScenario();
        s.addAlert('system', 'Guided Demo: Stadium operating at baseline optimal levels.', 'info');
      }
    },
    {
      step: 2,
      title: 'Phase 2: Multi-Disruption Storm',
      subtitle: 'Rain Storm + Metro Suspension + Gate Closure',
      description: 'Disruptions strike simultaneously! Torrential rain starts, Metro Line 1 suspends services, and a suspicious bag triggers a security closure at Gate C. Crowds bottleneck, risk levels spike, and wait times multiply.',
      actionLabel: 'Deploy AI Copilot Solutions',
      runAction: (s) => {
        s.triggerScenario('gate_closure');
        setTimeout(() => {
          s.triggerScenario('rain');
        }, 800);
      }
    },
    {
      step: 3,
      title: 'Phase 3: AI Redirection & Staffing',
      subtitle: 'Dynamic Rerouting & Automated Dispatch',
      description: 'StadiumMind AI automatically generates rerouting pathways on the Digital Twin, dispatches standby volunteers to high-risk bottlenecks, and plays multilingual audio broadcast instructions to clear concourses.',
      actionLabel: 'Observe Stabilization',
      runAction: (s) => {
        s.autoAllocateVolunteers();
        s.addAlert('operations', 'AI Dispatch: Re-routing vectors active on stadium displays.', 'info');
      }
    },
    {
      step: 4,
      title: 'Phase 4: Match Stabilization & PDF Output',
      subtitle: 'Threat Resolved & Post-Game Analysis',
      description: 'Disruptions successfully navigated. Bottlenecks cleared, transit issues stabilized, and emergency responders resolved active incidents. The post-match operations report is ready for export.',
      actionLabel: 'Restart Tour Walkthrough',
      runAction: (s) => {
        s.emergencies.forEach(e => {
          if (e.status !== 'resolved') {
            s.resolveEmergency(e.id);
          }
        });
        s.resetScenario();
        s.addAlert('system', 'Guided Demo: Stadium restored to stable baseline operations.', 'info');
      }
    }
  ];

  const handleNextStep = () => {
    setIsRunning(true);
    const targetStep = currentStep === 4 ? 1 : currentStep + 1;
    setCurrentStep(targetStep);
    
    stages[targetStep - 1].runAction(state);
    
    setTimeout(() => {
      setIsRunning(false);
    }, 1000);
  };

  const handleExportPDF = () => {
    exportMatchReport({
      matchName: matchInfo.matchName,
      score: matchInfo.score,
      minute: matchInfo.minute,
      zones,
      concessions,
      transit,
      volunteers,
      emergencies,
      liveStats: {
        ...liveStats,
        energyUsage: liveStats.energyUsage,
        waterUsage: liveStats.waterUsage,
        wasteGenerated: liveStats.wasteGenerated,
        carbonFootprint: liveStats.carbonFootprint
      },
      currentScenarioName: currentScenario ? currentScenario.name : ''
    });
  };

  const curStage = stages[currentStep - 1];

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-blue-950/15 p-6 backdrop-blur-md shadow-lg shadow-blue-500/5">
      <div className="mb-4 flex items-center justify-between border-b border-blue-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-bold tracking-tight text-white">StadiumMind Guided Demo Mode</h2>
        </div>
        <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
          Interactive Pitch Tour
        </span>
      </div>

      {/* Progress indicators */}
      <div className="mb-6 flex items-center justify-between">
        {[1, 2, 3, 4].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300 ${
                currentStep === stepNum
                  ? 'bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/25 scale-105'
                  : currentStep > stepNum
                  ? 'bg-blue-950 border-blue-600 text-blue-400'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {currentStep > stepNum ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
              </div>
              <span className={`mt-1.5 text-[9px] uppercase tracking-wider font-bold ${
                currentStep === stepNum ? 'text-blue-400' : 'text-slate-500'
              }`}>
                Phase {stepNum}
              </span>
            </div>
            {stepNum < 4 && (
              <div className={`h-0.5 flex-1 transition-all duration-500 ${
                currentStep > stepNum ? 'bg-blue-600' : 'bg-slate-800'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Highlight active step details */}
      <div className="rounded-xl bg-slate-950/60 p-5 border border-slate-900">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
          {currentStep === 2 ? <AlertTriangle className="h-3.5 w-3.5 text-rose-500 animate-bounce" /> : <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />}
          {curStage.subtitle}
        </div>
        <h3 className="mt-1 text-base font-bold text-white">{curStage.title}</h3>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed font-medium">
          {curStage.description}
        </p>
      </div>

      {/* Action controls */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handleNextStep}
          disabled={isRunning}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.01] active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {curStage.actionLabel}
          <ArrowRight className="h-4 w-4" />
        </button>

        {currentStep === 4 && (
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-5 py-3 text-xs font-bold text-emerald-400 hover:bg-emerald-600/30 active:scale-95 transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            Generate Post-Match PDF Report
          </button>
        )}

        <button
          onClick={() => {
            setCurrentStep(1);
            resetScenario();
            // Clear emergencies
            emergencies.forEach(e => {
              if (e.id.startsWith('sim-')) {
                // simple removal filter handles it inside resetScenario
              }
            });
            state.addAlert('system', 'Guided Demo restarted by Host.', 'info');
          }}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
          title="Reset back to Phase 1"
        >
          Reset Demo
        </button>
      </div>
    </div>
  );
};
export default GuidedDemoController;
