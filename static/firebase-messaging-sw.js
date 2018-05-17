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

var cacheName = 'cubetasticV0.3';
var filesToCache = [
  '/',
  '/index.html',
  '/solve.html',
  '/pdfs.html',
  '/train.html',
  '/timer.html',
  '/installpwa.html',
  '/contactMe.html',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Acme|Cabin|Saira|Play|Iceberg|Unica+One|Atomic+Age|Coda|Contrail+One|Kelly+Slab|Nova+Flat|Nova+Round|Share+Tech+Mono|VT323',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  '/css/materialize.min.css',
  '/css/main.css',
  '/css/timer.css',
  'images/icons/icon-512x512.png',
  'js/materialize.min.js',
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
