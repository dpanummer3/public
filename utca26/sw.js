const CACHE_NAME='utca-shell-v9';
const APP_SHELL=['/','/manifest.webmanifest?v=44','/icon-192.png?v=44','/icon-512.png?v=44'];
self.addEventListener('install',event=>{
event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).catch(()=>undefined));
self.skipWaiting();
});
self.addEventListener('activate',event=>{
event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
const request=event.request;
if(request.method!=='GET'||request.mode!=='navigate')return;
event.respondWith(fetch(request).then(response=>{
if(response&&response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('/',copy)).catch(()=>undefined)}
return response;
}).catch(()=>caches.match(request).then(response=>response||caches.match('/'))));
});
