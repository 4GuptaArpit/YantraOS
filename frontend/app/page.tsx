"use client";

import React, { useState, useEffect } from "react";
import { 
  Wrench, Droplets, Wind, ShieldAlert, CheckCircle2, Clock, 
  Truck, PhoneCall, CreditCard, Play, Pause, KeyRound, Building2
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

interface Incident {
  id: number;
  incident_code: string;
  machine_name: string;
  machine_brand: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  tenancy_split: {
    is_rental: boolean;
    tenant_name: string;
    landlord_name: string;
    tenant_share: number;
    landlord_share: number;
    clause_applied: string;
    approval_status: string;
  };
  gnani_call?: {
    call_sid: string;
    technician_name: string;
    duration_seconds: number;
    language: string;
    negotiated_firm_slot: string;
    transcript: Array<{
      timestamp: string;
      speaker: string;
      text: string;
      translation: string;
    }>;
  };
  delhivery_shipment?: {
    waybill_number: string;
    item_name: string;
    status: string;
    estimated_delivery_time: string;
    live_location: string;
  };
  pinelabs_escrow?: {
    escrow_id: string;
    total_amount: number;
    parts_cost: number;
    technician_labor_cost: number;
    tenant_share: number;
    landlord_share: number;
    escrow_status: string;
    doorstep_otp: string;
    otp_verified: boolean;
    geofence_status: string;
  };
}

export default function YantraOSDashboard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
  const [otpInput, setOtpInput] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Initial Data Fetch with resilient fallback
  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data: Machine[]) => setMachines(data))
      .catch(() => {
        setMachines([
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
      });

    fetch("http://localhost:8000/api/incidents")
      .then((res) => res.json())
      .then((data: Incident[]) => {
        if (data && data.length > 0) setIncident(data[0]);
      })
      .catch(() => {
        // Handled silently
      });
  }, []);

  // Audio Playback & Subtitle timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setActiveSubtitleIndex((prev) => (prev < 5 ? prev + 1 : 0));
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingAudio]);

  const handleVerifyOtp = async () => {
    if (!incident) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/rails/pinelabs/verify-otp/${incident.id}?entered_otp=${otpInput}`, {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSuccess(true);
        setIncident((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: "ESCROW_SETTLED",
            pinelabs_escrow: prev.pinelabs_escrow ? {
              ...prev.pinelabs_escrow,
              escrow_status: "RELEASED",
              otp_verified: true
            } : undefined
          };
        });
      } else {
        alert(data.detail || "Invalid OTP code");
      }
    } catch {
      // Local fallback simulator
      if (otpInput === "7492") {
        setOtpSuccess(true);
      } else {
        alert("Invalid OTP! Try demo code: 7492");
      }
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans pb-16">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              य
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                YantraOS <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">Round 2 Build</span>
              </span>
              <p className="text-[11px] text-slate-400">Autonomous Domestic Machine Operating System</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Gnani.ai Voice Rail</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Delhivery JIT Parts</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>Pine Labs Escrow</span>
              </div>
            </div>

            <div className="h-8 px-3 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-2 text-xs font-medium text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Tower B - 402, Godrej Woods</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* Banner Alert: Live Autonomous Incident */}
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
          
          {/* RAIL 1: GNANI.AI VOICE CONSOLE */}
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
                  Outbound Call • 65s
                </span>
              </div>

              {/* Call Audio Simulation Card */}
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">Technician Ramesh (Kent Certified)</p>
                    <p className="text-[11px] text-slate-400">Language: hi-IN (Bilingual Hinglish)</p>
                  </div>
                  <button 
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-500/20 flex items-center justify-center"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>

                {/* Simulated Audio Waveform */}
                <div className="flex items-center gap-1 h-6 px-1">
                  {[40, 75, 30, 90, 60, 45, 80, 100, 35, 65, 85, 40, 95, 70, 50, 80, 30, 90].map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-emerald-400' : 'bg-slate-700'}`}
                      style={{ height: isPlayingAudio ? `${Math.max(20, (h * (i % 3 + 1)) % 100)}%` : '20%' }}
                    ></div>
                  ))}
                </div>

                {/* Subtitle Snippet */}
                <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 text-xs space-y-1">
                  <p className="text-[11px] font-bold text-emerald-400">
                    {activeSubtitleIndex % 2 === 0 ? "YantraOS (Gnani.ai):" : "Technician Ramesh:"}
                  </p>
                  <p className="text-slate-200 italic">
                    {activeSubtitleIndex === 0 && "\"Namaste Ramesh ji, Kent RO filter replacement ke regarding call kiya hai.\""}
                    {activeSubtitleIndex === 1 && "\"Arrey bhaiya main Cyber Hub hu, 10 minute me aa raha hu ghar pe raho.\""}
                    {activeSubtitleIndex === 2 && "\"Ramesh ji, genuine OEM parts Delhivery se 2:15 PM deliver ho rahe hain. Theek 3:30 PM lock karein?\""}
                    {activeSubtitleIndex === 3 && "\"Achha parts direct aa rahe hain? Phir theek hai, 3:30 PM Sector 43 pohonch jaunga.\""}
                    {activeSubtitleIndex === 4 && "\"Bohot badhiya. MyGate pre-approved hai, Pine Labs escrow OTP verify hoke instant labor release hoga.\""}
                    {activeSubtitleIndex >= 5 && "\"Theek hai sir, theek 3:30 PM milte hain. Shukriya.\""}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Slot Lock: <b>3:30 PM</b></span>
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
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    OUT FOR DELIVERY
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
                    <span>12:45 PM - Rider Vikas M. (1.8km away)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ETA: Today, 2:15 PM (Precedes Technician)</span>
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
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otpSuccess || actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-xs font-semibold text-white transition whitespace-nowrap"
                    >
                      {otpSuccess ? "Released" : "Verify OTP"}
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
                  machine.status === 'CRITICAL_BREAKDOWN' && !otpSuccess
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
                    <span className={`font-bold ${
                      (otpSuccess && machine.id === 1) || machine.health_score > 70 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {otpSuccess && machine.id === 1 ? '98%' : `${machine.health_score}%`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (otpSuccess && machine.id === 1) || machine.health_score > 70 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${otpSuccess && machine.id === 1 ? 98 : machine.health_score}%` }}
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
                    {otpSuccess && machine.id === 1 ? '110 ppm' : `${machine.wear_metric_value} ppm`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
