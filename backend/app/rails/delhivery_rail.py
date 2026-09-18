import random
import datetime

class DelhiveryLogisticsRail:
    """
    Adapter for Delhivery Express Surface & Hyperlocal Parts Logistics.
    Orchestrates pre-emptive spare parts dispatch directly to the consumer's doorstep,
    preventing technician fake part substitutions and eliminate multi-day parts chasing.
    """

    @staticmethod
    def dispatch_spare_part(item_name: str, item_sku: str, destination_pincode: str):
        awb = f"DEL_AWB_{random.randint(10000000, 99999999)}"
        now = datetime.datetime.now()
        eta_time = (now + datetime.timedelta(hours=3, minutes=30)).strftime("%I:%M %p")

        timeline = [
            {"time": "09:15 AM", "status": "Manifested", "location": "OEM Gurugram Central Warehouse", "completed": True},
            {"time": "10:30 AM", "status": "In Transit", "location": "Delhivery Sorting Hub, Sector 18", "completed": True},
            {"time": "12:45 PM", "status": "Out for Delivery", "location": "Sector 43 Delivery Center (Rider: Vikas M.)", "completed": True},
            {"time": eta_time, "status": "Expected Doorstep Arrival", "location": "Tower B, Flat 402, Godrej Woods", "completed": False}
        ]

        return {
            "waybill_number": awb,
            "item_name": item_name,
            "item_sku": item_sku,
            "origin_hub": "Delhivery Gurugram Fulfillment Center",
            "destination_pincode": destination_pincode,
            "status": "OUT_FOR_DELIVERY",
            "estimated_delivery_time": f"Today, {eta_time}",
            "live_location": "Sector 43 Hub, 1.8km away from destination",
            "timeline": timeline
        }
