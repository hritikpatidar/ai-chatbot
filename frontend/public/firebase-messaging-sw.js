importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyC3KHGG79LFHunIYt977u3lGSnOF2GyI5Q",
    authDomain: "naqshapp.firebaseapp.com",
    projectId: "naqshapp",
    storageBucket: "naqshapp.firebasestorage.app",
    messagingSenderId: "292444242482",
    appId: "1:292444242482:web:4e8a8472316027aafd322b",
    measurementId: "G-ZG5ZKK831G"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);
    let route = payload?.data?.webRoute || "/";
    self.registration.showNotification(
        payload.data?.title || "New Notification",
        {
            body: payload.data?.message,
            icon: payload.data?.image,
            data: { url: route },
        }
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = new URL(event.notification.data?.url || '/chat', self.location.origin).href;
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});