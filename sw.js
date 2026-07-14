// H2 CRM Service Worker — minimal for PWA installability
var CACHE = "h2crm-v1";
var ASSETS = ["./", "./index.html", "./icon-512.svg", "./icon-192.svg", "./manifest.json"];

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  // Only cache our own shell files, pass through GAS requests
  var url = e.request.url;
  if (url.indexOf("script.google.com") >= 0 || url.indexOf("googleusercontent") >= 0) {
    return; // let GAS requests go through normally
  }
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});