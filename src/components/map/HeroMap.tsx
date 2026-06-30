"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// This is necessary to fix leaflet icon issues in Next.js if standard markers are ever used.
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function HeroMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-slate-800 animate-pulse rounded-2xl" />;

  const markers = [
    { position: [28.6139, 77.2090] as [number, number], color: "#ef4444", name: "Water Leak" }, 
    { position: [28.63, 77.22] as [number, number], color: "#10b981", name: "Pothole Repaired" },
    { position: [28.60, 77.18] as [number, number], color: "#f59e0b", name: "Streetlight Out" },
    { position: [28.64, 77.19] as [number, number], color: "#60a5fa", name: "Waste Management" },
  ];

  return (
    <MapContainer 
      center={[28.615, 77.2]} 
      zoom={12} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {markers.map((marker, idx) => (
        <CircleMarker
          key={idx}
          center={marker.position}
          pathOptions={{ color: marker.color, fillColor: marker.color, fillOpacity: 0.7, weight: 1 }}
          radius={8}
        >
          <Popup>
            <div className="font-semibold text-slate-800">{marker.name}</div>
            <div className="text-xs text-slate-500">Just now</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
