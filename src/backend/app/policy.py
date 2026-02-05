from pydantic import BaseModel
from typing import Optional

class PolicyResult(BaseModel):
    allowed: bool
    reason: str
    risk_level: str

class SovereignPolicy:
    """
    Simulates an Open Policy Agent (OPA) sidecar.
    This enforces the 'Data Contract' before data enters the system.
    """
    
    @staticmethod
    def check(record: dict) -> PolicyResult:
        # Rule 1: GEO-PRIVACY (Block Precise GPS)
        # If coordinates have more than 3 decimal places, it's too precise (house-level).
        lat = str(record.get('lat', 0))
        lng = str(record.get('lng', 0))
        
        # Simple check: split by '.' and count length of the second part
        lat_decimals = len(lat.split('.')[1]) if '.' in lat else 0
        lng_decimals = len(lng.split('.')[1]) if '.' in lng else 0
        
        if lat_decimals > 3 or lng_decimals > 3:
            return PolicyResult(
                allowed=False, 
                reason="GEO_PRIVACY_VIOLATION: Coordinates too precise (>3 decimals)",
                risk_level="HIGH"
            )

        # Rule 2: DATA-MINIMALISM (Block Low Case Counts)
        # To prevent re-identification of rare diseases in small villages.
        if record.get('cases', 0) < 5:
             return PolicyResult(
                allowed=True, # We allow it, but flag it as a warning
                reason="WARNING: Low case count (Privacy Risk)",
                risk_level="MEDIUM"
            )

        return PolicyResult(allowed=True, reason="COMPLIANT", risk_level="LOW")

# Initialize the engine
engine = SovereignPolicy()