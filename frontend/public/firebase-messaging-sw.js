importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDcmwfuGoYtoMCFTcf-UEyJDYx5ogQNaRE",
    authDomain: "ai-chatbot-b6a8b.firebaseapp.com",
    projectId: "ai-chatbot-b6a8b",
    storageBucket: "ai-chatbot-b6a8b.firebasestorage.app",
    messagingSenderId: "303386119787",
    appId: "1:303386119787:web:1008ec528c097574bceb2e",
    measurementId: "G-JQG4JEC1SE",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:",payload);
    const title = payload?.data?.title ||"AI Chatbot";
    const body =payload?.data?.message ||"";
    const image =payload?.data?.image || null;
    const route =payload?.data?.webRoute ||"/";
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
        console.log("Notification clicked:",event);
        event.notification.close();
        const route = event.notification?.data?.url ||"/";
        const urlToOpen =
            new URL(
                route,
                self.location.origin
            ).href;
        console.log(" Opening URL:",urlToOpen);
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

