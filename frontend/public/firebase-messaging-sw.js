importScripts(
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js",
);

const firebaseConfig = Object.fromEntries(
  new URL(self.location.href).searchParams.entries(),
);

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.data?.title || "AI Chatbot";
  const body = payload?.data?.message || "";
  const image = payload?.data?.image || null;
  const route = payload?.data?.webRoute || "/";
  const notificationOptions = {
    body,
    ...(image && { icon: image }),
    data: {
      url: route,
    },
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const route = event.notification?.data?.url || "/";
  const urlToOpen = new URL(route, self.location.origin).href;
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(async (clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin)) {
            if ("navigate" in client) {
              await client.navigate(urlToOpen);
            }
            if ("focus" in client) {
              return client.focus();
            }
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
