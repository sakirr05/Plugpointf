/**
 * --- WHAT IS THIS HOOK FOR? ---
 * This is our "Security Guard". It talks to Firebase to handle 
 * Signups, Logins, and Logouts. It also "watches" to see if a user 
 * is still logged in when they refresh the page.
 */

import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../config/firebase";

export function useFirebaseAuth() {
  // firebaseUser stores the "Raw" user data directly from Firebase
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This "Effect" runs once when the app starts.
  // It sets up a "Listener" that stays active and alerts us 
  // every time the user logs in or logs out.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user); // Update our local state with the user's info
      setLoading(false);     // We finished checking, so stop the loading spinner
    });

    // This cleanup function stops the listener if this component is destroyed
    return unsubscribe;
  }, []);

  // Standard Email/Password Signup
  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      // 1. Tell Firebase to create the account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Firebase doesn't store the "Name" by default during signup, 
      // so we manually update their profile to include it.
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      }

      return userCredential.user;
    } catch (err: any) {
      // If something goes wrong (like the email exists), we translate the error code
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Standard Email/Password Login
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // The "Quick Login" with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      // This opens the familiar Google Login popup window
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Log out and clear the session
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    firebaseUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
  };
}

/**
 * --- ERROR TRANSLATOR ---
 * Firebase returns codes like "auth/user-not-found".
 * This function turns those technical codes into friendly English 
 * messages that the user can actually understand.
 */
function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
    default:
      return "An error occurred during authentication.";
  }
}
