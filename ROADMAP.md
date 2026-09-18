# ⚡ YantraOS: The Autonomous Domestic Machine Operating System
### The Ken Case Competition 2026: The Great Rewiring (Round 2 Build)
**Opening 10: Keeping the Machines Running**  
*Stack: FastAPI (Python 3.14) · Next.js 14 App Router · TailwindCSS · SQLite/SQLAlchemy · Partner Rails (Gnani.ai, Delhivery, Pine Labs)*

---

## 🗺️ Master Engineering Roadmap & Progress Tracker

```
[PROGRESS: 0 / 6 PHASES COMPLETED]
[████████████████████████████████████████] 0%
```

| Phase | Module | Scope & Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **System Blueprint & Architecture** | Project scaffolding, documentation, environment config, architecture specs | ⏳ **IN PROGRESS** |
| **Phase 2** | **Core Backend & Data Models** | SQLite Database, SQLAlchemy schemas, Appliance State Graph, Seed data | ⚪ Planned |
| **Phase 3** | **The Three Partner Rails (Adapters)** | **Gnani.ai** (Voice/IVR), **Delhivery** (Spare parts dispatch), **Pine Labs** (Escrow/Split) | ⚪ Planned |
| **Phase 4** | **Autonomous Agent Orchestrator** | End-to-End incident loop (Muddy water RO incident & Landlord-Tenant AC split) | ⚪ Planned |
| **Phase 5** | **Executive Command Center UI** | Next.js 14 Dashboard, Live Audio Waveform Player, Delhivery Tracker, Pine Labs Card | ⚪ Planned |
| **Phase 6** | **Demo Showcase & Verification** | End-to-end simulation test, audio asset generation, GitHub repo polish & README | ⚪ Planned |

---

## 🏗️ Detailed Phase Specifications

### Phase 1: Foundation & Project Structure
- Initialize Git repository and standard project skeleton.
- Root configuration, environment variables, documentation, and architecture diagrams.
- Backend and Frontend workspace isolation.

### Phase 2: Core Data Engine & Appliance State Graph
- **Machine State Model:** Brand, Model, Serial, Purchase Date, AMC Provider, Remaining Quotas, Wear Curves (TDS degradation, AC compressor hours).
- **Incident & Ticket State Model:** Incident Lifecycle (`DETECTED` $\to$ `TRIAGED` $\to$ `PARTS_DISPATCHED` $\to$ `VOICE_NEGOTIATED` $\to$ `DOORSTEP_GEOFENCED` $\to$ `OTP_VERIFIED` $\to$ `ESCROW_SETTLED`).
- **Pre-seeded Real Data:**
  - *Kent Grand+ RO* (Choked sediment filter, muddy water spike, 0 free AMC visits remaining).
  - *Daikin 1.5T Inverter AC* (Capacitor/compressor fault, landlord-tenant liability split).
  - *Bosch 7kg Front-Load Washer* (Normal preventive maintenance cycle).

### Phase 3: The Three Partner Rails (Production-Grade Sandboxes)
1. **Gnani.ai Voice Rail:**
   - Real-time telephony simulator with speech-to-text transcript generator.
   - Vernacular Hinglish dialogue manager for technician negotiation.
   - Generates realistic audio waveforms with synced bilingual subtitles.
2. **Delhivery Logistics Rail:**
   - Just-in-Time spare parts order placement (OEM pre-filter cartridge & membrane).
   - Automated Waybill (AWB) generation and simulated delivery tracking updates.
3. **Pine Labs Payments Rail:**
   - Pre-authorization escrow locks (`PL_ESCROW_XXX`).
   - Landlord-Tenant automated lease threshold split calculator (<₹1,000 tenant, >₹1,000 landlord).
   - Cryptographic OTP verification for milestone payment release.

### Phase 4: Autonomous Orchestration Engine
- Multi-agent coordinator that connects the trigger to the partner rails.
- Triage logic: Checks warranty/AMC terms, orders spare parts via Delhivery first, then calls technician via Gnani voice to align arrival with the part's delivery ETA!

### Phase 5: World-Class Executive Command Center (UI)
- **Executive HUD:** High-density, Linear/Apple-grade visual design.
- **Machine Vault:** Live wear & tear rings, AMC status, and service history.
- **Live Incident Room:** Stepper tracking the active breakdown from trigger to completion.
- **Gnani Voice Console:** Audio player with live Hinglish transcript highlighting negotiation wins.
- **Delhivery Dispatch Card:** Live AWB progress bar with map coordinates.
- **Pine Labs Escrow Drawer:** Interactive payment split and dynamic geofenced OTP card.

### Phase 6: End-to-End Verification & Presentation
- Automated test scripts validating full workflow execution across all 3 partner rails.
- High-fidelity GitHub README with badges, architecture diagrams, and submission evidence.
