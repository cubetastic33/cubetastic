importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '744871672011'
});
const messaging = firebase.messaging();

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;
  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('https://cubetastic.herokuapp.com');
    notification.close();
  }
});

messaging.setBackgroundMessageHandler(function(payload) {
  return self.registration.showNotification(title, options);
});

var cacheName = 'cubetasticV1.2.1';
var filesToCache = [
  '/',
  '/index',
  '/solve',
  '/timer',
  '/installpwa',
  '/contactMe',
  '/signin',
  '/signup',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Acme|Cabin|Play|Saira|Oswald',
  'https://fonts.googleapis.com/css?family=Cabin|Saira|Play|Iceberg|Unica+One|Contrail+One|Share+Tech+Mono|Black+Han+Sans|Copse|Noto+Sans|Space+Mono|Titillium+Web',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
  '/css/main.css',
  '/css/timer.css',
  '/images/icons/icon-512x512.png',
  '/images/textures/cubes.png',
  '/js/main.js',
  '/js/loggedStatus.js',
  '/js/timer.js',
  '/js/tnoodle.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

//This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function(response) {
  return caches.open('cubetastic-offline').then(function(cache) {
    console.log('Offline page updated from refreshOffline event: '+ response.url);
    return cache.put(offlinePage, response);
  });
});
