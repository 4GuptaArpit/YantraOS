"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Activity, ShieldAlert, CheckCircle2, Clock, 
  Truck, PhoneCall, CreditCard, Play, Pause, KeyRound, Building2,
  Camera, MessageSquare, AlertTriangle, FileText, Cpu, Radio,
  ArrowRight, Terminal, Zap, ShieldCheck, HelpCircle
} from "lucide-react";

interface Machine {
  id: number;
  name: string;
  category: "WATER_PURIFIER" | "AIR_CONDITIONER" | "WASHING_MACHINE";
  brand: string;
  model_number: string;
  serial_number: string;
  location_room: string;
  has_active_amc: boolean;
  amc_provider: string;
  amc_free_visits_remaining: number;
  amc_cooldown_active: boolean;
  health_score: number;
  wear_metric_name: string;
  wear_metric_value: number;
  wear_threshold: number;
  wear_unit: string;
  power_draw_watts: number;
  mfg_date: string;
  status: "CRITICAL" | "WARNING" | "NOMINAL";
}

export default function YantraOSDashboard() {
  // Machine digital twins state
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: 1,
      name: "Kent Grand+ RO Water Purifier",
      category: "WATER_PURIFIER",
      brand: "Kent RO Systems",
      model_number: "KENT-GP-11076",
      serial_number: "SN-DEL-2023-88912",
      location_room: "Kitchen Utility · Bay 1",
      has_active_amc: true,
      amc_provider: "Kent Comprehensive Care",
      amc_free_visits_remaining: 0,
      amc_cooldown_active: true,
      health_score: 24,
      wear_metric_name: "Raw Inflow Turbidity / TDS",
      wear_metric_value: 920.0,
      wear_threshold: 300.0,
      wear_unit: "ppm",
      power_draw_watts: 60,
      mfg_date: "04/2023",
      status: "CRITICAL"
    },
    {
      id: 2,
      name: "Daikin 1.5T 5-Star Inverter Split AC",
      category: "AIR_CONDITIONER",
      brand: "Daikin Industries",
      model_number: "FTKF50TV16U",
      serial_number: "DKN-IN-88921-X",
      location_room: "Master Bedroom · Zone A",
      has_active_amc: false,
      amc_provider: "None (On-Demand)",
      amc_free_visits_remaining: 0,
      amc_cooldown_active: false,
      health_score: 78,
      wear_metric_name: "Compressor Thermal Hours",
      wear_metric_value: 1420.0,
      wear_threshold: 2000.0,
      wear_unit: "hrs",
      power_draw_watts: 1140,
      mfg_date: "02/2022",
      status: "WARNING"
    },
    {
      id: 3,
      name: "Bosch Serie 6 8kg Front Load Washer",
      category: "WASHING_MACHINE",
      brand: "Bosch Home Appliances",
      model_number: "WAJ2846PIN",
      serial_number: "BSH-FL-99014",
      location_room: "Dry Balcony · Utility Area",
      has_active_amc: true,
      amc_provider: "Bosch Extended Shield",
      amc_free_visits_remaining: 1,
      amc_cooldown_active: false,
      health_score: 94,
      wear_metric_name: "Descaling Duty Cycle",
      wear_metric_value: 14.0,
      wear_threshold: 50.0,
      wear_unit: "cycles",
      power_draw_watts: 1900,
      mfg_date: "08/2023",
      status: "NOMINAL"
    }
  ]);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulation Stages: 1: MUD_SPIKE -> 2: GNANI_NEGOTIATED -> 3: GEOFENCE_ARRIVED -> 4: OTP_SETTLED
  const [simStep, setSimStep] = useState<number>(1);
  const [otpInput, setOtpInput] = useState("7492");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // UI Navigation Tabs
  const [activeTab, setActiveTab] = useState<"SCHEMATIC" | "TELEMETRY" | "CONTRACTS">("SCHEMATIC");
  const [selectedSchematicPart, setSelectedSchematicPart] = useState<string>("SEDIMENT_FILTER");

  // Modals for Ingress Proof
  const [showWalkthroughModal, setShowWalkthroughModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);

  // Live atomic clock ticker
  const [timeTicker, setTimeTicker] = useState("21:40:12 IST");

  // Live Agent Decision Feed constant log events
  const decisionLogs = [
    { id: 1, step: 1, time: "00:00:08", channel: "SENSOR", msg: "TDS threshold exceeded (920 ppm > 300 ppm). Wear curve anomaly: +612%." },
    { id: 2, step: 1, time: "00:00:09", channel: "AGENT", msg: "Incident Classification triggered → SEVERITY: CRITICAL_BREACH." },
    { id: 3, step: 1, time: "00:00:11", channel: "AGENT", msg: "Lease Clause 14B parsed → Municipal external fault: 100% Landlord Liability (₹1,450)." },
    { id: 4, step: 2, time: "00:00:14", channel: "AGENT", msg: "Dispatching Gnani Indic Voice Rail → Target: Ramesh Kumar (Kent Certified)." },
    { id: 5, step: 2, time: "00:01:22", channel: "GNANI", msg: "Hinglish negotiation complete. Slot locked firm @ 3:30 PM. Confidence: 96%." },
    { id: 6, step: 3, time: "00:02:44", channel: "DELHIVERY", msg: "Automated JIT parts order placed → SKU: KENT-SP-SED-01. AWB: DEL_88291039." },
    { id: 7, step: 3, time: "00:18:12", channel: "DELHIVERY", msg: "OEM filter package delivered at Tower B Security Gate. Anti-counterfeit seal verified." },
    { id: 8, step: 3, time: "00:32:05", channel: "PINELABS", msg: "Plural Escrow ₹1,450 pre-authorized from Landlord Vikas Khanna. Escrow ID: PL_ESC_99182." },
    { id: 9, step: 3, time: "00:44:50", channel: "SENSOR", msg: "Geofence ping received: Technician Ramesh 38M from flat doorstep. Entry pre-cleared." },
    { id: 10, step: 4, time: "00:47:15", channel: "PINELABS", msg: "Doorstep OTP cryptographic handshake completed (PIN: 7492 verified). ₹1,450 released." },
    { id: 11, step: 4, time: "00:47:20", channel: "AGENT", msg: "Post-repair hydraulic telemetry nominal (14.8 L/hr, TDS 105 ppm). Machine state: RESTORED." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setTimeTicker(`${h}:${m}:${s} IST`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtitle timing mapping (in seconds)
  const subtitles = [
    { start: 0, end: 3, speaker: "Technician Ramesh", text: "Hello? Haan ji kaun bol rahe hain?", translation: "Hello? Yes, who is speaking?", intent: "INBOUND_GREETING" },
    { start: 3, end: 12, speaker: "YantraOS (Gnani.ai)", text: "Namaste Ramesh ji, main Arpit Sharma ji ke flat se Yantra assistant bol raha hu. Kent RO filter replacement ke regarding call kiya hai.", translation: "Namaste Ramesh ji, I'm the Yantra assistant calling from Arpit Sharma's residence regarding Kent RO filter replacement.", intent: "CONTEXT_HANDSHAKE" },
    { start: 12, end: 19, speaker: "Technician Ramesh", text: "Arrey bhaiya main abhi Cyber Hub side hu. Das minute me nikal ke aa raha hu, aap ghar pe raho.", translation: "Oh brother, I'm near Cyber Hub. Leaving in 10 mins, stay at home.", intent: "UNREALISTIC_ESTIMATE" },
    { start: 19, end: 33, speaker: "YantraOS (Gnani.ai)", text: "Ramesh ji, genuine Kent cartridge Delhivery se 2:15 PM flat pe deliver ho rahi hai. Aur sir 3 baje tak meeting me hain. Kya hum aapka visit theek 3:30 PM lock karein?", translation: "Ramesh ji, genuine parts arrive via Delhivery at 2:15 PM. Resident is in meetings till 3:00 PM. Can we lock your slot for exactly 3:30 PM?", intent: "BYPASS_CALENDLY" },
    { start: 33, end: 43, speaker: "Technician Ramesh", text: "Achha parts direct customer ke paas aa rahe hain? Phir badhiya hai, mujhe service kit nahi dhundhni padegi. Theek 3:30 pe Sector 43 pohonch jaunga.", translation: "Oh, parts arrive directly at customer's doorstep? That's great, I won't have to search for a kit. I'll reach Sector 43 at 3:30 PM.", intent: "SLOT_CONFIRMED" },
    { start: 43, end: 56, speaker: "YantraOS (Gnani.ai)", text: "Bohot badhiya Ramesh ji. Aapka MyGate visitor pass pre-approved hai. Pine Labs escrow link ready hai, job complete hote hi OTP verify hoke instant payout release ho jayega.", translation: "Excellent Ramesh ji. MyGate entry is pre-cleared. Pine Labs escrow is secured; funds release instantly on OTP verification.", intent: "ESCROW_PREAUTH" },
    { start: 56, end: 60, speaker: "Technician Ramesh", text: "Theek hai sir, theek 3:30 PM milte hain. Shukriya!", translation: "Alright sir, see you at 3:30 PM sharp. Thank you!", intent: "CALL_TERMINATE" }
  ];

  const toggleAudio = React.useCallback(() => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  }, [isPlayingAudio]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setAudioCurrentTime(cur);

    for (let i = subtitles.length - 1; i >= 0; i--) {
      if (cur >= subtitles[i].start) {
        setActiveSubtitleIndex(i);
        break;
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setActiveSubtitleIndex(0);
  };

  // Interactive Simulation Controls & Toast State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3500);
  };

  const triggerMudSpike = React.useCallback(() => {
    setIsTransitioning(true);
    setSimStep(1);
    setOtpSuccess(false);
    setOtpError(false);
    setMachines(prev => prev.map(m => m.id === 1 ? {
      ...m,
      health_score: 18,
      wear_metric_value: 940.0,
      status: "CRITICAL"
    } : m));
    showToast("⚠️ INCIDENT DETECTED: TDS Inflow Spike (920 ppm) - DJB Mainline Rupture");
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const triggerNegotiate = React.useCallback(() => {
    setIsTransitioning(true);
    setSimStep(2);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
    showToast("📞 GNANI VOICE RAIL: Autonomous Inbound Negotiation Locked for 3:30 PM");
    // Also trigger backend call asynchronously if running
    fetch("http://localhost:8000/api/rails/gnani/trigger-call/1", { method: "POST" }).catch(() => {});
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const triggerGeofenceArrival = React.useCallback(() => {
    setIsTransitioning(true);
    setSimStep(3);
    showToast("🚚 DELHIVERY LOGISTICS: OEM Cartridge Delivered at Tower B Gate");
    fetch("http://localhost:8000/api/rails/delhivery/dispatch/1", { method: "POST" }).catch(() => {});
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const triggerSettleEscrow = React.useCallback((explicitOtp?: string) => {
    setIsTransitioning(true);
    setSimStep(4);
    setOtpSuccess(true);
    setOtpError(false);
    setOtpInput("7492");
    setMachines(prev => prev.map(m => m.id === 1 ? {
      ...m,
      health_score: 98,
      wear_metric_value: 105.0,
      status: "NOMINAL"
    } : m));
    showToast("🎉 SYSTEM RESTORED: ₹1,450 Escrow Released via Pine Labs. RO Health: 98%");
    // Also trigger backend OTP settlement asynchronously
    fetch("http://localhost:8000/api/rails/pinelabs/verify-otp/1?entered_otp=7492", { method: "POST" }).catch(() => {});
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const handleVerifyOtp = (code?: string) => {
    const codeToTest = (code !== undefined ? code : otpInput).trim();
    if (codeToTest !== "7492") {
      setOtpError(true);
      showToast(`❌ PIN REJECTED: '${codeToTest}' invalid. Pine Labs Escrow remains locked.`);
      setTimeout(() => setOtpError(false), 2500);
      return;
    }
    triggerSettleEscrow();
  };

  // Keyboard shortcut listener for judge demonstration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "1") triggerMudSpike();
      if (e.key === "2") triggerNegotiate();
      if (e.key === "3") triggerGeofenceArrival();
      if (e.key === "4") triggerSettleEscrow();
      if (e.key === " ") {
        e.preventDefault();
        toggleAudio();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleAudio, triggerMudSpike, triggerNegotiate, triggerGeofenceArrival, triggerSettleEscrow]);

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#e6edf3] antialiased selection:bg-amber-500/20 selection:text-amber-300 font-sans pb-24">
      {/* Real Audio Element */}
      <audio 
        ref={audioRef} 
        src="/audio/ro_technician_negotiation.mp3" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      {/* TOP TACTICAL TELEMETRY HEADER */}
      <header className="border-b border-[#1b2230] bg-[#0d1117] sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          
          {/* Brand & Node Identity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded border border-amber-500/40 bg-amber-500/10 flex items-center justify-center font-mono font-black text-amber-400 text-sm tracking-wider">
                Y
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wide text-white uppercase">YantraOS</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161c28] border border-[#273248] text-slate-300">
                    v2.4.1-CORE
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    DAEMON_ACTIVE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  DOMESTIC MACHINE OPERATING SYSTEM · AUTONOMOUS DISPATCH
                </p>
              </div>
            </div>

            <div className="hidden xl:block h-6 w-px bg-[#1e2738]" />

            {/* Household Node Telemetry */}
            <div className="hidden xl:flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">NODE:</span>
                <span className="text-white font-medium">GODREJ WOODS #402</span>
              </div>
              <span className="text-slate-600">/</span>
              <div className="text-slate-400">
                <span>GRID:</span> <span className="text-slate-300">SECTOR-43 GGN</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons & Clock */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#12161f] border border-[#20293a] text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>{timeTicker}</span>
            </div>

            <button 
              onClick={() => setShowWalkthroughModal(true)}
              className="px-2.5 py-1.5 rounded bg-[#121824] hover:bg-[#182132] border border-[#243046] text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition active:scale-[0.98]"
              title="Inspect 60-second video ingestion camera model"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">60s Optical Ingress</span>
            </button>

            <button 
              onClick={() => setShowWhatsAppModal(true)}
              className="px-2.5 py-1.5 rounded bg-[#0e1d17] hover:bg-[#132920] border border-[#1b3d2f] text-xs font-mono text-emerald-300 flex items-center gap-1.5 transition active:scale-[0.98]"
              title="Inspect WhatsApp biometric card sent to Landlord"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp Approval</span>
            </button>

            <button 
              onClick={() => setShowLeaseModal(true)}
              className="px-2.5 py-1.5 rounded bg-[#181524] hover:bg-[#221e33] border border-[#302848] text-xs font-mono text-indigo-300 flex items-center gap-1.5 transition active:scale-[0.98]"
              title="View lease agreement clause arbitration"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Lease Clause 14B</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN SYSTEM WORKSPACE */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 pt-4 space-y-5">

        {/* TOAST NOTIFICATION SYSTEM */}
        {activeToast && (
          <div className="fixed top-16 right-6 z-50 animate-bounce bg-[#0d1624] border border-amber-500/80 text-amber-300 text-xs font-mono px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>{activeToast}</span>
          </div>
        )}

        {/* 0. MISSION CONTEXT HERO STRIP: 5-SECOND HIGH LEVEL ORIENTATION */}
        <div className="rounded-lg bg-[#0b0e14] border border-[#1b2332] overflow-hidden shadow-2xl">
          {/* Tactical Marquee Header */}
          <div className="bg-[#121722] border-b border-[#1f293d] px-3.5 py-1.5 flex items-center justify-between font-mono text-[11px]">
            <div className="flex items-center gap-2 text-amber-400 font-bold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>▓ LIVE INCIDENT DISPATCH // GODREJ WOODS TOWER B, FLAT 402 // DJB TURBIDITY EVENT ▓</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[10px]">
              <span>TENANT LIABILITY: <b className="text-emerald-400">₹0.00 (ENFORCED)</b></span>
              <span className="text-slate-600">|</span>
              <span>AUTONOMOUS RESTORATION: <b className="text-cyan-300">{simStep >= 4 ? "COMPLETE" : "IN PROGRESS"}</b></span>
            </div>
          </div>

          {/* Quick Problem vs Outcome Two-Column Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1a2233] p-3 text-xs font-mono bg-gradient-to-r from-[#0c1017] to-[#0d131d]">
            {/* LEFT: Problem Context */}
            <div className="flex items-center gap-3 py-1.5 md:py-0 md:pr-4">
              <div className="w-8 h-8 rounded bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400 uppercase">Resident:</span>
                  <span className="text-white font-bold">Arpit Sharma</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Appliance:</span>
                  <span className="text-cyan-300 font-bold">Kent Grand+ RO</span>
                </div>
                <p className="text-[10px] text-red-300 truncate">
                  Cause: Delhi Jal Board mainline rupture · Turbidity surge (920 ppm) · AMC exhausted
                </p>
              </div>
            </div>

            {/* RIGHT: Outcome Context */}
            <div className="flex items-center gap-3 py-1.5 md:py-0 md:pl-4 justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400 uppercase">Cost to Tenant:</span>
                    <span className="text-emerald-400 font-black text-sm">₹0.00</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">Clause 14B:</span>
                    <span className="text-indigo-300 font-bold">100% Landlord</span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Resolution Time: <b className="text-white font-mono">{simStep >= 4 ? "47 mins total" : "47 mins projected"}</b> (vs 5-day manual AMC delay)
                  </p>
                </div>
              </div>
              <span className={`hidden lg:inline-block px-2.5 py-1 text-[10px] font-bold rounded border uppercase ${
                simStep >= 4 ? "bg-emerald-950 border-emerald-500 text-emerald-300" : "bg-cyan-950 border-cyan-500 text-cyan-300 animate-pulse"
              }`}>
                {simStep >= 4 ? "RECOVERED ✓" : "AUTONOMOUS FLOW"}
              </span>
            </div>
          </div>
        </div>

        {/* IMPACT AT A GLANCE METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg bg-[#0e121a] border border-[#1e2739] p-3 flex items-center gap-3 font-mono">
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg lg:text-xl font-black text-white">8 sec</div>
              <div className="text-[10px] text-slate-400 uppercase leading-tight">Detection to Dispatch</div>
            </div>
          </div>

          <div className="rounded-lg bg-[#0e121a] border border-[#1e2739] p-3 flex items-center gap-3 font-mono">
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg lg:text-xl font-black text-indigo-300">₹1,450</div>
              <div className="text-[10px] text-slate-400 uppercase leading-tight">Landlord Clause 14B Escrow</div>
            </div>
          </div>

          <div className="rounded-lg bg-[#0e121a] border border-[#1e2739] p-3 flex items-center gap-3 font-mono">
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg lg:text-xl font-black text-emerald-400">0 Calls</div>
              <div className="text-[10px] text-slate-400 uppercase leading-tight">Required by Resident</div>
            </div>
          </div>

          <div className="rounded-lg bg-[#0e121a] border border-[#1e2739] p-3 flex items-center gap-3 font-mono">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg lg:text-xl font-black text-cyan-300">{simStep >= 4 ? "47 min" : "14 min"}</div>
              <div className="text-[10px] text-slate-400 uppercase leading-tight">{simStep >= 4 ? "Restoration Elapsed" : "ETA to Full Recovery"}</div>
            </div>
          </div>
        </div>

        {/* 1. HERO: ACTIVE INCIDENT TELEMETRY STRIP (CRITICAL EVENT FOCUS) */}
        <section className={`rounded-xl border p-5 lg:p-6 transition-all duration-300 relative overflow-hidden ${
          simStep >= 4 
            ? "bg-gradient-to-r from-[#0d1b14] via-[#0e171b] to-[#0c1322] border-emerald-500/50 shadow-lg shadow-emerald-950/20" 
            : "bg-gradient-to-r from-[#1f0d11] via-[#14121b] to-[#0e131d] border-red-500/60 shadow-xl shadow-red-950/30"
        }`}>
          {/* Subtle status glow corner */}
          <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl pointer-events-none ${simStep >= 4 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 border ${
                  simStep >= 4 
                    ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300" 
                    : "bg-red-950/80 border-red-500/80 text-red-300 animate-pulse"
                }`}>
                  {simStep >= 4 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  {simStep >= 4 ? "SYSTEM STATUS: RESOLVED & NOMINAL" : "TELEMETRY BREACH: INCIDENT IN PROGRESS"}
                </span>
                <span className="text-xs font-mono text-slate-300">INCIDENT: INC-2026-DEL-RO-402</span>
                <span className="text-xs font-mono text-slate-500">|</span>
                <span className="text-xs font-mono text-amber-400">AMC STATUS: 0 FREE VISITS (EXHAUSTED)</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                RO Sediment Pre-Filter Occlusion <span className="text-slate-400 text-lg font-normal block sm:inline sm:text-2xl">(Delhi Jal Board Turbidity Surge)</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-3xl">
                Municipal mainline rupture in Sector 43 spiked incoming particulate matter to <b>920 ppm</b>. YantraOS detected hydraulic collapse (15.0 L/hr down to 1.8 L/hr). Recognizing the AMC avoidance trap, YantraOS autonomously dispatched OEM kit <code className="font-mono text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded">#KENT-SP-SED-01</code> via Delhivery, locked technician Ramesh for 3:30 PM via Gnani.ai, and pre-authorized ₹1,450 via Pine Labs escrow under Lease Clause 14B.
              </p>
            </div>

            {/* Diagnostic Metrics Matrix */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3 font-mono">
              <div className="p-3.5 rounded-lg bg-[#0e121a]/90 border border-[#202a3d] text-center backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Inflow TDS</span>
                <span className={`text-xl lg:text-2xl font-black ${simStep >= 4 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {simStep >= 4 ? "105" : "920"} <span className="text-xs font-normal text-slate-400">PPM</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">NOMINAL: &lt;300</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0e121a]/90 border border-[#202a3d] text-center backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Flow Rate</span>
                <span className={`text-xl lg:text-2xl font-black ${simStep >= 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {simStep >= 4 ? "14.8" : "1.8"} <span className="text-xs font-normal text-slate-400">L/HR</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{simStep >= 4 ? "+722% RESTORED" : "-88% LOSS"}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0e121a]/90 border border-[#202a3d] text-center backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Escrow Split</span>
                <span className="text-xl lg:text-2xl font-black text-indigo-300">
                  ₹1,450
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold">100% LANDLORD</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. OPERATOR / JUDGE TACTICAL TIMELINE CONTROLLER */}
        <section className={`rounded-xl bg-[#0e121a] border ${isTransitioning ? 'border-amber-400 shadow-lg' : 'border-[#1e2739]'} p-4 lg:p-5 relative transition-all`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-[#1b2332]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase">
                  Simulation Director // Scenario: DJB Muddy Water Inflow
                </h2>
                <p className="text-[11px] font-mono text-slate-400">Click a stage or press hotkey to demonstrate autonomous machine recovery lifecycle</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-[#141924] px-3 py-1.5 rounded-lg border border-[#222d42]">
              <span className="text-amber-400 font-bold">PRESS KEYS:</span>
              <kbd className="px-2 py-0.5 rounded bg-[#1e2638] border border-[#2e3b54] text-white font-bold">1</kbd>
              <span>→</span>
              <kbd className="px-2 py-0.5 rounded bg-[#1e2638] border border-[#2e3b54] text-white font-bold">2</kbd>
              <span>→</span>
              <kbd className="px-2 py-0.5 rounded bg-[#1e2638] border border-[#2e3b54] text-white font-bold">3</kbd>
              <span>→</span>
              <kbd className="px-2 py-0.5 rounded bg-[#1e2638] border border-[#2e3b54] text-white font-bold">4</kbd>
              <span className="text-slate-500">|</span>
              <kbd className="px-2 py-0.5 rounded bg-[#1e2638] border border-[#2e3b54] text-cyan-300 font-bold">SPACE</kbd>
              <span className="text-slate-400">AUDIO</span>
            </div>
          </div>

          {/* Connected Countdown Execution Pipeline */}
          <div className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              
              {/* Step 1 */}
              <div className="relative flex flex-col">
                <button
                  onClick={triggerMudSpike}
                  className={`p-3.5 rounded-lg text-left border font-mono transition-all relative group w-full h-full flex flex-col justify-between ${
                    simStep === 1
                      ? "bg-[#241216] border-red-500 text-white ring-2 ring-red-500/40 shadow-lg shadow-red-950/50"
                      : simStep > 1
                      ? "bg-[#0f1917] border-emerald-500/40 text-slate-300 hover:border-emerald-500/70"
                      : "bg-[#0f131c] border-[#1a2333] text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          simStep === 1 ? 'bg-red-500 text-white animate-pulse' : simStep > 1 ? 'bg-emerald-500 text-black' : 'bg-[#222c3d] text-slate-400'
                        }`}>
                          {simStep > 1 ? "✓" : "1"}
                        </span>
                        <span className={simStep === 1 ? "text-red-400 font-bold" : "text-slate-400"}>STAGE 01</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">T-00:00</span>
                    </div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">
                      01 · Turbidity Breach Detected
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1 font-sans">
                      920 PPM Inflow · DJB mainline rupture · Hydraulic drop
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1a2333] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>SEVERITY: <b className="text-red-400">CRITICAL</b></span>
                    <span className="text-red-400 font-bold">[CLICK / 1]</span>
                  </div>
                </button>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col">
                <button
                  onClick={triggerNegotiate}
                  className={`p-3.5 rounded-lg text-left border font-mono transition-all relative group w-full h-full flex flex-col justify-between ${
                    simStep === 2
                      ? "bg-[#102419] border-emerald-500 text-white ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50"
                      : simStep > 2
                      ? "bg-[#0f1917] border-emerald-500/40 text-slate-300 hover:border-emerald-500/70"
                      : "bg-[#0f131c] border-[#1a2333] text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          simStep === 2 ? 'bg-emerald-500 text-black animate-pulse' : simStep > 2 ? 'bg-emerald-500 text-black' : 'bg-[#222c3d] text-slate-400'
                        }`}>
                          {simStep > 2 ? "✓" : "2"}
                        </span>
                        <span className={simStep === 2 ? "text-emerald-400 font-bold" : "text-slate-400"}>STAGE 02</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">T+00:04</span>
                    </div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">
                      02 · Voice AI Intercepts Tech Delay
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1 font-sans">
                      Slot locked firm 3:30 PM in Hinglish · Zero hostage wait
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1a2333] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>AGENT: <b className="text-emerald-400">GNANI.AI</b></span>
                    <span className="text-emerald-400 font-bold">[CLICK / 2]</span>
                  </div>
                </button>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col">
                <button
                  onClick={triggerGeofenceArrival}
                  className={`p-3.5 rounded-lg text-left border font-mono transition-all relative group w-full h-full flex flex-col justify-between ${
                    simStep === 3
                      ? "bg-[#10212f] border-cyan-500 text-white ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/50"
                      : simStep > 3
                      ? "bg-[#0f1917] border-emerald-500/40 text-slate-300 hover:border-emerald-500/70"
                      : "bg-[#0f131c] border-[#1a2333] text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          simStep === 3 ? 'bg-cyan-400 text-black animate-pulse' : simStep > 3 ? 'bg-emerald-500 text-black' : 'bg-[#222c3d] text-slate-400'
                        }`}>
                          {simStep > 3 ? "✓" : "3"}
                        </span>
                        <span className={simStep === 3 ? "text-cyan-400 font-bold" : "text-slate-400"}>STAGE 03</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">T+00:18</span>
                    </div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">
                      03 · OEM Cartridge Delivered at Gate
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1 font-sans">
                      Anti-counterfeit OEM seal #8821 verified via Delhivery
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1a2333] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>LOGISTICS: <b className="text-cyan-300">DELHIVERY</b></span>
                    <span className="text-cyan-300 font-bold">[CLICK / 3]</span>
                  </div>
                </button>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col">
                <button
                  onClick={() => triggerSettleEscrow()}
                  className={`p-3.5 rounded-lg text-left border font-mono transition-all relative group w-full h-full flex flex-col justify-between ${
                    simStep === 4
                      ? "bg-[#1c1730] border-indigo-500 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/50"
                      : "bg-[#0f131c] border-[#1a2333] text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          simStep === 4 ? 'bg-indigo-400 text-black animate-pulse' : 'bg-[#222c3d] text-slate-400'
                        }`}>
                          {simStep >= 4 && otpSuccess ? "✓" : "4"}
                        </span>
                        <span className={simStep === 4 ? "text-indigo-400 font-bold" : "text-slate-400"}>STAGE 04</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">T+00:45</span>
                    </div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">
                      04 · Doorstep Cryptographic Handshake
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1 font-sans">
                      PIN 7492 verification · ₹1,450 Escrow released to tech
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1a2333] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>SETTLEMENT: <b className="text-indigo-300">PINE LABS</b></span>
                    <span className="text-indigo-300 font-bold">[CLICK / 4]</span>
                  </div>
                </button>
              </div>

            </div>

            {/* Visual Animated Pipeline Pulse Rail */}
            <div className="hidden md:flex items-center justify-between px-6 pt-3 text-[10px] font-mono text-slate-400">
              <span className={simStep >= 1 ? "text-red-400 font-bold" : ""}>TDS BREACH</span>
              <div className="flex-1 mx-3 h-0.5 bg-[#1b2436] relative overflow-hidden rounded">
                <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-emerald-400 to-cyan-400 ${simStep > 1 ? 'animate-pipeline-pulse' : 'opacity-20'}`} />
              </div>
              <span className={simStep >= 2 ? "text-emerald-400 font-bold" : ""}>CALL LOCKED</span>
              <div className="flex-1 mx-3 h-0.5 bg-[#1b2436] relative overflow-hidden rounded">
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-400 ${simStep > 2 ? 'animate-pipeline-pulse' : 'opacity-20'}`} />
              </div>
              <span className={simStep >= 3 ? "text-cyan-400 font-bold" : ""}>PARTS AT GATE</span>
              <div className="flex-1 mx-3 h-0.5 bg-[#1b2436] relative overflow-hidden rounded">
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 ${simStep >= 4 ? 'animate-pipeline-pulse' : 'opacity-20'}`} />
              </div>
              <span className={simStep >= 4 ? "text-indigo-300 font-bold" : ""}>ESCROW SETTLED</span>
            </div>
          </div>
        </section>

        {/* 3. THE THREE PARTNER RAILS SHOWCASE */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-3 py-0.5">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h2 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                The Three Partner Rails // Ground Reality Execution Engine
              </h2>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800">
              SYNCHRONIZED DISPATCH · ZERO AT-HOME HOSTAGE TIME
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* RAIL 1: GNANI.AI VOICE RAIL */}
            <div className={`rounded-xl bg-[#0e121a] border ${simStep === 2 ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/40' : 'border-[#1e2739]'} p-4 flex flex-col justify-between space-y-4 transition-all`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2332]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white font-mono">1. GNANI.AI VOICE RAIL</h3>
                      <p className="text-[10px] text-slate-400">Vernacular Technician Negotiator</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                    60s INDIC AUDIO
                  </span>
                </div>

                {/* Call Controller & Audio Player */}
                <div className="rounded bg-[#080b0f] border border-[#1b2230] p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono font-bold text-white">Technician Ramesh (Kent Certified)</p>
                      <p className="text-[10px] font-mono text-slate-400">
                        Swara (Bot) ↔ Madhur (Tech) · Hinglish [{Math.floor(audioCurrentTime)}s / 60s]
                      </p>
                    </div>
                    <button
                      onClick={toggleAudio}
                      className="p-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-950"
                      title="Play/Pause Conversation Audio"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span className="text-[11px] font-bold">{isPlayingAudio ? "PAUSE" : "LISTEN"}</span>
                    </button>
                  </div>

                  {/* Dual Channel Acoustic Oscilloscope Bars */}
                  <div className="flex items-center gap-1 h-8 px-1.5 bg-[#0b0e14] rounded border border-[#171e2c]">
                    {[45, 80, 30, 95, 60, 40, 85, 100, 35, 75, 90, 50, 95, 65, 40, 85, 30, 90, 55, 75, 45, 70, 85, 50].map((h, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-sm transition-all ${
                          isPlayingAudio 
                            ? 'bg-emerald-400' 
                            : 'bg-slate-800'
                        }`}
                        style={{ 
                          height: isPlayingAudio ? `${h}%` : '15%',
                          animation: isPlayingAudio ? `audioWave ${0.5 + (i % 5) * 0.15}s ease-in-out infinite alternate` : 'none',
                          animationDelay: `${(i * 0.05).toFixed(2)}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Synchronized Telephony Transcript */}
                  <div className="rounded bg-[#0e131d] border border-[#1c2436] p-3 text-xs space-y-1.5 min-h-[90px]">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-emerald-400">
                        {subtitles[activeSubtitleIndex].speaker}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#182030] text-cyan-300">
                        [{subtitles[activeSubtitleIndex].intent}]
                      </span>
                    </div>
                    <p className="text-slate-200 font-sans text-xs">
                      &ldquo;{subtitles[activeSubtitleIndex].text}&rdquo;
                    </p>
                    <p className="text-slate-400 font-sans text-[11px] italic">
                      {subtitles[activeSubtitleIndex].translation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1b2332] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>LOCKED VISIT: <b className="text-white">3:30 PM (FIRM)</b></span>
                <span className="text-emerald-400 font-bold">✓ ZERO WAITING HOSTAGE</span>
              </div>
            </div>

            {/* RAIL 2: DELHIVERY LOGISTICS RAIL */}
            <div className={`rounded-xl bg-[#0e121a] border ${simStep === 3 ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/40' : 'border-[#1e2739]'} p-4 flex flex-col justify-between space-y-4 transition-all`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2332]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white font-mono">2. DELHIVERY LOGISTICS RAIL</h3>
                      <p className="text-[10px] text-slate-400">JIT Genuine Spare Parts Dispatch</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                    AWB: DEL_88291039
                  </span>
                </div>

                {/* Waybill Telemetry Card */}
                <div className="rounded bg-[#080b0f] border border-[#1b2230] p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-mono font-bold text-white">Kent Spun Sediment + Carbon Kit</p>
                      <p className="text-[10px] font-mono text-slate-400">SKU: KENT-SP-SED-01 · Invoiced: ₹750</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                      simStep >= 3 
                        ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' 
                        : 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                    }`}>
                      {simStep >= 3 ? "DELIVERED AT GATE" : "OUT FOR DELIVERY"}
                    </span>
                  </div>

                  {/* Waypoint Tracking Trajectory */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>09:15 AM - Dispatched: OEM Gurugram Hub</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>10:30 AM - Sector 18 Mother Sorting Center</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-300 font-medium text-[11px]">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex-shrink-0" />
                      <span>{simStep >= 3 ? "02:15 PM - Delivered at Tower B Security" : "01:10 PM - Courier Rider Vikas M. (1.4 km away)"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>ETA: 2:15 PM (Precedes 3:30 PM Technician Visit)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1b2332] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>ANTI-SUBSTITUTION: <b className="text-white">OEM SEAL #8821</b></span>
                <span className="text-cyan-400 font-bold">✓ GENUINE PART ASSURED</span>
              </div>
            </div>

            {/* RAIL 3: PINE LABS ESCROW & TENANCY RAIL */}
            <div className={`rounded-xl bg-[#0e121a] border ${simStep === 4 ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/40' : 'border-[#1e2739]'} p-4 flex flex-col justify-between space-y-4 transition-all`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#1b2332]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white font-mono">3. PINE LABS ESCROW RAIL</h3>
                      <p className="text-[10px] text-slate-400">Plural Pre-Auth & Tenancy Split</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    otpSuccess 
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300' 
                      : 'bg-indigo-950 border-indigo-800 text-indigo-300'
                  }`}>
                    {otpSuccess ? "SETTLED & RELEASED" : "ESCROW LOCKED (₹1,450)"}
                  </span>
                </div>

                {/* Escrow Arbitration Box */}
                <div className="rounded bg-[#080b0f] border border-[#1b2230] p-3 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Total Approved Repair:</span>
                    <span className="text-white font-bold">₹1,450 (Parts ₹750 + Labor ₹700)</span>
                  </div>

                  <div className="p-2.5 rounded bg-[#111522] border border-[#1f263c] space-y-1 text-[11px]">
                    <span className="text-indigo-300 font-bold block">Lease Split (Clause 14B):</span>
                    <div className="flex justify-between text-slate-300">
                      <span>Tenant (Arpit Sharma):</span>
                      <span className="text-emerald-400 font-bold">₹0</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Landlord (Vikas Khanna):</span>
                      <span className="text-indigo-300 font-bold">₹1,450 (Pre-Authorized)</span>
                    </div>
                  </div>

                  {/* Doorstep OTP Release Form */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                      <KeyRound className="w-3 h-3 text-indigo-400" />
                      DOORSTEP DYNAMIC PIN HANDSHAKE:
                    </span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={otpInput}
                        onChange={(e) => {
                          setOtpInput(e.target.value);
                          if (otpError) setOtpError(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !otpSuccess) {
                            handleVerifyOtp();
                          }
                        }}
                        disabled={otpSuccess}
                        className={`w-full px-2.5 py-1.5 rounded bg-[#121620] border text-xs text-white font-mono tracking-widest text-center focus:outline-none disabled:opacity-50 transition-all ${
                          otpError 
                            ? "border-red-500 ring-2 ring-red-500/40 bg-red-950/20 text-red-200 animate-pulse" 
                            : otpSuccess 
                            ? "border-emerald-500/60 ring-2 ring-emerald-500/30 text-emerald-400"
                            : "border-[#232d42] focus:border-indigo-500"
                        }`}
                        placeholder="Enter 4-digit PIN (Try 7492)"
                      />
                      <button
                        onClick={() => handleVerifyOtp()}
                        disabled={otpSuccess}
                        className={`px-3 py-1.5 rounded text-xs font-bold text-white transition whitespace-nowrap ${
                          otpSuccess 
                            ? "bg-emerald-600 cursor-default" 
                            : otpError 
                            ? "bg-red-600 hover:bg-red-500" 
                            : "bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#1b2130]"
                        }`}
                      >
                        {otpSuccess ? "Released ✓" : otpError ? "Retry PIN" : "Verify PIN"}
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                        <span>⚠️ Cryptographic mismatch. Doorstep Escrow rejected.</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1b2332] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>GEOFENCE: <b className="text-white">38M FROM DOORSTEP</b></span>
                <span className="text-indigo-400 font-bold">✓ CRYPTOGRAPHIC RELEASE</span>
              </div>
            </div>

          </div>
        </section>

        {/* 3.5 LIVE AGENT DECISION FEED + COMPETITIVE BENCHMARK (HACKATHON IMPACT MODULE) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LIVE AGENT DECISION FEED (8 cols) */}
          <div className="lg:col-span-8 rounded-xl bg-[#090d14] border border-[#1b2537] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-[#0e1420] px-4 py-2.5 border-b border-[#1b2537] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white tracking-wide uppercase">Live Autonomous Agent Decision Feed</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold animate-pulse">
                  DAEMON RUNNING
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>STAGE: <b className="text-cyan-300">{simStep}/4 ACTIVE</b></span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">MODEL: <b className="text-slate-200">YANTRA-DECIDE-v2</b></span>
              </div>
            </div>

            {/* Terminal Window Content with auto-scrolling log events */}
            <div className="p-4 font-mono text-xs space-y-2 max-h-72 overflow-y-auto bg-[#070a10]">
              {decisionLogs.filter(log => log.step <= simStep).map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-2.5 py-1 px-2 rounded hover:bg-[#111827]/40 transition border-l-2 border-transparent hover:border-cyan-500"
                >
                  <span className="text-slate-500 text-[11px] flex-shrink-0">[{log.time}]</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                    log.channel === "SENSOR" 
                      ? "bg-red-950/80 text-red-300 border border-red-800/60" 
                      : log.channel === "GNANI" 
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60" 
                      : log.channel === "DELHIVERY" 
                      ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800/60" 
                      : log.channel === "PINELABS" 
                      ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60" 
                      : "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                  }`}>
                    {log.channel}
                  </span>
                  <span className="text-slate-200 text-[11px] leading-relaxed flex-1 font-sans">
                    {log.msg}
                  </span>
                </div>
              ))}

              {/* Blinking Terminal Prompt Cursor */}
              <div className="flex items-center gap-2 text-cyan-400 pt-1 text-[11px]">
                <span className="text-emerald-400 font-bold">yantra@node-402:~$</span>
                <span className="text-slate-400">
                  {simStep < 4 ? "awaiting downstream rail triggers..." : "all autonomous mitigation cycles completed. Telemetry nominal."}
                </span>
                <span className="inline-block w-2 h-3.5 bg-cyan-400 animate-cursor-blink" />
              </div>
            </div>

            <div className="px-4 py-2 border-t border-[#161f2f] bg-[#0b0f18] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero human intervention required across 11 autonomous decisions</span>
              </span>
              <span className="text-emerald-400 font-bold">100% AUDIT TRAIL PRESERVED</span>
            </div>
          </div>

          {/* "WHY NOT JUST CALL KENT AMC?" CALLOUT (4 cols) */}
          <div className="lg:col-span-4 rounded-xl bg-[#0e131d] border border-[#232f44] p-4 flex flex-col justify-between space-y-3 font-mono shadow-xl relative overflow-hidden">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b2537]">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Why Not Just Call Kent AMC?
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                  REALITY GAP
                </span>
              </div>

              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Standard domestic warranty & AMC contracts fail during sudden infrastructure surges:
              </p>

              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded bg-[#090c13] border border-[#1a2333] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Kent AMC Free Visits:</span>
                    <span className="text-red-400 font-bold">0 Remaining</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AMC Callback Latency:</span>
                    <span className="text-red-400 font-bold">4 to 6 Business Days</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Resident Waiting Time:</span>
                    <span className="text-red-400 font-bold">5 Days No Pure Water</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Landlord Dispute Loss:</span>
                    <span className="text-red-400 font-bold">Avg ₹3,200 (Tenant Deducted)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/50 space-y-1 text-emerald-300">
                  <span className="font-bold block text-xs text-white">YantraOS Autonomous Edge:</span>
                  <div className="flex justify-between">
                    <span>Total Cycle:</span>
                    <b className="text-emerald-400">47 Minutes</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenant Cost:</span>
                    <b className="text-emerald-400">₹0.00 (Enforced)</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Parts Authenticity:</span>
                    <b className="text-emerald-400">100% Genuine OEM</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1b2537] text-[10px] text-slate-400 flex items-center justify-between">
              <span>LEGAL CLAUSE: <b className="text-indigo-300">14(B) ARBITRATED</b></span>
              <span className="text-cyan-300 font-bold">✓ DISPUTE ELIMINATED</span>
            </div>
          </div>

        </section>

        {/* 4. HOUSEHOLD DIGITAL MACHINE TWIN FLEET REGISTRY */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between border-l-4 border-cyan-500 pl-3 py-0.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                Household Machine Twin Fleet Registry // 3 Synchronized Appliances
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-800">
              GODREJ WOODS TOWER B · 402
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {machines.map((machine) => (
              <div 
                key={machine.id}
                className={`rounded-xl bg-[#0e121a] border p-4 space-y-3 font-mono transition-all ${
                  machine.status === "CRITICAL"
                    ? "border-red-500/80 shadow-lg shadow-red-950/20 ring-1 ring-red-500/30"
                    : machine.status === "WARNING"
                    ? "border-amber-500/50"
                    : "border-[#1e2739] hover:border-[#2f3d57]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">{machine.location_room}</span>
                    <h3 className="text-sm font-bold text-white font-sans tracking-tight">{machine.name}</h3>
                    <p className="text-[11px] text-slate-400">{machine.model_number} · SN: {machine.serial_number}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    machine.status === "CRITICAL"
                      ? "bg-red-950 border-red-500 text-red-300"
                      : machine.status === "WARNING"
                      ? "bg-amber-950 border-amber-500 text-amber-300"
                      : "bg-emerald-950 border-emerald-500 text-emerald-300"
                  }`}>
                    {machine.status}
                  </span>
                </div>

                {/* Health Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Machine Health Score:</span>
                    <span className={`font-bold ${machine.health_score > 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {machine.health_score}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#161c28] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        machine.health_score > 70 ? 'bg-emerald-500' : machine.health_score > 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${machine.health_score}%` }}
                    />
                  </div>
                </div>

                {/* Machine Details Box */}
                <div className="rounded bg-[#080b0f] border border-[#1b2230] p-3 text-[11px] space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Metric Tracked:</span>
                    <span className="text-white">{machine.wear_metric_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Value:</span>
                    <span className={machine.wear_metric_value > machine.wear_threshold ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                      {machine.wear_metric_value} {machine.wear_unit} (Threshold: {machine.wear_threshold})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AMC Status:</span>
                    <span className={machine.amc_free_visits_remaining === 0 ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>
                      {machine.has_active_amc ? `Active (${machine.amc_free_visits_remaining} visits left)` : "Expired"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rated Power:</span>
                    <span className="text-slate-300">{machine.power_draw_watts}W · MFG: {machine.mfg_date}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sensors: Active Telemetry</span>
                  <span className="text-cyan-400 font-semibold">Polling: 10s</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. HARDWARE DEEP-DIVE: HYDRAULIC SCHEMATIC & WEAR CURVE ENGINE */}
        <section className="rounded-xl bg-[#0e121a] border border-[#1e2739] overflow-hidden">
          
          {/* Section Sub-Navigation Tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1b2332] bg-[#0c1017]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
                HARDWARE DIGITAL TWIN: KENT GRAND+ RO PURIFIER (SN: SN-DEL-2023-88912)
              </span>
            </div>
            
            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab("SCHEMATIC")}
                className={`px-3 py-1 rounded transition ${
                  activeTab === "SCHEMATIC"
                    ? "bg-[#1b2434] text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1. Hydraulic Schematic
              </button>
              <button
                onClick={() => setActiveTab("TELEMETRY")}
                className={`px-3 py-1 rounded transition ${
                  activeTab === "TELEMETRY"
                    ? "bg-[#1b2434] text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2. Wear Degradation Curve
              </button>
              <button
                onClick={() => setActiveTab("CONTRACTS")}
                className={`px-3 py-1 rounded transition ${
                  activeTab === "CONTRACTS"
                    ? "bg-[#1b2434] text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                3. Warranty Fine Print Audit
              </button>
            </div>
          </div>

          <div className="p-5">
            {activeTab === "SCHEMATIC" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>INTERACTIVE HYDRAULIC FLOW ARCHITECTURE: Click any component to inspect physical sensor telemetry</span>
                  <span className="text-cyan-400">CURRENT SELECTION: {selectedSchematicPart}</span>
                </div>

                {/* SVG Hydraulic Schematic */}
                <div className="w-full bg-[#080b0f] border border-[#1b2230] rounded-lg p-4 overflow-x-auto">
                  <div className="min-w-[800px] flex items-center justify-between relative py-6">
                    
                    {/* Stage 1: Municipal Raw Inflow */}
                    <div 
                      onClick={() => setSelectedSchematicPart("MUNICIPAL_INLET")}
                      className={`cursor-pointer p-3 rounded border text-center transition w-36 ${
                        selectedSchematicPart === "MUNICIPAL_INLET"
                          ? "bg-[#141b28] border-cyan-400 text-white"
                          : "bg-[#0d121c] border-[#1e293c] text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-500 block">RAW WATER INLET</span>
                      <p className="text-xs font-bold mt-1">DJB Supply</p>
                      <span className="text-[10px] font-mono text-red-400 mt-1 block">920 ppm TDS</span>
                    </div>

                    {/* Dynamic Flow Conduit 1 */}
                    <div className="h-4 flex-1 relative flex items-center px-1">
                      <svg className="w-full h-3 overflow-visible">
                        <line 
                          x1="0" y1="6" x2="100%" y2="6" 
                          stroke={simStep >= 4 ? "#10b981" : "#ef4444"} 
                          strokeWidth="2.5" 
                          className={simStep >= 4 ? "animate-flow" : "animate-flow-fast"}
                        />
                      </svg>
                      <div className={`absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 ${simStep >= 4 ? 'border-emerald-400' : 'border-red-400'} rotate-45`}></div>
                    </div>

                    {/* Stage 2: Spun Sediment Pre-Filter (CHOKED) */}
                    <div 
                      onClick={() => setSelectedSchematicPart("SEDIMENT_FILTER")}
                      className={`cursor-pointer p-3 rounded border text-center transition w-44 relative ${
                        selectedSchematicPart === "SEDIMENT_FILTER"
                          ? simStep >= 4
                            ? "bg-[#0f241a] border-emerald-500 text-white shadow-lg shadow-emerald-950/50"
                            : "bg-[#251014] border-red-500 text-white shadow-lg shadow-red-950/50"
                          : simStep >= 4
                            ? "bg-[#0b1a13] border-emerald-900/80 text-emerald-300 hover:border-emerald-600"
                            : "bg-[#180e12] border-red-900/80 text-red-300 hover:border-red-600"
                      }`}
                    >
                      <span className={`text-[9px] font-mono font-bold block flex items-center justify-center gap-1 ${simStep >= 4 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {simStep >= 4 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-red-400" />}
                        {simStep >= 4 ? "REPLACED (NEW OEM)" : "CHOKED (98%)"}
                      </span>
                      <p className="text-xs font-bold mt-1">Spun Sediment 5μm</p>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">SKU: KENT-SP-SED-01</span>
                    </div>

                    {/* Dynamic Flow Conduit 2 */}
                    <div className="h-4 flex-1 relative flex items-center px-1">
                      <svg className="w-full h-3 overflow-visible">
                        <line 
                          x1="0" y1="6" x2="100%" y2="6" 
                          stroke={simStep >= 4 ? "#10b981" : "#f59e0b"} 
                          strokeWidth="2.5" 
                          className="animate-flow"
                        />
                      </svg>
                      <div className={`absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 ${simStep >= 4 ? 'border-emerald-400' : 'border-amber-400'} rotate-45`}></div>
                    </div>

                    {/* Stage 3: Carbon Block */}
                    <div 
                      onClick={() => setSelectedSchematicPart("CARBON_BLOCK")}
                      className={`cursor-pointer p-3 rounded border text-center transition w-36 ${
                        selectedSchematicPart === "CARBON_BLOCK"
                          ? "bg-[#141b28] border-cyan-400 text-white"
                          : "bg-[#0d121c] border-[#1e293c] text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-500 block">STAGE 2</span>
                      <p className="text-xs font-bold mt-1">Carbon Block</p>
                      <span className="text-[10px] font-mono text-amber-400 mt-1 block">Chlorine: 0.1ppm</span>
                    </div>

                    {/* Dynamic Flow Conduit 3 */}
                    <div className="h-4 flex-1 relative flex items-center px-1">
                      <svg className="w-full h-3 overflow-visible">
                        <line 
                          x1="0" y1="6" x2="100%" y2="6" 
                          stroke="#06b6d4" 
                          strokeWidth="2.5" 
                          className="animate-flow"
                        />
                      </svg>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-400 rotate-45"></div>
                    </div>

                    {/* Stage 4: Booster Pump */}
                    <div 
                      onClick={() => setSelectedSchematicPart("BOOSTER_PUMP")}
                      className={`cursor-pointer p-3 rounded border text-center transition w-36 ${
                        selectedSchematicPart === "BOOSTER_PUMP"
                          ? "bg-[#141b28] border-cyan-400 text-white"
                          : "bg-[#0d121c] border-[#1e293c] text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-500 block">INTERNAL PUMP</span>
                      <p className="text-xs font-bold mt-1">110 PSI Booster</p>
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Duty: 85%</span>
                    </div>

                    {/* Dynamic Flow Conduit 4 */}
                    <div className="h-4 flex-1 relative flex items-center px-1">
                      <svg className="w-full h-3 overflow-visible">
                        <line 
                          x1="0" y1="6" x2="100%" y2="6" 
                          stroke="#06b6d4" 
                          strokeWidth="2.5" 
                          className="animate-flow"
                        />
                      </svg>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-400 rotate-45"></div>
                    </div>

                    {/* Stage 5: RO Membrane */}
                    <div 
                      onClick={() => setSelectedSchematicPart("RO_MEMBRANE")}
                      className={`cursor-pointer p-3 rounded border text-center transition w-36 ${
                        selectedSchematicPart === "RO_MEMBRANE"
                          ? "bg-[#141b28] border-cyan-400 text-white"
                          : "bg-[#0d121c] border-[#1e293c] text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-500 block">STAGE 4</span>
                      <p className="text-xs font-bold mt-1">Dow Filmtec 75GPD</p>
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Rejection: 96%</span>
                    </div>

                    {/* Dynamic Flow Conduit 5 */}
                    <div className="h-4 flex-1 relative flex items-center px-1">
                      <svg className="w-full h-3 overflow-visible">
                        <line 
                          x1="0" y1="6" x2="100%" y2="6" 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                          className="animate-flow"
                        />
                      </svg>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-emerald-400 rotate-45"></div>
                    </div>

                    {/* Stage 6: Pure Water Tank */}
                    <div 
                      onClick={() => setSelectedSchematicPart("PURE_TANK")}
                      className={`cursor-pointer p-3 rounded border text-center transition w-36 ${
                        selectedSchematicPart === "PURE_TANK"
                          ? "bg-[#141b28] border-cyan-400 text-white"
                          : "bg-[#0d121c] border-[#1e293c] text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-500 block">DISPATCH RESERVOIR</span>
                      <p className="text-xs font-bold mt-1">8L SS Storage</p>
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 block">TDS: 42 ppm</span>
                    </div>

                  </div>
                </div>

                {/* Selected Component Sensor Inspection Card */}
                <div className="rounded bg-[#111622] border border-[#1f293b] p-4 text-xs font-mono">
                  {selectedSchematicPart === "SEDIMENT_FILTER" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-slate-500 block text-[10px]">INSPECTION TARGET:</span>
                        <span className="text-white font-bold">5-Micron Spun Polypropylene Sediment Filter</span>
                        <span className="text-slate-400 block mt-1">Pore Occlusion Index: <b>{simStep >= 4 ? "4.2% (Pristine)" : "98.4% (Severe Choke)"}</b></span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">PRESSURE DROP (ΔP):</span>
                        <span className="text-red-400 font-bold">{simStep >= 4 ? "0.3 Bar (Standard)" : "2.4 Bar (Breached)"}</span>
                        <span className="text-slate-400 block mt-1">Max allowable before cavitation: 1.0 Bar</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">OEM DISPATCH STATUS:</span>
                        <span className="text-cyan-300 font-bold">Delhivery AWB #DEL_88291039</span>
                        <span className="text-slate-400 block mt-1">Part SKU: KENT-SP-SED-01 (₹750)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">RECOMMENDED RESOLUTION:</span>
                        <span className="text-emerald-400 font-bold">Cartridge Hot-Swap</span>
                        <span className="text-slate-400 block mt-1">Locked visit: Today 3:30 PM (Tech Ramesh)</span>
                      </div>
                    </div>
                  )}

                  {selectedSchematicPart !== "SEDIMENT_FILTER" && (
                    <div className="text-slate-400 flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold">{selectedSchematicPart}:</span> Nominal operating parameters registered. No secondary membrane damage detected thanks to rapid autonomous sediment line isolation.
                      </div>
                      <button 
                        onClick={() => setSelectedSchematicPart("SEDIMENT_FILTER")}
                        className="px-2 py-1 rounded bg-[#1b2434] text-cyan-300 hover:text-white"
                      >
                        Return to Choked Sediment Filter →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "TELEMETRY" && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>72-HOUR SENSOR DEGRADATION TELEMETRY: Inflow TDS vs Hydraulic Flow Rate vs Pump Strain</span>
                  <span className="text-red-400">● MUNICIPAL SPIKE BREACH POINT REGISTERED AT T-00:00</span>
                </div>

                {/* SVG Visual Degradation Curve */}
                <div className="w-full h-48 bg-[#080b0f] border border-[#1b2230] rounded p-3 relative">
                  <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="800" y2="40" stroke="#1f293d" strokeDasharray="4" />
                    <line x1="0" y1="80" x2="800" y2="80" stroke="#1f293d" strokeDasharray="4" />
                    <line x1="0" y1="120" x2="800" y2="120" stroke="#1f293d" strokeDasharray="4" />
                    
                    {/* Safe TDS threshold line */}
                    <line x1="0" y1="100" x2="800" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="2" />
                    <text x="10" y="95" fill="#ef4444" fontSize="9">CRITICAL TDS THRESHOLD (300 PPM)</text>

                    {/* TDS Spike curve (Red) */}
                    <path 
                      d="M 0 130 Q 200 130 350 125 T 450 120 T 500 40 T 800 30" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2.5" 
                    />

                    {/* Flow rate drop curve (Cyan) */}
                    <path 
                      d="M 0 40 Q 200 40 350 45 T 450 50 T 500 135 T 800 145" 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="2.5" 
                    />

                    {/* Breach Event Marker */}
                    <circle cx="500" cy="40" r="4" fill="#ef4444" className="animate-ping" />
                    <circle cx="500" cy="40" r="3" fill="#ffffff" />
                    <line x1="500" y1="0" x2="500" y2="160" stroke="#ef4444" strokeWidth="1" strokeDasharray="3" />
                    <text x="510" y="20" fill="#ffffff" fontSize="9" fontWeight="bold">T-00:00 MUNICIPAL BURST DETECTED</text>
                  </svg>

                  <div className="absolute bottom-2 left-4 flex gap-6 text-[10px]">
                    <span className="text-red-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-red-400"></span> Raw TDS Inflow (PPM)
                    </span>
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-cyan-400"></span> Hydraulic Flow Rate (L/hr)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#111622] border border-[#1e293b] text-xs text-slate-300">
                  <b>Automated Rule Triggered:</b> When Raw TDS exceeds 300 ppm for &gt; 4 consecutive sensor telemetry pulses and flow rate degrades by &gt; 40%, YantraOS classifies incident as <i>External Hydraulic Catastrophe</i> rather than normal wear, automatically validating Landlord Liability under Tenancy Lease Clause 14B.
                </div>
              </div>
            )}

            {activeTab === "CONTRACTS" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded bg-[#111622] border border-[#1e293b] space-y-2">
                  <span className="text-slate-500 text-[10px]">CONTRACT PROVIDER</span>
                  <p className="text-white font-bold">Kent Comprehensive Care AMC</p>
                  <p className="text-slate-400 text-[11px]">Contract ID: #KENT-AMC-2023-88219</p>
                  <div className="pt-2 border-t border-[#1e293b] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Allotted Visits:</span>
                      <span className="text-white">2 per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Visits Remaining:</span>
                      <span className="text-red-400 font-bold">0 / 2 (Exhausted)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded bg-[#111622] border border-[#1e293b] space-y-2">
                  <span className="text-slate-500 text-[10px]">THE GROUND REALITY TRAP</span>
                  <p className="text-amber-400 font-bold">Technician Avoidance Pattern</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Brand AMC technicians earn zero incremental labor fees on exhausted free-visit tickets. Unorganized tickets get postponed indefinitely with <i>&ldquo;Bhaiya parts nahi hai, kal subah pakka&rdquo;</i> excuses.
                  </p>
                </div>

                <div className="p-4 rounded bg-[#111622] border border-[#1e293b] space-y-2">
                  <span className="text-slate-500 text-[10px]">YANTRAOS COUNTER-ACTION</span>
                  <p className="text-emerald-400 font-bold">Direct Parts + Paid Labor Escrow</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Bypassed brand dial-tree: ordered OEM kit via Delhivery Express, pre-authorized ₹700 direct labor fee via Pine Labs escrow. Technician arrives eagerly with guaranteed payout waiting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* MODAL 1: 60-SECOND OPTICAL MEMORY INGRESS SCANNER */}
      {showWalkthroughModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-[#232d42] rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2332]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">60-Second Video Ingress Scanner</h3>
              </div>
              <button 
                onClick={() => setShowWalkthroughModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#161c28]"
              >
                ESC [✕]
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Zero manual data entry: The household resident pans their smartphone camera across home appliances for 60 seconds upon move-in. YantraOS vision models extract metal rating plates, serial numbers, and OCR specs automatically.
            </p>

            {/* Viewfinder Mockup */}
            <div className="rounded bg-[#05070a] border border-[#1e273a] p-4 relative overflow-hidden">
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

              <div className="space-y-2 py-4">
                <div className="flex justify-between items-center text-[10px] text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    CV TRACKER: FRAME #248 BOUNDING BOX
                  </span>
                  <span>CONFIDENCE: 99.4%</span>
                </div>

                <div className="p-3 rounded bg-[#0b0f16] border border-cyan-900/60 text-[11px] space-y-1">
                  <p className="text-emerald-400 font-bold">✓ OCR BOUND: Kent Grand+ Rating Stamp</p>
                  <p className="text-slate-300">MODEL: KENT-GP-11076 | SERIAL: SN-DEL-2023-88912</p>
                  <p className="text-slate-300">PRESSURE RATING: 0.3 - 3.0 kg/cm² | POWER: 60W</p>
                  <p className="text-cyan-300">→ MATCHED GMAIL INVOICE: Amazon India #INV-2023-99142</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowWalkthroughModal(false)}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition"
              >
                Close Viewfinder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WHATSAPP 1-TAP BIOMETRIC APPROVAL CARD */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-[#232d42] rounded-lg max-w-sm w-full p-5 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2332]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">WhatsApp Biometric Push</h3>
              </div>
              <button 
                onClick={() => setShowWhatsAppModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#161c28]"
              >
                ESC [✕]
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Real WhatsApp interactive message received by Landlord <b>Vikas Khanna</b> to authorize Pine Labs escrow with 1-tap:
            </p>

            {/* Authentic WhatsApp Bubble */}
            <div className="rounded-lg bg-[#0b141a] p-3.5 border border-emerald-950/80 space-y-2.5 text-xs font-sans text-slate-200">
              <div className="flex items-center justify-between border-b border-[#182229] pb-2">
                <span className="text-[11px] font-bold text-emerald-400 font-mono flex items-center gap-1">
                  ⚡ YantraOS Verified Maintenance
                </span>
                <span className="text-[9px] text-slate-500 font-mono">14:02 IST</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                <b>Flat 402, Godrej Woods (Tenant: Arpit Sharma):</b>
                <br />Kent RO purifier sediment choked due to municipal supply surge.
              </p>

              <div className="p-2 rounded bg-[#111b21] border border-[#1f2c34] space-y-0.5 text-[10px] font-mono">
                <p>• Delhivery Parts: ₹750 (OEM Cartridge)</p>
                <p>• Certified Tech Labor: ₹700 (3:30 PM slot)</p>
                <p className="text-indigo-300 font-bold">• Lease Split: 100% Landlord Liability (Clause 14B)</p>
              </div>

              <button 
                onClick={() => {
                  triggerGeofenceArrival();
                  setShowWhatsAppModal(false);
                }}
                className="w-full py-2 rounded bg-[#00a884] hover:bg-[#06cf9c] text-white font-bold text-xs text-center transition font-mono"
              >
                [ 🟢 1-TAP PRE-AUTHORIZE (₹1,450 ESCROW) ]
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button 
                onClick={() => setShowWhatsAppModal(false)}
                className="px-3 py-1 rounded bg-[#1b2332] text-slate-300 text-xs hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LEASE CLAUSE 14B ARBITRATION AUDITOR */}
      {showLeaseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-[#232d42] rounded-lg max-w-xl w-full p-5 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2332]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Lease Agreement Clause 14B Arbitration</h3>
              </div>
              <button 
                onClick={() => setShowLeaseModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#161c28]"
              >
                ESC [✕]
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Rental Agreement between <b>Vikas Khanna (Lessor)</b> and <b>Arpit Sharma (Lessee)</b> parsed via Pine Labs arbitration parser:
            </p>

            <div className="rounded bg-[#080b0f] border border-[#1b2230] p-4 text-xs font-mono space-y-2 text-slate-300">
              <span className="text-[10px] text-slate-500 block">EXTRACTED CONTRACT TEXT:</span>
              <p className="bg-[#10141f] p-3 rounded border border-indigo-900/50 text-indigo-200 leading-relaxed font-sans text-xs">
                &ldquo;<b>Clause 14(B) — Major Domestic Fixtures & Hydraulic Maintenance:</b> All capital repairs, structural defects, electrical motor replacements, or premature filter failures exceeding INR 1,000 arising directly from municipal water supply contamination or grid voltage spikes shall be borne exclusively 100% by the Lessor (Landlord). Routine day-to-day minor consumables below INR 300 shall be the liability of Lessee.&rdquo;
              </p>
              
              <div className="pt-2 text-[11px] space-y-1">
                <p className="text-emerald-400">✓ Repair Quote: ₹1,450 (&gt; INR 1,000 threshold verified)</p>
                <p className="text-emerald-400">✓ Cause of Failure: Municipal Inflow Spike 920 ppm (External DJB grid anomaly verified)</p>
                <p className="text-indigo-300 font-bold">→ Decision: 100% Liability Assigned to Landlord Vikas Khanna</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowLeaseModal(false)}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
              >
                Dismiss Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
