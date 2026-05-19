"use client";
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { CITY_CENTER } from "@/lib/mock";

const carIcon = L.divIcon({
  className: "",
  html: `<div style="background:#0a0a0a;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.25);">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const dropIcon = L.divIcon({
  className: "",
  html: `<div style="background:#0a0a0a;width:18px;height:18px;border-radius:4px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

type Props = {
  pickup?: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driver?: { lat: number; lng: number };
  showRoute?: boolean;
  searching?: boolean;
};

export default function MapView({ pickup = CITY_CENTER, dropoff, driver, showRoute, searching }: Props) {
  const points: [number, number][] = [];
  if (driver) points.push([driver.lat, driver.lng]);
  if (pickup) points.push([pickup.lat, pickup.lng]);
  if (dropoff) points.push([dropoff.lat, dropoff.lng]);

  return (
    <MapContainer
      center={[pickup.lat, pickup.lng]}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap, &copy; CARTO'
      />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
      />
      {pickup && (
        <CircleMarker
          center={[pickup.lat, pickup.lng]}
          radius={7}
          pathOptions={{ color: "white", fillColor: "#0a0a0a", fillOpacity: 1, weight: 3 }}
        />
      )}
      {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={dropIcon} />}
      {driver && <Marker position={[driver.lat, driver.lng]} icon={carIcon} />}
      {showRoute && dropoff && (
        <Polyline positions={points} pathOptions={{ color: "#0a0a0a", weight: 4, opacity: 0.9 }} />
      )}
      {searching && (
        <CircleMarker
          center={[pickup.lat, pickup.lng]}
          radius={45}
          pathOptions={{ color: "#0a0a0a", fillColor: "#0a0a0a", fillOpacity: 0.08, weight: 1 }}
        />
      )}
    </MapContainer>
  );
}
