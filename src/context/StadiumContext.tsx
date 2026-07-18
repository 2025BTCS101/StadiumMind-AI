'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Zone,
  Concession,
  TransitLine,
  Volunteer,
  EmergencyIncident,
  INITIAL_ZONES,
  INITIAL_CONCESSIONS,
  INITIAL_TRANSIT,
  INITIAL_VOLUNTEERS,
  INITIAL_EMERGENCIES,
  SIMULATION_SCENARIOS,
  SimulatorScenario
} from '../data/mockStadiumData';

export interface AlertLog {
  id: string;
  time: string;
  category: 'system' | 'security' | 'transit' | 'operations' | 'emergency';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  resolved: boolean;
}

export interface StadiumContextType {
  zones: Zone[];
  concessions: Concession[];
  transit: TransitLine[];
  volunteers: Volunteer[];
  emergencies: EmergencyIncident[];
  alerts: AlertLog[];
  liveStats: {
    attendance: number;
    maxCapacity: number;
    avgQueueTime: number;
    riskIndex: number;
    energyUsage: number; // kW
    waterUsage: number; // Liters/min
    wasteGenerated: number; // kg
    carbonFootprint: number; // kg CO2e
    activeStaffCount: number;
  };
  currentScenario: SimulatorScenario | null;
  matchInfo: {
    matchName: string;
    score: string;
    minute: number;
    timeline: string;
  };
  triggerScenario: (scenarioId: string) => void;
  resetScenario: () => void;
  reportEmergency: (type: 'medical' | 'fire' | 'security' | 'power' | 'crowd', location: string, description: string) => void;
  resolveEmergency: (id: string) => void;
  assignVolunteer: (volunteerId: string, locationId: string, taskDescription?: string) => void;
  autoAllocateVolunteers: () => void;
  addAlert: (category: AlertLog['category'], message: string, severity: AlertLog['severity']) => void;
  resolveAlert: (id: string) => void;
  triggerNextMatchMinute: () => void;
}

const StadiumContext = createContext<StadiumContextType | undefined>(undefined);

export const StadiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live State
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [concessions, setConcessions] = useState<Concession[]>(INITIAL_CONCESSIONS);
  const [transit, setTransit] = useState<TransitLine[]>(INITIAL_TRANSIT);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [emergencies, setEmergies] = useState<EmergencyIncident[]>(INITIAL_EMERGENCIES);
  const [alerts, setAlerts] = useState<AlertLog[]>([
    { id: 'a1', time: '12:00', category: 'system', message: 'StadiumMind AI Operating System Online.', severity: 'info', resolved: false },
    { id: 'a2', time: '12:15', category: 'transit', message: 'Shuttle Bus East encountering traffic delays.', severity: 'warning', resolved: false },
    { id: 'a3', time: '12:35', category: 'emergency', message: 'Medical distress in South seating Sector 124.', severity: 'warning', resolved: false }
  ]);

  const [currentScenario, setCurrentScenario] = useState<SimulatorScenario | null>(null);
  const [matchInfo, setMatchInfo] = useState({
    matchName: 'USA vs England — FIFA World Cup Group B',
    score: 'USA 1 - 1 ENG',
    minute: 72,
    timeline: 'Second Half - Intensive midfield pressure.'
  });

  const [liveStats, setLiveStats] = useState({
    attendance: 69420,
    maxCapacity: 80000,
    avgQueueTime: 14,
    riskIndex: 12,
    energyUsage: 2450, // kW
    waterUsage: 840, // Liters/min
    wasteGenerated: 1842, // kg
    carbonFootprint: 145, // kg
    activeStaffCount: 245
  });

  // Keep references to access inside timers
  const stateRef = useRef({ zones, concessions, transit, volunteers, emergencies, alerts, liveStats, currentScenario });
  useEffect(() => {
    stateRef.current = { zones, concessions, transit, volunteers, emergencies, alerts, liveStats, currentScenario };
  }, [zones, concessions, transit, volunteers, emergencies, alerts, liveStats, currentScenario]);

  // Utility to generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Core alert adder
  const addAlert = (category: AlertLog['category'], message: string, severity: AlertLog['severity']) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newAlert: AlertLog = {
      id: generateId(),
      time,
      category,
      message,
      severity,
      resolved: false
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 50)); // cap at 50 logs
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  // Run Real-Time Sensor Mock Fluctuations (Ticks every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = stateRef.current;
      
      // 1. Attendance increases/decreases slightly
      const isFilling = cur.liveStats.attendance < cur.liveStats.maxCapacity * 0.95;
      const attendanceDelta = isFilling 
        ? Math.floor(Math.random() * 25) + 5 
        : Math.floor(Math.random() * 11) - 5;
      const newAttendance = Math.min(
        cur.liveStats.maxCapacity,
        Math.max(50000, cur.liveStats.attendance + attendanceDelta)
      );

      // 2. Fluctuations in sustainability metrics
      const energyDelta = Math.floor(Math.random() * 21) - 10;
      const waterDelta = Math.floor(Math.random() * 15) - 7;
      const wasteDelta = Math.floor(Math.random() * 5) + 1; // constantly accumulates
      
      // 3. Fluctuations in concessions queue wait times
      const updatedConcessions = cur.concessions.map(c => {
        if (c.status === 'closed') return c;
        // slightly fluctuate queues
        const qDelta = Math.floor(Math.random() * 3) - 1;
        const newQ = Math.max(1, c.queueLength + qDelta);
        const status = newQ > 30 ? 'congested' : 'open';
        return {
          ...c,
          queueLength: newQ,
          status,
          inventoryLevel: Math.max(5, c.inventoryLevel - (Math.random() > 0.8 ? 2 : 0))
        };
      });

      // Calculate new average queue time
      const totalQ = updatedConcessions.reduce((acc, c) => acc + c.queueLength, 0);
      const avgQ = Math.round(totalQ / updatedConcessions.length);

      // 4. Update zones occupancies slightly to reflect crowd moving
      const updatedZones = cur.zones.map(z => {
        if (z.type === 'seating') {
          // seating stays fairly stable during game
          return { ...z, occupancy: Math.min(z.capacity, Math.max(10000, z.occupancy + Math.floor(Math.random() * 7) - 3)) };
        } else if (z.type === 'gate' || z.type === 'concourse' || z.type === 'transit') {
          // gates fluctuate more
          const mult = cur.currentScenario ? 1.5 : 1.0;
          return { ...z, occupancy: Math.min(z.capacity, Math.max(200, z.occupancy + (Math.floor(Math.random() * 51) - 25) * mult)) };
        }
        return z;
      });

      // Dynamic risk index calculation based on active emergencies, delays, and gate status
      let baseRisk = 8;
      if (cur.emergencies.some(e => e.status !== 'resolved')) {
        const severeCount = cur.emergencies.filter(e => e.severity === 'critical' || e.severity === 'high').length;
        baseRisk += severeCount * 18 + (cur.emergencies.length - severeCount) * 8;
      }
      if (cur.currentScenario) {
        baseRisk += cur.currentScenario.impactMetrics.riskIndex * 0.6;
      }
      const finalRisk = Math.min(99, Math.max(5, Math.round(baseRisk + (Math.random() * 4 - 2))));

      setConcessions(updatedConcessions);
      setZones(updatedZones);
      setLiveStats(prev => ({
        ...prev,
        attendance: newAttendance,
        avgQueueTime: avgQ,
        energyUsage: Math.max(1500, prev.energyUsage + energyDelta),
        waterUsage: Math.max(500, prev.waterUsage + waterDelta),
        wasteGenerated: prev.wasteGenerated + wasteDelta,
        carbonFootprint: Math.round(prev.carbonFootprint + (prev.energyUsage / 10000)),
        riskIndex: finalRisk
      }));

    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Scenario trigger implementation
  const triggerScenario = (scenarioId: string) => {
    const scenario = SIMULATION_SCENARIOS[scenarioId];
    if (!scenario) return;

    setCurrentScenario(scenario);
    addAlert('system', `AI SCENARIO RUNNING: ${scenario.name} simulated.`, 'warning');

    // Apply scenario status overrides
    // 1. Update Transit
    setTransit((prev) =>
      prev.map((t) => {
        const override = scenario.transitStatus.find((os) => os.transitId === t.id);
        if (override) {
          return {
            ...t,
            status: override.status,
            delayMinutes: override.delayMinutes,
            info: `SIMULATED: ${override.status.toUpperCase()} (${override.delayMinutes} mins delay)`
          };
        }
        return t;
      })
    );

    // 2. Update Zones
    setZones((prev) =>
      prev.map((z) => {
        const override = scenario.zonesStatus.find((oz) => oz.zoneId === z.id);
        if (override) {
          return {
            ...z,
            riskScore: override.riskScore,
            occupancy: Math.min(z.capacity, Math.round(z.occupancy * override.occupancyMultiplier))
          };
        }
        return z;
      })
    );

    // 3. Update Concessions
    setConcessions((prev) =>
      prev.map((c) => {
        const override = scenario.concessionStatus.find((oc) => oc.concessionId === c.id);
        if (override) {
          return {
            ...c,
            status: override.status,
            queueLength: override.queueLength
          };
        }
        return c;
      })
    );

    // 4. Inject Scenario Emergencies
    setEmergies((prev) => {
      const currentSimEmgIds = new Set(prev.map(e => e.id));
      const newEmergencies: EmergencyIncident[] = scenario.emergencies
        .filter(se => !currentSimEmgIds.has(se.id))
        .map((se) => ({
          ...se,
          assignedVolunteerIds: [],
          reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      
      newEmergencies.forEach(ne => {
        addAlert('emergency', `AI EMERGENCY DETECTED: ${ne.description}`, ne.severity === 'critical' ? 'critical' : 'warning');
      });

      return [...newEmergencies, ...prev];
    });

    // Bump global dashboard risk metrics
    setLiveStats((prev) => ({
      ...prev,
      avgQueueTime: Math.round(prev.avgQueueTime * scenario.impactMetrics.queueTimeMultiplier),
      riskIndex: Math.min(99, prev.riskIndex + scenario.impactMetrics.riskIndex)
    }));
  };

  const resetScenario = () => {
    if (!currentScenario) return;

    addAlert('system', `AI SCENARIO RESOLVED: Restoring systems to standard levels.`, 'info');
    setCurrentScenario(null);

    // Reset components to initial states (or current baseline states)
    setTransit(INITIAL_TRANSIT);
    setZones(INITIAL_ZONES);
    setConcessions(INITIAL_CONCESSIONS);
    
    // Resolve any simulation-generated emergencies
    setEmergies((prev) => prev.filter(e => !e.id.startsWith('sim-')));
  };

  // Emergency Handlers
  const reportEmergency = (
    type: 'medical' | 'fire' | 'security' | 'power' | 'crowd',
    location: string,
    description: string
  ) => {
    const id = 'emg-' + generateId();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const severity = type === 'fire' || type === 'crowd' ? 'high' : 'medium';
    
    const newEmergency: EmergencyIncident = {
      id,
      type,
      location,
      severity,
      status: 'reported',
      description,
      assignedVolunteerIds: [],
      reportedAt: time
    };

    setEmergies((prev) => [newEmergency, ...prev]);
    addAlert('emergency', `NEW EMERGENCY REPORTED: ${description} (Location: ${location})`, severity === 'high' ? 'critical' : 'warning');

    // Auto-allocate volunteers for this emergency
    setTimeout(() => {
      // Find idle volunteers
      const idleVol = stateRef.current.volunteers.find(v => v.status === 'idle');
      if (idleVol) {
        assignVolunteer(idleVol.id, location, `Respond to ${type} emergency - ${description}`);
      }
    }, 1000);
  };

  const resolveEmergency = (id: string) => {
    setEmergies((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          // Release volunteers
          setVolunteers((vols) =>
            vols.map((v) =>
              e.assignedVolunteerIds.includes(v.id)
                ? { ...v, status: 'idle', task: undefined, experienceMatches: v.experienceMatches + 1 }
                : v
            )
          );
          addAlert('emergency', `Incident Resolved: ${e.description}`, 'info');
          return { ...e, status: 'resolved' as const };
        }
        return e;
      })
    );
  };

  // Volunteer Handlers
  const assignVolunteer = (volunteerId: string, locationId: string, taskDescription?: string) => {
    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === volunteerId) {
          addAlert('operations', `Staff re-allocated: ${v.name} dispatched to ${locationId}.`, 'info');
          return {
            ...v,
            status: 'assigned',
            location: locationId,
            task: taskDescription || 'General operational assistance'
          };
        }
        return v;
      })
    );

    // Link back to emergency incident if one is in this location
    setEmergies((prev) =>
      prev.map((e) => {
        if (e.location === locationId && e.status !== 'resolved' && !e.assignedVolunteerIds.includes(volunteerId)) {
          return {
            ...e,
            status: 'responding',
            assignedVolunteerIds: [...e.assignedVolunteerIds, volunteerId]
          };
        }
        return e;
      })
    );
  };

  const autoAllocateVolunteers = () => {
    const activeEmergencies = stateRef.current.emergencies.filter(e => e.status !== 'resolved');
    if (activeEmergencies.length === 0) {
      addAlert('operations', 'AI Dispatch: No active incidents found. Staff optimized at gates.', 'info');
      
      // Balance volunteers across busy gates
      setVolunteers((prev) => {
        const sortedGates = [...stateRef.current.zones]
          .filter(z => z.type === 'gate')
          .sort((a, b) => b.occupancy - a.occupancy);
        
        let gateIdx = 0;
        return prev.map(v => {
          if (v.status === 'idle') {
            const targetGate = sortedGates[gateIdx % sortedGates.length];
            gateIdx++;
            return {
              ...v,
              status: 'assigned',
              location: targetGate.id,
              task: `Manage high traffic flow at ${targetGate.name}`
            };
          }
          return v;
        });
      });
      return;
    }

    addAlert('operations', 'AI Auto-Dispatch active. Rerouting volunteers by priority.', 'info');
    
    // Assign nearest idle volunteers to active emergencies
    setVolunteers((prev) => {
      let emgIdx = 0;
      return prev.map((vol) => {
        if (vol.status === 'idle' && activeEmergencies.length > 0) {
          const emg = activeEmergencies[emgIdx % activeEmergencies.length];
          emgIdx++;
          
          // Dispatch
          setTimeout(() => {
            setEmergies((currEmg) =>
              currEmg.map((e) =>
                e.id === emg.id ? { ...e, status: 'responding', assignedVolunteerIds: [...e.assignedVolunteerIds, vol.id] } : e
              )
            );
          }, 100);

          return {
            ...vol,
            status: 'assigned',
            location: emg.location,
            task: `Emergency Support - ${emg.description}`
          };
        }
        return vol;
      });
    });
  };

  // Match Simulation Time Increments
  const triggerNextMatchMinute = () => {
    setMatchInfo((prev) => {
      const nextMin = prev.minute + 1;
      let score = prev.score;
      let timeline = prev.timeline;

      if (nextMin === 75) {
        score = 'USA 2 - 1 ENG';
        timeline = 'GOAL! USA scores via a penalty kick! Stadium crowd intensity peaking.';
        addAlert('system', 'MATCH UPDATE: USA 2 - 1 ENG (75\'). Scoreboard updated.', 'info');
      } else if (nextMin === 88) {
        score = 'USA 2 - 2 ENG';
        timeline = 'GOAL! England equalizes with a header from a corner kick! Intense drama.';
        addAlert('system', 'MATCH UPDATE: USA 2 - 2 ENG (88\'). Scoreboard updated.', 'info');
      } else if (nextMin > 90) {
        timeline = 'Full Time nearing. High crowd movement expected towards exits shortly.';
      } else {
        timeline = `Minute ${nextMin} - Action continues on the pitch.`;
      }

      return {
        ...prev,
        minute: nextMin,
        score,
        timeline
      };
    });
  };

  return (
    <StadiumContext.Provider
      value={{
        zones,
        concessions,
        transit,
        volunteers,
        emergencies,
        alerts,
        liveStats,
        currentScenario,
        matchInfo,
        triggerScenario,
        resetScenario,
        reportEmergency,
        resolveEmergency,
        assignVolunteer,
        autoAllocateVolunteers,
        addAlert,
        resolveAlert,
        triggerNextMatchMinute
      }}
    >
      {children}
    </StadiumContext.Provider>
  );
};

export const useStadiumState = () => {
  const context = useContext(StadiumContext);
  if (!context) {
    throw new Error('useStadiumState must be used within a StadiumProvider');
  }
  return context;
};
export default StadiumContext;
