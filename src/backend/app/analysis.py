class OutbreakIntelligence:
    """
    The 'Brain' of the Node.
    Calculates risk based on case velocity and thresholds.
    """
    
    @staticmethod
    def analyze(cases: int, disease: str) -> dict:
        score = 0.0
        anomaly = None
        
        # 1. Base Severity Map (Mock Knowledge Base)
        severity_index = {
            "Cholera": 1.5,   # Highly infectious
            "Malaria": 0.8,   # Endemic
            "Unknown": 2.0    # High alert for unknown pathogens
        }
        
        multiplier = severity_index.get(disease, 1.0)
        
        # 2. Calculate Risk Score (Simple Heuristic)
        # Formula: Cases * Severity. Cap at 100.
        raw_score = cases * multiplier
        
        # Normalize to 0-100 scale (assuming 50 cases is "High" for this demo)
        score = min(round((raw_score / 50) * 100, 1), 100.0)
        
        # 3. Detect Anomaly Type
        if score > 80:
            anomaly = "Critical Spike"
        elif score > 50:
            anomaly = "Elevated Activity"
        else:
            anomaly = "Baseline"
            
        return {"score": score, "anomaly": anomaly}

analyzer = OutbreakIntelligence()