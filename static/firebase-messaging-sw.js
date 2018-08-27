importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
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

var cacheName = 'cubetasticV1.4.5';
var filesToCache = [
  '/',
  '/index',
  '/solve',
  '/timer',
  '/installpwa',
  '/signin',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Acme|Cabin|Play|Saira|Oswald',
  'https://fonts.googleapis.com/css?family=Cabin|Saira|Play|Iceberg|Unica+One|Contrail+One|Share+Tech+Mono|Black+Han+Sans|Copse|Noto+Sans|Space+Mono|Titillium+Web',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
  'https://vjs.zencdn.net/7.1.0/video-js.css',
  '/css/main.css',
  '/css/timer.css',
  '/images/icons/icon-512x512.png',
  '/images/textures/cubes.png',
  '/js/main.js',
  '/js/loggedStatus.js',
  '/js/timer.js',
  '/js/nouislider.min.js',
  '/js/tnoodle.js',
  '/audio/8_seconds.ogg',
  '/audio/8_seconds.mp3',
  '/audio/12_seconds.ogg',
  '/audio/12_seconds.mp3',
  '/images/bridge_in_the_forest.jpg',
  '/images/clouds_at_dawn.jpg',
  '/images/countryside_cabin.jpg',
  '/images/evening_light_1080x1920.jpg',
  '/images/evening_light_3840x2160.jpg',
  '/images/forest_mountain.jpg',
  '/images/lake_at_dawn.jpg',
  '/images/mountain_lake.jpg',
  '/images/mountain_silhouette.jpg',
  '/images/starry_night.jpg',
  '/images/stars_timelapse.jpg',
  '/images/sunset_in_the_forest_1080x1920.jpg',
  '/images/sunset_in_the_forest_7680x4320.jpg',
  '/images/vincent-guth-aurora.jpg',
  '/images/work_table.jpg',
  '/images/thumbnails/aurora_vincent_guth_mobile.png',
  '/images/thumbnails/bridge_in_the_forest.png',
  '/images/thumbnails/clouds_at_dawn.png',
  '/images/thumbnails/countryside_cabin.png',
  '/images/thumbnails/evening_light.png',
  '/images/thumbnails/evening_light_mobile.png',
  '/images/thumbnails/forest_mountain.png',
  '/images/thumbnails/lake_at_dawn.png',
  '/images/thumbnails/mountain_lake.png',
  '/images/thumbnails/mountain_silhouette.png',
  '/images/thumbnails/starry_night_mobile.png',
  '/images/thumbnails/stars_timelapse.png',
  '/images/thumbnails/sunset_in_the_forest.png',
  '/images/thumbnails/sunset_in_the_forest_mobile.png',
  '/images/thumbnails/work_table.png'
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
