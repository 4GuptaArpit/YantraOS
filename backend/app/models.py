from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(String, default="HH_NCR_402")
    name = Column(String, nullable=False) # e.g. "Kent Grand+ RO Purifier"
    category = Column(String, nullable=False) # "WATER_PURIFIER", "AIR_CONDITIONER", "WASHING_MACHINE"
    brand = Column(String, nullable=False) # "Kent", "Daikin", "Bosch"
    model_number = Column(String) # "KENT-GP-11076"
    serial_number = Column(String) # "SN-DEL-2023-88912"
    location_room = Column(String) # "Kitchen Utility", "Master Bedroom"
    purchase_date = Column(String) # "2023-04-10"
    warranty_expiry = Column(String) # "2024-04-09"
    is_under_warranty = Column(Boolean, default=False)
    
    # AMC Details
    has_active_amc = Column(Boolean, default=True)
    amc_provider = Column(String) # "Kent Direct Care AMC"
    amc_expiry = Column(String) # "2026-11-30"
    amc_free_visits_total = Column(Integer, default=2)
    amc_free_visits_remaining = Column(Integer, default=0) # Real scenario: exhausted quota!
    amc_cooldown_active = Column(Boolean, default=True) # Hidden fine print trap!

    # Telemetry & Wear Metrics
    health_score = Column(Integer, default=100) # 0 to 100
    wear_metric_name = Column(String) # "Filter TDS Inflow", "Compressor Hours"
    wear_metric_value = Column(Float) # e.g. 850 ppm (TDS)
    wear_threshold = Column(Float) # 300 ppm (TDS threshold)
    status = Column(String, default="OPTIMAL") # "OPTIMAL", "WARNING", "CRITICAL_BREAKDOWN"

    incidents = relationship("Incident", back_populates="machine")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String, unique=True, index=True) # "INC-2026-RO-402"
    machine_id = Column(Integer, ForeignKey("machines.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    trigger_type = Column(String) # "TELEMETRY_SPIKE", "USER_VOICE_NOTE", "SCHEDULED_MAINTENANCE"
    severity = Column(String, default="HIGH") # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    
    # Lifecycle: DETECTED -> TRIAGED -> PARTS_DISPATCHED -> VOICE_NEGOTIATED -> DOORSTEP_GEOFENCED -> OTP_VERIFIED -> ESCROW_SETTLED
    status = Column(String, default="DETECTED")
    
    # Legal / Tenancy Split
    is_rental_property = Column(Boolean, default=True)
    tenant_name = Column(String, default="Arpit Sharma")
    landlord_name = Column(String, default="Vikas Khanna")
    tenant_liability_amount = Column(Float, default=0.0)
    landlord_liability_amount = Column(Float, default=0.0)
    split_clause_applied = Column(String) # "Clause 14B: Damage <INR 1000 borne by tenant, mechanical >INR 1000 borne by owner"
    landlord_approval_status = Column(String, default="AUTO_APPROVED") # "PENDING", "APPROVED"

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    machine = relationship("Machine", back_populates="incidents")
    gnani_call = relationship("GnaniCallLog", back_populates="incident", uselist=False)
    delhivery_shipment = relationship("DelhiveryShipment", back_populates="incident", uselist=False)
    pinelabs_escrow = relationship("PineLabsEscrow", back_populates="incident", uselist=False)

class GnaniCallLog(Base):
    __tablename__ = "gnani_call_logs"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    call_sid = Column(String, unique=True) # "GNANI_CALL_88910"
    technician_name = Column(String, default="Ramesh Kumar (Kent Certified)")
    technician_phone = Column(String, default="+91 98101 23456")
    call_direction = Column(String, default="OUTBOUND") # "OUTBOUND" or "INBOUND"
    duration_seconds = Column(Integer, default=74)
    language = Column(String, default="hi-IN-Hinglish")
    
    # Negotiation Outcomes
    initial_technician_slot = Column(String, default="Uncertain (Coming in 10 mins)")
    negotiated_firm_slot = Column(String, default="Today, 3:30 PM - 4:15 PM")
    slot_agreed = Column(Boolean, default=True)
    
    # Full Transcript (JSON format of timestamps, speaker, and text)
    transcript = Column(JSON)
    audio_url = Column(String) # Path to audio file

    incident = relationship("Incident", back_populates="gnani_call")

class DelhiveryShipment(Base):
    __tablename__ = "delhivery_shipments"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    waybill_number = Column(String, unique=True) # "DEL_AWB_88291039"
    item_name = Column(String, nullable=False) # "Kent OEM Sediment Filter + Carbon Block"
    item_sku = Column(String, default="KENT-SP-SED-01")
    cost = Column(Float, default=750.0)
    origin_hub = Column(String, default="Delhivery Gurugram Fulfillment Center")
    destination_pincode = Column(String, default="122001")
    status = Column(String, default="OUT_FOR_DELIVERY") # "MANIFESTED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"
    estimated_delivery_time = Column(String, default="Today, 2:15 PM")
    live_location = Column(String, default="Sector 43 Hub, 1.8km away")

    incident = relationship("Incident", back_populates="delhivery_shipment")

class PineLabsEscrow(Base):
    __tablename__ = "pinelabs_escrow"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    escrow_id = Column(String, unique=True) # "PL_ESC_992140"
    total_amount = Column(Float, default=1450.0) # 750 parts + 700 labor
    parts_cost = Column(Float, default=750.0)
    technician_labor_cost = Column(Float, default=700.0)
    
    tenant_share = Column(Float, default=0.0)
    landlord_share = Column(Float, default=1450.0)
    
    escrow_status = Column(String, default="LOCKED") # "LOCKED", "RELEASED", "REFUNDED"
    pre_auth_txn_id = Column(String, default="PL_TXN_PREAUTH_8871")
    settlement_txn_id = Column(String)
    
    # Doorstep Security Handshake
    doorstep_otp = Column(String, default="7492")
    otp_verified = Column(Boolean, default=False)
    geofence_status = Column(String, default="WITHIN_50M") # "OUTSIDE", "APPROACHING", "WITHIN_50M"

    incident = relationship("Incident", back_populates="pinelabs_escrow")
