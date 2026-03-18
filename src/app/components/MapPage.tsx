import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  Zap,
  Star,
  X,
  Navigation,
  ZoomIn,
  ZoomOut,
  Layers,
  Shield,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Charger } from "../data/mock-data";

// Map bounds for Bangalore area
const MAP_CENTER = { lat: 12.96, lng: 77.63 };
const MAP_BOUNDS = {
  minLat: 12.90,
  maxLat: 13.02,
  minLng: 77.54,
  maxLng: 77.78,
};

function latLngToPixel(
  lat: number,
  lng: number,
  width: number,
  height: number,
  zoom: number
) {
  const scale = zoom;
  const x =
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
    width *
    scale;
  const y =
    ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    height *
    scale;
  return { x, y };
}

export function MapPage() {
  const { chargers } = useApp();
  const navigate = useNavigate();
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filterConnector, setFilterConnector] = useState("All");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const filtered = chargers.filter((c) => {
    const matchConnector =
      filterConnector === "All" || c.connectorType === filterConnector;
    const matchAvailable = !showOnlyAvailable || c.available;
    return matchConnector && matchAvailable;
  });

  const mapWidth = 600;
  const mapHeight = 500;

  return (
    <div className="relative h-full flex flex-col">
      {/* Filter Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "J1772", "CCS", "Tesla"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterConnector(type === "Tesla" ? "Tesla Wall Connector" : type)}
            className={`px-3 py-1.5 rounded-full text-[0.75rem] whitespace-nowrap shadow-md transition-colors ${
              filterConnector === type ||
              (type === "Tesla" && filterConnector === "Tesla Wall Connector")
                ? "bg-primary text-white"
                : "bg-white text-foreground border border-border"
            }`}
            style={{ fontWeight: 500 }}
          >
            {type}
          </button>
        ))}
        <button
          onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
          className={`px-3 py-1.5 rounded-full text-[0.75rem] whitespace-nowrap shadow-md transition-colors ${
            showOnlyAvailable
              ? "bg-emerald-500 text-white"
              : "bg-white text-foreground border border-border"
          }`}
          style={{ fontWeight: 500 }}
        >
          Available Now
        </button>
      </div>

      {/* Map Area */}
      <div
        ref={mapRef}
        className="flex-1 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 20%, #a5d6a7 40%, #81c784 60%, #b2dfdb 80%, #80cbc4 100%)",
        }}
      >
        {/* Grid lines for map feel */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`h-${i}`}>
              <div
                className="absolute left-0 right-0 border-t border-gray-600"
                style={{ top: `${(i / 20) * 100}%` }}
              />
              <div
                className="absolute top-0 bottom-0 border-l border-gray-600"
                style={{ left: `${(i / 20) * 100}%` }}
              />
            </div>
          ))}
        </div>

        {/* Road-like lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#555" strokeWidth="3" />
          <line x1="0" y1="60%" x2="100%" y2="55%" stroke="#555" strokeWidth="2" />
          <line x1="25%" y1="0" x2="30%" y2="100%" stroke="#555" strokeWidth="2" />
          <line x1="65%" y1="0" x2="60%" y2="100%" stroke="#555" strokeWidth="3" />
          <line x1="0" y1="80%" x2="100%" y2="75%" stroke="#555" strokeWidth="2" />
          <line x1="45%" y1="0" x2="50%" y2="100%" stroke="#555" strokeWidth="2" />
        </svg>

        {/* Area labels */}
        <div className="absolute top-[10%] left-[15%] text-[0.6875rem] text-gray-600/60 uppercase tracking-wider" style={{ fontWeight: 600 }}>
          Malleshwaram
        </div>
        <div className="absolute top-[35%] left-[45%] text-[0.6875rem] text-gray-600/60 uppercase tracking-wider" style={{ fontWeight: 600 }}>
          MG Road
        </div>
        <div className="absolute top-[70%] left-[30%] text-[0.6875rem] text-gray-600/60 uppercase tracking-wider" style={{ fontWeight: 600 }}>
          Jayanagar
        </div>
        <div className="absolute top-[55%] right-[10%] text-[0.6875rem] text-gray-600/60 uppercase tracking-wider" style={{ fontWeight: 600 }}>
          HSR Layout
        </div>
        <div className="absolute top-[45%] left-[55%] text-[0.6875rem] text-gray-600/60 uppercase tracking-wider" style={{ fontWeight: 600 }}>
          Koramangala
        </div>
        <div className="absolute top-[25%] right-[15%] text-[0.6875rem] text-gray-600/60 uppercase tracking-wider" style={{ fontWeight: 600 }}>
          Indiranagar
        </div>

        {/* Charger Pins */}
        {filtered.map((charger) => {
          const pos = latLngToPixel(
            charger.lat,
            charger.lng,
            mapWidth,
            mapHeight,
            zoom
          );
          const isSelected = selectedCharger?.id === charger.id;

          // Convert to percentage positioning
          const xPercent =
            ((charger.lng - MAP_BOUNDS.minLng) /
              (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
            100;
          const yPercent =
            ((MAP_BOUNDS.maxLat - charger.lat) /
              (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
            100;

          return (
            <button
              key={charger.id}
              onClick={() => setSelectedCharger(charger)}
              className="absolute z-10 transition-all duration-200"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: `translate(-50%, -100%) scale(${isSelected ? 1.3 : 1})`,
              }}
            >
              <div className="relative">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-lg transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : charger.available
                      ? "bg-white text-foreground border border-border"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span className="text-[0.6875rem]" style={{ fontWeight: 600 }}>
                    ₹{charger.pricePerHour}
                  </span>
                </div>
                <div
                  className={`w-2 h-2 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 ${
                    isSelected
                      ? "bg-primary"
                      : charger.available
                      ? "bg-white"
                      : "bg-gray-300"
                  }`}
                />
              </div>
            </button>
          );
        })}

        {/* User Location */}
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            top: "45%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute inset-0 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-3 bottom-[calc(50%-4rem)] z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center border border-border"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
          className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center border border-border"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center border border-border">
          <Navigation className="w-4 h-4 text-blue-500" />
        </button>
        <button className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center border border-border">
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Charger Card */}
      {selectedCharger && (
        <div className="absolute bottom-4 left-3 right-3 z-20">
          <div className="bg-white rounded-xl shadow-xl border border-border overflow-hidden">
            <button
              onClick={() => setSelectedCharger(null)}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/40 rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
            <div className="flex gap-3 p-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={selectedCharger.image}
                  alt={selectedCharger.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="text-[0.875rem] truncate" style={{ fontWeight: 600 }}>
                    {selectedCharger.title}
                  </h3>
                  {selectedCharger.verified && (
                    <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-[0.75rem] text-muted-foreground truncate mt-0.5">
                  {selectedCharger.address}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[0.75rem]" style={{ fontWeight: 500 }}>
                      {selectedCharger.rating}
                    </span>
                  </div>
                  <span className="text-[0.6875rem] text-muted-foreground">
                    {selectedCharger.connectorType}
                  </span>
                  <span className="text-[0.6875rem] text-muted-foreground">
                    {selectedCharger.power} kW
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[0.9375rem] text-primary" style={{ fontWeight: 700 }}>
                    ₹{selectedCharger.pricePerHour}/hr
                  </span>
                  <button
                    onClick={() => navigate(`/charger/${selectedCharger.id}`)}
                    className="px-3 py-1 bg-primary text-white rounded-lg text-[0.75rem]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charger count */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        {!selectedCharger && (
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md border border-border">
            <span className="text-[0.75rem] text-muted-foreground">
              <span style={{ fontWeight: 600 }} className="text-foreground">{filtered.length}</span> chargers in this area
            </span>
          </div>
        )}
      </div>
    </div>
  );
}