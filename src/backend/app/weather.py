import httpx
from datetime import date

class WeatherService:
    """
    Fetches environmental data to provide 'One Health' context.
    Uses Open-Meteo (Free, Non-Commercial License).
    """
    
    BASE_URL = "https://archive-api.open-meteo.com/v1/archive"

    async def get_context(self, lat: float, lng: float, event_date: date) -> str:
        try:
            # Fetch rain and temp for the specific event date
            params = {
                "latitude": lat,
                "longitude": lng,
                "start_date": str(event_date),
                "end_date": str(event_date),
                "daily": "precipitation_sum,temperature_2m_max",
                "timezone": "auto"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.BASE_URL, params=params, timeout=5.0)
                
            if response.status_code == 200:
                data = response.json()
                if "daily" in data:
                    rain = data["daily"]["precipitation_sum"][0]
                    temp = data["daily"]["temperature_2m_max"][0]
                    
                    # Logic: Determine Anomaly
                    if rain is not None and rain > 20.0:
                        return f"Heavy Rain ({rain}mm)"
                    elif temp is not None and temp > 35.0:
                        return f"Heatwave ({temp}°C)"
                    else:
                        return f"Normal ({temp}°C, {rain}mm)"
            
            return "No Satellite Data"
            
        except Exception as e:
            print(f"Weather API Error: {e}")
            return "Service Unavailable"

# Initialize
meteo = WeatherService()