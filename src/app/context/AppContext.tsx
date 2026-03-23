import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  currentUser as defaultUser,
  chargers as defaultChargers,
  bookings as defaultBookings,
  reviews as defaultReviews,
  type User,
  type Charger,
  type Booking,
  type Review,
} from "../data/mock-data";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  chargers: Charger[];
  bookings: Booking[];
  reviews: Review[];
  authLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  addReview: (review: Review) => void;
  addCharger: (charger: Charger) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, loading: authLoading, error: authError, signup: firebaseSignup, login: firebaseLogin, loginWithGoogle: firebaseLoginWithGoogle, logout: firebaseLogout } = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [chargers, setChargers] = useState(defaultChargers);
  const [bookings, setBookings] = useState(defaultBookings);
  const [reviews, setReviews] = useState(defaultReviews);

  // Sync Firebase user with app user
  useEffect(() => {
    if (firebaseUser) {
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "User",
        avatar: firebaseUser.photoURL || "https://i.pravatar.cc/150?img=33",
        email: firebaseUser.email || "",
        phone: firebaseUser.phoneNumber || "+91 98765 43210",
        joinedDate: "March 2026",
        chargersListed: 0,
        totalBookings: 0,
        rating: 5.0,
        verified: !!firebaseUser.emailVerified,
      });
    } else {
      setUser(null);
    }
  }, [firebaseUser]);

  const login = async (email: string, password: string) => {
    await firebaseLogin(email, password);
  };

  const signup = async (name: string, email: string, password: string) => {
    await firebaseSignup(name, email, password);
  };

  const loginWithGoogle = async () => {
    await firebaseLoginWithGoogle();
  };

  const logout = async () => {
    await firebaseLogout();
  };

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
  };

  const addReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    setChargers((prev) =>
      prev.map((c) => {
        if (c.id === review.chargerId) {
          const chargerReviews = [...reviews.filter((r) => r.chargerId === c.id), review];
          const avgRating =
            chargerReviews.reduce((sum, r) => sum + r.rating, 0) / chargerReviews.length;
          return {
            ...c,
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: c.reviewCount + 1,
          };
        }
        return c;
      })
    );
  };

  const addCharger = (charger: Charger) => {
    setChargers((prev) => [charger, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!firebaseUser,
        chargers,
        bookings,
        reviews,
        authLoading,
        authError,
        login,
        signup,
        loginWithGoogle,
        logout,
        addBooking,
        cancelBooking,
        addReview,
        addCharger,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
