import { Zone, Concession, TransitLine, Volunteer, EmergencyIncident } from '../data/mockStadiumData';

interface ReportData {
  matchName: string;
  score: string;
  minute: number;
  zones: Zone[];
  concessions: Concession[];
  transit: TransitLine[];
  volunteers: Volunteer[];
  emergencies: EmergencyIncident[];
  liveStats: {
    attendance: number;
    maxCapacity: number;
    avgQueueTime: number;
    riskIndex: number;
    energyUsage: number;
    waterUsage: number;
    wasteGenerated: number;
    carbonFootprint: number;
  };
  currentScenarioName: string;
}

export function exportMatchReport(data: ReportData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up blocked! Please allow pop-ups to download the AI report.');
    return;
  }

  const resolvedEmergencies = data.emergencies.filter(e => e.status === 'resolved');
  const busyGates = [...data.zones]
    .filter(z => z.type === 'gate')
    .sort((a, b) => b.occupancy - a.occupancy)
    .slice(0, 3);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>StadiumMind AI - Post-Match Executive Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        body {
          font-family: 'Outfit', sans-serif;
          color: #1e293b;
          background: #ffffff;
          margin: 0;
          padding: 40px;
          line-height: 1.5;
        }
        .header {
          border-bottom: 3px solid #1e3a8a;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: -0.5px;
        }
        .header .subtitle {
          color: #2563eb;
          font-size: 14px;
          font-weight: 600;
          margin-top: 5px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .meta-item label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .meta-item span {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }
        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #1e3a8a;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
          margin-top: 30px;
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        .summary-box {
          background: #eff6ff;
          border-left: 4px solid #2563eb;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 25px;
          font-size: 14px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .stat-card {
          border: 1px solid #e2e8f0;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
        }
        .stat-card .val {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }
        .stat-card .lbl {
          font-size: 12px;
          color: #64748b;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
          font-size: 13px;
        }
        th {
          background: #f1f5f9;
          text-align: left;
          padding: 10px;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 600;
          border-radius: 12px;
          text-transform: uppercase;
        }
        .badge.critical { background: #fee2e2; color: #991b1b; }
        .badge.high { background: #ffedd5; color: #9a3412; }
        .badge.medium { background: #fef9c3; color: #713f12; }
        .badge.low { background: #e0f2fe; color: #075985; }
        .badge.success { background: #dcfce7; color: #166534; }
        .footer {
          margin-top: 50px;
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
          font-size: 11px;
          color: #64748b;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-end;">
        <button onclick="window.print();" style="background: #2563eb; color: white; border: none; padding: 10px 20px; font-family: inherit; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
          Print / Save PDF
        </button>
      </div>

      <div class="header">
        <div>
          <h1>StadiumMind AI Operations Report</h1>
          <div class="subtitle">FIFA World Cup 2026 Smart Stadium Command Center</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: 800; color: #1e3a8a;">FIFA 2026</div>
          <div style="font-size: 11px; color: #64748b;">Report ID: SM-${Math.floor(100000 + Math.random() * 900000)}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <label>Match fixture</label>
          <span>${data.matchName}</span>
        </div>
        <div class="meta-item">
          <label>Score line</label>
          <span>${data.score} (${data.minute}')</span>
        </div>
        <div class="meta-item">
          <label>Active Simulation</label>
          <span>${data.currentScenarioName || 'None (Normal Operations)'}</span>
        </div>
        <div class="meta-item">
          <label>Report Generated</label>
          <span>${new Date().toLocaleString()}</span>
        </div>
      </div>

      <div class="section-title">Executive Summary</div>
      <div class="summary-box">
        <strong>Predictive AI Summary:</strong> The stadium operated with a peak attendance of <strong>${data.liveStats.attendance.toLocaleString()}</strong> fans (${Math.round((data.liveStats.attendance/data.liveStats.maxCapacity)*100)}% capacity). Under the <strong>${data.currentScenarioName || 'Baseline'}</strong> scenario, StadiumMind AI dynamically adjusted pedestrian channels, diverted gate flows, and auto-allocated resources. Security reports show <strong>${resolvedEmergencies.length}</strong> incident(s) resolved with response times averaging under 90 seconds. Crowd flow was optimized to maintain safety risk metrics at <strong>${data.liveStats.riskIndex}/100</strong>.
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="val">${data.liveStats.avgQueueTime} mins</div>
          <div class="lbl">Avg. Concession Wait Time</div>
        </div>
        <div class="stat-card">
          <div class="val">${data.liveStats.energyUsage} kW</div>
          <div class="lbl">Peak Power Consumption</div>
        </div>
        <div class="stat-card">
          <div class="val">${data.liveStats.carbonFootprint} kg CO₂e</div>
          <div class="lbl">Total Carbon Footprint</div>
        </div>
      </div>

      <div class="section-title">Safety & Security Incident Ledger</div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Location</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Description</th>
            <th>Reported</th>
          </tr>
        </thead>
        <tbody>
          ${data.emergencies.map(e => `
            <tr>
              <td><strong>${e.id}</strong></td>
              <td>${e.type.toUpperCase()}</td>
              <td>${e.location}</td>
              <td><span class="badge ${e.severity}">${e.severity}</span></td>
              <td><span class="badge ${e.status === 'resolved' ? 'success' : 'high'}">${e.status}</span></td>
              <td>${e.description}</td>
              <td>${e.reportedAt}</td>
            </tr>
          `).join('') || '<tr><td colspan="7" style="text-align:center;">No incidents logged during this match.</td></tr>'}
        </tbody>
      </table>

      <div class="section-title">Transit & Gate Flow Analysis</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <h3>Top 3 Congested Gates</h3>
          <table>
            <thead>
              <tr>
                <th>Gate</th>
                <th>Spectators</th>
                <th>Risk Score</th>
              </tr>
            </thead>
            <tbody>
              ${busyGates.map(bg => `
                <tr>
                  <td><strong>${bg.name}</strong></td>
                  <td>${bg.occupancy.toLocaleString()} / ${bg.capacity.toLocaleString()}</td>
                  <td><span class="badge ${bg.riskScore > 50 ? 'high' : 'low'}">${bg.riskScore}/100</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Transit Line Statuses</h3>
          <table>
            <thead>
              <tr>
                <th>Transit Line</th>
                <th>Status</th>
                <th>Delay</th>
              </tr>
            </thead>
            <tbody>
              ${data.transit.map(t => `
                <tr>
                  <td><strong>${t.name}</strong></td>
                  <td><span class="badge ${t.status === 'normal' ? 'success' : 'high'}">${t.status}</span></td>
                  <td>${t.delayMinutes} mins</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="section-title">Volunteer & Staff Allocations</div>
      <table>
        <thead>
          <tr>
            <th>Volunteer Name</th>
            <th>Role</th>
            <th>Current Location</th>
            <th>Status</th>
            <th>Assigned Task</th>
            <th>Exp. (Tasks Completed)</th>
          </tr>
        </thead>
        <tbody>
          ${data.volunteers.map(v => `
            <tr>
              <td><strong>${v.name}</strong></td>
              <td>${v.role}</td>
              <td>${v.location}</td>
              <td><span class="badge ${v.status === 'idle' ? 'low' : 'success'}">${v.status}</span></td>
              <td>${v.task || 'On Standby'}</td>
              <td>${v.experienceMatches} tasks</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="section-title">Sustainability Ledger</div>
      <div style="font-size: 13px; margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <strong>Water Metrics:</strong><br/>
          Current Draw: ${data.liveStats.waterUsage} L/min<br/>
          Waste generated: ${data.liveStats.wasteGenerated} kg<br/>
          Recycled water: 42% (Greywater systems active)
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <strong>Energy Metrics:</strong><br/>
          Peak Load: ${data.liveStats.energyUsage} kW<br/>
          Solar Offset: 450 kW (Photovoltaic roof active)<br/>
          Battery storage draw: 120 kW
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <strong>Transportation Impact:</strong><br/>
          Metro occupancy: 82% average<br/>
          Carbon footprint: ${data.liveStats.carbonFootprint} kg CO₂e<br/>
          Rideshare lane efficiency: High
        </div>
      </div>

      <div class="section-title">AI Optimization Recommendations (Next Match)</div>
      <ul style="font-size: 13px; padding-left: 20px; line-height: 1.6;">
        <li><strong>Redistribution of Shuttle Busses:</strong> Given the ${data.transit.find(t => t.id === 'bus-shuttle-east')?.delayMinutes || 0} min delays on East Shuttles, recommend dispatching 4 standby busses from West Terminal 35 minutes prior to full time.</li>
        <li><strong>Pre-emptive Concession Staffing:</strong> Increase staff density at ${data.concessions.find(c => c.id === 'food-2')?.name || 'Taco Fest'} during peak half-time window to reduce current average queues.</li>
        <li><strong>Gate Closure Resiliency:</strong> In case of future Gate closures, dynamic audio routing should begin immediately on the adjacent upper ring promenades to redirect foot traffic before exits bottleneck.</li>
      </ul>

      <div class="footer">
        <span>StadiumMind AI Operating System &copy; 2026. All Rights Reserved.</span>
        <span>Generated by System Copilot on behalf of FIFA Venue Operations.</span>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
