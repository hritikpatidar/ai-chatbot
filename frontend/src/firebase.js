import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging"
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app)


export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log("permission", permission);
    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BOYoLHj32f1tgqunxiR1SOj3TIRn5FJ6eWn2ef6dA_fh40jumOFjF_CteuKqkx8AP-XoqDY4FXIW0tF9FxcOzRc"
        })
        setItemLocalStorage("fcm_token", token);
    }
}