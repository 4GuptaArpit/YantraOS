# ⚡ YantraOS: The Autonomous Domestic Machine Operating System
> **The Ken Case Competition 2026: The Great Rewiring**  
> **Opening 10: Keeping the Machines Running**  
> *Track: Product Strategy & Build · Team: Shruti, Arpit*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%203-003B57)](https://www.sqlite.org/)
[![Gnani.ai](https://img.shields.io/badge/Voice%20Rail-Gnani.ai-4CAF50)](https://gnani.ai/)
[![Delhivery](https://img.shields.io/badge/Logistics%20Rail-Delhivery-E53935)](https://www.delhivery.com/)
[![Pine Labs](https://img.shields.io/badge/Payments%20Rail-Pine%20Labs-1E88E5)](https://www.pinelabs.com/)

---

## 📌 The Problem & Ground Reality
Across 40 million urban Indian flats, the average household operates 8–14 complex electromechanical appliances (RO purifiers, split ACs, front-load washers, geysers, chimneys). 

Yet, the home operates as an ad-hoc, manual dispatch desk. Households delay maintenance not out of apathy, but because of the dread of becoming an **"at-home hostage"** to unorganized repair logistics:
- Technicians who promise *"bhaiya nikal gaya hu, 10 min me aa raha hu"* over a span of two days.
- Deceptive AMC fine print (e.g., hidden quotas like *"only 2 free visits per year"*) causing technicians to evade free warranty tickets.
- Bitter landlord-tenant arguments regarding who pays for repairs in rented properties.

**YantraOS** rewires domestic machine management into an autonomous operating system that predicts wear, orders genuine parts in advance, negotiates technician visits in vernacular Hinglish, and mediates landlord-tenant escrow settlements with zero manual cognitive overhead.

---

## 🏛️ End-to-End System Architecture

```
                                  [ YANTRA-OS CORE ]
                               (FastAPI / Python Engine)
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
    [ GNANI.AI VOICE ]          [ DELHIVERY LOGISTICS ]         [ PINE LABS ESCROW ]
• Inbound/Outbound telephony • Surface dispatch tracking    • Pre-authorized escrow
• Hinglish speech synthesis   • Genuine OEM spare part order • Landlord-tenant split
• Technician negotiation      • Real-time courier ETA        • OTP-triggered release
• IVR brand dial-tree         • Reverse logistics / returns  • Digital invoice receipt
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          ▼
                               [ YANTRA COMMAND CENTER ]
                                (Next.js 14 + Tailwind)
                   • Digital Machine Twin (RO, AC, Washing Machine)
                   • Living Wear & Tear Curves (TDS, Heat Stress)
                   • Live Audio Waveform & Technician Call Transcript
                   • 1-Tap Biometric Approval & Geofenced OTP
```

---

## 🚀 The Three Partner Rails in Action

### 1. 🎙️ Voice Rail: **Gnani.ai**
- **The Ground Truth:** Indian technicians do not use Calendly; they call and speak colloquial Hinglish.
- **How YantraOS Runs on Gnani:** When a breakdown is triaged, YantraOS deploys a low-latency conversational agent via Gnani.ai that dials the mechanic, counters unrealistic arrival claims, shares exact Google Calendar openings, and locks a firm 45-minute window.

### 2. 📦 Logistics Rail: **Delhivery**
- **The Ground Truth:** Technicians arrive without parts or substitute counterfeit components, causing multi-day delays.
- **How YantraOS Runs on Delhivery:** The agent diagnoses the machine fault (e.g. sediment filter choke) and orders genuine OEM parts dispatched via Delhivery Express. The part arrives at the customer's doorstep *before* the technician visits.

### 3. 💳 Payments Rail: **Pine Labs**
- **The Ground Truth:** Upfront repair payments leave customers vulnerable to shoddy work; rental repairs cause landlord-tenant disputes.
- **How YantraOS Runs on Pine Labs:** Pine Labs Plural holds repair fees in milestone escrow. It parses rental leases to split costs automatically (e.g., Clause 14B: repairs >₹1,000 billed 100% to landlord). Escrow is cryptographically settled only when the technician's geofenced doorstep OTP is verified.

---

## ⚡ Quick Start: Running YantraOS Locally

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Start the Backend API (FastAPI)
```bash
cd backend
python -m app.seed   # Seeds initial machines and real RO incident data
python -m uvicorn app.main:app --port 8000 --reload
```
*API Swagger Documentation available at:* `http://localhost:8000/docs`

### 2. Start the Executive Command Center (Next.js)
```bash
cd frontend
npm run dev
```
*Open:* `http://localhost:3000` to view the interactive dashboard.

---

## 📊 Live Scenario Demonstration: The Muddy Water RO Emergency
- **Incident:** Sudden municipal muddy water surge (Delhi Jal Board) spikes TDS to 920 ppm, choking the Kent Grand+ sediment pre-filter.
- **AMC Fine Print Trap:** Free AMC visits exhausted (0 remaining); technician evades visit.
- **Autonomous Resolution:**
  1. YantraOS detects flow drop and wear curve breach.
  2. Delhivery dispatches OEM replacement cartridge (AWB: `DEL_88291039`, ETA: 2:15 PM).
  3. Gnani.ai voice bot calls technician Ramesh, aligns his visit with the part delivery, and locks 3:30 PM.
  4. Pine Labs locks ₹1,450 in escrow (100% Landlord liability via Clause 14B).
  5. Doorstep OTP `7492` releases funds upon successful filter replacement.

---

## 📄 License & Confidentiality
Developed for **The Ken Case Competition 2026: The Great Rewiring**.  
All rights reserved © 2026 Team YantraOS.
