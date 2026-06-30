"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }: { center: L.LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LocationMarker({ position, setPosition, onLocationSelect }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void, onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function MapPicker({ 
  onLocationSelect,
  initialPosition
}: { 
  onLocationSelect: (lat: number, lng: number) => void,
  initialPosition?: { lat: number, lng: number } | null
}) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialPosition ? L.latLng(initialPosition.lat, initialPosition.lng) : null
  );

  // Removed synchronous setState in useEffect to prevent cascading renders
  // We can just rely on the key prop changing in the parent component to reset state
  // or use derived state during render.
  if (initialPosition && (!position || position.lat !== initialPosition.lat || position.lng !== initialPosition.lng)) {
    setPosition(L.latLng(initialPosition.lat, initialPosition.lng));
  }

  const defaultCenter: L.LatLngExpression = [28.6139, 77.2090];
  const center = position || defaultCenter;

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "0.75rem", zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
}
