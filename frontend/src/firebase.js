// Firebase configuration - use environment variables for Vercel deployment
// These will be replaced by Vercel during build time
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDFCYSkBvQh4RJjwMLGJZuSsa24v7s00go",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "fitbet-233e6.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "fitbet-233e6",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "fitbet-233e6.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "202923672640",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:202923672640:web:8e5f5ce4c7736f99220ba5",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-P5T1G2Y6XF"
};

// Mock Firebase Auth implementation that mimics real Firebase behavior
// Replace with real Firebase when upgrading to Vite or webpack
const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication with your Firebase project users
    // In production, these would be real Firebase users
    if (email === "admin@qualitrack.local" && password === "Admin123!") {
      const user = {
        uid: "admin-uid-12345",
        email: "admin@qualitrack.local",
        displayName: "Admin User",
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "mock-refresh-token",
        tenantId: null
      };
      mockAuth.currentUser = user;
      return { user };
    } else if (email === "inspector@qualitrack.local" && password === "Inspect123!") {
      const user = {
        uid: "inspector-uid-67890",
        email: "inspector@qualitrack.local",
        displayName: "QC Inspector",
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "mock-refresh-token",
        tenantId: null
      };
      mockAuth.currentUser = user;
      return { user };
    } else {
      // Simulate Firebase auth error
      const error = new Error("Firebase: Error (auth/invalid-credential).");
      error.code = "auth/invalid-credential";
      throw error;
    }
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockAuth.currentUser = null;
    return Promise.resolve();
  },
  sendPasswordResetEmail: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Password reset email sent to: ${email}`);
    return Promise.resolve();
  },
  onAuthStateChanged: (callback) => {
    // Mock auth state change listener
    callback(mockAuth.currentUser);
    return () => {}; // Return unsubscribe function
  }
};

export { mockAuth as auth, mockAuth as default };

// Future implementation for real Firebase (uncomment when build system supports ES modules):
/*
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
*/
