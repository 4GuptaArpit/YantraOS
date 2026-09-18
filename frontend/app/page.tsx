"use client";

import React, { useState, useRef } from "react";
import { 
  Wrench, Droplets, Wind, ShieldAlert, CheckCircle2, Clock, 
  Truck, PhoneCall, CreditCard, Play, Pause, KeyRound, Building2,
  Sparkles, Camera, MessageSquare
} from "lucide-react";

interface Machine {
  id: number;
  name: string;
  category: string;
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
  status: string;
}

export default function YantraOSDashboard() {
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: 1,
      name: "Kent Grand+ RO Water Purifier",
      category: "WATER_PURIFIER",
      brand: "Kent",
      model_number: "KENT-GP-11076",
      serial_number: "SN-DEL-2023-88912",
      location_room: "Kitchen Utility",
      has_active_amc: true,
      amc_provider: "Kent Comprehensive AMC",
      amc_free_visits_remaining: 0,
      amc_cooldown_active: true,
      health_score: 24,
      wear_metric_name: "Turbidity / TDS Inflow",
      wear_metric_value: 920.0,
      wear_threshold: 300.0,
      status: "CRITICAL_BREAKDOWN"
    },
    {
      id: 2,
      name: "Daikin 1.5 Ton 5-Star Split AC",
      category: "AIR_CONDITIONER",
      brand: "Daikin",
      model_number: "FTKF50TV",
      serial_number: "DKN-IN-88921-X",
      location_room: "Master Bedroom",
      has_active_amc: false,
      amc_provider: "None",
      amc_free_visits_remaining: 0,
      amc_cooldown_active: false,
      health_score: 78,
      wear_metric_name: "Compressor Hours",
      wear_metric_value: 1420.0,
      wear_threshold: 2000.0,
      status: "WARNING"
    },
    {
      id: 3,
      name: "Bosch Serie 6 Front Load Washer",
      category: "WASHING_MACHINE",
      brand: "Bosch",
      model_number: "WAJ2846PIN",
      serial_number: "BSH-FL-99014",
      location_room: "Dry Balcony",
      has_active_amc: true,
      amc_provider: "Bosch Care Extended",
      amc_free_visits_remaining: 1,
      amc_cooldown_active: false,
      health_score: 94,
      wear_metric_name: "Descaling Cycles",
      wear_metric_value: 14.0,
      wear_threshold: 50.0,
      status: "OPTIMAL"
    }
  ]);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulation Stages: 1: MUD_SPIKE -> 2: GNANI_NEGOTIATED -> 3: GEOFENCE_ARRIVED -> 4: OTP_SETTLED
  const [simStep, setSimStep] = useState<number>(2);
  const [otpInput, setOtpInput] = useState("7492");
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Modals for Ingress Proof
  const [showWalkthroughModal, setShowWalkthroughModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Subtitle timing mapping (in seconds)
  const subtitles = [
    { start: 0, speaker: "Technician Ramesh", text: "Hello? Haan ji kaun bol rahe hain?", translation: "Hello? Yes, who is speaking?" },
    { start: 3, speaker: "YantraOS (Gnani.ai)", text: "Namaste Ramesh ji, main Arpit Sharma ji ke flat se Yantra assistant bol raha hu. Kent RO filter replacement ke regarding call kiya hai.", translation: "Hello Ramesh ji, I am the Yantra assistant from Arpit Sharma's flat regarding Kent RO filter replacement." },
    { start: 12, speaker: "Technician Ramesh", text: "Arrey bhaiya main abhi Cyber Hub side hu. Das minute me nikal ke aa raha hu, aap ghar pe raho.", translation: "Oh brother, I'm near Cyber Hub. Leaving in 10 mins, please stay home." },
    { start: 19, speaker: "YantraOS (Gnani.ai)", text: "Ramesh ji, genuine Kent cartridge Delhivery se 2:15 PM flat pe deliver ho rahi hai. Aur sir 3 baje tak meeting me hain. Kya hum aapka visit theek 3:30 PM lock karein?", translation: "Ramesh ji, genuine parts arrive via Delhivery at 2:15 PM. Sir is in meetings until 3 PM. Can we lock visit for 3:30 PM?" },
    { start: 33, speaker: "Technician Ramesh", text: "Achha parts direct customer ke paas aa rahe hain? Phir badhiya hai, mujhe service kit nahi dhundhni padegi. Theek 3:30 pe Sector 43 pohonch jaunga.", translation: "Oh parts arrive directly? Great, I don't have to search for a kit. I'll reach Sector 43 at 3:30 PM." },
    { start: 43, speaker: "YantraOS (Gnani.ai)", text: "Bohot badhiya Ramesh ji. Aapka MyGate visitor pass pre-approved hai. Pine Labs escrow link ready hai, job complete hote hi OTP verify hoke instant payout release ho jayega.", translation: "Great Ramesh ji. Your MyGate pass is pre-approved. Pine Labs escrow is locked; instant payout on OTP verification." },
    { start: 56, speaker: "Technician Ramesh", text: "Theek hai sir, theek 3:30 PM milte hain. Shukriya!", translation: "Alright sir, see you at 3:30 PM. Thank you!" }
  ];

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

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

  // Interactive Simulation Controls
  const triggerMudSpike = () => {
    setSimStep(1);
    setOtpSuccess(false);
    setMachines(prev => prev.map(m => m.id === 1 ? {
      ...m,
      health_score: 18,
      wear_metric_value: 940.0,
      status: "CRITICAL_BREAKDOWN"
    } : m));
  };

  const triggerNegotiate = () => {
    setSimStep(2);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const triggerGeofenceArrival = () => {
    setSimStep(3);
  };

  const triggerSettleEscrow = () => {
    setSimStep(4);
    setOtpSuccess(true);
    setMachines(prev => prev.map(m => m.id === 1 ? {
      ...m,
      health_score: 98,
      wear_metric_value: 105.0,
      status: "OPTIMAL"
    } : m));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans pb-20">
      {/* Hidden Audio Element with Real Generated Voice Track */}
      <audio 
        ref={audioRef} 
        src="/audio/ro_technician_negotiation.mp3" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              य
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                YantraOS <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">Round 2 Winner Build</span>
              </span>
              <p className="text-[11px] text-slate-400">Autonomous Domestic Machine Operating System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowWalkthroughModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>60s Video Scan (Memory Ingress)</span>
            </button>
            <button 
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-xs font-medium text-emerald-300 border border-emerald-800 flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Biometric Card</span>
            </button>
            <div className="h-8 px-3 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-2 text-xs font-medium text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Tower B - 402, Godrej Woods</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* JUDGE'S LIVE SIMULATION CONTROLLER BANNER */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-slate-900 border border-blue-800/50 p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Judge Interactive Control Deck: Run End-to-End Autonomous Incident
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Click any stage to simulate live system reaction</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={triggerMudSpike}
              className={`p-3 rounded-xl text-left border transition flex items-center justify-between ${
                simStep === 1 ? 'bg-red-900/40 border-red-500 shadow-md shadow-red-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-[10px] text-slate-400">STAGE 1</p>
                <p className="text-xs font-bold text-white">Muddy Water Spike</p>
              </div>
              <Droplets className="w-4 h-4 text-red-400" />
            </button>

            <button 
              onClick={triggerNegotiate}
              className={`p-3 rounded-xl text-left border transition flex items-center justify-between ${
                simStep === 2 ? 'bg-emerald-900/40 border-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-[10px] text-slate-400">STAGE 2 (Real Voice)</p>
                <p className="text-xs font-bold text-emerald-300">Gnani Voice Call</p>
              </div>
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </button>

            <button 
              onClick={triggerGeofenceArrival}
              className={`p-3 rounded-xl text-left border transition flex items-center justify-between ${
                simStep === 3 ? 'bg-blue-900/40 border-blue-500 shadow-md shadow-blue-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-[10px] text-slate-400">STAGE 3</p>
                <p className="text-xs font-bold text-blue-300">Delhivery + Doorstep</p>
              </div>
              <Truck className="w-4 h-4 text-blue-400" />
            </button>

            <button 
              onClick={triggerSettleEscrow}
              className={`p-3 rounded-xl text-left border transition flex items-center justify-between ${
                simStep === 4 ? 'bg-indigo-900/40 border-indigo-500 shadow-md shadow-indigo-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-[10px] text-slate-400">STAGE 4</p>
                <p className="text-xs font-bold text-indigo-300">Pine Labs Settle</p>
              </div>
              <CreditCard className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Live Incident Status Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-900/60 p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL TELEMETRY SPIKE DETECTED
                </span>
                <span className="text-xs text-slate-400">Incident Code: INC-2026-RO-402</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                RO Sediment Choke (Municipal Muddy Water Inflow)
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Delhi Jal Board municipal pipe burst detected via society telemetry. Inflow TDS spiked to <b>920 ppm</b>, choking the sediment pre-filter. Free AMC visits quota is <b>exhausted</b>; YantraOS bypassed technician avoidance and autonomously ordered genuine parts via Delhivery and locked the technician visit via Gnani.ai.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
                <p className="text-[11px] text-slate-400">Technician Window</p>
                <p className="text-sm font-semibold text-emerald-400">Today, 3:30 PM - 4:15 PM</p>
              </div>
              <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
                <p className="text-[11px] text-slate-400">Pine Labs Escrow</p>
                <p className="text-sm font-semibold text-indigo-400">₹1,450 (100% Landlord Split)</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Partner Rails Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* RAIL 1: GNANI.AI VOICE CONSOLE (WITH REAL AUDIO PLAYER) */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Gnani.ai Voice Rail</h3>
                    <p className="text-xs text-slate-400">Vernacular Technician Negotiator</p>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  Real Audio Track • 60s
                </span>
              </div>

              {/* Real Call Audio Player Card */}
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">Technician Ramesh (Kent Certified)</p>
                    <p className="text-[11px] text-slate-400">Swara (Agent) ↔ Madhur (Technician)</p>
                  </div>
                  <button 
                    onClick={toggleAudio}
                    className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-500/30 flex items-center justify-center animate-pulse"
                    title="Click to Listen to Real Hinglish Conversation"
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1 h-8 px-1">
                  {[35, 60, 25, 80, 50, 40, 75, 95, 30, 70, 85, 45, 90, 65, 40, 85, 25, 95, 50, 75, 30, 60, 80].map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-200 ${isPlayingAudio ? 'bg-emerald-400' : 'bg-slate-800'}`}
                      style={{ height: isPlayingAudio ? `${Math.max(15, (h * (i % 3 + 1)) % 100)}%` : '15%' }}
                    ></div>
                  ))}
                </div>

                {/* Live Synchronized Subtitles */}
                <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 text-xs space-y-1.5 min-h-[75px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400">
                      {subtitles[activeSubtitleIndex].speaker}:
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {Math.floor(audioCurrentTime)}s / 60s
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">
                    &ldquo;{subtitles[activeSubtitleIndex].text}&rdquo;
                  </p>
                  <p className="text-slate-400 text-[10px] italic">
                    {subtitles[activeSubtitleIndex].translation}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Slot Lock: <b>3:30 PM (Firm)</b></span>
              <span className="text-emerald-400 font-medium">✓ Zero Hostage Waiting</span>
            </div>
          </div>

          {/* RAIL 2: DELHIVERY JIT PARTS LOGISTICS */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Delhivery Logistics Rail</h3>
                    <p className="text-xs text-slate-400">JIT Genuine Spare Parts Dispatch</p>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                  AWB: DEL_88291039
                </span>
              </div>

              {/* Waybill Details Card */}
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">Kent Spun Sediment + Carbon Kit</p>
                    <p className="text-[11px] text-slate-400">SKU: KENT-SP-SED-01 • Invoiced: ₹750</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                    simStep >= 3 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {simStep >= 3 ? "DELIVERED AT DOOR" : "OUT FOR DELIVERY"}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>09:15 AM - Dispatched: OEM Gurugram Hub</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>10:30 AM - Sector 18 Sorting Center</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-300 font-medium">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
                    <span>{simStep >= 3 ? "2:15 PM - Delivered at Security Desk" : "12:45 PM - Rider Vikas M. (1.8km away)"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ETA: 2:15 PM (Precedes 3:30 PM Technician)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Prevents Fake Part Substitutions</span>
              <span className="text-blue-400 font-medium">✓ OEM Authenticity</span>
            </div>
          </div>

          {/* RAIL 3: PINE LABS ESCROW & TENANCY ARBITRATION */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Pine Labs Escrow Rail</h3>
                    <p className="text-xs text-slate-400">Plural Pre-Auth & Lease Arbitration</p>
                  </div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${otpSuccess ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                  {otpSuccess ? "SETTLED" : "ESCROW LOCKED"}
                </span>
              </div>

              {/* Escrow & Tenancy Split Card */}
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Repair Quote:</span>
                  <span className="font-bold text-white">₹1,450 (Parts ₹750 + Labor ₹700)</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                  <p className="font-semibold text-indigo-300">Automated Rental Split (Clause 14B):</p>
                  <div className="flex justify-between text-slate-300">
                    <span>Tenant (Arpit Sharma):</span>
                    <span className="font-bold text-emerald-400">₹0</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Landlord (Vikas Khanna):</span>
                    <span className="font-bold text-indigo-400">₹1,450 (Pre-Authorized)</span>
                  </div>
                </div>

                {/* Dynamic Geofenced OTP Form */}
                <div className="pt-1">
                  <p className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Doorstep Dynamic OTP Handshake:
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Demo OTP: 7492" 
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      disabled={otpSuccess}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50 font-mono tracking-wider"
                    />
                    <button
                      onClick={triggerSettleEscrow}
                      disabled={otpSuccess}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-xs font-semibold text-white transition whitespace-nowrap"
                    >
                      {otpSuccess ? "Released ✓" : "Verify OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Geofence: <b>Within 50m</b></span>
              <span className="text-indigo-400 font-medium">✓ Cryptographic Release</span>
            </div>
          </div>

        </div>

        {/* Domestic Machine Twin State Graph */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Household Digital Machine Twins</h2>
              <p className="text-xs text-slate-400">Living wear-and-tear models, warranty expiration vaults, and AMC quota counters</p>
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              3 Machines Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <div 
                key={machine.id} 
                className={`rounded-2xl bg-slate-900/60 border p-5 space-y-4 transition ${
                  machine.status === 'CRITICAL_BREAKDOWN'
                    ? 'border-red-900/60 shadow-lg shadow-red-950/30' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {machine.location_room}
                    </span>
                    <h3 className="font-bold text-sm text-white">{machine.name}</h3>
                    <p className="text-[11px] text-slate-400">{machine.model_number} • {machine.serial_number}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
                    {machine.category === 'WATER_PURIFIER' && <Droplets className="w-5 h-5 text-cyan-400" />}
                    {machine.category === 'AIR_CONDITIONER' && <Wind className="w-5 h-5 text-blue-400" />}
                    {machine.category === 'WASHING_MACHINE' && <Wrench className="w-5 h-5 text-indigo-400" />}
                  </div>
                </div>

                {/* Health Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Machine Health Score</span>
                    <span className={`font-bold ${machine.health_score > 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {machine.health_score}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${machine.health_score > 70 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${machine.health_score}%` }}
                    ></div>
                  </div>
                </div>

                {/* AMC Quota Fine Print Insight Card */}
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">AMC Status:</span>
                    <span className="font-medium text-slate-200">{machine.has_active_amc ? "Active Care Contract" : "Expired / Pay-per-visit"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Free Visits Remaining:</span>
                    <span className={`font-bold ${machine.amc_free_visits_remaining === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {machine.amc_free_visits_remaining} / 2
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fine Print Cooldown:</span>
                    <span className="font-semibold text-amber-400">
                      {machine.amc_cooldown_active ? "Active (Technician Dodge Risk)" : "None"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                  <span>Metric: {machine.wear_metric_name}</span>
                  <span className="font-bold text-white">
                    {machine.wear_metric_value} ppm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL 1: 60-SECOND MULTIMODAL WALKTHROUGH INGRESS */}
      {showWalkthroughModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Zero-Data Entry: 60s Multimodal Ingress</h3>
              </div>
              <button 
                onClick={() => setShowWalkthroughModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To answer the design question: <i>&ldquo;How does the service memory get built without the household doing data entry?&rdquo;</i> Users record a single 60-second phone walkthrough of their appliances.
            </p>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                  OCR Engine: Vision Model Parsing Frame #142
                </span>
                <span className="text-slate-400">Confidence: 99.4%</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1 font-mono">
                <p className="text-emerald-400">✓ Detected: Kent Grand+ Metal Rating Plate</p>
                <p className="text-slate-300">Model: KENT-GP-11076 | Serial: SN-DEL-2023-88912</p>
                <p className="text-slate-300">MFG Date: 04/2023 | Inflow Pressure: 0.3-3.0 kg/cm²</p>
                <p className="text-indigo-400">→ Synced with Amazon Invoice #INV-2023-99142 via Gmail API</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowWalkthroughModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: WHATSAPP BIOMETRIC APPROVAL CARD */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">WhatsApp 1-Tap Biometric Card</h3>
              </div>
              <button 
                onClick={() => setShowWhatsAppModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              The exact zero-touch approval card received by Landlord <b>Vikas Khanna</b> on WhatsApp:
            </p>

            <div className="rounded-xl bg-[#0b141a] p-4 border border-emerald-950 space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <span>⚡ YantraOS Verified Maintenance</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <b>Flat 402, Godrej Woods (Tenant: Arpit):</b> Kent RO sediment choke due to municipal water spike.
              </p>
              <div className="p-2 rounded bg-[#111b21] border border-slate-800 space-y-1 text-[10px]">
                <p>• Delhivery Parts: ₹750 (Pre-filter kit)</p>
                <p>• Labor (Tech Ramesh): ₹700 (3:30 PM slot)</p>
                <p className="text-indigo-300 font-bold">• Lease Split (Clause 14B): 100% Landlord Liability</p>
              </div>
              <button 
                onClick={() => {
                  triggerSettleEscrow();
                  setShowWhatsAppModal(false);
                }}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs text-center transition"
              >
                [ 🟢 1-Tap Pre-Authorize Escrow (₹1,450) ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
