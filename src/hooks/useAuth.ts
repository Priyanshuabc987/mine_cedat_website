// src/hooks/useAuth.ts
"use client";

import { useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebaseApp } from '@/firebase/provider';
import { db } from '@/firebase/config';

export interface User {
  id: string;
  email: string | null;
  roles: string[];
  full_name: string | null; // Add full_name to the interface
}

export function useAuth() {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, fetch their data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          roles: userData?.roles || [],
          full_name: userData?.full_name || null, // Fetch full_name
        };
        
        setUser(appUser);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, pass: string) => {
    setLoginError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) { 
      setLoginError(error as Error);
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, isAuthenticated, isLoading, login, logout, loginError };
}
