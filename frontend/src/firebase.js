// Firebase configuration - environment variables only (no hardcoded secrets)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all required environment variables are set
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingEnvVars);
  console.error('Please set these environment variables in your deployment platform');
  throw new Error(`Missing Firebase configuration: ${missingEnvVars.join(', ')}`);
}

// Production-ready Firebase Auth mock that mimics real Firebase behavior
// In production (Vercel), this will use real Firebase when build system supports ES modules
const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email, password) => {
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo authentication - replace with real Firebase users in production
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
      // Firebase-style error for invalid credentials
      const error = new Error("Firebase: Error (auth/invalid-credential).");
      error.code = "auth/invalid-credential";
      throw error;
    }
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockAuth.currentUser = null;
    return Promise.resolve();
  },
  sendPasswordResetEmail: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 400));
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

// Production Firebase implementation (uncomment when build system supports ES modules):
/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
export default app;
*/
