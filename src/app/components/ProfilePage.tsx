import { useNavigate } from "react-router";
import {
  User,
  Shield,
  Star,
  MapPin,
  CalendarDays,
  Zap,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
  CreditCard,
  Heart,
  MessageCircle,
  Award,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

/**
 * --- THE PROFILE PAGE ---
 * This screen displays the user's personal info, their stats 
 * (like how much they've spent or how many chargers they own), 
 * and a menu for settings and support.
 */
export function ProfilePage() {
  const navigate = useNavigate();
  
  // We pull everything about the current user from our global AppContext
  const { user, isAuthenticated, logout, bookings, chargers, reviews } = useApp();

  // --- SECURITY CHECK ---
  // If the user isn't logged in, we show a "Please Sign In" empty state
  if (!isAuthenticated || !user) {
    return (
      // flex-col: stacks icon, title, and button vertically
      // items-center & justify-center: makes everything perfectly centered on screen
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-[1.25rem]" style={{ fontWeight: 700 }}>Sign in to PlugPoint</h2>
        <p className="text-[0.875rem] text-muted-foreground mt-1">
          Access your bookings, manage chargers, and more
        </p>
        <button
          onClick={() => navigate("/auth")}
          // bg-primary: our brand green color
          className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-[0.9375rem] font-bold shadow-lg shadow-primary/20"
        >
          Sign In
        </button>
      </div>
    );
  }

  // --- DATA CALCULATIONS ---
  // We filter the global lists to find things that belong ONLY to this user
  const userChargers = chargers.filter((c) => c.ownerId === user.id);
  
  // Calculate how many bookings they've finished
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  
  // Reduce is a JS trick to add up all the 'totalCost' numbers into one 'sum'
  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalCost, 0);

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming").length;
  const userReviews = reviews.filter((r) => r.userId === user.id).length;
  
  // Check if they are a 'Superhost' (Treated as a VIP if rating is high)
  const isSuperhost = user.rating >= 4.5 && userChargers.length > 0;

  // --- MENU DATA ---
  // We organize the menu into sections like "Account", "Host", etc.
  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: CreditCard, label: "Wallet Balance", detail: "₹0.00", onClick: () => toast.info("Wallet & Payments integration coming soon!") },
        { icon: Bell, label: "Active Bookings", detail: upcomingBookings > 0 ? `${upcomingBookings} upcoming` : "None", onClick: () => navigate("/bookings") },
        { icon: Heart, label: "My Reviews", detail: `${userReviews} reviews`, onClick: () => toast.info("Reviews management coming soon!") },
      ],
    },
    {
      title: "Host",
      items: [
        { icon: Zap, label: "My Chargers", detail: `${userChargers.length} listed`, onClick: () => navigate("/list-charger") },
        { icon: Award, label: "Host Level", detail: isSuperhost ? "Superhost" : "Standard Host", onClick: () => toast.info("Host levels are assigned automatically.") },
      ],
    },
  ];

  return (
    <div className="pb-4">
      
      {/* ─── PROFILE HEADER ─── */}
      {/* bg-gradient-to-b: creates a soft colored fade at the top of the profile */}
      <div className="px-4 pt-4 pb-5 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            // rounded-full: makes the profile picture a circle
            // shadow-md: adds a soft drop shadow
            className="w-16 h-16 rounded-full border-2 border-white shadow-md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[1.125rem]" style={{ fontWeight: 700 }}>{user.name}</h1>
              {user.verified && <Shield className="w-4 h-4 text-primary" />}
            </div>
            <p className="text-[0.8125rem] text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[0.75rem]" style={{ fontWeight: 500 }}>
                {user.rating} rating
              </span>
              <span className="text-[0.75rem] text-muted-foreground ml-1">
                • Member since {user.joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* ─── QUICK STATS CARDS ─── */}
        {/* grid-cols-3: creates 3 columns of equal width */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: "Bookings", value: completedBookings.toString() },
            { label: "Chargers", value: user.chargersListed.toString() },
            { label: "Total Spent", value: `₹${totalSpent.toFixed(0)}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-3 bg-white rounded-xl border border-border shadow-sm"
            >
              <span className="text-[1.125rem] text-primary" style={{ fontWeight: 700 }}>
                {stat.value}
              </span>
              <span className="text-[0.6875rem] text-muted-foreground mt-0.5 font-medium uppercase tracking-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── VERIFICATION BADGE ─── */}
      <div className="mx-4 mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
        {/* bg-emerald-100: a soft green background for the check icon */}
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-[0.8125rem]" style={{ fontWeight: 600 }}>Identity Verified</p>
          <p className="text-[0.6875rem] text-muted-foreground">
            Email, phone, and ID verified
          </p>
        </div>
        <div className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[0.6875rem] font-bold">
          Verified
        </div>
      </div>

      {/* ─── MENU SECTIONS ─── */}
      {menuSections.map((section) => (
        <div key={section.title} className="mt-5">
          {/* Section Heading (Account, Host, etc.) */}
          <h3 className="px-5 text-[0.7rem] text-muted-foreground uppercase tracking-widest mb-1.5 font-bold">
            {section.title}
          </h3>
          {/* overflow-hidden: ensures the rounded corners look clean on the buttons inside */}
          <div className="mx-4 bg-white rounded-xl border border-border overflow-hidden shadow-sm">
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  // border-b: adds a divider line between menu items, except for the last one
                  className={`flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors ${
                    i < section.items.length - 1
                      ? "border-b border-slate-50"
                      : ""
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="flex-1 text-[0.875rem] font-medium text-slate-700">{item.label}</span>
                  {item.detail && (
                    <span className="text-[0.75rem] text-slate-400 mr-1">
                      {item.detail}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* ─── LOGOUT BUTTON ─── */}
      <div className="px-4 mt-8">
        <button
          onClick={async () => {
            try {
              await logout(); // Calls the Firebase sign out function
              navigate("/auth"); // Takes them back to the login screen
            } catch (error) {
              console.error("Logout error:", error);
            }
          }}
          // border-red-200: a soft red border for the dangerous logout action
          className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 text-red-600 rounded-xl text-[0.875rem] font-bold hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <p className="text-center text-[0.6875rem] text-slate-400 mt-6 pb-2 font-medium">
        PlugPoint v1.0.0 • Peer-to-Peer Charging
      </p>
    </div>
  );
}