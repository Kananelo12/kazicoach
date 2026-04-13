import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import "server-only";

interface FirebaseCredentials {
  privateKey?: string;
}

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    // Parse the JSON-encoded environment variable
    let privateKey: string | undefined;
    
    try {
      if (!process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error("FIREBASE_PRIVATE_KEY environment variable is not set");
      }

      // Parse the JSON string to extract the privateKey field
      const credentials: FirebaseCredentials = JSON.parse(
        process.env.FIREBASE_PRIVATE_KEY
      );
      
      if (!credentials.privateKey) {
        throw new Error(
          "privateKey field is missing from FIREBASE_PRIVATE_KEY JSON"
        );
      }

      // Replace escaped newlines with actual newlines
      privateKey = credentials.privateKey.replace(/\\n/g, "\n");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to parse Firebase credentials from environment";
      throw new Error(
        `Firebase Admin initialization failed: ${message}`
      );
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

export const { auth: firebaseAuth, db: firebaseDb } = initFirebaseAdmin();
