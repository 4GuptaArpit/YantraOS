from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from .database import get_db, Base, engine
from .models import Machine, Incident, GnaniCallLog, DelhiveryShipment, PineLabsEscrow
from .seed import seed_database
from .rails.gnani_rail import GnaniVoiceRail
from .rails.delhivery_rail import DelhiveryLogisticsRail
from .rails.pinelabs_rail import PineLabsPaymentRail

# Initialize schemas
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="YantraOS Core API",
    description="The Autonomous Domestic Machine Memory & Dispatch Engine (The Ken Case Competition 2026)",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "system": "YantraOS",
        "status": "OPERATIONAL",
        "round": "Round 2 - The Great Rewiring",
        "opening": "Opening 10: Keeping the Machines Running",
        "rails": {
            "voice": "Gnani.ai Indic Telephony Engine",
            "logistics": "Delhivery JIT Spare Parts Dispatch",
            "payments": "Pine Labs Plural Pre-Auth Escrow"
        }
    }

# 1. Machines & State Graph
@app.get("/api/machines")
def get_machines(db: Session = Depends(get_db)):
    return db.query(Machine).all()

@app.get("/api/machines/{machine_id}")
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

# 2. Incidents & Active Triage
@app.get("/api/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).all()
    results = []
    for inc in incidents:
        results.append({
            "id": inc.id,
            "incident_code": inc.incident_code,
            "machine_name": inc.machine.name if inc.machine else "Unknown",
            "machine_brand": inc.machine.brand if inc.machine else "Unknown",
            "title": inc.title,
            "description": inc.description,
            "severity": inc.severity,
            "status": inc.status,
            "tenancy_split": {
                "is_rental": inc.is_rental_property,
                "tenant_name": inc.tenant_name,
                "landlord_name": inc.landlord_name,
                "tenant_share": inc.tenant_liability_amount,
                "landlord_share": inc.landlord_liability_amount,
                "clause_applied": inc.split_clause_applied,
                "approval_status": inc.landlord_approval_status
            },
            "gnani_call": inc.gnani_call,
            "delhivery_shipment": inc.delhivery_shipment,
            "pinelabs_escrow": inc.pinelabs_escrow
        })
    return results

@app.get("/api/incidents/{incident_id}")
def get_incident_details(incident_id: int, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {
        "id": inc.id,
        "incident_code": inc.incident_code,
        "machine": inc.machine,
        "title": inc.title,
        "description": inc.description,
        "severity": inc.severity,
        "status": inc.status,
        "tenancy_split": {
            "is_rental": inc.is_rental_property,
            "tenant_name": inc.tenant_name,
            "landlord_name": inc.landlord_name,
            "tenant_share": inc.tenant_liability_amount,
            "landlord_share": inc.landlord_liability_amount,
            "clause_applied": inc.split_clause_applied,
            "approval_status": inc.landlord_approval_status
        },
        "gnani_call": inc.gnani_call,
        "delhivery_shipment": inc.delhivery_shipment,
        "pinelabs_escrow": inc.pinelabs_escrow
    }

# 3. Rail Actions: Trigger Gnani Voice Call Simulation
@app.post("/api/rails/gnani/trigger-call/{incident_id}")
def trigger_gnani_call(incident_id: int, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    call_data = GnaniVoiceRail.generate_technician_negotiation(
        technician_name="Ramesh Kumar (Kent Certified)",
        requested_slot="Uncertain (Coming in 10 mins)",
        preferred_slot="Today, 3:30 PM"
    )

    if inc.gnani_call:
        inc.gnani_call.transcript = call_data["transcript"]
        inc.gnani_call.duration_seconds = call_data["duration_seconds"]
        inc.gnani_call.negotiated_firm_slot = call_data["negotiated_firm_slot"]
    else:
        log = GnaniCallLog(
            incident_id=inc.id,
            call_sid=call_data["call_sid"],
            technician_name=call_data["technician_name"],
            duration_seconds=call_data["duration_seconds"],
            language=call_data["language"],
            initial_technician_slot="Uncertain (Coming in 10 mins)",
            negotiated_firm_slot=call_data["negotiated_firm_slot"],
            slot_agreed=True,
            transcript=call_data["transcript"],
            audio_url="/demo_assets/audio/ro_technician_negotiation.mp3"
        )
        db.add(log)
    
    inc.status = "VOICE_NEGOTIATED"
    db.commit()
    return {"status": "SUCCESS", "call_summary": call_data}

# 4. Rail Actions: Verify Doorstep OTP & Release Pine Labs Escrow
@app.post("/api/rails/pinelabs/verify-otp/{incident_id}")
def verify_otp(incident_id: int, entered_otp: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc or not inc.pinelabs_escrow:
        raise HTTPException(status_code=404, detail="Escrow record not found")
    
    escrow = inc.pinelabs_escrow
    result = PineLabsPaymentRail.verify_otp_and_release(
        escrow_id=escrow.escrow_id,
        entered_otp=entered_otp,
        correct_otp=escrow.doorstep_otp
    )

    if result["success"]:
        escrow.escrow_status = "RELEASED"
        escrow.otp_verified = True
        escrow.settlement_txn_id = result["settlement_txn_id"]
        inc.status = "ESCROW_SETTLED"
        
        # Restore machine health
        if inc.machine:
            inc.machine.health_score = 98
            inc.machine.status = "OPTIMAL"
            inc.machine.wear_metric_value = 110.0 # Restored clean TDS!
        
        db.commit()
        return result
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Escrow remains locked.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
