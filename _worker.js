const JSON_HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});
let schemaPromise=null;
async function initSchema(env){
await env.DB.prepare(`CREATE TABLE IF NOT EXISTS participants (
name TEXT PRIMARY KEY COLLATE NOCASE,
current_stop TEXT NOT NULL DEFAULT '',
intox INTEGER NOT NULL DEFAULT 1 CHECK(intox BETWEEN 1 AND 5),
ratings_json TEXT NOT NULL DEFAULT '{}',
updated_at INTEGER NOT NULL DEFAULT (unixepoch())
)`).run();
const {results=[]}=await env.DB.prepare('PRAGMA table_info(participants)').all();
if(!results.some(column=>column.name==='ratings_json'))await env.DB.prepare(`ALTER TABLE participants ADD COLUMN ratings_json TEXT NOT NULL DEFAULT '{}'`).run();
}
async function ensureSchema(env){
if(!env.DB)return false;
if(!schemaPromise)schemaPromise=initSchema(env).catch(error=>{schemaPromise=null;throw error});
await schemaPromise;
return true;
}
function cleanRatings(input){
const out={};
if(!input||typeof input!=='object'||Array.isArray(input))return out;
for(const [keyRaw,value] of Object.entries(input)){
const key=String(keyRaw).slice(0,64),score=Number(value);
if(key&&Number.isInteger(score)&&score>=1&&score<=5)out[key]=score;
}
return out;
}
function rowToParticipant(row){
let ratings={};
try{ratings=JSON.parse(row.ratingsJson||'{}')}catch{}
return {name:row.name,currentStop:row.currentStop,ratings,updatedAt:row.updatedAt};
}
async function getParticipants(env){
if(!await ensureSchema(env))return {participants:[]};
const {results=[]}=await env.DB.prepare(`SELECT name,current_stop AS currentStop,ratings_json AS ratingsJson,updated_at AS updatedAt FROM participants WHERE updated_at >= unixepoch() - 172800 ORDER BY updated_at DESC LIMIT 12`).all();
return {participants:results.map(rowToParticipant)};
}
async function handleState(request,env,url){
if(request.method==='GET')return json(await getParticipants(env));
if(!env.DB)return json({participants:[]},503);
await ensureSchema(env);
if(request.method==='POST'){
let body;
try{body=await request.json()}catch{return json({error:'Ongeldige JSON'},400)}
const name=String(body.name||'').trim().replace(/\s+/g,' ').slice(0,24);
if(!name)return json({error:'Naam ontbreekt'},400);
const currentStop=String(body.currentStop==null?'':body.currentStop).slice(0,64);
const ratings=cleanRatings(body.ratings);
await env.DB.prepare(`INSERT INTO participants(name,current_stop,ratings_json,updated_at) VALUES(?1,?2,?3,unixepoch()) ON CONFLICT(name) DO UPDATE SET current_stop=excluded.current_stop,ratings_json=excluded.ratings_json,updated_at=unixepoch()`).bind(name,currentStop,JSON.stringify(ratings)).run();
return json(await getParticipants(env));
}
if(request.method==='DELETE'){
const name=String(url.searchParams.get('name')||'').trim().replace(/\s+/g,' ').slice(0,24);
if(!name)return json({error:'Naam ontbreekt'},400);
await env.DB.prepare('DELETE FROM participants WHERE name=?1').bind(name).run();
return json(await getParticipants(env));
}
return json({error:'Method not allowed'},405);
}

async function handlePlacePhoto(request,env,url){
if(request.method!=='GET')return json({error:'Method not allowed'},405);
const key=String(env.GOOGLE_MAPS_API_KEY||'');
if(!key)return json({error:'Google Places photos not configured'},503);
const q=String(url.searchParams.get('q')||'').trim().slice(0,220);
if(!q)return json({error:'Locatie ontbreekt'},400);
const lat=Number(url.searchParams.get('lat')),lng=Number(url.searchParams.get('lng'));
if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat<52.02||lat>52.17||lng<5.02||lng>5.23||!/utrecht/i.test(q))return json({error:'Locatie buiten Utrecht'},400);
const body={textQuery:q,languageCode:'nl',locationBias:{circle:{center:{latitude:lat,longitude:lng},radius:700}}};
let searchResponse;
try{
searchResponse=await fetch('https://places.googleapis.com/v1/places:searchText',{
method:'POST',
headers:{'content-type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'places.photos'},
body:JSON.stringify(body)
});
}catch{return json({error:'Google Places tijdelijk niet bereikbaar'},502)}
if(!searchResponse.ok)return json({error:'Google Places zoekopdracht mislukt'},502);
let data;
try{data=await searchResponse.json()}catch{return json({error:'Ongeldig antwoord van Google Places'},502)}
const photo=data&&data.places&&data.places[0]&&data.places[0].photos&&data.places[0].photos[0];
if(!photo||!photo.name)return json({error:'Geen locatie-foto gevonden'},404);
return json({
src:'/api/place-photo/media?name='+encodeURIComponent(photo.name),
googleMapsUri:String(photo.googleMapsUri||'')
});
}
async function handlePlacePhotoMedia(request,env,url){
if(request.method!=='GET')return new Response(null,{status:405});
const key=String(env.GOOGLE_MAPS_API_KEY||'');
if(!key)return new Response(null,{status:503});
const name=String(url.searchParams.get('name')||'');
if(!/^places\/[^/]+\/photos\/[^/]+$/.test(name))return new Response(null,{status:400});
let upstream;
try{
upstream=await fetch('https://places.googleapis.com/v1/'+name+'/media?maxWidthPx=1200&maxHeightPx=720&key='+encodeURIComponent(key),{redirect:'follow'});
}catch{return new Response(null,{status:502})}
if(!upstream.ok)return new Response(null,{status:upstream.status===404?404:502});
const headers=new Headers();
headers.set('content-type',upstream.headers.get('content-type')||'image/jpeg');
headers.set('cache-control','private, no-store');
headers.set('X-Content-Type-Options','nosniff');
headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
return new Response(upstream.body,{status:200,headers});
}
export default {async fetch(request,env){
const url=new URL(request.url);
if(url.pathname==='/robots.txt')return new Response('User-agent: *\nDisallow:\n',{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}});
if(url.pathname==='/api/state')return handleState(request,env,url);
if(url.pathname==='/api/place-photo')return handlePlacePhoto(request,env,url);
if(url.pathname==='/api/place-photo/media')return handlePlacePhotoMedia(request,env,url);
const response=await env.ASSETS.fetch(request),headers=new Headers(response.headers);
headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
headers.set('X-Content-Type-Options','nosniff');
if(url.pathname==='/manifest.webmanifest'){
headers.set('content-type','application/manifest+json; charset=utf-8');
headers.set('cache-control','no-cache');
}else if(url.pathname==='/sw.js'){
headers.set('content-type','application/javascript; charset=utf-8');
headers.set('cache-control','no-cache');
headers.set('Service-Worker-Allowed','/');
}else if(/^\/(?:icon(?:-maskable)?-(?:192|512)|apple-touch-icon(?:-v(?:37|38))?|favicon-32)\.png$/.test(url.pathname)){
headers.set('cache-control','public, max-age=31536000, immutable');
}else if(url.pathname==='/'||url.pathname==='/index.html'){
headers.set('cache-control','public, max-age=0, must-revalidate');
}
return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}};
