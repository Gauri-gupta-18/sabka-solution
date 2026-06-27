"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { User as AppUser, Role } from "@/types";

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setFirebaseUser(currUser);
      if (currUser) {
        // Fetch custom user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currUser.uid));
        if (userDoc.exists()) {
          setUser({ id: currUser.uid, ...userDoc.data() } as AppUser);
        } else {
          // If no doc exists (e.g. newly signed up via Google but doc not created yet),
          // we could optionally create it here or handle it in the signup flow.
          setUser({
            id: currUser.uid,
            email: currUser.email || "",
            displayName: currUser.displayName || "",
            role: "Citizen",
            trustScore: 0,
            citizenRank: "New Member",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
