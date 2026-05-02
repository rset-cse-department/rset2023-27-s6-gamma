import { initializeApp } from "firebase/app";
import { CONFIG} from "./config.js";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: CONFIG.FIREBASE_API_KEY,
  authDomain: CONFIG.FIREBASE_AUTH_DOMAIN,
  projectId: CONFIG.FIREBASE_PROJECT_ID,
  appId: "1:320894889344:web:4eb33137865f8d71de6565",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence);