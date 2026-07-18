import { askGeminiAI } from './gemini';
import { Zone, Concession, TransitLine, Volunteer, EmergencyIncident } from '../data/mockStadiumData';

const mockState = {
  zones: [
    { id: 'gate-a', name: 'Gate A', type: 'gate' as const, capacity: 10000, occupancy: 2000, riskScore: 10, description: 'North gate', coords: { x: 0, y: 0 } },
    { id: 'gate-c', name: 'Gate C', type: 'gate' as const, capacity: 10000, occupancy: 8000, riskScore: 75, description: 'East gate', coords: { x: 0, y: 0 } },
    { id: 'sec-south', name: 'Sector South', type: 'seating' as const, capacity: 20000, occupancy: 15000, riskScore: 25, description: 'South seating', coords: { x: 0, y: 0 } }
  ],
  concessions: [
    { id: 'restroom-1', name: 'Restroom Block A', type: 'restroom' as const, status: 'open' as const, queueLength: 5, inventoryLevel: 100 },
    { id: 'food-2', name: 'Taco Fest', type: 'food' as const, status: 'congested' as const, queueLength: 45, inventoryLevel: 10 }
  ],
  transit: [
    { id: 'metro-1', name: 'Metro Line 1', type: 'metro' as const, status: 'normal' as const, occupancy: 60, frequency: 5, delayMinutes: 0, info: 'Regular' }
  ],
  volunteers: [],
  emergencies: [],
  liveStats: {
    attendance: 65000,
    maxCapacity: 80000,
    avgQueueTime: 25,
    riskIndex: 12,
    energyUsage: 2200,
    waterUsage: 780,
    wasteGenerated: 1200,
    carbonFootprint: 100,
    activeStaffCount: 200
  }
};

describe('askGeminiAI Utility Fallback Tests', () => {
  it('should answer restroom locations using local state context when no API key is provided', async () => {
    const reply = await askGeminiAI('Where is the nearest restroom?', mockState);
    expect(reply).toContain('Restroom Block A');
    expect(reply).toContain('5 people');
  });

  it('should diagnose Gate C congestion based on live occupancy percentage', async () => {
    const reply = await askGeminiAI('Why is Gate C congested?', mockState);
    expect(reply).toContain('Gate C');
    expect(reply).toContain('8000');
  });

  it('should return default welcome statement for unrecognized queries', async () => {
    const reply = await askGeminiAI('Who won the match?', mockState);
    expect(reply).toContain('Welcome to StadiumMind AI');
    expect(reply).toContain('65000');
  });
});
