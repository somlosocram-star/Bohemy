/* Bohemy — service worker */
const CACHE = 'bohemy-v33';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];
const MEDIA = [
  './hilo.mp3','./arco.mp3','./agua.mp3','./dragon.mp3','./hielo.mp3',
  './cubilete.mp3','./caidas.mp3','./dos.mp3','./varios.mp3',
  './posada_cutre.jpg','./posada_media.jpg','./posada_luz.jpg','./sala_rey.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(CORE).then(() => { Promise.allSettled(MEDIA.map(u => c.add(u))); })
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
  } else {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
  }
});
