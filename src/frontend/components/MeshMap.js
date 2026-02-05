'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons in Next.js
const iconActive = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconSync = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MeshMap() {
  // Mock Topology Data (In Phase 3 we fetch this from API)
  const self = { id: "ETH-01", lat: 9.03, lng: 38.74 };
  const peers = [
    { id: "KEN-02", lat: -1.29, lng: 36.82, status: "online" },
    { id: "UGA-03", lat: 0.34, lng: 32.58, status: "syncing" },
    { id: "RWA-04", lat: -1.94, lng: 30.06, status: "online" }
  ];

  const connections = peers.map(peer => ({
    positions: [[self.lat, self.lng], [peer.lat, peer.lng]],
    color: peer.status === 'online' ? '#00732E' : '#C69214' // CDC Green or Gold
  }));

  return (
    <MapContainer 
      center={[5.0, 36.0]} 
      zoom={5} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem', background: '#F5F5F5' }}
    >
      {/* Light Mode Tiles for Official Look */}
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Mesh Connections */}
      {connections.map((conn, idx) => (
        <Polyline 
            key={idx} 
            positions={conn.positions} 
            pathOptions={{ color: conn.color, weight: 2, opacity: 0.6, dashArray: '5, 10' }} 
        />
      ))}

      {/* Self Node */}
      <Marker position={[self.lat, self.lng]} icon={iconActive}>
        <Popup><strong>{self.id} (YOU)</strong><br/>Sovereign Node</Popup>
      </Marker>

      {/* Peer Nodes */}
      {peers.map((peer) => (
        <Marker key={peer.id} position={[peer.lat, peer.lng]} icon={peer.status === 'online' ? iconActive : iconSync}>
          <Popup><strong>{peer.id}</strong><br/>Status: {peer.status}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}