import React, { createContext, useContext, useState, ReactNode } from "react";
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

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  chargers: Charger[];
  bookings: Booking[];
  reviews: Review[];
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  addReview: (review: Review) => void;
  addCharger: (charger: Charger) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [chargers, setChargers] = useState(defaultChargers);
  const [bookings, setBookings] = useState(defaultBookings);
  const [reviews, setReviews] = useState(defaultReviews);

  const login = (_email: string, _password: string) => {
    setUser(defaultUser);
    setIsAuthenticated(true);
  };

  const signup = (name: string, email: string, _password: string) => {
    setUser({ ...defaultUser, name, email });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
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
        isAuthenticated,
        chargers,
        bookings,
        reviews,
        login,
        signup,
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
