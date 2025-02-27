import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB9ACBsUjTDnHamQ2liG4EBDRKfnDTZcNI",
  authDomain: "ms-crypto-manager.firebaseapp.com",
  projectId: "ms-crypto-manager",
  storageBucket: "ms-crypto-manager.firebasestorage.app",
  messagingSenderId: "925342833760",
  appId: "1:925342833760:web:cdaefd477aedd46be1f705",
  measurementId: "G-R22V8359SV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { analytics };
export default app;