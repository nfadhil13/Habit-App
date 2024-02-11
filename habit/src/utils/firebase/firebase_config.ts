import admin from "firebase-admin";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
interface FirebaseAdminParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function formatPrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

export function createFirebaseAdmin(params: FirebaseAdminParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) return admin.app();

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey: privateKey,
  });

  const result = admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
  });

  return result;
}

export async function initAdmin() {
  const params: FirebaseAdminParams = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
    clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL || "",
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || "",
  };

  return createFirebaseAdmin(params);
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const clientApp = initializeApp(firebaseConfig);

const FirebaseConfig = {
  clientApp,
};

export default FirebaseConfig;
