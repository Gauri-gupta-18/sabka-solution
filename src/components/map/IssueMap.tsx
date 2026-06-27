"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Issue } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

// Fix for default marker icon in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons based on severity
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const icons = {
  Critical: createCustomIcon("#EF4444"), // Destructive
  High: createCustomIcon("#F59E0B"), // Amber
  Medium: createCustomIcon("#3B82F6"), // Blue
  Low: createCustomIcon("#10B981"), // Emerald
};

interface IssueMapProps {
  issues: Issue[];
  center?: [number, number];
  zoom?: number;
}

export default function IssueMap({ issues, center = [12.9716, 77.5946], zoom = 12 }: IssueMapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      className="rounded-xl overflow-hidden shadow-sm border border-border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {issues.map((issue) => (
        <Marker 
          key={issue.id} 
          position={[issue.location.lat, issue.location.lng]}
          icon={icons[issue.priority] || icons.Medium}
        >
          <Popup className="custom-popup">
            <div className="p-1 min-w-[200px]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-slate-900">{issue.title}</span>
              </div>
              <div className="flex gap-2 mb-3">
                <Badge variant={issue.status === 'Resolved' ? 'secondary' : 'default'} className="text-[10px] px-1.5 py-0.5">
                  {issue.status}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-border">
                  {issue.category}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mb-2">{issue.description}</p>
              <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Reported recently
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
