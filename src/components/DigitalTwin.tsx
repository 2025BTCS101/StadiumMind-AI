'use client';

import React, { useState } from 'react';
import { useStadiumState } from '../context/StadiumContext';
import { Zone } from '../data/mockStadiumData';
import { Flame, AlertTriangle, ShieldAlert, Heart, Radio, Activity, Eye } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const { zones, emergencies, currentScenario } = useStadiumState();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showEvacPaths, setShowEvacPaths] = useState(false);

  // Helper to determine the color overlay of a zone
  const getZoneColor = (zone: Zone) => {
    // 1. Check if there's an active emergency in this zone
    const hasEmergency = emergencies.some(e => e.location === zone.id && e.status !== 'resolved');
    if (hasEmergency) {
      return 'fill-red-600/80 stroke-red-500 animate-pulse';
    }

    // 2. If heatmap mode is active, color based on capacity occupancy percentage
    if (showHeatmap) {
      const pct = zone.occupancy / zone.capacity;
      if (pct > 0.85) return 'fill-rose-500/70 stroke-rose-400'; // Critical bottleneck
      if (pct > 0.65) return 'fill-amber-500/60 stroke-amber-400'; // High congestion
      if (pct > 0.40) return 'fill-indigo-500/50 stroke-indigo-400'; // Medium load
      return 'fill-teal-500/40 stroke-teal-400'; // Smooth/normal flow
    }

    // 3. Standard view: Categorized colors
    switch (zone.type) {
      case 'seating': return 'fill-slate-800/60 stroke-slate-600 hover:fill-blue-900/50';
      case 'gate': return 'fill-emerald-800/80 stroke-emerald-600 hover:fill-emerald-700/80';
      case 'vip': return 'fill-amber-700/70 stroke-amber-500 hover:fill-amber-600/70';
      case 'concourse': return 'fill-slate-700/80 stroke-slate-500 hover:fill-indigo-950/40';
      case 'medical': return 'fill-red-800/70 stroke-red-600 hover:fill-red-700';
      case 'transit': return 'fill-sky-800/70 stroke-sky-500 hover:fill-sky-700';
      case 'parking': return 'fill-cyan-800/70 stroke-cyan-600 hover:fill-cyan-700';
      default: return 'fill-slate-700 stroke-slate-500';
    }
  };

  // Helper to get matching active incident icon
  const getEmergencyIcon = (zoneId: string) => {
    const incident = emergencies.find(e => e.location === zoneId && e.status !== 'resolved');
    if (!incident) return null;
    
    switch (incident.type) {
      case 'medical': return <Heart className="h-4 w-4 text-red-100 animate-bounce" />;
      case 'fire': return <Flame className="h-4 w-4 text-orange-200 animate-pulse" />;
      case 'security': return <ShieldAlert className="h-4 w-4 text-yellow-100 animate-bounce" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-100" />;
    }
  };

  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-slate-100/10 bg-slate-900/40 p-6 backdrop-blur-md">
      {/* Top controls toolbar */}
      <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-4 border-b border-slate-100/10 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <Radio className="h-5 w-5 text-blue-500 animate-pulse" />
            Live Stadium Digital Twin
          </h2>
          <p className="text-xs text-slate-400">Interactive telemetry mapping zone sensors.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowHeatmap(!showHeatmap);
              if (!showHeatmap) setShowEvacPaths(false);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              showHeatmap
                ? 'bg-blue-600/25 text-blue-400 border border-blue-500/30'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Heatmap Layer: {showHeatmap ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => {
              setShowEvacPaths(!showEvacPaths);
              if (!showEvacPaths) setShowHeatmap(false);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              showEvacPaths
                ? 'bg-emerald-600/25 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Evacuation Lines: {showEvacPaths ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full max-w-[480px] overflow-visible rounded-xl bg-slate-950/80 p-6 border border-slate-800/40">
        <svg
          viewBox="-20 -60 480 500"
          className="w-full h-auto cursor-pointer overflow-visible select-none"
        >
          {/* Custom style for dashed path flow animations */}
          <style>{`
            .evac-path {
              stroke-dasharray: 8, 8;
              animation: flowPath 1.2s linear infinite;
            }
            @keyframes flowPath {
              from { stroke-dashoffset: 16; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>

          {/* Grids and labels for reference */}
          <circle cx="200" cy="205" r="160" className="fill-none stroke-slate-800/20" strokeWidth="1" />
          <circle cx="200" cy="205" r="120" className="fill-none stroke-slate-800/20" strokeWidth="1" />

          {/* Outer Transit plazas */}
          {zones.filter(z => z.type === 'transit' || z.type === 'parking').map(z => (
            <rect
              key={z.id}
              x={z.coords.x}
              y={z.coords.y}
              width={z.coords.width || 60}
              height={z.coords.height || 60}
              rx="4"
              className={`transition-all duration-300 stroke-2 ${getZoneColor(z)}`}
              onClick={() => setSelectedZone(z)}
            />
          ))}

          {/* Seating Sectors (Large Rings segments modeled as boxes for clean rendering) */}
          {zones.filter(z => z.type === 'seating').map(z => (
            <rect
              key={z.id}
              x={z.coords.x}
              y={z.coords.y}
              width={z.coords.width}
              height={z.coords.height}
              rx="6"
              className={`transition-all duration-300 stroke-2 cursor-pointer ${getZoneColor(z)}`}
              onClick={() => setSelectedZone(z)}
            />
          ))}

          {/* Concourse rings */}
          {zones.filter(z => z.type === 'concourse').map(z => (
            <rect
              key={z.id}
              x={z.coords.x}
              y={z.coords.y}
              width={z.coords.width}
              height={z.coords.height}
              rx="12"
              className={`transition-all duration-300 stroke-2 cursor-pointer ${getZoneColor(z)}`}
              onClick={() => setSelectedZone(z)}
            />
          ))}

          {/* VIP lounge / Center Pitch representation */}
          <rect x="100" y="145" width="200" height="120" className="fill-emerald-950/20 stroke-slate-800/50" strokeWidth="2" rx="4" />
          <circle cx="200" cy="205" r="25" className="fill-none stroke-slate-800/50" />
          <line x1="200" y1="145" x2="200" y2="265" className="stroke-slate-800/50" />

          {zones.filter(z => z.type === 'vip').map(z => (
            <rect
              key={z.id}
              x={z.coords.x}
              y={z.coords.y}
              width={z.coords.width}
              height={z.coords.height}
              rx="4"
              className={`transition-all duration-300 stroke-2 cursor-pointer ${getZoneColor(z)}`}
              onClick={() => setSelectedZone(z)}
            />
          ))}

          {/* Medical center */}
          {zones.filter(z => z.type === 'medical').map(z => (
            <circle
              key={z.id}
              cx={z.coords.x}
              cy={z.coords.y}
              r={z.coords.r || 10}
              className={`transition-all duration-300 stroke-2 cursor-pointer ${getZoneColor(z)}`}
              onClick={() => setSelectedZone(z)}
            />
          ))}

          {/* Gates (Outer small circles) */}
          {zones.filter(z => z.type === 'gate').map(z => (
            <circle
              key={z.id}
              cx={z.coords.x}
              cy={z.coords.y}
              r={z.coords.r || 10}
              className={`transition-all duration-300 stroke-2 cursor-pointer ${getZoneColor(z)}`}
              onClick={() => setSelectedZone(z)}
            />
          ))}

          {/* Live emergency icon overlay pins */}
          {zones.map(z => {
            const hasEmergency = emergencies.some(e => e.location === z.id && e.status !== 'resolved');
            if (!hasEmergency) return null;
            
            // Render emergency flags
            const cx = z.coords.x + ((z.coords.width || 0) / 2);
            const cy = z.coords.y + ((z.coords.height || 0) / 2);
            return (
              <g key={`pin-${z.id}`}>
                <circle cx={z.coords.r ? z.coords.x : cx} cy={z.coords.r ? z.coords.y : cy} r="18" className="fill-red-600/90 stroke-white stroke-2 animate-ping" />
                <foreignObject
                  x={(z.coords.r ? z.coords.x : cx) - 8}
                  y={(z.coords.r ? z.coords.y : cy) - 8}
                  width="16"
                  height="16"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    {getEmergencyIcon(z.id)}
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Evacuation paths (Dynamic Animated Stroke lines mapping routes to gates A, B, D, E) */}
          {showEvacPaths && (
            <g>
              {/* Concourse B -> Gate B */}
              <path d="M 280 115 Q 340 100 340 45" className="evac-path fill-none stroke-emerald-400 stroke-[3]" />
              {/* Upper concourse -> Gate A */}
              <path d="M 200 85 L 200 15" className="evac-path fill-none stroke-emerald-400 stroke-[3]" />
              {/* Lower concourse -> Gate D */}
              <path d="M 200 315 L 200 385" className="evac-path fill-none stroke-emerald-400 stroke-[3]" />
              {/* South seating -> Gate C */}
              <path d="M 320 345 Q 340 330 340 350" className="evac-path fill-none stroke-emerald-400 stroke-[3]" />
              {/* Southwest concourse -> Gate E */}
              <path d="M 100 285 Q 60 285 60 350" className="evac-path fill-none stroke-emerald-400 stroke-[3]" />
              
              {/* Labels on Evac path exits */}
              <text x="200" y="-8" textAnchor="middle" className="fill-emerald-400 text-[10px] font-bold uppercase">Main Evac Channel A</text>
              <text x="200" y="420" textAnchor="middle" className="fill-emerald-400 text-[10px] font-bold uppercase">Main Evac Channel D</text>
            </g>
          )}

          {/* Labels for landmarks */}
          <text x="200" y="200" textAnchor="middle" className="fill-slate-500 text-[10px] uppercase tracking-wider font-semibold pointer-events-none select-none">PITCH</text>
          <text x="200" y="222" textAnchor="middle" className="fill-slate-600 text-[9px] uppercase pointer-events-none select-none">VIP Club</text>
          <text x="200" y="-35" textAnchor="middle" className="fill-sky-400 text-[8px] uppercase tracking-widest font-bold pointer-events-none select-none">Metro plaza</text>
          <text x="450" y="255" textAnchor="middle" transform="rotate(90 450 250)" className="fill-cyan-400 text-[8px] uppercase tracking-widest font-bold pointer-events-none select-none">Parking Lot East</text>
          
          <text x="200" y="-2" textAnchor="middle" className="fill-slate-400 text-[8px] font-semibold pointer-events-none">GATE A</text>
          <text x="200" y="412" textAnchor="middle" className="fill-slate-400 text-[8px] font-semibold pointer-events-none">GATE D</text>
          <text x="358" y="38" textAnchor="start" className="fill-slate-400 text-[8px] font-semibold pointer-events-none">GATE B</text>
          <text x="358" y="375" textAnchor="start" className="fill-slate-400 text-[8px] font-semibold pointer-events-none">GATE C</text>
          <text x="44" y="375" textAnchor="end" className="fill-slate-400 text-[8px] font-semibold pointer-events-none">GATE E</text>
          <text x="44" y="38" textAnchor="end" className="fill-slate-400 text-[8px] font-semibold pointer-events-none">GATE F</text>
        </svg>

        {/* Live Legend */}
        <div className="mt-4 flex justify-between border-t border-slate-800/60 pt-3 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            <span>Optimal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Congested</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Bottleneck</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <span>Crisis</span>
          </div>
        </div>
      </div>

      {/* Selected Zone Popover panel */}
      {selectedZone && (
        <div className="mt-4 w-full rounded-xl border border-slate-100/10 bg-slate-950/80 p-4 text-left transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase">{selectedZone.name}</h3>
              <p className="text-xs text-slate-400">{selectedZone.description}</p>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-xs text-slate-500 hover:text-slate-200"
            >
              Clear
            </button>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded bg-slate-900 p-2">
              <div className="font-semibold text-slate-300">
                {selectedZone.occupancy.toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500 uppercase">Occupancy</div>
            </div>
            <div className="rounded bg-slate-900 p-2">
              <div className="font-semibold text-slate-300">
                {Math.round((selectedZone.occupancy / selectedZone.capacity) * 100)}%
              </div>
              <div className="text-[9px] text-slate-500 uppercase">Cap. Utilized</div>
            </div>
            <div className="rounded bg-slate-900 p-2">
              <div className="font-semibold text-red-400">
                {selectedZone.riskScore}%
              </div>
              <div className="text-[9px] text-slate-500 uppercase">Safety Risk</div>
            </div>
          </div>
          
          {/* List specific crisis detail if zone has emergency */}
          {emergencies.some(e => e.location === selectedZone.id && e.status !== 'resolved') && (
            <div className="mt-2.5 rounded bg-red-950/30 border border-red-900/50 p-2 text-xs text-red-200">
              <strong>Incident alert:</strong> {emergencies.find(e => e.location === selectedZone.id && e.status !== 'resolved')?.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default DigitalTwin;
