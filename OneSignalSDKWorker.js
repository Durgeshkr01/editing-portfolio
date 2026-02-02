importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Handle push events for background notifications
self.addEventListener('push', function(event) {
    console.log('[OneSignal SW] Push event received');
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
    console.log('[OneSignal SW] Notification clicked');
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || 'https://editing-portfolio-alpha.vercel.app/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
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
