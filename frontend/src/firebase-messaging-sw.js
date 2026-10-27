importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload?.data?.title || "AI Chatbot";
    const body = payload?.data?.message || "";
    const image = payload?.data?.image || null;
    const route = payload?.data?.webRoute || "/";
    const notificationOptions = {
        body,
        ...(image && {
            icon: image,
        }),
        data: {
            url: route,
        },
    };

    self.registration.showNotification(
        title,
        notificationOptions
    );
});

self.addEventListener(
    "notificationclick",
    (event) => {
        event.notification.close();
        const route = event.notification?.data?.url || "/";
        const urlToOpen =
            new URL(
                route,
                self.location.origin
            ).href;
        event.waitUntil(
            clients
                .matchAll({
                    type: "window",
                    includeUncontrolled: true,
                })
                .then(async (clientList) => {
                    // Existing tab mil gaya
                    for (const client of clientList) {
                        if (
                            client.url === urlToOpen &&
                            "focus" in client
                        ) {
                            return client.focus();
                        }
                    }
                    // Existing application tab
                    for (const client of clientList) {
                        if (
                            client.url.startsWith(
                                self.location.origin
                            )
                        ) {
                            if ("navigate" in client) {
                                await client.navigate(
                                    urlToOpen
                                );
                            }
                            if ("focus" in client) {
                                return client.focus();
                            }
                        }
                    }

                    // No existing tab
                    if (clients.openWindow) {
                        return clients.openWindow(
                            urlToOpen
                        );
                    }
                })
        );
    }
);

