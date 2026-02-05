import httpx
import os
import json
from .models import HealthRecord

class FederationService:
    """
    The 'Diplomat' of the Node.
    Handles secure, anonymized communication with Peer Nodes.
    """
    
    def __init__(self):
        # Load peers from env (parse the JSON string)
        peers_str = os.getenv("PEER_NODES", "[]")
        try:
            self.peers = json.loads(peers_str)
        except:
            self.peers = []
            
        self.node_id = os.getenv("NODE_COUNTRY", "ETH")

    async def broadcast_alert(self, record: HealthRecord, risk_data: dict):
        """
        Sends an anonymized 'Signal' to all peers if risk is critical.
        """
        if risk_data['score'] < 80:
            return "Risk too low to broadcast."

        # 1. Anonymize the Payload (The 'Data Contract')
        # We DO NOT send lat/lng or cases count. Just the signal.
        signal = {
            "origin_node": self.node_id,
            "disease": record.disease,
            "anomaly": risk_data['anomaly'],
            "risk_score": risk_data['score'],
            "status": "ALERT",
            "timestamp": str(record.date)
        }

        print(f"📡 BROADCASTING SIGNAL: {signal}")

        # 2. Send to all peers asynchronously
        async with httpx.AsyncClient() as client:
            for peer in self.peers:
                try:
                    # In a real mesh, we would use mTLS here
                    # For MVP, we simulate the "Fire and Forget"
                    # await client.post(f"{peer}/federation/signal", json=signal, timeout=2.0)
                    print(f"   -> Sent to Peer: {peer} [Simulated]")
                except Exception as e:
                    print(f"   -> Failed to reach {peer}: {e}")

        return f"Broadcasted to {len(self.peers)} peers"

diplomat = FederationService()