'use client';

import React, { useState } from 'react';
import { useStadiumState } from '../../context/StadiumContext';
import { DigitalTwin } from '../../components/DigitalTwin';
import { ScenarioSimulator } from '../../components/ScenarioSimulator';
import { GuidedDemoController } from '../../components/GuidedDemoController';
import { ShieldAlert, Users, Timer, Activity, Heart, Flame, Shield, HelpCircle, UserCheck, Droplet, Zap, Trash2, Globe, Send, Plus } from 'lucide-react';

export default function DashboardPage() {
  const {
    liveStats,
    emergencies,
    resolveEmergency,
    reportEmergency,
    volunteers,
    autoAllocateVolunteers,
    alerts,
    zones
  } = useStadiumState();

  // Custom incident creation form state
  const [showAddIncident, setShowAddIncident] = useState(false);
  const [newIncidentType, setNewIncidentType] = useState<'medical' | 'fire' | 'security' | 'power' | 'crowd'>('medical');
  const [newIncidentLoc, setNewIncidentLoc] = useState('sec-south');
  const [newIncidentDesc, setNewIncidentDesc] = useState('');

  const activeIncidents = emergencies.filter(e => e.status !== 'resolved');

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentDesc.trim()) return;
    
    reportEmergency(newIncidentType, newIncidentLoc, newIncidentDesc);
    setNewIncidentDesc('');
    setShowAddIncident(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Guided Demo Tour Header */}
      <GuidedDemoController />

      {/* 2. Main Analytics Ticker Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        
        {/* Attendance */}
        <div className="rounded-xl border border-slate-100/10 bg-slate-900/40 p-4.5 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Attendance</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-extrabold text-white font-mono leading-none">
              {liveStats.attendance.toLocaleString()}
            </h3>
            <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1">
              Cap: {liveStats.maxCapacity.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Avg Queue Time */}
        <div className="rounded-xl border border-slate-100/10 bg-slate-900/40 p-4.5 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Queue Time Index</span>
            <Timer className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-extrabold text-white font-mono leading-none">
              {liveStats.avgQueueTime} mins
            </h3>
            <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1">
              Concessions Average
            </p>
          </div>
        </div>

        {/* Safety Risk */}
        <div className="rounded-xl border border-slate-100/10 bg-slate-900/40 p-4.5 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Safety Risk Index</span>
            <Activity className="h-4 w-4 text-red-400 animate-pulse" />
          </div>
          <div className="mt-2.5">
            <h3 className={`text-xl font-extrabold font-mono leading-none ${
              liveStats.riskIndex > 50 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {liveStats.riskIndex}%
            </h3>
            <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1">
              Grid Threat Rating
            </p>
          </div>
        </div>

        {/* Active Volunteers */}
        <div className="rounded-xl border border-slate-100/10 bg-slate-900/40 p-4.5 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">AI Operations Staff</span>
            <UserCheck className="h-4 w-4 text-teal-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-extrabold text-white font-mono leading-none">
              {volunteers.filter(v => v.status === 'assigned').length} / {volunteers.length}
            </h3>
            <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1">
              Deployed Volunteers
            </p>
          </div>
        </div>

        {/* Sustainability Carbon Footprint */}
        <div className="rounded-xl border border-slate-100/10 bg-slate-900/40 p-4.5 backdrop-blur-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Carbon Footprint</span>
            <Globe className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-extrabold text-white font-mono leading-none">
              {liveStats.carbonFootprint} kg
            </h3>
            <p className="text-[9px] text-slate-500 font-semibold uppercase mt-1">
              Offset: -22% Electrified
            </p>
          </div>
        </div>

      </div>

      {/* 3. Columns: Map & controls vs Copilot & logs */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Side: Digital twin & Scenarios (7/12 cols) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Digital Twin Map */}
          <DigitalTwin />

          {/* Scenario simulator */}
          <ScenarioSimulator />

        </div>

        {/* Right Side: Emergency, CCTV, Volunteers, Sustainability (5/12 cols) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* CCTV COMPUTER VISION STREAM */}
          <div className="rounded-2xl border border-slate-100/10 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase">CCTV Threat Detection AI</h3>
                <p className="text-[10px] text-slate-400">Simulating live CV cameras.</p>
              </div>
              <span className="rounded bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/20 uppercase tracking-widest animate-pulse">
                SURVEILLANCE LIVE
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="absolute top-2 left-2 text-[8px] bg-black/60 text-emerald-400 px-1 rounded font-mono">CAM 01 // NORTH GATES</div>
                <div className="absolute bottom-2 right-2 text-[8px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-bold uppercase tracking-wider">Flow Normal // 12% Threat</div>
                <div className="h-full w-full opacity-20 bg-cover" style={{ backgroundImage: 'radial-gradient(circle, #0f172a 40%, transparent 100%)' }} />
              </div>
              
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="absolute top-2 left-2 text-[8px] bg-black/60 text-emerald-400 px-1 rounded font-mono">CAM 02 // EAST PARKING</div>
                <div className={`absolute bottom-2 right-2 text-[8px] px-1 rounded font-bold uppercase tracking-wider ${
                  liveStats.riskIndex > 50 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {liveStats.riskIndex > 50 ? 'Anomaly Detected // 85% Risk' : 'Parking Normal // 8% Risk'}
                </div>
                <div className="h-full w-full opacity-20" />
              </div>
            </div>
          </div>

          {/* AI EMERGENCY COPILOT RESPONSE PANEL */}
          <div className="rounded-2xl border border-slate-100/10 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase">AI Emergency Copilot</h3>
                <p className="text-[10px] text-slate-400">Response center for reported crowd alerts.</p>
              </div>
              
              <button
                onClick={() => setShowAddIncident(!showAddIncident)}
                className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Report Incident
              </button>
            </div>

            {/* Custom incident submission form */}
            {showAddIncident && (
              <form onSubmit={handleCreateIncident} className="mb-4 rounded-lg bg-slate-950/80 p-4 border border-slate-850 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Simulate Custom Emergency</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Incident Type</label>
                    <select
                      value={newIncidentType}
                      onChange={(e) => setNewIncidentType(e.target.value as any)}
                      className="w-full rounded bg-slate-900 p-1.5 outline-none border border-slate-800 text-slate-200"
                    >
                      <option value="medical">Medical emergency</option>
                      <option value="fire">Fire threat</option>
                      <option value="security">Security dispute</option>
                      <option value="crowd">Crowd density surge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Zone Location</label>
                    <select
                      value={newIncidentLoc}
                      onChange={(e) => setNewIncidentLoc(e.target.value)}
                      className="w-full rounded bg-slate-900 p-1.5 outline-none border border-slate-800 text-slate-200"
                    >
                      {zones.map(z => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase">Description details</label>
                  <input
                    type="text"
                    value={newIncidentDesc}
                    onChange={(e) => setNewIncidentDesc(e.target.value)}
                    placeholder="e.g. Fainting due to high density concourse A"
                    className="w-full rounded bg-slate-900 p-1.5 text-xs text-slate-200 outline-none border border-slate-800 placeholder:text-slate-600"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddIncident(false)}
                    className="rounded bg-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-blue-500 flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    Submit Emergency
                  </button>
                </div>
              </form>
            )}

            {/* List of active emergencies */}
            <div className="space-y-2.5">
              {activeIncidents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 font-semibold uppercase">
                  No active emergencies. Stadium safe.
                </div>
              ) : (
                activeIncidents.map((emg) => (
                  <div
                    key={emg.id}
                    className="rounded-xl border border-red-900/40 bg-red-950/10 p-3.5 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {emg.type === 'medical' ? (
                          <Heart className="h-4.5 w-4.5 text-red-400 animate-bounce" />
                        ) : emg.type === 'fire' ? (
                          <Flame className="h-4.5 w-4.5 text-orange-400" />
                        ) : (
                          <ShieldAlert className="h-4.5 w-4.5 text-yellow-400" />
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-red-200 uppercase">
                            {emg.type.toUpperCase()} INCIDENT: {zones.find(z => z.id === emg.location)?.name || emg.location}
                          </h4>
                          <p className="text-[10px] text-red-300/80 mt-0.5 leading-relaxed font-semibold">
                            {emg.description}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => resolveEmergency(emg.id)}
                        className="rounded bg-emerald-600 px-2 py-1 text-[9px] font-extrabold text-white uppercase hover:bg-emerald-500 active:scale-95 transition-all"
                      >
                        Resolve
                      </button>
                    </div>

                    <div className="mt-3 border-t border-red-900/30 pt-2.5 flex items-center justify-between text-[9px] uppercase font-bold text-red-400/80">
                      <span>Reported: {emg.reportedAt}</span>
                      <span>
                        Response team: {emg.assignedVolunteerIds.length > 0 
                          ? volunteers.filter(v => emg.assignedVolunteerIds.includes(v.id)).map(v => v.name).join(', ') 
                          : 'Awaiting AI Auto-dispatch'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI VOLUNTEER & OPERATIONS STAFF */}
          <div className="rounded-2xl border border-slate-100/10 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase">AI Operations Staff</h3>
                <p className="text-[10px] text-slate-400">Dynamic volunteer mapping.</p>
              </div>
              <button
                onClick={autoAllocateVolunteers}
                className="rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-blue-500"
              >
                Auto-dispatch Staff
              </button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {volunteers.map((vol) => (
                <div key={vol.id} className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-900">
                  <div className="flex items-center gap-3">
                    <img src={vol.avatar} alt={vol.name} className="h-8 w-8 rounded-full border border-slate-700 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{vol.name}</h4>
                      <p className="text-[9px] text-slate-500 font-semibold uppercase">{vol.role} &bull; Location: {zones.find(z => z.id === vol.location)?.name || vol.location}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      vol.status === 'assigned' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {vol.status}
                    </span>
                    <p className="text-[8px] text-slate-500 mt-1 font-semibold">
                      {vol.task ? vol.task : 'Idle standby'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUSTAINABILITY LEDGER WIDGET */}
          <div className="rounded-2xl border border-slate-100/10 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="mb-4 border-b border-slate-100/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase">Sustainability Grid Ledger</h3>
              <p className="text-[10px] text-slate-400">Live carbon footprint & resources metrics.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-900">
                <Zap className="h-4 w-4 mx-auto text-yellow-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">{liveStats.energyUsage} kW</div>
                <div className="text-[8px] font-semibold text-slate-500 uppercase mt-0.5">Electricity Draw</div>
              </div>
              
              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-900">
                <Droplet className="h-4 w-4 mx-auto text-sky-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">{liveStats.waterUsage} L/m</div>
                <div className="text-[8px] font-semibold text-slate-500 uppercase mt-0.5">Water Draw</div>
              </div>
              
              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-900">
                <Trash2 className="h-4 w-4 mx-auto text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">{liveStats.wasteGenerated} kg</div>
                <div className="text-[8px] font-semibold text-slate-500 uppercase mt-0.5">Waste Collected</div>
              </div>
            </div>
          </div>

          {/* live alert log tracker */}
          <div className="rounded-2xl border border-slate-100/10 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="mb-3 border-b border-slate-100/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase">AI Operations Logs</h3>
            </div>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {alerts.map((log) => (
                <div key={log.id} className="text-[10px] leading-relaxed flex items-start justify-between border-b border-slate-900/60 pb-1.5">
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-mono">[{log.time}]</span>
                    <span className={`font-semibold uppercase ${
                      log.severity === 'critical' ? 'text-red-400' : log.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                    }`}>
                      {log.category.toUpperCase()}:
                    </span>
                    <span className="text-slate-300 font-medium">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
