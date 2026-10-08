import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import { readFileSync } from "fs";

const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
}

if (admin.getApps().length === 0) {
    admin.initializeApp({
        credential: admin.cert(serviceAccount),
    });
}

const messaging = getMessaging(admin.getApp());

const sendNotification = async (token, notificationData) => {
    try {
        if (!token) {
            return {
                success: false,
                error: "FCM token is required",
            };
        }
        const message = {
            token,
            data: Object.fromEntries(
                Object.entries(notificationData || {}).map(
                    ([key, value]) => [
                        key,
                        String(value ?? ""),
                    ]
                )
            ),
            android: {
                priority: "high",
                notification: {
                    title:
                        notificationData.title ||
                        "AI Chatbot",
                    body:
                        notificationData.message ||
                        "",
                    sound: "default",
                    ...(notificationData.image && {
                        imageUrl:
                            notificationData.image,
                    }),
                },
            },
        };

        const response = await messaging.send(message);
        console.log("✅ FCM Sent:", response);
        return {
            success: true,
            response,
        };
    } catch (error) {
        console.error( "FCM Error:", error.code, error.message);
        return {
            success: false,
            error: error.message,
            code: error.code,
        };
    }
};

export default sendNotification;