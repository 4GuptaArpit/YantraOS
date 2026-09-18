from .database import SessionLocal, engine, Base
from .models import Machine, Incident, GnaniCallLog, DelhiveryShipment, PineLabsEscrow
from .rails.gnani_rail import GnaniVoiceRail
from .rails.delhivery_rail import DelhiveryLogisticsRail
from .rails.pinelabs_rail import PineLabsPaymentRail

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(Machine).count() > 0:
        db.close()
        return

    # Machine 1: Kent Grand+ RO (The Real Customer Insight: Muddy municipal water choke + AMC fine print limit)
    ro_machine = Machine(
        household_id="HH_NCR_402",
        name="Kent Grand+ RO Water Purifier",
        category="WATER_PURIFIER",
        brand="Kent",
        model_number="KENT-GP-11076",
        serial_number="SN-DEL-2023-88912",
        location_room="Kitchen Utility",
        purchase_date="2023-05-15",
        warranty_expiry="2024-05-14",
        is_under_warranty=False,
        has_active_amc=True,
        amc_provider="Kent Care Comprehensive AMC",
        amc_expiry="2026-12-31",
        amc_free_visits_total=2,
        amc_free_visits_remaining=0, # EXHAUSTED! Triggers hidden cooldown dodging by technicians
        amc_cooldown_active=True,
        health_score=24,
        wear_metric_name="Inflow Water Turbidity / TDS",
        wear_metric_value=920.0, # High muddy water spike!
        wear_threshold=300.0,
        status="CRITICAL_BREAKDOWN"
    )

    # Machine 2: Daikin 1.5T Inverter Split AC (Landlord-Tenant dispute use case)
    ac_machine = Machine(
        household_id="HH_NCR_402",
        name="Daikin 1.5 Ton 5-Star Split AC",
        category="AIR_CONDITIONER",
        brand="Daikin",
        model_number="FTKF50TV",
        serial_number="DKN-IN-88921-X",
        location_room="Master Bedroom",
        purchase_date="2022-03-20",
        warranty_expiry="2023-03-19",
        is_under_warranty=False,
        has_active_amc=False,
        amc_provider=None,
        amc_free_visits_total=0,
        amc_free_visits_remaining=0,
        amc_cooldown_active=False,
        health_score=78,
        wear_metric_name="Compressor Heat Stress Hours",
        wear_metric_value=1420.0,
        wear_threshold=2000.0,
        status="WARNING"
    )

    # Machine 3: Bosch 7kg Front Load Washer
    washer_machine = Machine(
        household_id="HH_NCR_402",
        name="Bosch Serie 6 Front Load Washer",
        category="WASHING_MACHINE",
        brand="Bosch",
        model_number="WAJ2846PIN",
        serial_number="BSH-FL-99014",
        location_room="Dry Balcony",
        purchase_date="2024-01-10",
        warranty_expiry="2026-01-09",
        is_under_warranty=True,
        has_active_amc=False,
        amc_provider="Bosch Extended Care",
        amc_free_visits_total=1,
        amc_free_visits_remaining=1,
        amc_cooldown_active=False,
        health_score=94,
        wear_metric_name="Drum Descaling Cycles",
        wear_metric_value=14.0,
        wear_threshold=50.0,
        status="OPTIMAL"
    )

    db.add_all([ro_machine, ac_machine, washer_machine])
    db.commit()
    db.refresh(ro_machine)

    # Create Active Incident: The Muddy Water RO Emergency
    incident = Incident(
        incident_code="INC-2026-RO-402",
        machine_id=ro_machine.id,
        title="RO Output Stoppage (Municipal Sediment Choke)",
        description="Sudden muddy water surge from Delhi Jal Board municipal pipeline choked the external pre-filter & sediment cartridge. Water outlet flow dropped to 0.05 L/min.",
        trigger_type="TELEMETRY_SPIKE",
        severity="CRITICAL",
        status="PARTS_DISPATCHED",
        is_rental_property=True,
        tenant_name="Arpit Sharma",
        landlord_name="Vikas Khanna",
        tenant_liability_amount=0.0,
        landlord_liability_amount=1450.0,
        split_clause_applied="Clause 14B (Major Mechanical): 100% Landlord Liability for Sediment Overhaul (>INR 1000)",
        landlord_approval_status="AUTO_APPROVED"
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # 1. Partner Rail: Gnani Call Log
    call_data = GnaniVoiceRail.generate_technician_negotiation(
        technician_name="Ramesh Kumar (Kent Certified)",
        requested_slot="Uncertain / Coming in 10 mins",
        preferred_slot="Today, 3:30 PM"
    )
    call_log = GnaniCallLog(
        incident_id=incident.id,
        call_sid=call_data["call_sid"],
        technician_name=call_data["technician_name"],
        technician_phone="+91 98101 23456",
        call_direction="OUTBOUND",
        duration_seconds=call_data["duration_seconds"],
        language=call_data["language"],
        initial_technician_slot="Uncertain (Coming in 10 mins)",
        negotiated_firm_slot=call_data["negotiated_firm_slot"],
        slot_agreed=True,
        transcript=call_data["transcript"],
        audio_url="/demo_assets/audio/ro_technician_negotiation.mp3"
    )
    db.add(call_log)

    # 2. Partner Rail: Delhivery Shipment
    delhivery_data = DelhiveryLogisticsRail.dispatch_spare_part(
        item_name="Kent OEM Spun Sediment Cartridge + Carbon Filter Kit",
        item_sku="KENT-SP-SED-01",
        destination_pincode="122001"
    )
    shipment = DelhiveryShipment(
        incident_id=incident.id,
        waybill_number=delhivery_data["waybill_number"],
        item_name=delhivery_data["item_name"],
        item_sku=delhivery_data["item_sku"],
        cost=750.0,
        origin_hub=delhivery_data["origin_hub"],
        destination_pincode=delhivery_data["destination_pincode"],
        status=delhivery_data["status"],
        estimated_delivery_time=delhivery_data["estimated_delivery_time"],
        live_location=delhivery_data["live_location"]
    )
    db.add(shipment)

    # 3. Partner Rail: Pine Labs Escrow
    escrow_data = PineLabsPaymentRail.create_escrow(
        total_cost=1450.0,
        parts_cost=750.0,
        labor_cost=700.0,
        is_rental=True
    )
    escrow = PineLabsEscrow(
        incident_id=incident.id,
        escrow_id=escrow_data["escrow_id"],
        total_amount=escrow_data["total_amount"],
        parts_cost=escrow_data["parts_cost"],
        technician_labor_cost=escrow_data["technician_labor_cost"],
        tenant_share=escrow_data["tenant_share"],
        landlord_share=escrow_data["landlord_share"],
        escrow_status="LOCKED",
        pre_auth_txn_id=escrow_data["pre_auth_txn_id"],
        doorstep_otp=escrow_data["doorstep_otp"],
        otp_verified=False,
        geofence_status="WITHIN_50M"
    )
    db.add(escrow)

    db.commit()
    db.close()
    print("YantraOS database seeded successfully with real incident data!")

if __name__ == "__main__":
    seed_database()
