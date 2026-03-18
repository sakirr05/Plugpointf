import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Zap,
  MapPin,
  Camera,
  DollarSign,
  Clock,
  Info,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Plus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Charger } from "../data/mock-data";

const connectorOptions = ["J1772", "CCS", "Tesla Wall Connector", "CHAdeMO"];
const amenityOptions = [
  "Covered Parking",
  "Well Lit",
  "WiFi Nearby",
  "Security Camera",
  "Gated Access",
  "Restroom Nearby",
  "Pet Friendly",
  "Street Parking",
  "Coffee Shop Nearby",
  "Underground Parking",
];

type Step = 1 | 2 | 3 | 4;

export function ListChargerPage() {
  const navigate = useNavigate();
  const { addCharger, user } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bangalore, KA");
  const [connectorType, setConnectorType] = useState("");
  const [power, setPower] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [pricePerKwh, setPricePerKwh] = useState("");
  const [availableHours, setAvailableHours] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return title && description && address;
      case 2:
        return connectorType && power;
      case 3:
        return pricePerHour && availableHours;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!user) return;
    const charger: Charger = {
      id: `c${Date.now()}`,
      ownerId: user.id,
      ownerName: user.name,
      ownerAvatar: user.avatar,
      ownerRating: user.rating,
      title,
      description,
      image:
        "https://images.unsplash.com/photo-1765272088039-a6f6b9188199?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZHJpdmV3YXklMjBlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nfGVufDF8fHx8MTc3MTQzOTIxMXww&ixlib=rb-4.1.0&q=80&w=1080",
      address,
      city,
      lat: 12.93 + Math.random() * 0.08,
      lng: 77.56 + Math.random() * 0.18,
      connectorType,
      power: parseFloat(power) || 7.2,
      pricePerHour: parseFloat(pricePerHour) || 80,
      pricePerKwh: parseFloat(pricePerKwh) || 12,
      available: true,
      availableHours,
      rating: 0,
      reviewCount: 0,
      amenities: selectedAmenities,
      instructions,
      verified: false,
    };
    addCharger(charger);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-[1.5rem]" style={{ fontWeight: 700 }}>Charger Listed!</h1>
        <p className="text-[0.875rem] text-muted-foreground mt-2 max-w-xs">
          Your charger "{title}" is now live. You'll be notified when someone books it.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-[0.875rem]"
          >
            View Listing
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setTitle("");
              setDescription("");
              setAddress("");
              setConnectorType("");
              setPower("");
              setPricePerHour("");
              setPricePerKwh("");
              setAvailableHours("");
              setSelectedAmenities([]);
              setInstructions("");
            }}
            className="px-5 py-2.5 border border-border rounded-xl text-[0.875rem]"
          >
            List Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-[1.25rem]" style={{ fontWeight: 700 }}>List Your Charger</h1>
        <p className="text-[0.8125rem] text-muted-foreground mt-0.5">
          Share your charger and earn money
        </p>
      </div>

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-[0.75rem] text-muted-foreground mt-1">
          Step {step} of 4 -{" "}
          {step === 1
            ? "Basic Info"
            : step === 2
            ? "Charger Details"
            : step === 3
            ? "Pricing & Availability"
            : "Amenities & Instructions"}
        </p>
      </div>

      <div className="px-4">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                Charger Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Home Charger"
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your charger, parking situation, and what makes it special..."
                className="w-full h-24 px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] resize-none outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 123 Main Street"
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                <Camera className="w-3.5 h-3.5 inline mr-1" />
                Photos
              </label>
              <div className="flex gap-2">
                <button className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="text-[0.625rem] mt-0.5">Add Photo</span>
                </button>
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Charger Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-2 block" style={{ fontWeight: 500 }}>
                <Zap className="w-3.5 h-3.5 inline mr-1" />
                Connector Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {connectorOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setConnectorType(opt)}
                    className={`p-3 rounded-xl border text-[0.8125rem] text-left transition-colors ${
                      connectorType === opt
                        ? "border-primary bg-secondary text-primary"
                        : "border-border"
                    }`}
                    style={{ fontWeight: connectorType === opt ? 600 : 400 }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                Power Output (kW) *
              </label>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                placeholder="e.g., 7.2"
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
              <p className="text-[0.6875rem] text-muted-foreground mt-1">
                Level 1: ~1.4 kW | Level 2: 3.3-19.2 kW | DC Fast: 50+ kW
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-[0.8125rem]" style={{ fontWeight: 600 }}>Connector Guide</span>
              </div>
              <p className="text-[0.75rem] text-muted-foreground mt-1">
                <strong>J1772:</strong> Standard Level 2, fits most EVs
                <br />
                <strong>CCS:</strong> Combined Charging System, DC fast charging
                <br />
                <strong>Tesla:</strong> Tesla-specific connector
                <br />
                <strong>CHAdeMO:</strong> Japanese standard DC fast charging
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                Price per Hour (₹) *
              </label>
              <input
                type="number"
                step="0.5"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="e.g., 80"
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
              <p className="text-[0.6875rem] text-muted-foreground mt-1">
                Average in your area: ₹80 - ₹150/hr
              </p>
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                Price per kWh (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={pricePerKwh}
                onChange={(e) => setPricePerKwh(e.target.value)}
                placeholder="e.g., 12"
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                <Clock className="w-3.5 h-3.5 inline mr-1" />
                Available Hours *
              </label>
              <input
                type="text"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                placeholder="e.g., 6 PM - 8 AM weekdays, All day weekends"
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-[0.8125rem]" style={{ fontWeight: 600 }}>Estimated Earnings</span>
              </div>
              <p className="text-[0.75rem] text-muted-foreground mt-1">
                Based on your pricing, you could earn{" "}
                <span style={{ fontWeight: 700 }} className="text-primary">
                  ₹{((parseFloat(pricePerHour) || 80) * 20).toFixed(0)} - ₹
                  {((parseFloat(pricePerHour) || 80) * 60).toFixed(0)}
                </span>{" "}
                per month
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Amenities & Instructions */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-2 block" style={{ fontWeight: 500 }}>
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.75rem] transition-colors ${
                      selectedAmenities.includes(a)
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {selectedAmenities.includes(a) && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[0.8125rem] text-muted-foreground mb-1.5 block" style={{ fontWeight: 500 }}>
                Charging Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="How should users find and use your charger? Include parking directions, gate codes (if any), cable location, etc."
                className="w-full h-28 px-3 py-2.5 border border-border rounded-xl bg-input-background text-[0.875rem] resize-none outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Shield className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-[0.75rem] text-muted-foreground">
                Your charger will be reviewed by our team before going live. Personal information like gate codes is only shared after booking.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep((step - 1) as Step)}
              className="flex items-center gap-1 px-4 py-2.5 border border-border rounded-xl text-[0.875rem]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as Step)}
              disabled={!canProceed()}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[0.875rem] transition-colors ${
                canProceed()
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-[0.875rem]"
            >
              List My Charger
            </button>
          )}
        </div>
      </div>
    </div>
  );
}