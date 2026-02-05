# OpenSentinel: The Sovereign Surveillance Mesh 🛡️🌍

**OpenSentinel** is a federated data mesh designed to bridge the trust gap in global health security. Unlike traditional centralized data lakes, OpenSentinel empowers nations with **sovereign nodes** that process health data locally, enforcing privacy and governance rules before sharing only anonymized insights with regional bodies like Africa CDC, PAHO, CARPHA, ACPHEED etc.



---

## 🚀 Key Features

### 1. **Sovereign Infrastructure** 🏛️
Each member state operates its own self-contained node. Data ownership and control remain strictly within national borders.
* **Tech Stack:** Dockerized Microservices (FastAPI + Next.js + PostgreSQL).
* **Offline-First:** Designed for intermittent connectivity environments.

### 2. **Governance Guardrails (The "Gatekeeper")** 🛡️
A "Policy-as-Code" engine intercepts every data ingestion request to enforce sovereignty laws automatically.
* **Privacy Protection:** Automatically blocks precise GPS data (preventing house-level identification).
* **Data Minimalism:** Flags or rejects low-count records to prevent re-identification.

### 3. **AI Intelligence Engine (The "Brain")** 🧠
Real-time analytics processing locally on the node.
* **Risk Scoring:** Assigns dynamic risk scores (0-100%) to outbreaks based on case velocity and severity.
* **Anomaly Detection:** Identifies potential threats instantly.

### 4. **One Health Fusion** 🌧️
Integrates environmental context into health surveillance.
* **Satellite Integration:** Automatically fetches real-time weather data (rainfall, temperature) for every case report via Open-Meteo API.
* **Contextual Alerts:** Correlates disease spikes with climate anomalies (e.g., Cholera + Heavy Rain).

### 5. **Mission Control Dashboard** 🖥️
A high-fidelity command center for national health ministries.
* **Real-time Visualization:** Live maps and KPI cards.
* **Audit Logs:** Transparent, immutable logs of all data allowed or blocked by the system.

---

## 🛠️ Architecture

OpenSentinel follows a **Federated Data Mesh** architecture:

1.  **Ingestion Layer:** REST API receiving data from EMRs (DHIS2, OpenMRS) and mobile tools.
2.  **Governance Layer:** Intercepts data *before* storage to check compliance.
3.  **Intelligence Layer:** Python-based analysis engine for risk and context fusion.
4.  **Presentation Layer:** Next.js Dashboard for decision-makers.

---

## 📦 Installation & Setup

### Prerequisites
* Docker & Docker Compose
* Git

### Quick Start

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/gamphani/OpenSentinel.git](https://github.com/gamphani/OpenSentinel.git)
    cd OpenSentinel
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```ini
    POSTGRES_USER=sentinel_admin
    POSTGRES_PASSWORD=your_secure_password
    POSTGRES_DB=sentinel_mesh_db
    SECRET_KEY=your_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

3.  **Launch the Node**
    ```bash
    docker-compose up --build
    ```

4.  **Access the System**
    * **Dashboard:** `http://localhost:3000`
    * **API Docs:** `http://localhost:8000/docs`
    * **Default Login:** `admin@moh.gov.et` / `AfricaCDC2026`

---

## 🧪 Testing the Intelligence

You can simulate data ingestion using the API Swagger docs (`/docs`).

**Example Payload (Good Data):**
```json
{
  "disease": "Malaria",
  "location": "Hawassa",
  "lat": 7.06,
  "lng": 38.47,
  "cases": 50,
  "date": "2026-02-05",
  "source": "DHIS2"
}
Example Payload (Blocked by Policy):

JSON
{
  "disease": "Unknown",
  "location": "Restricted Zone",
  "lat": 7.065432,  // Too precise!
  "lng": 38.471112, // Will trigger GEO_PRIVACY_VIOLATION
  "cases": 50,
  "date": "2026-02-05",
  "source": "Manual"
}
🤝 Contribution
OpenSentinel is an open-source initiative. Contributions are welcome to expand connector support (FHIR, HL7) and enhance the federated learning capabilities.

Built with 💚 for Global Health Security.