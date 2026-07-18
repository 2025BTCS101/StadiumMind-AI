export interface Zone {
  id: string;
  name: string;
  type: 'gate' | 'seating' | 'concourse' | 'parking' | 'transit' | 'medical' | 'vip';
  capacity: number;
  occupancy: number;
  riskScore: number;
  description: string;
  // SVG coordinates for drawing on the Digital Twin
  coords: { x: number; y: number; r?: number; width?: number; height?: number; path?: string };
}

export interface Concession {
  id: string;
  name: string;
  type: 'food' | 'restroom' | 'merchandise';
  status: 'open' | 'congested' | 'closed';
  queueLength: number; // in people
  inventoryLevel: number; // percentage
  volunteerId?: string;
}

export interface TransitLine {
  id: string;
  name: string;
  type: 'metro' | 'bus' | 'parking';
  status: 'normal' | 'delayed' | 'suspended';
  occupancy: number; // percentage
  frequency: number; // minutes between arrivals
  delayMinutes: number;
  info: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'assigned' | 'offline';
  location: string; // Zone ID
  avatar: string;
  task?: string;
  experienceMatches: number; // Completed tasks count
}

export interface EmergencyIncident {
  id: string;
  type: 'medical' | 'fire' | 'security' | 'power' | 'crowd';
  location: string; // Zone ID
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'responding' | 'resolved';
  description: string;
  assignedVolunteerIds: string[];
  reportedAt: string;
}

export const INITIAL_ZONES: Zone[] = [
  // Seating Sectors
  { id: 'sec-north', name: 'North Seating (Sectors 100-115)', type: 'seating', capacity: 22000, occupancy: 18500, riskScore: 12, description: 'General seating, family-friendly area.', coords: { x: 50, y: 15, width: 300, height: 40 } },
  { id: 'sec-south', name: 'South Seating (Sectors 120-135)', type: 'seating', capacity: 22000, occupancy: 19100, riskScore: 18, description: 'Active fan zone, high movement.', coords: { x: 50, y: 345, width: 300, height: 40 } },
  { id: 'sec-east', name: 'East Seating (Sectors 140-155)', type: 'seating', capacity: 18000, occupancy: 14200, riskScore: 10, description: 'General seating, optimal viewing angle.', coords: { x: 10, y: 65, width: 30, height: 270 } },
  { id: 'sec-west', name: 'West Seating (Sectors 160-175)', type: 'seating', capacity: 18000, occupancy: 13900, riskScore: 8, description: 'General seating, shaded zone.', coords: { x: 360, y: 65, width: 30, height: 270 } },
  
  // VIP Suites
  { id: 'vip-lounge', name: 'VIP Luxury Suites & Club Lounge', type: 'vip', capacity: 3000, occupancy: 2100, riskScore: 2, description: 'Premium hospitality suites.', coords: { x: 120, y: 175, width: 160, height: 50 } },
  
  // Concourse Zones
  { id: 'conc-upper', name: 'Upper Ring Concourse', type: 'concourse', capacity: 15000, occupancy: 4200, riskScore: 15, description: 'Elevated promenade with food and restrooms.', coords: { x: 75, y: 85, width: 250, height: 30 } },
  { id: 'conc-lower', name: 'Lower Ring Concourse', type: 'concourse', capacity: 20000, occupancy: 8500, riskScore: 24, description: 'Ground level corridor, heavy pedestrian traffic.', coords: { x: 75, y: 285, width: 250, height: 30 } },
  
  // Gates
  { id: 'gate-a', name: 'Gate A (Main North Entrance)', type: 'gate', capacity: 15000, occupancy: 4500, riskScore: 15, description: 'Primary flow point from Metro Terminal 1.', coords: { x: 200, y: 5, r: 12 } },
  { id: 'gate-b', name: 'Gate B (Northeast Entrance)', type: 'gate', capacity: 10000, occupancy: 3100, riskScore: 11, description: 'Secondary flow point.', coords: { x: 340, y: 40, r: 10 } },
  { id: 'gate-c', name: 'Gate C (Southeast Entrance)', type: 'gate', capacity: 10000, occupancy: 8200, riskScore: 55, description: 'High congestion near Parking Lot East.', coords: { x: 340, y: 360, r: 10 } },
  { id: 'gate-d', name: 'Gate D (Main South Entrance)', type: 'gate', capacity: 15000, occupancy: 2100, riskScore: 5, description: 'Primary flow point for rideshares.', coords: { x: 200, y: 395, r: 12 } },
  { id: 'gate-e', name: 'Gate E (Southwest Entrance)', type: 'gate', capacity: 10000, occupancy: 1200, riskScore: 4, description: 'Flow point for West Shuttle.', coords: { x: 60, y: 360, r: 10 } },
  { id: 'gate-f', name: 'Gate F (Northwest Entrance)', type: 'gate', capacity: 10000, occupancy: 3900, riskScore: 28, description: 'Flow point for VIP parking and Media hub.', coords: { x: 60, y: 40, r: 10 } },

  // External Areas
  { id: 'transit-hub', name: 'Metro Terminal & Transit Plaza', type: 'transit', capacity: 30000, occupancy: 12000, riskScore: 32, description: 'Metro station and public shuttle bays.', coords: { x: 200, y: -45, width: 120, height: 35 } },
  { id: 'parking-east', name: 'Parking Terminal East', type: 'parking', capacity: 8000, occupancy: 7600, riskScore: 18, description: 'General fan parking, high occupancy.', coords: { x: 425, y: 200, width: 50, height: 100 } },
  { id: 'medical-center', name: 'Main Medical Emergency Center', type: 'medical', capacity: 200, occupancy: 18, riskScore: 1, description: 'Primary trauma and first-aid response facility.', coords: { x: 200, y: 235, r: 15 } }
];

export const INITIAL_CONCESSIONS: Concession[] = [
  { id: 'food-1', name: 'World Cup Grill (Gate A)', type: 'food', status: 'open', queueLength: 15, inventoryLevel: 85 },
  { id: 'food-2', name: 'Taco Fest (Gate C)', type: 'food', status: 'congested', queueLength: 48, inventoryLevel: 25 },
  { id: 'food-3', name: 'FIFA Brews (VIP Lounge)', type: 'food', status: 'open', queueLength: 4, inventoryLevel: 90 },
  { id: 'food-4', name: 'Global Eats (Gate E)', type: 'food', status: 'open', queueLength: 8, inventoryLevel: 65 },
  
  { id: 'restroom-1', name: 'Restroom Block A (North)', type: 'restroom', status: 'open', queueLength: 12, inventoryLevel: 100 },
  { id: 'restroom-2', name: 'Restroom Block C (East)', type: 'restroom', status: 'congested', queueLength: 35, inventoryLevel: 95 },
  { id: 'restroom-3', name: 'Restroom Block D (South)', type: 'restroom', status: 'open', queueLength: 5, inventoryLevel: 100 },
  { id: 'restroom-4', name: 'Restroom Block F (West)', type: 'restroom', status: 'open', queueLength: 18, inventoryLevel: 100 },
  
  { id: 'merch-1', name: 'Official FIFA Fan Shop (Concourse)', type: 'merchandise', status: 'open', queueLength: 25, inventoryLevel: 45 }
];

export const INITIAL_TRANSIT: TransitLine[] = [
  { id: 'metro-line-1', name: 'Metro Line 1 (Downtown - Express)', type: 'metro', status: 'normal', occupancy: 85, frequency: 4, delayMinutes: 0, info: 'Running at maximum capacity.' },
  { id: 'metro-line-2', name: 'Metro Line 2 (Airport - Suburban)', type: 'metro', status: 'normal', occupancy: 60, frequency: 6, delayMinutes: 0, info: 'Regular service.' },
  { id: 'bus-shuttle-east', name: 'East Parking Shuttle (Lot B)', type: 'bus', status: 'delayed', occupancy: 95, frequency: 10, delayMinutes: 12, info: 'Heavy local street traffic causing delays.' },
  { id: 'bus-shuttle-west', name: 'VIP & Press Shuttle Hub', type: 'bus', status: 'normal', occupancy: 35, frequency: 8, delayMinutes: 0, info: 'Regular service.' },
  { id: 'parking-lot-a', name: 'General Public Parking Lot A', type: 'parking', status: 'normal', occupancy: 95, frequency: 0, delayMinutes: 0, info: '95% full. Rerouting traffic to Lot B.' },
  { id: 'parking-lot-b', name: 'Overflow Parking Lot B', type: 'parking', status: 'normal', occupancy: 42, frequency: 0, delayMinutes: 0, info: 'Spaces available. Shuttle transfers running.' }
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'vol-1', name: 'Mateo Silva', role: 'Crowd Marshal', status: 'assigned', location: 'gate-c', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', task: 'Directing flow to Gate D', experienceMatches: 14 },
  { id: 'vol-2', name: 'Sarah Jenkins', role: 'Language Assistant (ES/FR/AR)', status: 'assigned', location: 'gate-a', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces', task: 'Assisting fans at Metro exit', experienceMatches: 22 },
  { id: 'vol-3', name: 'Yuki Tanaka', role: 'Medical First Responder', status: 'idle', location: 'medical-center', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', experienceMatches: 31 },
  { id: 'vol-4', name: 'Liam O\'Connor', role: 'Accessibility Helper', status: 'idle', location: 'gate-d', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', experienceMatches: 9 },
  { id: 'vol-5', name: 'Fatima Al-Sayed', role: 'Operations Assistant', status: 'assigned', location: 'food-2', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', task: 'Coordinating stock delivery', experienceMatches: 18 }
];

export const INITIAL_EMERGENCIES: EmergencyIncident[] = [
  {
    id: 'emg-1',
    type: 'medical',
    location: 'sec-south',
    severity: 'medium',
    status: 'responding',
    description: 'Heat exhaustion - Fan collapsed in Sector 124.',
    assignedVolunteerIds: ['vol-3'],
    reportedAt: '12:35'
  }
];

export interface SimulatorScenario {
  id: string;
  name: string;
  description: string;
  impactMetrics: {
    crowdFlowRate: number; // normal = 100%
    queueTimeMultiplier: number; // normal = 1x
    transitDelayMinutes: number;
    riskIndex: number; // out of 100
  };
  zonesStatus: { zoneId: string; riskScore: number; occupancyMultiplier: number }[];
  concessionStatus: { concessionId: string; status: 'open' | 'congested' | 'closed'; queueLength: number }[];
  transitStatus: { transitId: string; status: 'normal' | 'delayed' | 'suspended'; delayMinutes: number }[];
  emergencies: Omit<EmergencyIncident, 'assignedVolunteerIds' | 'reportedAt'>[];
  actionRecommendation: string;
}

export const SIMULATION_SCENARIOS: Record<string, SimulatorScenario> = {
  rain: {
    id: 'rain',
    name: 'Flash Flooding & Heavy Rain',
    description: 'Sudden high-volume storm causes flooding near Gate E and Metro Terminal. Fans rush inside, creating severe concourse density.',
    impactMetrics: {
      crowdFlowRate: 65,
      queueTimeMultiplier: 2.2,
      transitDelayMinutes: 15,
      riskIndex: 68
    },
    zonesStatus: [
      { zoneId: 'gate-e', riskScore: 75, occupancyMultiplier: 1.8 },
      { zoneId: 'conc-lower', riskScore: 60, occupancyMultiplier: 1.6 },
      { zoneId: 'transit-hub', riskScore: 50, occupancyMultiplier: 1.5 }
    ],
    concessionStatus: [
      { concessionId: 'food-1', status: 'congested', queueLength: 35 },
      { concessionId: 'food-2', status: 'congested', queueLength: 60 },
      { concessionId: 'food-4', status: 'closed', queueLength: 0 } // flooded area
    ],
    transitStatus: [
      { transitId: 'bus-shuttle-east', status: 'delayed', delayMinutes: 25 },
      { transitId: 'metro-line-2', status: 'delayed', delayMinutes: 10 }
    ],
    emergencies: [
      { id: 'sim-emg-1', type: 'crowd', location: 'gate-e', severity: 'high', status: 'reported', description: 'Crush risk at Gate E exit due to rain shelter seekers.' }
    ],
    actionRecommendation: 'Redirect Sector 120-135 entrants to Gate D. Deploy 4 additional Crowd Marshals to Gate E exit. Issue warning announcements in 6 languages. Open lower concourse emergency pathways.'
  },
  metro_strike: {
    id: 'metro_strike',
    name: 'Metro Line 1 Complete Suspend',
    description: 'Signal failure suspends Metro Line 1 (primary public route). 15,000+ egressing fans are stranded at the Transit Plaza, surging rideshare gates.',
    impactMetrics: {
      crowdFlowRate: 40,
      queueTimeMultiplier: 3.5,
      transitDelayMinutes: 45,
      riskIndex: 78
    },
    zonesStatus: [
      { zoneId: 'transit-hub', riskScore: 85, occupancyMultiplier: 2.5 },
      { zoneId: 'gate-a', riskScore: 72, occupancyMultiplier: 2.1 },
      { zoneId: 'gate-d', riskScore: 65, occupancyMultiplier: 1.8 }
    ],
    concessionStatus: [
      { concessionId: 'food-1', status: 'congested', queueLength: 55 },
      { concessionId: 'merch-1', status: 'congested', queueLength: 45 }
    ],
    transitStatus: [
      { transitId: 'metro-line-1', status: 'suspended', delayMinutes: 60 },
      { transitId: 'bus-shuttle-east', status: 'normal', delayMinutes: 0 },
      { transitId: 'parking-lot-b', status: 'normal', delayMinutes: 0 }
    ],
    emergencies: [
      { id: 'sim-emg-2', type: 'security', location: 'transit-hub', severity: 'high', status: 'reported', description: 'Restlessness and verbal altercations at public transit turnstiles.' }
    ],
    actionRecommendation: 'Instantly request emergency bus bridge from local municipality. Direct parking lot shuttles to route passengers to Overflow Parking Lot B. Activate Rideshare Zones C & D at full capacity.'
  },
  gate_closure: {
    id: 'gate_closure',
    name: 'Gate C Breach / Closure',
    description: 'Suspicious unattended bag detected at Gate C. Security establishes a 100-meter safety zone, closing the gate and bottlenecking South and East seating flows.',
    impactMetrics: {
      crowdFlowRate: 50,
      queueTimeMultiplier: 2.8,
      transitDelayMinutes: 5,
      riskIndex: 82
    },
    zonesStatus: [
      { zoneId: 'gate-c', riskScore: 90, occupancyMultiplier: 0.1 }, // evacuated
      { zoneId: 'gate-b', riskScore: 68, occupancyMultiplier: 2.2 }, // redirection load
      { zoneId: 'gate-d', riskScore: 62, occupancyMultiplier: 1.9 }  // redirection load
    ],
    concessionStatus: [
      { concessionId: 'food-2', status: 'closed', queueLength: 0 } // near gate C
    ],
    transitStatus: [
      { transitId: 'bus-shuttle-east', status: 'suspended', delayMinutes: 30 } // suspended shuttle access to East Gate
    ],
    emergencies: [
      { id: 'sim-emg-3', type: 'security', location: 'gate-c', severity: 'critical', status: 'responding', description: 'Suspicious backpack left near security scan arch.' }
    ],
    actionRecommendation: 'Divert all remaining Gate C ticket holders to Gate B (VIP Entrance bypass enabled) and Gate D. Deploy bomb squad first responders. Broadcast emergency evacuation orders for immediate sectors.'
  },
  power_failure: {
    id: 'power_failure',
    name: 'Concourse B Sector Power Outage',
    description: 'Electrical transformer trip cuts power to concourse lighting, ticketing gates, and food stalls in the lower south-east sectors.',
    impactMetrics: {
      crowdFlowRate: 55,
      queueTimeMultiplier: 1.9,
      transitDelayMinutes: 0,
      riskIndex: 74
    },
    zonesStatus: [
      { zoneId: 'conc-lower', riskScore: 80, occupancyMultiplier: 1.5 },
      { zoneId: 'sec-south', riskScore: 45, occupancyMultiplier: 1.1 }
    ],
    concessionStatus: [
      { concessionId: 'food-2', status: 'closed', queueLength: 0 },
      { concessionId: 'restroom-2', status: 'closed', queueLength: 0 }
    ],
    transitStatus: [],
    emergencies: [
      { id: 'sim-emg-4', type: 'power', location: 'conc-lower', severity: 'high', status: 'reported', description: 'Total power loss in south corridor. Emergency backup lights active.' }
    ],
    actionRecommendation: 'Activate aux generators for turnstiles. Deploy volunteers with hand torches to direct crowd flow. Reroute south seating exits to open-air zones. Suspend food sales in Sector B.'
  }
};
