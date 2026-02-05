from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import date
from typing import List, Optional

from . import models, auth, database
from .database import engine
from .policy import engine as policy_engine # <--- Import our new Gatekeeper

from .analysis import analyzer # <--- NEW

import httpx # Needed for async requests
from .weather import meteo # <--- Import new service

# Initialize Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OpenSentinel Node", version="2.2")

# CORS Setup
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. AUTHENTICATION ---
@app.on_event("startup")
def startup_db():
    db = database.SessionLocal()
    if not db.query(models.User).filter_by(email="admin@moh.gov.et").first():
        admin = models.User(
            email="admin@moh.gov.et",
            full_name="Ministry Admin",
            hashed_password=auth.get_password_hash("AfricaCDC2026"),
            role="sovereign_admin"
        )
        db.add(admin)
        db.commit()
    db.close()

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- 2. DATA SCHEMAS ---
class RecordInput(BaseModel):
    disease: str
    location: str
    lat: float
    lng: float
    cases: int
    date: date
    source: str = "API"

class StatsOutput(BaseModel):
    total_cases: int
    active_alerts: int
    locations_monitored: int

# --- 3. INTELLIGENCE ENDPOINTS ---

@app.post("/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_data(record: RecordInput, db: Session = Depends(database.get_db)): # <--- Changed to async
    # 1. Policy Check
    policy = policy_engine.check(record.dict())

    final_status = "blocked" if not policy.allowed else "active"
    audit_note = f"{record.source}"
    if not policy.allowed:
        audit_note += f" | {policy.reason}"

    # 2. Intelligence Analysis (Risk)
    risk_data = {"score": 0.0, "anomaly": "Policy Blocked"}
    weather_info = "Skipped" # Default

    if policy.allowed:
        risk_data = analyzer.analyze(record.cases, record.disease)
        # 3. One Health Fusion (NEW!)
        # Fetch real satellite data for this location/date
        weather_info = await meteo.get_context(record.lat, record.lng, record.date)

    # 4. Save Record
    data_to_save = record.dict()
    data_to_save['status'] = final_status
    data_to_save['source'] = audit_note
    data_to_save['risk_score'] = risk_data['score']
    data_to_save['anomaly_type'] = risk_data['anomaly']
    data_to_save['weather_context'] = weather_info # <--- Saving it

    new_record = models.HealthRecord(**data_to_save)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    if not policy.allowed:
        return {"status": "rejected", "reason": policy.reason, "id": new_record.id}

    return {
        "status": "ingested", 
        "id": new_record.id, 
        "risk": risk_data,
        "weather": weather_info # Return to sender
    }
    
@app.get("/stats", response_model=StatsOutput)
def get_live_stats(db: Session = Depends(database.get_db)):
    # Only count 'active' records for the dashboard numbers
    total_cases = db.query(func.sum(models.HealthRecord.cases)).filter(models.HealthRecord.status == 'active').scalar() or 0
    active_alerts = db.query(models.HealthRecord).filter(models.HealthRecord.cases > 0, models.HealthRecord.status == 'active').count()
    locations = db.query(models.HealthRecord.location).filter(models.HealthRecord.status == 'active').distinct().count()
    
    return {
        "total_cases": total_cases,
        "active_alerts": active_alerts,
        "locations_monitored": locations
    }

@app.get("/records")
def get_audit_log(limit: int = 10, db: Session = Depends(database.get_db)):
    # Return both active and blocked records for the log
    return db.query(models.HealthRecord).order_by(models.HealthRecord.id.desc()).limit(limit).all()