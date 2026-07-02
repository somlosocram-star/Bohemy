/* Bohemy — service worker */
const CACHE = 'bohemy-v48';
const CORE = ['./','./index.html','./manifest.webmanifest','./favicon-32.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png','./apple-touch-icon.png'];
const MEDIA = ['./agua.mp3','./arco.mp3','./caidas.mp3','./cubilete.mp3','./dos.mp3','./dragon.mp3','./hielo.mp3','./hilo.mp3','./varios.mp3','./a000.jpg','./a001.png','./a002.png','./a003.png','./a004.png','./a005.png','./a006.png','./a007.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).then(() => { Promise.allSettled(MEDIA.map(u => c.add(u))); })).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept')||'').includes('text/html');
  if (isHTML) { e.respondWith(fetch(req).then(res => { const c=res.clone(); caches.open(CACHE).then(x=>x.put('./index.html',c)); return res; }).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./')))); return; }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const c=res.clone(); caches.open(CACHE).then(x=>x.put(req,c)); return res; })));
});
