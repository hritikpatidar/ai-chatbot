import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getMessaging,
    getToken,
} from "firebase/messaging";

import { setItemLocalStorage } from "./utils/browserServices";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.log("❌ Notification permission denied");
            return null;
        }
        const token = await getToken(
            messaging,
            {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            }
        );
        if (!token) {
            console.log("FCM token not generated");
            return null;
        }
        setItemLocalStorage("fcm_token", token);
        return token;
    } catch (error) {
        console.error(" FCM Token Error:", error);
        return null;
    }
};