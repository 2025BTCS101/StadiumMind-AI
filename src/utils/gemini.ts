import { Zone, Concession, TransitLine, Volunteer, EmergencyIncident } from '../data/mockStadiumData';

interface SystemStateContext {
  zones: Zone[];
  concessions: Concession[];
  transit: TransitLine[];
  volunteers: Volunteer[];
  emergencies: EmergencyIncident[];
  liveStats: {
    attendance: number;
    avgQueueTime: number;
    riskIndex: number;
    energyUsage: number;
    waterUsage: number;
  };
}

export async function askGeminiAI(
  prompt: string,
  state: SystemStateContext,
  apiKey?: string,
  language: string = 'en'
): Promise<string> {
  const cleanPrompt = prompt.trim().toLowerCase();

  // If API key is present, attempt to query the live Gemini API using fetch
  const keyToUse = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (keyToUse) {
    try {
      const systemContext = `
You are StadiumMind AI, the Predictive Operations Copilot for the FIFA World Cup 2026.
You have access to the following live stadium metrics:
- Total Attendance: ${state.liveStats.attendance}/${80000}
- Average Concession Wait Time: ${state.liveStats.avgQueueTime} minutes
- Stadium Risk Index: ${state.liveStats.riskIndex}/100
- Energy Load: ${state.liveStats.energyUsage} kW
- Water Consumption: ${state.liveStats.waterUsage} L/min

Active Incidents:
${state.emergencies.filter(e => e.status !== 'resolved').map(e => `- ${e.type.toUpperCase()} in ${e.location}: ${e.description} (Severity: ${e.severity})`).join('\n') || 'None'}

Concession Statuses:
${state.concessions.map(c => `- ${c.name} (${c.type}): ${c.status}, Queue: ${c.queueLength} people, Inventory: ${c.inventoryLevel}%`).join('\n')}

Transit Statuses:
${state.transit.map(t => `- ${t.name}: Status: ${t.status}, Delay: ${t.delayMinutes} mins, Info: ${t.info}`).join('\n')}

Gates Statuses:
${state.zones.filter(z => z.type === 'gate').map(z => `- ${z.name}: Occupancy: ${z.occupancy}/${z.capacity}, Risk Score: ${z.riskScore}/100`).join('\n')}

Answer the user's question in a professional, concise, action-oriented manner (maximum 3-4 sentences). Suggest specific operations decisions if relevant. Respond in the requested language: ${language}.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyToUse}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemContext}\n\nUser Question: ${prompt}` }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 250,
              temperature: 0.2
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
      console.warn('Gemini API request failed, falling back to local reasoning.');
    } catch (e) {
      console.error('Error querying Gemini API:', e);
    }
  }

  // Local Reasoning Engine - Returns context-aware predictions using the exact live state
  const getRawResponse = (): string => {
    // 1. Check for specific gate issues
    if (cleanPrompt.includes('gate b') || cleanPrompt.includes('gate-b')) {
      const gate = state.zones.find(z => z.id === 'gate-b');
      return `Gate B (Northeast Entrance) is currently operating at ${Math.round((gate?.occupancy || 0) / (gate?.capacity || 1) * 100)}% capacity. The safety risk score is ${gate?.riskScore}/100. It is a stable fallback if other eastern gates experience congestion.`;
    }
    
    if (cleanPrompt.includes('gate c') || cleanPrompt.includes('gate-c') || cleanPrompt.includes('why is gate c crowded')) {
      const gate = state.zones.find(z => z.id === 'gate-c');
      const isClosed = gate?.riskScore && gate.riskScore > 80;
      if (isClosed) {
        return `Gate C is currently closed due to a security alert regarding an unattended bag. Standard pedestrian traffic is being diverted to Gate B and Gate D, which has caused a spike in queue times at neighboring zones.`;
      }
      return `Gate C is currently highly congested with ${gate?.occupancy} fans in queue, representing ${Math.round((gate?.occupancy || 0) / (gate?.capacity || 1) * 100)}% capacity. This is due to its proximity to Parking Lot East which is at 95% occupancy. I recommend dispatching 2 additional volunteers to reroute fans towards the South Gate D.`;
    }

    if (cleanPrompt.includes('gate a') || cleanPrompt.includes('gate-a')) {
      const gate = state.zones.find(z => z.id === 'gate-a');
      return `Gate A is processing fans from the Metro Plaza. Current queue wait times average ${Math.round((gate?.occupancy || 1000) / 400)} minutes. Operations are normal.`;
    }

    // 2. Check for emergency or evacuation routing
    if (cleanPrompt.includes('evacuate') || cleanPrompt.includes('evacuation') || cleanPrompt.includes('escape') || cleanPrompt.includes('emergency route')) {
      const activeCritical = state.emergencies.find(e => e.severity === 'critical' || e.severity === 'high');
      if (activeCritical) {
        return `EMERGENCY ALERT: Active ${activeCritical.type} incident at ${activeCritical.location}. Evacuation path is established redirecting occupants AWAY from ${activeCritical.location} towards Gates A and D. Exit corridors are highlighted in green flashing signals. Security teams have been deployed to block affected concourse sectors.`;
      }
      return `Standard evacuation protocols are active. All 6 main exit gates are clear. In a general evacuation, occupants in North/East sectors exit via Gates A & B; South/West sectors exit via Gates D & E. VIPs exit via Gate F bypass route.`;
    }

    // 3. Concession congestion inquiries
    if (cleanPrompt.includes('restroom') || cleanPrompt.includes('toilet') || cleanPrompt.includes('bathroom')) {
      const restrooms = state.concessions.filter(c => c.type === 'restroom');
      const shortestQ = [...restrooms].sort((a, b) => a.queueLength - b.queueLength)[0];
      const congested = restrooms.filter(r => r.status === 'congested');
      
      let answer = `Concourse Restroom telemetry shows the shortest queue is at ${shortestQ.name} (${shortestQ.queueLength} people waiting).`;
      if (congested.length > 0) {
        answer += ` Restroom Block C is currently congested due to heavy seating load in Sector 120. Fans are advised to use Block D.`;
      }
      return answer;
    }

    if (cleanPrompt.includes('food') || cleanPrompt.includes('grill') || cleanPrompt.includes('eat') || cleanPrompt.includes('hungry') || cleanPrompt.includes('queue')) {
      const foodStalls = state.concessions.filter(c => c.type === 'food');
      const shortestQ = [...foodStalls].sort((a, b) => a.queueLength - b.queueLength)[0];
      const lowStock = foodStalls.filter(f => f.inventoryLevel < 30);
      
      let answer = `Food Court operations report that ${shortestQ.name} has the shortest queue line (${shortestQ.queueLength} people).`;
      if (lowStock.length > 0) {
        answer += ` Note: ${lowStock.map(l => l.name).join(', ')} is running low on stock (${lowStock[0].inventoryLevel}% remaining). AI has dispatched restocking requests to central kitchen operations.`;
      }
      return answer;
    }

    // 4. Transit inquiries
    if (cleanPrompt.includes('metro') || cleanPrompt.includes('subway') || cleanPrompt.includes('transit') || cleanPrompt.includes('bus') || cleanPrompt.includes('train')) {
      const delays = state.transit.filter(t => t.status === 'delayed' || t.status === 'suspended');
      if (delays.length > 0) {
        return `Transit Monitor: ${delays.map(d => `${d.name} (${d.status.toUpperCase()} - ${d.delayMinutes} min delay)`).join(', ')}. ${delays[0].info} We recommend fans exit via South Gates to access rideshare pickup points or use municipal shuttle transfers.`;
      }
      return `Transit Monitor: All lines (Metro Line 1 & 2, Shuttles) are running on schedule. Average frequency is 5 minutes. Transit Plaza is currently handling egress waves efficiently.`;
    }

    // 5. General simulation/prediction inquiries
    if (cleanPrompt.includes('predict') || cleanPrompt.includes('congestion') || cleanPrompt.includes('next 15 minutes') || cleanPrompt.includes('where is crowd going')) {
      if (state.liveStats.riskIndex > 50) {
        return `PREDICTIVE MODEL ALERT: Crowd density in Lower Concourse is peaking due to the current active incident. Crowd flow models predict Gate B queues will swell by 25% over the next 10 minutes as fans bypass Gate C. Action: Keep digital signage showing detour directions.`;
      }
      return `Predictive analytics models show steady crowd flows. Ingress flow is at 98% complete. Over the next 15 minutes, concourse corridors will see a temporary 10% decrease in density as fans return to seats for the second half kickoff. No bottlenecks predicted.`;
    }

    if (cleanPrompt.includes('volunteer') || cleanPrompt.includes('staff') || cleanPrompt.includes('placement')) {
      const idleVol = state.volunteers.filter(v => v.status === 'idle');
      const assignedVol = state.volunteers.filter(v => v.status === 'assigned');
      return `Staffing Matrix: Out of ${state.volunteers.length} registered event volunteers, ${assignedVol.length} are active on tasks, and ${idleVol.length} are on standby. AI recommends keeping standby volunteers near the Medical Center and Gate C for rapid deploy readiness.`;
    }

    if (cleanPrompt.includes('carbon') || cleanPrompt.includes('sustainability') || cleanPrompt.includes('green') || cleanPrompt.includes('energy') || cleanPrompt.includes('electricity')) {
      const power = state.liveStats.energyUsage;
      const water = state.liveStats.waterUsage;
      return `Sustainability Ledger: Current power draw is ${power} kW (operating at optimal solar-battery mix). Water consumption is ${water} L/min (40% recycled greywater). Carbon footprint is mitigated by 22% due to electric-only municipal shuttle fleets and stadium smart-lighting sensors.`;
    }

    // Default response (Generic Stadiummind assistant)
    return `Welcome to StadiumMind AI. Currently, attendance is at ${state.liveStats.attendance} spectators, and the stadium risk score is ${state.liveStats.riskIndex}/100. I can assist you with queue metrics, gate closures, metro transit details, emergency routing, and volunteer placements. What details can I pull from the smart grid for you?`;
  };

  const rawResult = getRawResponse();
  return translateLocalResponse(rawResult, language);
}

function translateLocalResponse(response: string, lang: string): string {
  if (lang === 'en') return response;

  if (lang === 'es') {
    if (response.includes('operating at') && response.includes('Gate B')) {
      return response
        .replace('Gate B (Northeast Entrance) is currently operating at', 'La Puerta B (Entrada Noreste) está funcionando actualmente al')
        .replace('capacity. The safety risk score is', 'de capacidad. La puntuación de riesgo es')
        .replace('It is a stable fallback if other eastern gates experience congestion.', 'Es una alternativa de desvío estable si otras puertas experimentan congestión.');
    }
    if (response.includes('Gate C is currently closed due to a security alert')) {
      return 'La Puerta C está cerrada actualmente debido a una alerta de seguridad por un bolso abandonado. El tráfico de peatones se está desviando a la Puerta B y la Puerta D, lo que ha provocado un aumento de las esperas en zonas vecinas.';
    }
    if (response.includes('Gate C is currently highly congested with')) {
      return response
        .replace('Gate C is currently highly congested with', 'La Puerta C está actualmente muy congestionada con')
        .replace('fans in queue, representing', 'aficionados en fila, lo que representa el')
        .replace('capacity. This is due to its proximity to Parking Lot East which is at 95% occupancy. I recommend dispatching 2 additional volunteers to reroute fans towards the South Gate D.', 'de capacidad. Esto se debe a su cercanía al Estacionamiento Este. Recomiendo enviar 2 voluntarios adicionales para desviar a los fanáticos hacia la Puerta Sur D.');
    }
    if (response.includes('Gate A is processing fans from the Metro Plaza.')) {
      return response
        .replace('Gate A is processing fans from the Metro Plaza. Current queue wait times average', 'La Puerta A está procesando fanáticos de la Plaza del Metro. El tiempo promedio de espera en cola es de')
        .replace('minutes. Operations are normal.', 'minutos. Las operaciones son normales.');
    }
    if (response.includes('EMERGENCY ALERT: Active')) {
      return response
        .replace('EMERGENCY ALERT: Active', 'ALERTA DE EMERGENCIA: Incidente activo de')
        .replace('incident at', 'en')
        .replace('Evacuation path is established redirecting occupants AWAY from', 'Se ha establecido una ruta de evacuación que redirige a los ocupantes LEJOS de')
        .replace('towards Gates A and D. Exit corridors are highlighted in green flashing signals. Security teams have been deployed to block affected concourse sectors.', 'hacia las Puertas A y D. Los pasillos de salida están resaltados con señales verdes intermitentes. Se han desplegado equipos de seguridad.');
    }
    if (response.includes('Standard evacuation protocols are active.')) {
      return 'Los protocolos estándar de evacuación están activos. Las 6 puertas de salida principales están despejadas. En una evacuación general, los ocupantes de los sectores Norte/Este salen por las Puertas A y B; los de los sectores Sur/Oeste salen por las Puertas D y E. Los VIP salen por la ruta alternativa de la Puerta F.';
    }
    if (response.includes('Concourse Restroom telemetry shows')) {
      return response
        .replace('Concourse Restroom telemetry shows the shortest queue is at', 'La telemetría de baños muestra que la cola más corta está en')
        .replace('people waiting', 'personas esperando')
        .replace('Restroom Block C is currently congested due to heavy seating load in Sector 120. Fans are advised to use Block D.', ' El Bloque de Baños C está congestionado debido a la gran carga en el Sector 120. Se aconseja a los fanáticos usar el Bloque D.');
    }
    if (response.includes('Food Court operations report that')) {
      return response
        .replace('Food Court operations report that', 'Las operaciones del patio de comidas reportan que')
        .replace('has the shortest queue line', 'tiene la cola más corta')
        .replace('people', 'personas')
        .replace('Note:', 'Nota:')
        .replace('is running low on stock', 'tiene pocas existencias')
        .replace('remaining). AI has dispatched restocking requests to central kitchen operations.', 'restante). La IA ha enviado solicitudes de reabastecimiento.');
    }
    if (response.includes('Transit Monitor: All lines (Metro Line 1 & 2, Shuttles)')) {
      return 'Monitor de Tránsito: Todas las líneas (Línea de Metro 1 y 2, Lanzaderas) funcionan según el horario programado. La frecuencia media es de 5 minutos. La Plaza de Tránsito está gestionando el flujo eficientemente.';
    }
    if (response.includes('Transit Monitor:') && response.includes('delay')) {
      return response
        .replace('Transit Monitor:', 'Monitor de Tránsito:')
        .replace('delay', 'de retraso')
        .replace('min', 'minutos')
        .replace('We recommend fans exit via South Gates to access rideshare pickup points or use municipal shuttle transfers.', 'Recomendamos a los fanáticos salir por las Puertas del Sur para acceder a taxis o usar lanzaderas municipales.');
    }
    if (response.includes('PREDICTIVE MODEL ALERT: Crowd density in Lower Concourse')) {
      return 'ALERTA DE MODELO PREDICTIVO: La densidad de multitud en el pasillo inferior está alcanzando su punto máximo debido al incidente activo. Se predice que las colas de la Puerta B aumentarán un 25% en los próximos 10 minutos. Acción: Mantener las pantallas digitales mostrando el desvío.';
    }
    if (response.includes('Predictive analytics models show steady crowd flows.')) {
      return 'Los modelos analíticos predictivos muestran flujos constantes. El ingreso está completo al 98%. En los próximos 15 minutos, la densidad en los pasillos disminuirá temporalmente un 10% a medida que los fanáticos regresen a sus asientos. No se predicen embotellamientos.';
    }
    if (response.includes('Staffing Matrix: Out of')) {
      return response
        .replace('Staffing Matrix: Out of', 'Matriz de Personal: De')
        .replace('registered event volunteers', 'voluntarios registrados')
        .replace('are active on tasks, and', 'están activos y')
        .replace('are on standby. AI recommends keeping standby volunteers near the Medical Center and Gate C for rapid deploy readiness.', 'están en espera. La IA recomienda mantener a los voluntarios de reserva cerca del Centro Médico y la Puerta C.');
    }
    if (response.includes('Sustainability Ledger:')) {
      return response
        .replace('Sustainability Ledger: Current power draw is', 'Libro de Sostenibilidad: El consumo de energía actual es de')
        .replace('kW (operating at optimal solar-battery mix). Water consumption is', 'kW (operando con mezcla óptima solar-batería). El consumo de agua es de')
        .replace('L/min (40% recycled greywater). Carbon footprint is mitigated by 22% due to electric-only municipal shuttle fleets and stadium smart-lighting sensors.', 'L/min (40% agua gris reciclada). La huella de carbono se mitiga en un 22% debido a las flotas de autobuses eléctricos.');
    }
    if (response.includes('Welcome to StadiumMind AI. Currently, attendance is at')) {
      return response
        .replace('Welcome to StadiumMind AI. Currently, attendance is at', 'Bienvenido a StadiumMind AI. Actualmente la asistencia es de')
        .replace('spectators, and the stadium risk score is', 'espectadores, y la puntuación de riesgo es')
        .replace('I can assist you with queue metrics, gate closures, metro transit details, emergency routing, and volunteer placements. What details can I pull from the smart grid for you?', 'Puedo ayudarle con métricas de colas, cierres de puertas, tránsito del metro, rutas de emergencia y asignación de voluntarios. ¿Qué información desea conocer?');
    }
  }

  if (lang === 'fr') {
    if (response.includes('operating at') && response.includes('Gate B')) {
      return response
        .replace('Gate B (Northeast Entrance) is currently operating at', 'La Porte B (Entrée Nord-Est) fonctionne actuellement à')
        .replace('capacity. The safety risk score is', 'de sa capacité. L\'indice de risque est de')
        .replace('It is a stable fallback if other eastern gates experience congestion.', 'C\'est une alternative stable si les autres portes de l\'est sont encombrées.');
    }
    if (response.includes('Gate C is currently closed due to a security alert')) {
      return 'La Porte C est actuellement fermée en raison d\'une alerte de sécurité concernant un sac suspect. Le trafic piéton est dévié vers les Portes B et D, ce qui augmente le temps d\'attente aux zones voisines.';
    }
    if (response.includes('Gate A is processing fans from the Metro Plaza.')) {
      return response
        .replace('Gate A is processing fans from the Metro Plaza. Current queue wait times average', 'La Porte A gère le flux de la place du métro. Le temps d\'attente moyen en file est de')
        .replace('minutes. Operations are normal.', 'minutes. Les opérations sont normales.');
    }
    if (response.includes('Welcome to StadiumMind AI. Currently, attendance is at')) {
      return response
        .replace('Welcome to StadiumMind AI. Currently, attendance is at', 'Bienvenue sur StadiumMind AI. L\'affluence est de')
        .replace('spectators, and the stadium risk score is', 'spectateurs, et l\'indice de risque est de')
        .replace('I can assist you with queue metrics, gate closures, metro transit details, emergency routing, and volunteer placements. What details can I pull from the smart grid for you?', 'Je peux vous renseigner sur les files d\'attente, les portes, les transports, l\'évacuation et les bénévoles.');
    }
  }

  if (lang === 'de') {
    if (response.includes('operating at') && response.includes('Gate B')) {
      return response
        .replace('Gate B (Northeast Entrance) is currently operating at', 'Tor B (Nordost-Eingang) arbeitet derzeit bei')
        .replace('capacity. The safety risk score is', 'Kapazität. Das Sicherheitsrisiko liegt bei')
        .replace('It is a stable fallback if other eastern gates experience congestion.', 'Es dient als stabiler Ausweichpunkt.');
    }
    if (response.includes('Gate C is currently closed due to a security alert')) {
      return 'Tor C ist wegen eines Sicherheitsalarms geschlossen. Der Fußgängerverkehr wird zu Tor B und Tor D umgeleitet.';
    }
    if (response.includes('Gate A is processing fans from the Metro Plaza.')) {
      return response
        .replace('Gate A is processing fans from the Metro Plaza. Current queue wait times average', 'Tor A verarbeitet Besucher vom Metro-Plaza. Wartezeit beträgt')
        .replace('minutes. Operations are normal.', 'Minuten. Normaler Betrieb.');
    }
    if (response.includes('Welcome to StadiumMind AI. Currently, attendance is at')) {
      return response
        .replace('Welcome to StadiumMind AI. Currently, attendance is at', 'Willkommen bei StadiumMind AI. Die Zuschauerzahl beträgt')
        .replace('spectators, and the stadium risk score is', 'Besucher, und das Sicherheitsrisiko liegt bei')
        .replace('I can assist you with queue metrics, gate closures, metro transit details, emergency routing, and volunteer placements. What details can I pull from the smart grid for you?', 'Ich kann Ihnen bei Warteschlangen, Toren, U-Bahnen, Evakuierungsrouten und Freiwilligen helfen.');
    }
  }

  return response;
}
