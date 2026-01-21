// src/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

// Evita inicializar mais de uma vez
if (!(globalThis as any).firebaseApp) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  (globalThis as any).firebaseApp = app;
  (globalThis as any).firestoreDB = db;
  (globalThis as any).firebaseAuth = auth;
  (globalThis as any).firebaseStorage = storage;
} else {
  app = (globalThis as any).firebaseApp;
  db = (globalThis as any).firestoreDB;
  auth = (globalThis as any).firebaseAuth;
  storage = (globalThis as any).firebaseStorage;
}

export { app, db, auth, storage };
