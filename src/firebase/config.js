// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that should be used
// https://firebase.google.com/docs/web/setup#available-libraries

// web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAny4IHSy-NtELPTyG0aiNtsy1Rz8QKpPU",
  authDomain: "fyra-network-84c30.firebaseapp.com",
  projectId: "fyra-network-84c30",
  // Storage bucket should use appspot.com domain
  storageBucket: "fyra-network-84c30.appspot.com",
  messagingSenderId: "180964475241",
  appId: "1:180964475241:web:08c62e87ad57e76a453df8",
  measurementId: "G-NGKDPCYELR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore — force long polling to avoid WebChannel 400 errors in restricted networks/adblock
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Storage
export const storage = getStorage(app);

// Analytics (only works in secure contexts; no-op if not available)
try {
  getAnalytics(app);
} catch (_) {}

export default app;
