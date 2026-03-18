import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  MapPin,
  Clock,
  Zap,
  XCircle,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ReviewModal } from "./ReviewModal";
import type { Booking } from "../data/mock-data";

const tabs = ["All", "Upcoming", "Active", "Completed", "Cancelled"] as const;

export function BookingsPage() {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const filtered =
    activeTab === "All"
      ? bookings
      : bookings.filter(
          (b) => b.status === activeTab.toLowerCase()
        );

  const statusConfig = {
    upcoming: {
      color: "bg-blue-100 text-blue-700",
      icon: Calendar,
      label: "Upcoming",
    },
    active: {
      color: "bg-emerald-100 text-emerald-700",
      icon: Zap,
      label: "Active",
    },
    completed: {
      color: "bg-gray-100 text-gray-600",
      icon: CheckCircle,
      label: "Completed",
    },
    cancelled: {
      color: "bg-red-100 text-red-600",
      icon: XCircle,
      label: "Cancelled",
    },
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-[1.25rem]" style={{ fontWeight: 700 }}>My Bookings</h1>
        <p className="text-[0.8125rem] text-muted-foreground mt-0.5">
          {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 overflow-x-auto no-scrollbar mb-4">
        {tabs.map((tab) => {
          const count =
            tab === "All"
              ? bookings.length
              : bookings.filter(
                  (b) => b.status === tab.toLowerCase()
                ).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-[0.75rem] whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Booking Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No bookings found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-[0.875rem]"
          >
            Find Chargers
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {filtered.map((booking) => {
            const config = statusConfig[booking.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={booking.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={booking.chargerImage}
                      alt={booking.chargerTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="text-[0.875rem] truncate"
                        style={{ fontWeight: 600 }}
                      >
                        {booking.chargerTitle}
                      </h3>
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] flex-shrink-0 ${config.color}`}
                        style={{ fontWeight: 500 }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[0.75rem] truncate">
                        {booking.chargerAddress}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[0.75rem] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {booking.date}
                      </span>
                      <span className="text-[0.75rem] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-[0.75rem] text-muted-foreground">
                      {booking.connectorType}
                    </span>
                    <span className="text-[0.75rem] text-muted-foreground flex items-center gap-0.5">
                      <Zap className="w-3 h-3" />
                      {booking.power} kW
                    </span>
                    <span className="text-[0.75rem] text-muted-foreground">
                      {booking.duration}h
                    </span>
                  </div>
                  <span className="text-[0.9375rem] text-primary" style={{ fontWeight: 700 }}>
                    ₹{booking.totalCost}
                  </span>
                </div>

                {/* Actions */}
                {booking.status === "upcoming" && (
                  <div className="flex gap-2 px-3 pb-3">
                    <button
                      onClick={() =>
                        navigate(`/charger/${booking.chargerId}`)
                      }
                      className="flex-1 py-2 text-[0.8125rem] border border-border rounded-lg flex items-center justify-center gap-1"
                    >
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setCancelConfirm(booking.id)}
                      className="flex-1 py-2 text-[0.8125rem] border border-destructive text-destructive rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {booking.status === "active" && (
                  <div className="px-3 pb-3">
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-[0.75rem] text-emerald-700" style={{ fontWeight: 600 }}>
                          Charging in progress
                        </p>
                        <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-1">
                          <div className="bg-emerald-500 h-1.5 rounded-full w-[65%]" />
                        </div>
                      </div>
                      <span className="text-[0.75rem] text-emerald-700" style={{ fontWeight: 600 }}>
                        65%
                      </span>
                    </div>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="flex gap-2 px-3 pb-3">
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="flex-1 py-2 text-[0.8125rem] bg-primary text-white rounded-lg flex items-center justify-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Leave Review
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/charger/${booking.chargerId}`)
                      }
                      className="flex-1 py-2 text-[0.8125rem] border border-border rounded-lg"
                    >
                      Book Again
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation */}
      {cancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCancelConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl p-6 mx-4 max-w-sm w-full text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <h3 className="text-[1.0625rem]" style={{ fontWeight: 600 }}>Cancel Booking?</h3>
            <p className="text-[0.8125rem] text-muted-foreground mt-1">
              Are you sure? A full refund will be issued to your payment method.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setCancelConfirm(null)}
                className="flex-1 py-2.5 border border-border rounded-xl text-[0.875rem]"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  cancelBooking(cancelConfirm);
                  setCancelConfirm(null);
                }}
                className="flex-1 py-2.5 bg-destructive text-white rounded-xl text-[0.875rem]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
        />
      )}
    </div>
  );
}