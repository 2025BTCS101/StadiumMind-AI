# StadiumMind AI 🏟️🤖
### *"The World's First Predictive AI Operating System for Smart Stadiums"*

Built for the **FIFA World Cup 2026™ Smart Stadiums & Tournament Operations Challenge**, **StadiumMind AI** shifts stadium management from reactive damage control to **predictive mitigation**. By combining real-time telemetry, live vector maps, and Generative AI, the platform forecasts crowd dynamics, simulates crisis events, and auto-dispatches resources before problems occur.

---

## 📷 Project Previews & Visuals

| Landing Page | Organizer Command Center |
| --- | --- |
| ![Landing Page Preview](file:///C:/Users/amans/.gemini/antigravity-ide/brain/d13106d3-5196-4307-8d42-1586057ffa9a/landing_page_1784359931736.png) | ![Command Center Preview](file:///C:/Users/amans/.gemini/antigravity-ide/brain/d13106d3-5196-4307-8d42-1586057ffa9a/dashboard_initial_1784360026669.png) |

| Live AI Operations Copilot Chatbot | Mobile Fan Companion Hub |
| --- | --- |
| ![Operations Chatbot Preview](file:///C:/Users/amans/.gemini/antigravity-ide/brain/d13106d3-5196-4307-8d42-1586057ffa9a/chatbot_working_1784362806853.png) | ![Fan Portal Preview](file:///C:/Users/amans/.gemini/antigravity-ide/brain/d13106d3-5196-4307-8d42-1586057ffa9a/fan_portal_1784360798438.png) |

---

## 🏆 Key Workflow Diagrams

### 1. Data Telemetry & GenAI Reasoning Flow
This diagram shows how live sensor streams (attendance gates, concession queues, transit lines) feed into our state contexts, passing real-time structural prompt variables directly to the Gemini API.

```mermaid
graph TD
    A[Sensors & Transit Feeds] -->|Live Metrics Ticker| B(StadiumContext Manager)
    B -->|Active Telemetry State| C{AskGeminiAI Wrapper}
    C -->|If Key Set: REST API Request| D[Google Gemini 2.5 Flash]
    C -->|If Offline: Rule Reasoning| E[Live State Telemetry Solver]
    D -->|Context Advisory Response| F[Dashboard Copilot & Fan Chat]
    E -->|Context Advisory Response| F
```

### 2. Guided Disruption & AI Mitigation Loop
This diagram tracks the sequence of events during a multi-disruption crisis (e.g. rain, gate closure, transit suspend) and how StadiumMind AI automatically reroutes flows and dispatches staff.

```mermaid
graph TD
    A[Event Disruption: Gate Closed/Rain] -->|Spike Density & Risk Score| B(Digital Twin Map)
    B -->|Trigger Warning Lights| C[AI Emergency Copilot]
    C -->|1. Generate Loudspeaker Warning| D[Audio Broadcast Narrator]
    C -->|2. Plot Redirect Vectors| E[SVG Evacuation Vectors]
    C -->|3. Evaluate Standby Staff| F[AI Volunteer Dispatcher]
    F -->|Match Distance & Priority| G[Assign & Route Volunteers]
```

### 3. Fan Assistant Voice & Translation Chain
This illustrates how the Mobile Fan portal handles voice-in, language translation, and audio voice replies in 50+ languages.

```mermaid
graph LR
    A[Fan Voice Query] -->|Web Speech Recog.| B[Text Input]
    B -->|Select Translation Language| C[Gemini AI Context Query]
    C -->|Localized Resolution| D[Translated Output text]
    D -->|Web Speech Synthesis| E[Audio Voice Speaker]
```

---

## 🌟 Core Features

* **Live Digital Twin Stadium Map**: A fully responsive SVG vector map displaying gates, concourse corridors, seating, and parking sectors. Layers include dynamic **occupancy heatmaps**, **active incident indicators**, and **animated exit vectors**.
* **What-If Scenario Simulator**: Models potential disruptions (concourse power failure, flash flooding, metro suspension, gate breaches) to forecast egress delay times and output immediate AI mitigation plans.
* **AI Emergency Copilot**: A response portal for operators to log incidents, allocate ambulance arrival times, and broadcast instant translated security warnings.
* **Mobile Fan Companion Hub**: A pocket assistant for World Cup attendees featuring **speech dictation dictation**, **read-aloud answers**, and automated translations.
* **Smart Sustainability Ledger**: Monitors live resource telemetry—power grid draw, solar photovoltaic battery charge offset, water usage, and carbon emissions.
* **W3C Accessibility Panel**: Fully Section 508 compliant, featuring **High Contrast layout theme**, **Large typography scaling**, and **Dyslexic-friendly typeface configurations**.
* **Post-Match PDF Exporter**: Compiles active scenario logs, security ledgers, volunteer task metrics, and green energy audits into a printable executive document.

---

## 💻 Tech Stack

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, Lucide Icons
* **Backend**: Next.js Server Components, Server-Side API Routing
* **Generative AI**: Google Gemini API (Direct REST fetch Client, falling back to local context reasoning solvers)
* **DevOps**: Vercel & Webpack Compile Engine

---

## 🚀 Quick Start Guide

### 1. Clone the Project
```bash
git clone <repository-url>
cd challenge4
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
*(The platform has built-in local fallback reasoning that maps context states even if an API key is not supplied).*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run local server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🌍 Accessibility Compliance
StadiumMind AI fully conforms to the **WCAG 2.1 AA** guidelines. All widgets support keyboard focus states, visual-contrast overrides, scale configurations, and screen reading narrations via native Web Speech synthesis.
