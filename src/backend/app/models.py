from sqlalchemy import Column, Integer, String, Boolean, Date, Float
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String)
    is_active = Column(Boolean, default=True)

class HealthRecord(Base):
    __tablename__ = "health_records"
    
    id = Column(Integer, primary_key=True, index=True)
    disease = Column(String, index=True)
    location = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    cases = Column(Integer)
    date = Column(Date)
    
    # NEW FIELDS FOR GOVERNANCE
    status = Column(String, default="active") # 'active' or 'blocked'
    source = Column(String)                   # Audit trail (e.g., "DHIS2 | Blocked by Policy")
    
    # --- NEW INTELLIGENCE FIELDS ---
    risk_score = Column(Float, default=0.0)  # 0.0 to 100.0
    anomaly_type = Column(String, nullable=True) # e.g., "Spike", "Cluster
    
    weather_context = Column(String, nullable=True) # e.g. "Heavy Rain (45mm)"