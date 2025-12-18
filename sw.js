// sw.js - Service Worker for Background Notifications

self.addEventListener('install', (event) => {
    // সার্ভিস ওয়ার্কার ইনস্টল হওয়ার সাথে সাথে একটিভ হবে
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // পেজ রিফ্রেশ ছাড়াই কন্ট্রোল নিবে
    event.waitUntil(self.clients.claim());
});

// যখন সিস্টেম থেকে কোনো পুশ নোটিফিকেশন আসবে
self.addEventListener('push', (event) => {
    const title = 'New Task Request!';
    const options = {
        body: event.data ? event.data.text() : 'Check your Admin Panel immediately.',
        icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827349.png', // নোটিফিকেশন আইকন
        badge: 'https://cdn-icons-png.flaticon.com/512/1827/1827349.png',
        vibrate: [500, 200, 500], // ভাইব্রেশন প্যাটার্ন
        tag: 'task-notification',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// নোটিফিকেশনে ক্লিক করলে অ্যাপ ওপেন হবে
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // যদি অ্যাডমিন প্যানেল খোলা থাকে, ফোকাস করবে
            for (const client of clientList) {
                if (client.url.includes('task_request.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // যদি বন্ধ থাকে, নতুন করে ওপেন করবে
            if (clients.openWindow) {
                return clients.openWindow('task_request.html');
            }
        })
    );
});
