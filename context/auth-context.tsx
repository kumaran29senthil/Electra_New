"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

type UserRole = 'voter' | 'candidate' | 'admin' | null;

interface AuthContextProps {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  logOut: () => Promise<void>;
  verifyEmail: () => Promise<void>;
  setupRecaptcha: (phoneNumber: string) => Promise<any>;
  confirmOtp: (otp: string, confirmationResult: any) => Promise<User>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // In a real app, you would fetch the user role from your database
      // For now, we'll simulate this with local storage
      if (currentUser) {
        // This would normally come from your backend after verifying the user
        const savedRole = localStorage.getItem(`userRole_${currentUser.uid}`);
        setUserRole(savedRole as UserRole);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const verifyEmail = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const setupRecaptcha = async (phoneNumber: string) => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
    });
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  };

  const confirmOtp = async (otp: string, confirmationResult: any) => {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userRole,
        loading, 
        signUp, 
        signIn, 
        logOut, 
        verifyEmail,
        setupRecaptcha,
        confirmOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};