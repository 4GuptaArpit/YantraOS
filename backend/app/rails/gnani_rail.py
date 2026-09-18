import json
import random

class GnaniVoiceRail:
    """
    Adapter for Gnani.ai Conversational Voice Engine.
    Handles low-latency Indic speech-to-text, dial-tree navigation,
    and vernacular Hinglish dialogue management for informal technician coordination.
    """

    @staticmethod
    def generate_technician_negotiation(technician_name: str, requested_slot: str, preferred_slot: str):
        """
        Simulates Gnani.ai outbound call to an Indian appliance mechanic.
        Returns full transcript with timestamps and negotiation metrics.
        """
        transcript = [
            {
                "timestamp": "00:03",
                "speaker": "Technician (Ramesh)",
                "text": "Hello? Haan ji kaun?",
                "translation": "Hello? Yes, who is this?"
            },
            {
                "timestamp": "00:07",
                "speaker": "YantraOS (Gnani.ai)",
                "text": "Namaste Ramesh ji, main Arpit Sharma ji ke apartment se Yantra assistant bol raha hu. Kent RO filter replacement ke regarding call kiya hai.",
                "translation": "Hello Ramesh ji, I am the Yantra assistant calling from Mr. Arpit Sharma's flat regarding the Kent RO filter replacement."
            },
            {
                "timestamp": "00:15",
                "speaker": "Technician (Ramesh)",
                "text": "Arrey bhaiya main abhi Cyber Hub side hu. 10 minute me nikal ke aa raha hu, aap ghar pe raho.",
                "translation": "Oh brother, I'm currently near Cyber Hub. I'll leave in 10 mins and come, please stay at home."
            },
            {
                "timestamp": "00:23",
                "speaker": "YantraOS (Gnani.ai)",
                "text": "Ramesh ji, Delhivery se genuine Kent pre-filter cartridge dopahar 2:15 baje direct flat pe deliver ho rahi hai. Aur sir 3 baje tak office call me hain. Kya hum aapka visit theek 3:30 baje lock karein?",
                "translation": "Ramesh ji, the genuine Kent filter cartridge is being delivered directly to the flat by Delhivery at 2:15 PM. Also, sir has office meetings until 3 PM. Can we lock your visit for exactly 3:30 PM?"
            },
            {
                "timestamp": "00:36",
                "speaker": "Technician (Ramesh)",
                "text": "Achha parts aapke paas direct aa rahe hain? Phir theek hai, mujhe service kit nahi dhundhni padegi. 3:30 baje Sector 43 pohonch jaunga.",
                "translation": "Oh, the parts are arriving directly at your place? That's great, then I don't have to search for a service kit. I will reach Sector 43 at 3:30 PM."
            },
            {
                "timestamp": "00:48",
                "speaker": "YantraOS (Gnani.ai)",
                "text": "Bohot badhiya Ramesh ji. Aapka MyGate entry pass Tower B, Flat 402 ke liye pre-approve kar diya hai. Labor charge ka Pine Labs escrow link ready hai, job complete hote hi OTP verify hoke instant payout ho jayega.",
                "translation": "Wonderful Ramesh ji. Your MyGate entry pass for Tower B, Flat 402 is pre-approved. The Pine Labs escrow link for your labor charge is active; once the OTP is verified post-job, you will get an instant payout."
            },
            {
                "timestamp": "01:02",
                "speaker": "Technician (Ramesh)",
                "text": "Theek hai sir, 3:30 baje milte hain. Shukriya.",
                "translation": "Alright sir, see you at 3:30 PM. Thank you."
            }
        ]

        return {
            "call_sid": f"GNANI_CALL_{random.randint(10000, 99999)}",
            "technician_name": technician_name,
            "duration_seconds": 65,
            "language": "hi-IN-Hinglish",
            "negotiated_firm_slot": "Today, 3:30 PM - 4:15 PM",
            "slot_agreed": True,
            "transcript": transcript,
            "confidence_score": 0.98
        }
