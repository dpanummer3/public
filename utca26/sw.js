const SHELL_CACHE='utca-shell-v48';
const PHOTO_CACHE='utca-place-photo-v1';
const APP_SHELL=['/','/app.css?v=97.4','/app.js?v=97.1','/manifest.webmanifest?v=97','/onboarding-checkin.webp?v=97','/onboarding-options.webp?v=97'];
const STATIC_PATHS=new Set(['/app.css','/app.js','/manifest.webmanifest','/onboarding-checkin.webp','/onboarding-options.webp','/apple-touch-icon.png','/favicon-32.png','/icon-192.png','/icon-512.png','/icon-maskable-192.png','/icon-maskable-512.png']);
self.addEventListener('install',event=>{event.waitUntil(caches.open(SHELL_CACHE).then(cache=>cache.addAll(APP_SHELL)).catch(()=>undefined));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>![SHELL_CACHE,PHOTO_CACHE].includes(key)).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
function cachePut(name,request,response){if(!response||!response.ok)return response;caches.open(name).then(cache=>cache.put(request,response.clone())).catch(()=>undefined);return response}
function staleWhileRevalidate(request){return caches.match(request).then(cached=>{const fresh=fetch(request).then(response=>cachePut(SHELL_CACHE,request,response)).catch(()=>cached);return cached||fresh})}
function cacheFirst(name,request){return caches.match(request).then(cached=>cached||fetch(request).then(response=>cachePut(name,request,response)))}
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{cachePut(SHELL_CACHE,'/',response.clone());return response}).catch(()=>caches.match(request).then(response=>response||caches.match('/'))));return}
if(url.pathname==='/api/place-photo'){event.respondWith(cacheFirst(PHOTO_CACHE,request));return}
if(STATIC_PATHS.has(url.pathname)){event.respondWith(staleWhileRevalidate(request));}
});
