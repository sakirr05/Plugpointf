import { useNavigate } from "react-router";
import { MapPin, Zap, Clock, Shield } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { StarRating } from "./StarRating";
import type { Charger } from "../data/mock-data";

interface ChargerCardProps {
  charger: Charger;
  variant?: "grid" | "list";
}

export function ChargerCard({ charger, variant = "grid" }: ChargerCardProps) {
  const navigate = useNavigate();

  if (variant === "list") {
    return (
      <button
        onClick={() => navigate(`/charger/${charger.id}`)}
        className="flex gap-3 p-3 bg-card rounded-xl border border-border hover:shadow-md transition-shadow text-left w-full"
      >
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={charger.image}
            alt={charger.title}
            className="w-full h-full object-cover"
          />
          {!charger.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-[0.6875rem]" style={{ fontWeight: 600 }}>Unavailable</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[0.9375rem] truncate" style={{ fontWeight: 600 }}>{charger.title}</h3>
            {charger.verified && (
              <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" />
            <span className="text-[0.75rem] truncate">{charger.address}, {charger.city}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 text-[0.75rem] text-muted-foreground">
              <Zap className="w-3 h-3" />
              {charger.power} kW
            </div>
            <span className="text-[0.75rem] text-muted-foreground">{charger.connectorType}</span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <StarRating rating={charger.rating} size={12} count={charger.reviewCount} />
            <span className="text-[0.875rem] text-primary" style={{ fontWeight: 700 }}>
              ₹{charger.pricePerHour}/hr
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/charger/${charger.id}`)}
      className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback
          src={charger.image}
          alt={charger.title}
          className="w-full h-full object-cover"
        />
        {charger.available ? (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-emerald-500 text-white text-[0.6875rem] rounded-full" style={{ fontWeight: 500 }}>
            Available
          </span>
        ) : (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-gray-500 text-white text-[0.6875rem] rounded-full" style={{ fontWeight: 500 }}>
            Unavailable
          </span>
        )}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 text-white text-[0.75rem] rounded-full backdrop-blur-sm" style={{ fontWeight: 600 }}>
          ₹{charger.pricePerHour}/hr
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.9375rem]" style={{ fontWeight: 600 }}>{charger.title}</h3>
          {charger.verified && <Shield className="w-4 h-4 text-primary flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground mt-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-[0.75rem] truncate">{charger.address}, {charger.city}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-[0.75rem] text-muted-foreground">
            <Zap className="w-3 h-3 text-primary" />
            {charger.power} kW
          </div>
          <span className="text-[0.75rem] px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground">
            {charger.connectorType}
          </span>
          <div className="flex items-center gap-1 text-[0.75rem] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {charger.availableHours.split(",")[0]}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <StarRating rating={charger.rating} size={12} count={charger.reviewCount} />
          <div className="flex items-center gap-1.5">
            <img
              src={charger.ownerAvatar}
              alt={charger.ownerName}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-[0.75rem] text-muted-foreground">{charger.ownerName}</span>
          </div>
        </div>
      </div>
    </button>
  );
}