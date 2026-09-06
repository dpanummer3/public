(function(){
'use strict';
var ICONP={"train":"<rect x=\"6\" y=\"3.6\" width=\"12\" height=\"12.4\" rx=\"3.8\"/><path d=\"M6.6 10.4h10.8\"/><path d=\"M9.4 13.2h.01M14.6 13.2h.01\"/><path d=\"M9.4 16.4 7.9 20.4M14.6 16.4l1.5 4\"/>","canoe":"<path d=\"M2.9 11.3c1.9-.8 16.3-.8 18.2 0-1.5 4.8-5 7.2-9.1 7.2s-7.6-2.4-9.1-7.2z\"/><path d=\"M6.3 12.7c2.7 1 8.7 1 11.4 0\"/><path d=\"m9.7 10.3 4.6-4.6\"/><path d=\"M14 5.3c.9-.9 2.4-.9 3.3 0s.9 2.4 0 3.3z\"/>","coffee":"<path d=\"M4.6 8.6h10.8v5.2a5 5 0 0 1-5 5h-.8a5 5 0 0 1-5-5z\"/><path d=\"M15.4 10.2h1.8a2.5 2.5 0 0 1 0 5h-1.8\"/><path d=\"M8 4v1.8M11.8 3.6v2.2\"/>","fork":"<path d=\"M6.4 3.6v5.8a2.3 2.3 0 0 0 4.6 0V3.6\"/><path d=\"M8.7 11.7v8.7\"/><path d=\"M17.2 3.6c-1.5 1.3-2.3 3.1-2.3 5.2s.8 3.4 2.3 4v7.6\"/>","ball":"<circle cx=\"12\" cy=\"5.6\" r=\"3.1\"/><path d=\"M5.2 20.8 18.8 9.8\"/><path d=\"M18.8 20.8 5.2 9.8\"/>","beer":"<path d=\"M6.6 7h8.2v11.6a1.8 1.8 0 0 1-1.8 1.8H8.4a1.8 1.8 0 0 1-1.8-1.8z\"/><path d=\"M14.8 9.6h2.2a2.5 2.5 0 0 1 0 5h-2.2\"/><path d=\"M9.4 10.6v5.8M12 10.6v5.8\"/><path d=\"M6.6 7c.6-2.2 7.6-2.2 8.2 0\"/>","boules":"<circle cx=\"8.4\" cy=\"15\" r=\"4.1\"/><circle cx=\"16.4\" cy=\"16.4\" r=\"2.9\"/><circle cx=\"14.4\" cy=\"8.4\" r=\"2.1\"/>","cocktail":"<path d=\"M4.4 5.2h15.2L12 12.8z\"/><path d=\"M12 12.8v6.4\"/><path d=\"M8.8 19.6h6.4\"/>","wine":"<path d=\"M7.4 3.8h9.2c0 5-1.7 7.4-4.6 8-2.9-.6-4.6-3-4.6-8z\"/><path d=\"M12 11.8v6.2\"/><path d=\"M8.9 20.2h6.2\"/>","dinner":"<path d=\"M6.4 3.6v5.8a2.3 2.3 0 0 0 4.6 0V3.6\"/><path d=\"M8.7 11.7v8.7\"/><path d=\"M17.2 3.6c-1.5 1.3-2.3 3.1-2.3 5.2s.8 3.4 2.3 4v7.6\"/>","sandwich":"<path d=\"M6.4 10.5h11.2l-1.3 9a1.8 1.8 0 0 1-1.8 1.5H9.5a1.8 1.8 0 0 1-1.8-1.5z\"/><path d=\"m9.5 10.3-1.1-5.7\"/><path d=\"M12 10.3V3.4\"/><path d=\"m14.5 10.3 1.1-5.7\"/>","flag":"<path d=\"M6.6 20.4V3.6\"/><path d=\"M6.6 4.8h10.6l-1.9 3.4 1.9 3.4H6.6\"/>","sun":"<circle cx=\"12\" cy=\"12\" r=\"4.1\"/><path d=\"M12 3.2v2M12 18.8v2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M3.2 12h2M18.8 12h2M5.8 18.2l1.4-1.4M16.8 7.2l1.4-1.4\"/>","rain":"<path d=\"M7.8 15.2a4.3 4.3 0 0 1-.3-8.6 5.9 5.9 0 0 1 10.9 1.5 3.6 3.6 0 0 1-.6 7.1z\"/><path d=\"m9.4 17.8-.9 2.6M12.9 17.8l-.9 2.6M16.4 17.8l-.9 2.6\"/>","spot":"<circle cx=\"12\" cy=\"12\" r=\"2.2\"/><circle cx=\"12\" cy=\"12\" r=\"6.4\"/><path d=\"M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2\"/>"};
function svgIcon(n){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONP[n]||ICONP.flag)+'</svg>'}
function stopBadge(n){return '<span class="stopicon">'+svgIcon(n)+'</span>'}
var meterBands={1:{label:'Verdacht fris',color:'#57dc78'},2:{label:'Keurig op koers',color:'#a6de4b'},3:{label:'Lekker uit de hand',color:'#e8d642'},4:{label:'Ik hier?',color:'#f58a28'},5:{label:'Balzak.',color:'#e74852'}};
function maps(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}
function nav(q){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(q)+'&travelmode=walking'}
var lunchAlts=[
{name:'Graaf Floris',note:'Lunch & borrel · Vismarkt 13',desc:'Grote klassieker aan de Vismarkt. Goede lunch, genoeg zitplek en logisch in de binnenstad.',addr:'Vismarkt 13, Utrecht',geo:[52.09072,5.11942],info:maps('Graaf Floris Vismarkt 13 Utrecht')},
{name:'Eetcafé De Vingerhoed',note:'Eetcafé · Donkere Gaard 11',desc:'Klassiek eetcafé aan de Donkere Gaard. Stevige lunch en prettig centraal voor de route.',addr:'Donkere Gaard 11, Utrecht',geo:[52.09039,5.12058],info:maps('Eetcafé De Vingerhoed Donkere Gaard 11 Utrecht')},
{name:'Orloff aan de Kade',note:'Lunch aan de kade · Oosterkade 18',desc:'Ruim café-restaurant aan de Oosterkade. Makkelijk met zes en logisch op de route richting de binnenstad.',addr:'Oosterkade 18, Utrecht',geo:[52.08025,5.12130],info:maps('Orloff aan de Kade Oosterkade 18 Utrecht')}
];
var neudeAlts=[
{name:'Café Le Journal',note:'Neude 32–34',desc:'Klassiek Neude-café met groot terras. Binnen werkt net zo goed als oktober besluit vervelend te doen.',addr:'Neude 32-34, Utrecht',geo:[52.09332,5.11855],info:maps('Café Le Journal Neude Utrecht')},
{name:'Tapperij de Luifel',note:'Neude 35',desc:'Rechttoe-rechtaan café aan de Neude. Bier, uitzicht op het plein en weinig reden om ingewikkeld te doen.',addr:'Neude 35, Utrecht',geo:[52.09340,5.11835],info:maps('Tapperij de Luifel Neude 35 Utrecht')},
{name:'Ubica',note:'Bier & cocktails · Ganzenmarkt 24',desc:'Historisch pand aan de Ganzenmarkt, vlak naast het poolcafé. Handig als de Neude vol staat.',addr:'Ganzenmarkt 24, Utrecht',geo:[52.09247,5.11938],info:maps('Ubica Ganzenmarkt 24 Utrecht')}
];
var oudegrachtAlts=[
{name:"Café 't Neutje",note:'Neude 30',desc:'Bruin café aan de Neude met een groot assortiment bier en sterke drank. Prima alternatief voor een borrel met zes man.',addr:'Neude 30, Utrecht',geo:[52.0926573,5.1185024],info:maps("Café 't Neutje Neude 30 Utrecht")},
{name:'Café Vredenburg',note:'Bruine kroeg · Vredenburg 39',desc:'Klassieke Utrechtse bruine kroeg naast TivoliVredenburg. Bier, sterke drank en weinig ingewikkeld gedoe.',addr:'Vredenburg 39, Utrecht',geo:[52.09304,5.11241],info:maps('Café Vredenburg Vredenburg 39 Utrecht')},
{name:'Kafé België',note:'Speciaalbier · Oudegracht 196',desc:'Utrechts speciaalbierinstituut. Goede optie als het terrasweer definitief is opgegeven.',addr:'Oudegracht 196, Utrecht',geo:[52.08945,5.12130],info:maps('Kafé België Oudegracht 196 Utrecht')}
];
var dinnerAlts=[
{name:'De Utrechter',note:'Stadsbrasserie · Vredenburg 40',desc:'Ruime stadsbrasserie tegenover TivoliVredenburg. Goede veilige keuze voor zes man.',addr:'Vredenburg 40, Utrecht',geo:[52.092664,5.111697],info:maps('De Utrechter Vredenburg 40 Utrecht'),reserve:'https://deutrechter.nl/'},
{name:'Beers & Barrels Centrum',note:'Burgers, vlees & bier · Oudegracht a/d Werf 125',desc:'Burgers, vlees en veel bier aan de Oudegracht. Goede keuze als niemand nog behoefte heeft aan subtiele porties.',addr:'Oudegracht aan de Werf 125, Utrecht',geo:[52.09105,5.11755],info:maps('Beers & Barrels Utrecht Centrum Oudegracht 125'),reserve:'tel:+31306368744'},
{name:"'t Taphuys",note:'Diner + zelf bier/wijn tappen · Mariaplaats 3',desc:'Diner met zelf bier en wijn tappen. Efficiënt systeem, potentieel desastreus voor de meter.',addr:'Mariaplaats 3, Utrecht',geo:[52.09020,5.11462],info:maps("'t Taphuys Utrecht Mariaplaats 3"),reserve:'https://www.taphuys.nl/utrecht/groepen'}
];
var barsAlts=[
{name:'Café DeRat',note:'Bruine kroeg · Lange Smeestraat 37',desc:'Kleine huiskamerkroeg met veel speciaalbier en precies genoeg ruimte om te doen alsof het nog vroeg is.',addr:'Lange Smeestraat 37, Utrecht',geo:[52.08563,5.12148],info:maps('Café DeRat Lange Smeestraat 37 Utrecht')},
{name:'Kafé België',note:'Speciaalbier · Oudegracht 196',desc:'Veel bier, weinig franje. Sterke tussenstop richting Janskerkhof en de afsluiter.',addr:'Oudegracht 196, Utrecht',geo:[52.08945,5.12130],info:maps('Kafé België Oudegracht 196 Utrecht')},
{name:'Café de Zaak',note:'Korte Minrebroederstraat 9',desc:'Centraal, druk en ongecompliceerd. Vanaf hier is Bambi praktisch om de hoek.',addr:'Korte Minrebroederstraat 9, Utrecht',geo:[52.09272,5.12055],info:maps('Café de Zaak Korte Minrebroederstraat 9 Utrecht')}
];
var finalAlts=[
{name:'Cafetaria Ten Beste',note:'Late snack · Predikherenstraat 2',desc:'Kapsalon, döner en snacks. Noordelijk van Bambi, maar nog steeds goed terug te lopen naar Centraal.',addr:'Predikherenstraat 2, Utrecht',geo:[52.09615,5.12055],info:maps('Cafetaria Ten Beste Predikherenstraat 2 Utrecht')},
{name:'Grillroom Huzur',note:'Shoarma & grill · Voorstraat 74',desc:'Late grilloptie aan de Voorstraat. Stevig, snel en nog open als de rest al verstandig begint te doen.',addr:'Voorstraat 74, Utrecht',geo:[52.09608,5.12192],info:maps('Grillroom Huzur Voorstraat 74 Utrecht')},
{name:'Polleke Utrecht',note:'Broodjes & late hap · Korte Jansstraat 12',desc:'Zelfde straat als Bambi. Minimale omweg, maximale kans dat iemand alsnog een broodje nodig heeft.',addr:'Korte Jansstraat 12, Utrecht',geo:[52.09318,5.12153],info:maps('Polleke Korte Jansstraat 12 Utrecht')}
];
var stopsCommon=[
{id:'start',icon:'train',time:'09:30–09:45',fixedStart:570,fixedEnd:585,name:'Utrecht Centraal',kind:'finish',meter:false,desc:'Verzamelen bij Stationsplein. Iedereen binnen, koffie in de hand en om 09:45 weg.',addr:'Stationsplein, Utrecht',geo:[52.08944,5.11028],info:maps('Utrecht Centraal')},
{id:'lunch',icon:'fork',time:'dynamisch',name:'Café Ledig Erf',optionNote:'Lunch · Tolsteegbrug 3',kind:'food',meter:true,desc:'Lunch zonder reserveringsgedoe. Even zitten, eten en de eerste fijne drankjes nuttigen.',addr:'Tolsteegbrug 3, Utrecht',geo:[52.08312,5.12302],info:maps('Café Ledig Erf Tolsteegbrug 3 Utrecht'),alts:lunchAlts},
{id:'pool',icon:'ball',time:'14:00–15:30',fixedStart:840,fixedEnd:930,reservationAnchor:true,name:'Poolcafé Hart van Utrecht',kind:'play',meter:true,desc:'Twee tafels, zes personen. Ik weet ook niet hoe dit werkt.',addr:'Ganzenmarkt 16B, Utrecht',geo:[52.092330,5.119405],info:maps('Poolcafé Hart van Utrecht Ganzenmarkt 16B Utrecht'),reserve:'https://www.poolenutrecht.nl/reserveren/'},
{id:'neude',icon:'beer',time:'dynamisch',name:'De Beurs · Neude',optionNote:'Terras / café · Neude 37–39',kind:'food',meter:true,desc:'Terras als het droog is, binnen als het tegenzit. Tijd voor bier en ongevraagd advies.',addr:'Neude 37-39, Utrecht',geo:[52.09345,5.11820],info:maps('De Beurs Neude Utrecht'),alts:neudeAlts},
{id:'jeu',icon:'boules',time:'16:30–17:45',fixedStart:990,fixedEnd:1065,reservationAnchor:true,name:'JEU de Boules Bar Utrecht',kind:'play',meter:true,desc:'Een baan, zes man, veel ballen en weinig hand-oog coördinatie.',addr:'Paardenveld 3, Utrecht',geo:[52.09505,5.10895],info:maps('JEU de boules bar Utrecht Paardenveld 3'),reserve:'https://jeudeboulesbar.nl/reserveren/'},
{id:'oudegracht',icon:'cocktail',time:'dynamisch',name:'Café De Postillon',optionNote:'Borrel · Lijnmarkt 50',kind:'food',meter:true,desc:'Bruine kroeg aan de Lijnmarkt met uitzicht op de Oudegracht. Nog één borrelblok voordat er serieus gegeten moet worden.',addr:'Lijnmarkt 50, Utrecht',geo:[52.089233,5.120931],info:maps('Café De Postillon Lijnmarkt 50 Utrecht'),alts:oudegrachtAlts},
{id:'dinner',icon:'dinner',time:'19:00–21:00',fixedStart:1140,fixedEnd:1260,reservationAnchor:true,name:'Eetcafé De Poort',optionNote:'Diner · Tolsteegbarrière 2',kind:'food',meter:true,desc:'Diner aan het Ledig Erf. Gewoon stevig eten voordat de avond zichzelf verder organiseert.',addr:'Tolsteegbarrière 2, Utrecht',geo:[52.08303,5.12278],info:maps('Eetcafé De Poort Tolsteegbarrière 2 Utrecht'),reserve:'tel:+31302314572',alts:dinnerAlts},
{id:'bars',icon:'wine',time:'dynamisch',name:'Café De Morgenster',optionNote:'Eerste kroeg · Oudegracht 323',kind:'food',meter:true,desc:'Eén kroeg als basis in plaats van een hele kroegenroute. Vanaf hier kunnen jullie blijven hangen of één van de drie alternatieven kiezen.',addr:'Oudegracht 323, Utrecht',geo:[52.085012,5.122299],info:maps('Café De Morgenster Oudegracht 323 Utrecht'),alts:barsAlts},
{id:'final',icon:'sandwich',time:'23:30–dynamisch',fixedStart:1410,name:'Broodje Bambi',optionNote:'Afsluiter · Korte Jansstraat 6',kind:'food',meter:true,desc:'Om de hoek van Janskerkhof, overdekt en tot diep in de nacht open. Vanaf hier lopen jullie terug naar Utrecht Centraal.',addr:'Korte Jansstraat 6, Utrecht',geo:[52.09324,5.12138],info:maps('Broodje Bambi Korte Jansstraat 6 Utrecht'),alts:finalAlts},
{id:'finish',icon:'flag',time:'00:00',fixedStart:1440,fixedEnd:1440,name:'Utrecht Centraal',kind:'finish',meter:false,desc:'Rondje dicht. Succes met het perron.',addr:'Utrecht Centraal, Utrecht',geo:[52.08944,5.11028],info:maps('Utrecht Centraal')}
];
var rainMorningAlts=[
{name:"Café 't Neutje",note:'Koffie & kaarten · Neude 30',desc:'Koffie en kaarten en wellicht een klein drankje.',addr:'Neude 30, Utrecht',geo:[52.0926573,5.1185024],info:maps("Café 't Neutje Neude 30 Utrecht")},
{name:'Graaf Floris',note:'Bruine-kroegsfeer · Vismarkt 13 · kaarten',desc:'Klassieker in de binnenstad met genoeg plek voor koffie, kaarten en droog schuilen tot Utrecht weer meewerkt.',addr:'Vismarkt 13, Utrecht',geo:[52.09072,5.11942],info:maps('Graaf Floris Vismarkt 13 Utrecht')},
{name:'Café de Zaak',note:'Modern bruin café · Korte Minrebroederstraat 9 · kaarten',desc:'Modern bruin café achter het stadhuis. Open vanaf de ochtend en een logische plek voor koffie, een drankje en een potje kaarten.',addr:'Korte Minrebroederstraat 9, Utrecht',geo:[52.092152,5.120394],info:maps('Café de Zaak Korte Minrebroederstraat 9 Utrecht')}
];
var weatherStop={
sun:{id:'weather-sun',icon:'canoe',time:'10:00–11:45',fixedStart:600,fixedEnd:705,reservationAnchor:true,name:'Kanoverhuur Utrecht',kind:'play',meter:true,desc:'Water, de Oudegracht. Drie tweepersoonskano\'s. Rustig beginnen en koekeloeren.',addr:'Oudegracht aan de Werf 275, Utrecht',geo:[52.08360,5.12155],info:maps('Kanoverhuur Utrecht Oudegracht aan de Werf 275 Utrecht'),reserve:'https://kanoverhuurutrecht.nl/reserveren'},
rain:{id:'weather-rain',icon:'coffee',time:'09:50–11:20',fixedStart:590,fixedEnd:680,name:'Café Orloff',optionNote:'Koffie & kaarten · Donkere Gaard 8',kind:'food',meter:true,desc:'Koffie, kaarten en rustig op gang komen in een gezellig café aan de Donkere Gaard.',addr:'Donkere Gaard 8, Utrecht',geo:[52.08982,5.12113],info:maps('Café Orloff Donkere Gaard 8 Utrecht'),alts:rainMorningAlts}
};
var memoryStore={};
function storeGet(k){try{return window.localStorage?window.localStorage.getItem(k):null}catch(e){return memoryStore[k]||null}}
function storeSet(k,v){try{if(window.localStorage)window.localStorage.setItem(k,v);else memoryStore[k]=v}catch(e){memoryStore[k]=v}}
function storeRemove(k){try{if(window.localStorage)window.localStorage.removeItem(k)}catch(e){} delete memoryStore[k]}
function safeJson(v,fallback){try{var x=JSON.parse(v);return x&&typeof x==='object'?x:fallback}catch(e){return fallback}}
function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
var mode=storeGet('utca-weather')||'sun';
function applyWeatherTheme(){
var rain=mode==='rain',chrome=rain?'#0d1518':'#11150f';
document.body.classList.toggle('rain-mode',rain);
document.documentElement.style.backgroundColor=chrome;
var theme=document.querySelector('meta[name="theme-color"]');
if(theme)theme.setAttribute('content',chrome);
}
function renderWeatherSwitcher(){
$$('.switcher button').forEach(function(button){
var active=button.getAttribute('data-mode')===mode;
button.classList.toggle('active',active);
button.setAttribute('aria-pressed',active?'true':'false');
});
}
var user=storeGet('utca-name')||'';
var currentStop=storeGet('utca-stop')||'';
var ratings=safeJson(storeGet('utca-ratings'),{});
var resultsFinalized=storeGet('utca-results-finalized')==='1';
var venueSelections=safeJson(storeGet('utca-venues-v13'),{});
if(storeGet('utca-rain-orloff-default-v1')!=='1'){
venueSelections['weather-rain']=0;
storeSet('utca-venues-v13',JSON.stringify(venueSelections));
storeSet('utca-rain-orloff-default-v1','1');
}
var participants=[];
var standaloneMode=(window.location.protocol==='file:'||window.location.protocol==='blob:'||window.location.protocol==='data:'||!window.location.hostname);
function itinerary(){var a=[stopsCommon[0],weatherStop[mode]];return a.concat(stopsCommon.slice(1))}
function meterStops(){return itinerary().filter(function(x){return x.meter})}
function toast(msg){var t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},1700)}
function bandForScore(v){if(v<1.5)return 1;if(v<2.5)return 2;if(v<3.5)return 3;if(v<4.5)return 4;return 5}
function bandForValue(v){return meterBands[Math.max(1,Math.min(5,Math.round(Number(v)||1)))]}
function percentFromAverage(avg){return Math.round(Math.max(0,Math.min(100,((avg-1)/4)*100)))}
function averageFromRatings(obj){obj=obj||ratings;var allowed={};meterStops().forEach(function(s){allowed[s.id]=true});var vals=[];for(var k in obj){if(Object.prototype.hasOwnProperty.call(obj,k)&&allowed[k]&&Number(obj[k])>=1&&Number(obj[k])<=5)vals.push(Number(obj[k]))}if(!vals.length)return{avg:null,count:0,total:Object.keys(allowed).length};var sum=0;vals.forEach(function(v){sum+=v});return{avg:sum/vals.length,count:vals.length,total:Object.keys(allowed).length}}
function persistRatings(){storeSet('utca-ratings',JSON.stringify(ratings))}
function renderUser(){var n=$('#userName'),chip=$('#userChip'),overlay=$('#loginOverlay'),shell=$('#bottomNavShell'),rt=$('#rosterToggle'),rw=$('#rosterWrap');if(n)n.textContent=user;if(chip)chip.classList.toggle('show',!!user);if(overlay)overlay.classList.toggle('show',!user);if(shell)shell.classList.toggle('show',!!user);if(rt)rt.classList.toggle('show',!!user);if(rw&&!user)rw.classList.remove('open')}
function externalAttrs(url){return url&&url.indexOf('tel:')===0?'':' target="_blank" rel="noopener"'}
function venueOptions(x){
var primary={name:x.optionName||x.name,note:x.optionNote||x.addr,desc:x.desc,addr:x.addr,geo:x.geo,info:x.info,reserve:x.reserve||''};
return [primary].concat(x.alts||[]);
}
function selectedVenueIndex(x){
if(!x.alts||!x.alts.length)return 0;
var idx=Number(venueSelections[x.id]||0),max=venueOptions(x).length-1;
return isFinite(idx)&&idx>=0&&idx<=max?idx:0;
}
function activeVenue(x){return venueOptions(x)[selectedVenueIndex(x)]}
function sameVenue(a,b){if(!a||!b)return false;return String(a.addr||'').trim().toLowerCase()===String(b.addr||'').trim().toLowerCase()}
function rad(v){return v*Math.PI/180}
function walkMinutes(a,b){
if(!a||!b)return 0;
if(sameVenue(a,b))return 0;
if(!a.geo||!b.geo)return 5;
var R=6371,dLat=rad(b.geo[0]-a.geo[0]),dLon=rad(b.geo[1]-a.geo[1]);
var q=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(rad(a.geo[0]))*Math.cos(rad(b.geo[0]))*Math.sin(dLon/2)*Math.sin(dLon/2);
var km=R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q));
var min=Math.round(km*13.4);
return Math.max(1,min);
}
function totalWalkMinutes(){
var arr=itinerary(),sum=0;
for(var i=1;i<arr.length;i++)sum+=walkMinutes(activeVenue(arr[i-1]),activeVenue(arr[i]));
return sum;
}
function fmtTime(min){
min=Math.max(0,Math.min(1440,Math.round(min)));
if(min===1440)return '00:00';
var h=Math.floor(min/60),m=min%60;
return (h<10?'0':'')+h+':'+(m<10?'0':'')+m;
}
function nextFixedIndex(arr,from){
for(var i=from+1;i<arr.length;i++)if(typeof arr[i].fixedStart==='number')return i;
return -1;
}
function computeSchedule(){
var arr=itinerary(),sch=[],i;
for(i=0;i<arr.length;i++)sch.push({start:null,end:null});
for(i=0;i<arr.length;i++){
if(typeof arr[i].fixedStart==='number')sch[i].start=arr[i].fixedStart;
if(typeof arr[i].fixedEnd==='number')sch[i].end=arr[i].fixedEnd;
}
for(i=0;i<arr.length;i++){
if(sch[i].start===null){
var prev=i>0?sch[i-1]:null;
if(prev&&prev.end!==null)sch[i].start=prev.end+walkMinutes(activeVenue(arr[i-1]),activeVenue(arr[i]));
}
if(sch[i].end===null){
var nfi=nextFixedIndex(arr,i);
if(nfi>i){
var next=arr[nfi];
if(nfi===i+1){
var w=walkMinutes(activeVenue(arr[i]),activeVenue(next));
var margin=next.reservationAnchor?5:0;
sch[i].end=sch[nfi].start-w-margin;
}
}
}
if(arr[i].id==='weather-rain'){
sch[i].start=590; sch[i].end=680;
}
}
for(i=1;i<arr.length;i++){
if(sch[i].start===null&&sch[i-1].end!==null)sch[i].start=sch[i-1].end+walkMinutes(activeVenue(arr[i-1]),activeVenue(arr[i]));
}
var idx={};for(i=0;i<arr.length;i++)idx[arr[i].id]=i;
function fitBefore(id,nextId,margin){
var a=idx[id],b=idx[nextId]; if(a===undefined||b===undefined)return;
if(sch[a].start===null&&a>0&&sch[a-1].end!==null)sch[a].start=sch[a-1].end+walkMinutes(activeVenue(arr[a-1]),activeVenue(arr[a]));
sch[a].end=sch[b].start-walkMinutes(activeVenue(arr[a]),activeVenue(arr[b]))-(margin||0);
}
fitBefore('lunch','pool',5);
fitBefore('neude','jeu',5);
fitBefore('oudegracht','dinner',5);
fitBefore('bars','final',0);
for(i=1;i<arr.length;i++){
if(sch[i].start===null&&sch[i-1].end!==null)sch[i].start=sch[i-1].end+walkMinutes(activeVenue(arr[i-1]),activeVenue(arr[i]));
}
if(idx.final!==undefined&&idx.finish!==undefined){
sch[idx.final].start=1410;
sch[idx.final].end=1440-walkMinutes(activeVenue(arr[idx.final]),activeVenue(arr[idx.finish]));
}
if(idx.bars!==undefined){
var bi=idx.bars;
if(bi>0)sch[bi].start=sch[bi-1].end+walkMinutes(activeVenue(arr[bi-1]),activeVenue(arr[bi]));
if(idx.final!==undefined)sch[bi].end=sch[idx.final].start-walkMinutes(activeVenue(arr[bi]),activeVenue(arr[idx.final]));
}
if(idx.lunch!==undefined){
var li=idx.lunch;
sch[li].start=sch[li-1].end+walkMinutes(activeVenue(arr[li-1]),activeVenue(arr[li]));
sch[li].end=sch[idx.pool].start-walkMinutes(activeVenue(arr[li]),activeVenue(arr[idx.pool]))-5;
}
if(idx.neude!==undefined){var ni=idx.neude;sch[ni].start=sch[ni-1].end+walkMinutes(activeVenue(arr[ni-1]),activeVenue(arr[ni]));sch[ni].end=sch[idx.jeu].start-walkMinutes(activeVenue(arr[ni]),activeVenue(arr[idx.jeu]))-5;}
if(idx.oudegracht!==undefined){var oi=idx.oudegracht;sch[oi].start=sch[oi-1].end+walkMinutes(activeVenue(arr[oi-1]),activeVenue(arr[oi]));sch[oi].end=sch[idx.dinner].start-walkMinutes(activeVenue(arr[oi]),activeVenue(arr[idx.dinner]))-5;}
return sch;
}
function displayStopTime(stop,s){
if(!s||s.start===null)return stop.time||'';
if(s.end===null||s.end===s.start)return fmtTime(s.start);
return fmtTime(s.start)+'–'+fmtTime(s.end);
}
function walkDisplay(arr,sch,i){
var prev=arr[i-1],cur=arr[i],w=walkMinutes(activeVenue(prev),activeVenue(cur));
var depart=sch[i-1].end,arrive=depart===null?null:depart+w;
var start=sch[i].start,slack=(arrive!==null&&start!==null)?Math.max(0,start-arrive):0;
var text='± '+w+' min lopen';
if(slack>0)text+=' + '+slack+' min speling';
return {walk:w,depart:depart,arrive:arrive,start:start,text:text};
}
function renderJourneyHeader(){
var arr=itinerary(),sch=computeSchedule(),idx=-1,i;
for(i=0;i<arr.length;i++)if(arr[i].id===currentStop){idx=i;break}
if(idx<0)idx=0;
var now=activeVenue(arr[idx]),nextIdx=idx+1;
var nowEl=$('#journeyNow'),nextEl=$('#journeyNext'),metaEl=$('#journeyMeta'),navEl=$('#journeyNav'),copyEl=$('#journeyCopy');
if(nowEl)nowEl.textContent=now.name;
if(copyEl){
copyEl.setAttribute('data-current-stop',arr[idx].id);
copyEl.setAttribute('aria-label','Ga naar huidige stop: '+now.name);
}
if(nextIdx>=arr.length){
if(nextEl)nextEl.textContent='Dag afgerond';
if(metaEl)metaEl.textContent='Je bent terug op Utrecht Centraal.';
if(navEl){
navEl.href='#finalResult';navEl.classList.remove('disabled');navEl.classList.add('done');navEl.textContent='KLAAR';
navEl.onclick=function(e){
e.preventDefault();
resultsFinalized=true;
storeSet('utca-results-finalized','1');
renderFinalResult();
setBottomTabActive('stand');
var result=$('#finalResult');
if(result)result.scrollIntoView({behavior:motionAllowed()?'smooth':'auto',block:'start'});
};
}
return;
}
var nextStop=arr[nextIdx],next=activeVenue(nextStop),w=walkMinutes(now,next);
if(nextEl)nextEl.textContent=next.name;
var t=sch[nextIdx]&&sch[nextIdx].start!==null?fmtTime(sch[nextIdx].start):'';
if(metaEl)metaEl.textContent=(t?t+' · ':'')+'± '+w+' min lopen';
if(navEl){navEl.onclick=null;navEl.href=nav(next.addr);navEl.classList.remove('disabled','done');navEl.textContent='Navigeer'}
}
function ensureNoConsecutiveDuplicate(){
var arr=itinerary(),changed=false;
for(var i=1;i<arr.length;i++){
var prev=activeVenue(arr[i-1]),cur=activeVenue(arr[i]);
if(sameVenue(prev,cur)&&arr[i].alts&&arr[i].alts.length){
var opts=venueOptions(arr[i]);
for(var j=0;j<opts.length;j++){
if(!sameVenue(prev,opts[j])){venueSelections[arr[i].id]=j;changed=true;break}
}
}
}
if(changed)persistVenueSelections();
}
function persistVenueSelections(){storeSet('utca-venues-v13',JSON.stringify(venueSelections))}
function alternativesHtml(x){
if(!x.alts||!x.alts.length)return'';
var opts=venueOptions(x),selected=selectedVenueIndex(x),rows='',arr=itinerary(),pos=arr.indexOf(x),prev=pos>0?activeVenue(arr[pos-1]):null,next=pos>=0&&pos<arr.length-1?activeVenue(arr[pos+1]):null;
opts.forEach(function(a,idx){
if(idx===selected)return;
var conflictPrev=sameVenue(prev,a),conflictNext=sameVenue(a,next),conflict=conflictPrev||conflictNext;
var walkText=conflict?(conflictPrev?'· zelfde tent als hiervoor':'· zelfde tent als hierna'):('· ± '+walkMinutes(prev,a)+' min lopen');
rows+='<div class="alt-row"><button type="button" class="alt-select" data-venue-stop="'+x.id+'" data-venue-index="'+idx+'" aria-label="Kies '+escapeHtml(a.name)+'" '+(conflict?'disabled':'')+'><div class="alt-name">'+escapeHtml(a.name)+' <span class="alt-walk">'+walkText+'</span></div><div class="alt-note">'+escapeHtml(a.note||a.addr||'')+'</div></button><div class="alt-actions"><a class="mini-round" href="'+a.info+'" target="_blank" rel="noopener" aria-label="Google Maps reviews van '+escapeHtml(a.name)+'">Info</a>'+(a.reserve?'<a class="mini-round r" href="'+a.reserve+'"'+externalAttrs(a.reserve)+' aria-label="Reserveren bij '+escapeHtml(a.name)+'">Boek</a>':'')+'</div></div>';
});
return '<details class="alternatives"><summary>'+(opts.length-1)+' andere opties <span>+</span></summary><div class="alt-list">'+rows+'</div></details>';
}
var placePhotoObserver=null,placePhotoInflight={};
var placeIdCache=(function(){try{return JSON.parse(storeGet('utca-placeids-v1')||'{}')||{}}catch(e){return{}}})();
function photoKey(el){return [el.getAttribute('data-place-photo')||'',el.getAttribute('data-place-lat')||'',el.getAttribute('data-place-lng')||''].join('|')}
function savePlaceId(key,id){if(!id)return;placeIdCache[key]=id;storeSet('utca-placeids-v1',JSON.stringify(placeIdCache))}
function placePhotoHtml(v,priority){
var query=(v.name||'')+', '+(v.addr||''),lat=v.geo&&isFinite(Number(v.geo[0]))?Number(v.geo[0]):'',lng=v.geo&&isFinite(Number(v.geo[1]))?Number(v.geo[1]):'',high=priority==='high';
return '<figure class="venue-photo" data-place-photo="'+escapeHtml(query)+'" data-place-lat="'+lat+'" data-place-lng="'+lng+'" data-place-link="'+escapeHtml(v.info||'')+'" data-photo-priority="'+(high?'high':'auto')+'"><a class="venue-photo-link" target="_blank" rel="noopener" aria-label="Bekijk foto van '+escapeHtml(v.name)+' in Google Maps"><img alt="" loading="'+(high?'eager':'lazy')+'" decoding="async" fetchpriority="'+(high?'high':'auto')+'"><span class="venue-photo-google" translate="no">Google Maps</span></a></figure>';
}
function loadedPhotoTwin(el){var key=photoKey(el),items=$$('[data-place-photo].loaded');for(var i=0;i<items.length;i++)if(items[i]!==el&&photoKey(items[i])===key){var img=items[i].querySelector('img');if(img&&img.src)return{img:img,link:items[i].querySelector('.venue-photo-link')}}return null}
function placeDetailsHref(el,data){
var q=el.getAttribute('data-place-photo')||'',id=data&&data.placeId||'';
if(id)return'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)+'&query_place_id='+encodeURIComponent(id);
return data&&data.googleMapsUri||el.getAttribute('data-place-link')||'#'
}
function applyPlacePhoto(el,data){
if(!el||!data||!data.src)return;var img=el.querySelector('img'),link=el.querySelector('.venue-photo-link');if(!img||!link)return;
if(data.placeId)savePlaceId(photoKey(el),data.placeId);link.href=placeDetailsHref(el,data);
img.onload=function(){el.classList.add('loaded');img.alt='Foto van '+(el.getAttribute('data-place-photo')||'de locatie')};
img.onerror=function(){el.classList.remove('loaded');el.removeAttribute('data-photo-loading');img.removeAttribute('src');img.alt=''};
img.src=data.src;
}
function loadPlacePhoto(el){
if(!el||el.classList.contains('loaded')||el.getAttribute('data-photo-loading')==='1')return;
var twin=loadedPhotoTwin(el);if(twin){var img=el.querySelector('img'),link=el.querySelector('.venue-photo-link');if(img&&link){link.href=twin.link&&twin.link.href?twin.link.href:el.getAttribute('data-place-link')||'#';img.onload=function(){el.classList.add('loaded')};img.src=twin.img.src}return}
var q=el.getAttribute('data-place-photo')||'',lat=el.getAttribute('data-place-lat')||'',lng=el.getAttribute('data-place-lng')||'',key=photoKey(el),placeId=placeIdCache[key]||'';
el.setAttribute('data-photo-loading','1');
var promise=placePhotoInflight[key];
if(!promise){var url='/api/place-photo?q='+encodeURIComponent(q)+(lat&&lng?'&lat='+encodeURIComponent(lat)+'&lng='+encodeURIComponent(lng):'')+(placeId?'&placeId='+encodeURIComponent(placeId):'');promise=fetch(url,{headers:{accept:'application/json'}}).then(function(r){if(!r.ok)throw new Error('photo');return r.json()});placePhotoInflight[key]=promise;promise.finally(function(){delete placePhotoInflight[key]})}
promise.then(function(data){applyPlacePhoto(el,data)}).catch(function(){el.classList.remove('loaded');el.removeAttribute('data-photo-loading')});
}
function initPlacePhotos(){
if(placePhotoObserver){placePhotoObserver.disconnect();placePhotoObserver=null}
if(!user)return;
var photos=$$('[data-place-photo]');if(!photos.length)return;
var lazy=[];photos.forEach(function(el){if(el.getAttribute('data-photo-priority')==='high')loadPlacePhoto(el);else lazy.push(el)});
if(!lazy.length)return;
if('IntersectionObserver' in window){placePhotoObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){placePhotoObserver.unobserve(entry.target);loadPlacePhoto(entry.target)}})},{rootMargin:'900px 0px'});lazy.forEach(function(el){placePhotoObserver.observe(el)})}else lazy.forEach(loadPlacePhoto);
}
function peopleAtStopHtml(stopId){
var here=(participants||[]).filter(function(p){
var isMe=user&&p.name.toLowerCase()===user.toLowerCase();
if(isMe)return currentStop===stopId;
return p.currentStop===stopId
});
if(user&&currentStop===stopId&&!here.some(function(p){return p.name.toLowerCase()===user.toLowerCase()}))here.unshift({name:user,currentStop:stopId});
if(!here.length)return'';
var html='<div class="stop-people">';
here.forEach(function(p){
var isMe=user&&p.name.toLowerCase()===user.toLowerCase();
html+='<span class="stop-person-chip '+(isMe?'me':'')+'">'+escapeHtml(p.name)+(isMe?'<i class="self-dot" aria-hidden="true"></i>':'')+'</span>';
});
html+='</div>';
return html;
}
function meterHtml(x){if(!x.meter)return'';var v=Number(ratings[x.id]||0),band=v?bandForValue(v):null,buttons='';for(var n=1;n<=5;n++)buttons+='<button data-rate="'+x.id+'" data-value="'+n+'" class="'+(v===n?'active':'')+'" aria-pressed="'+(v===n?'true':'false')+'" aria-label="Score '+n+'">'+n+'</button>';return '<div class="stop-meter"><div class="stop-meter-head"><div class="stop-meter-title">Naar de klote-meter</div><div class="stop-meter-state">'+(v?v+'/5':'Nog invullen')+'</div></div><div class="stop-meter-buttons">'+buttons+'</div><div class="meter-scale-labels"><span>Fris</span><span>Naar de klote</span></div><div class="stop-meter-copy">'+(band?'<strong>'+band.label+'</strong>':'Tik 1–5 na dit onderdeel.')+'</div></div>'}
function updateMeterUi(id){var meter=document.querySelector('.card[data-stop="'+id+'"] .stop-meter');if(!meter)return;var v=Number(ratings[id]||0),band=v?bandForValue(v):null;meter.querySelectorAll('[data-rate]').forEach(function(b){var on=Number(b.getAttribute('data-value'))===v;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});var state=meter.querySelector('.stop-meter-state'),copy=meter.querySelector('.stop-meter-copy');if(state)state.textContent=v?v+'/5':'Nog invullen';if(copy)copy.innerHTML=band?'<strong>'+band.label+'</strong>':'Tik 1–5 na dit onderdeel.'}
function renderStopPeople(){$$('.card[data-stop]').forEach(function(card){var id=card.getAttribute('data-stop'),old=card.querySelector('.stop-people'),html=peopleAtStopHtml(id);if(old){if(html)old.outerHTML=html;else old.remove()}else if(html){var body=card.querySelector('.card-body'),meter=card.querySelector('.stop-meter');if(meter)meter.insertAdjacentHTML('beforebegin',html);else (body||card).insertAdjacentHTML('beforeend',html)}})}
var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.6 4.5L19 6.5"/></svg>';
function railHtml(state,id){
return '<span class="tl-rail"><span class="tl-node" role="button" tabindex="0" data-rail-here="'+id+'" aria-label="Check in bij deze stop">'+(state==='done'?CHECK:'')+'</span></span>'
}
function stopStates(arr){
var cur=-1,i;
for(i=0;i<arr.length;i++){if(arr[i].id===currentStop){cur=i;break}}
var out=[];
for(i=0;i<arr.length;i++){
if(i===cur)out.push('current');
else if(cur>=0&&i<cur)out.push('done');
else out.push('todo');
}
return {states:out,cur:cur}
}
function motionAllowed(){return !(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)}
function positionCheckedCard(id){
var card=id?document.querySelector('.card[data-stop="'+id+'"]'):null;if(!card)return;
var topLimit=12,bottomLimit=window.innerHeight-12,journey=$('#journeyBar'),bottomNav=$('.bottom-nav-shell');
if(journey){var jr=journey.getBoundingClientRect();if(jr.bottom>0&&jr.top<window.innerHeight)topLimit=Math.max(topLimit,jr.bottom+10)}
if(bottomNav){var nr=bottomNav.getBoundingClientRect();if(nr.top>0&&nr.top<window.innerHeight)bottomLimit=Math.min(bottomLimit,nr.top-10)}
var r=card.getBoundingClientRect(),available=Math.max(180,bottomLimit-topLimit),target=null;
if(r.height<=available){
if(r.top<topLimit)target=window.scrollY+r.top-topLimit;
else if(r.bottom>bottomLimit)target=window.scrollY+r.bottom-bottomLimit;
}else if(r.top<topLimit||r.bottom>bottomLimit){target=window.scrollY+r.top-topLimit}
if(target===null)return;
target=Math.max(0,target);
try{window.scrollTo({top:target,left:0,behavior:'auto'})}catch(e){window.scrollTo(0,target)}
}
function renderTimeline(){
var arr=itinerary(),sch=computeSchedule(),html='';
var st=stopStates(arr),states=st.states,position=st.cur>=0?st.cur+1:0;
arr.forEach(function(x,i){
if(i){
var wd=walkDisplay(arr,sch,i),range=(wd.depart!==null&&wd.start!==null)?fmtTime(wd.depart)+'–'+fmtTime(wd.start):'';
var walkState=(st.cur>=0&&i<=st.cur)?'done':'todo';
if(wd.walk>0||(wd.depart!==null&&wd.start!==null&&wd.start>wd.depart))html+='<div class="tl-row walkrow '+walkState+'"><span class="tl-rail" aria-hidden="true"></span><div class="walk"><span>'+range+'</span><div class="rule"></div><span>'+wd.text+'</span></div></div>';
}
var v=activeVenue(x),timeLabel=displayStopTime(x,sch[i]);
html+='<div class="tl-row stop '+states[i]+'">'+railHtml(states[i],x.id)+'<article class="card '+(currentStop===x.id?'current':'')+'" data-stop="'+x.id+'"><div class="card-media">'+placePhotoHtml(v,(st.cur>=0?(i===st.cur||i===st.cur+1):i<2)?'high':'auto')+'<div class="media-scrim"></div><div class="media-top"><span class="media-time">'+stopBadge(x.icon)+'<span class="time">'+timeLabel+'</span></span><span class="media-index">Stop '+(i+1)+' · '+arr.length+'</span></div><div class="media-title"><div class="name">'+escapeHtml(v.name)+'</div><div class="location">'+escapeHtml(v.addr)+'</div></div></div><div class="card-body"><p class="desc">'+escapeHtml(v.desc)+'</p><div class="row"><div class="circles"><a class="round" href="'+nav(v.addr)+'" target="_blank" rel="noopener" aria-label="Navigeer naar '+escapeHtml(v.name)+'">Nav</a>'+(v.reserve?'<a class="round r" href="'+v.reserve+'"'+externalAttrs(v.reserve)+' aria-label="Reserveren">Boek</a>':'')+'</div><button type="button" class="here '+(currentStop===x.id?'active':'')+'" data-here="'+x.id+'" aria-pressed="'+(currentStop===x.id?'true':'false')+'" '+(user?'':'disabled')+'><span class="here-label">Check in ✓</span></button></div>'+alternativesHtml(x)+peopleAtStopHtml(x.id)+meterHtml(x)+'</div></article></div>';
});
$('#timeline').innerHTML=html;
initPlacePhotos();
renderProgress(position,arr.length);
$$('[data-here]').forEach(function(b){b.onclick=function(){setHere(b.getAttribute('data-here'))}});
bindEasyCheckinZones();
$$('[data-rate]').forEach(function(b){b.onclick=function(){setRating(b.getAttribute('data-rate'),Number(b.getAttribute('data-value')))}});
$$('[data-venue-stop]').forEach(function(b){b.onclick=function(){selectVenue(b.getAttribute('data-venue-stop'),Number(b.getAttribute('data-venue-index')))}});
renderJourneyHeader();
}
function renderProgress(position,total){
var wrap=$('#tlProgress'),bar=$('#tlProgressBar'),label=$('#tlProgressLabel');
if(!wrap)return;
if(!user||!position){wrap.hidden=true;return}
wrap.hidden=false;
label.innerHTML='<strong>'+position+'</strong> / '+total;
bar.style.width=Math.round(position/total*100)+'%';
}
function renderDayResult(){var r=averageFromRatings(),pct=$('#dayPercent'),bar=$('#dayBar'),copy=$('#dayCopy'),meta=$('#dayMeta');if(r.avg===null){pct.textContent='—';bar.style.width='0%';bar.style.background=meterBands[1].color;copy.textContent='Vul onder een onderdeel de meter in. Alleen ingevulde meters tellen mee.';meta.textContent='0 van '+r.total+' onderdelen ingevuld';return}var p=percentFromAverage(r.avg),band=meterBands[bandForScore(r.avg)];pct.textContent=p+'%';bar.style.width=p+'%';bar.style.background=band.color;copy.innerHTML='<strong>'+band.label+'</strong>';meta.textContent='Gemiddeld '+r.avg.toFixed(1)+'/5 · '+r.count+' van '+r.total+' onderdelen ingevuld'}
function renderRoute(){
var mins=totalWalkMinutes(),walkLabel='± '+mins+' min';
var routeWalk=$('#routeWalk');
if(routeWalk)routeWalk.textContent=walkLabel;

var fullRoute=$('#fullRoute');
if(fullRoute){
var arr=itinerary(),origin=activeVenue(arr[0]).addr,destination=activeVenue(arr[arr.length-1]).addr,points=[];
for(var i=1;i<arr.length-1;i++)points.push(activeVenue(arr[i]).addr);
var wp=points.map(encodeURIComponent).join('%7C');
var routeHref='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(origin)+'&destination='+encodeURIComponent(destination)+'&travelmode=walking&waypoints='+wp;
fullRoute.href=routeHref;
var bottomMap=$('#bottomMap');if(bottomMap)bottomMap.href=routeHref;
}
}
function participantResult(p){var r=averageFromRatings(p.ratings||{});return r.avg===null?{pct:null,avg:null}:{pct:percentFromAverage(r.avg),avg:r.avg}}
function setHereButtonLabel(btn,text){if(!btn)return;var label=btn.querySelector('.here-label');if(label)label.textContent=text;else btn.textContent=text}
function herdMoment(){if(!user||!currentStop||participants.length!==6||!participants.every(function(p){return p.currentStop===currentStop}))return;var key='utca-herd-'+currentStop,b=$('[data-here="'+currentStop+'"]');if(storeGet(key)||!b)return;storeSet(key,'1');setHereButtonLabel(b,'Grupo completo ✓');var id=currentStop;setTimeout(function(){var x=$('[data-here="'+id+'"]');if(x&&currentStop===id)setHereButtonLabel(x,'Check in ✓')},2600)}
function renderFinalResult(){
var box=$('#finalResult'),title=$('#resultStageTitle');if(!box)return;
var isFinal=resultsFinalized&&currentStop==='finish';
if(title)title.textContent=isFinal?'EINDSTAND':'TUSSENSTAND';
var scored=participants.map(function(p){return{p:p,r:participantResult(p)}}).filter(function(x){return x.r.avg!==null});
var clearResult=function(nameEl,scoreEl,barEl){var n=$(nameEl),s=$(scoreEl),b=$(barEl);if(n)n.textContent='—';if(s)s.textContent='—';if(b){b.style.width='0%';b.style.background='transparent'}};
box.hidden=false;
if(!scored.length){clearResult('#finalTopName','#finalTopScore','#finalTopBar');clearResult('#finalMidName','#finalMidScore','#finalMidBar');clearResult('#finalLowName','#finalLowScore','#finalLowBar');return}
var hi=Math.max.apply(null,scored.map(function(x){return x.r.pct})),lo=Math.min.apply(null,scored.map(function(x){return x.r.pct})),mid=(hi+lo)/2;
var names=function(n){return scored.filter(function(x){return x.r.pct===n}).map(function(x){return escapeHtml(x.p.name)}).join(' & ')};
var balance=scored.reduce(function(best,x){return Math.abs(x.r.pct-mid)<Math.abs(best.r.pct-mid)?x:best},scored[0]);
var setResult=function(nameEl,scoreEl,barEl,name,pct){var n=$(nameEl),s=$(scoreEl),b=$(barEl),avg=1+(pct/100)*4,band=meterBands[bandForScore(avg)];if(n)n.innerHTML=name;if(s)s.textContent=pct+'%';if(b){b.style.width=pct+'%';b.style.background=band.color}};
setResult('#finalTopName','#finalTopScore','#finalTopBar',names(hi),hi);
setResult('#finalMidName','#finalMidScore','#finalMidBar',escapeHtml(balance.p.name),balance.r.pct);
setResult('#finalLowName','#finalLowScore','#finalLowBar',names(lo),lo);
}
function renderRoster(){
var box=$('#roster'),count=$('#rosterCount'),countFull=$('#rosterCountFull'),stack=$('#rosterStack'),toggle=$('#rosterToggle');
if(count)count.textContent=participants.length+'/6';
if(countFull)countFull.textContent=participants.length+'/6';
if(toggle)toggle.classList.toggle('show',!!user);
if(stack){
var av='';
participants.slice(0,3).forEach(function(p){var isMe=user&&p.name.toLowerCase()===user.toLowerCase();av+='<span class="roster-avatar '+(isMe?'me':'')+'" aria-hidden="true">'+escapeHtml(p.name.charAt(0))+'</span>'});
if(participants.length>3)av+='<span class="roster-avatar more" aria-hidden="true">+'+(participants.length-3)+'</span>';
if(!av)av='<span class="roster-avatar more" aria-hidden="true">·</span>';
stack.innerHTML=av;
}
if(!box)return;
if(!participants.length){box.innerHTML='<span class="roster-empty">Nog niemand zichtbaar.</span>';return}
var html='';
participants.forEach(function(p){var isMe=user&&p.name.toLowerCase()===user.toLowerCase();html+='<span class="roster-chip '+(isMe?'me':'')+'"><span>'+escapeHtml(p.name)+(isMe?'<i class="self-dot" aria-hidden="true"></i>':'')+'</span><button type="button" data-remove-person="'+escapeHtml(p.name)+'" aria-label="Verwijder '+escapeHtml(p.name)+'">×</button></span>'});
box.innerHTML=html;
$$('[data-remove-person]').forEach(function(b){b.onclick=function(){removeParticipant(b.getAttribute('data-remove-person'))}});
}
function relativeAge(ts){
if(!ts)return'';
var sec=Math.max(0,Math.floor(Date.now()/1000-Number(ts)));
if(sec<60)return'zojuist';
if(sec<3600)return Math.floor(sec/60)+' min geleden';
if(sec<7200)return'1 uur geleden';
if(sec<86400)return Math.floor(sec/3600)+' uur geleden';
return Math.floor(sec/86400)+' d geleden';
}
function checkinIsStale(p){
return !!(p&&p.currentStop&&p.updatedAt&&((Date.now()/1000)-Number(p.updatedAt)>1800));
}
function jumpToStop(stopId){
if(!stopId)return;
if(stopId===weatherStop.sun.id&&mode!=='sun'){
mode='sun';
storeSet('utca-weather',mode);
applyWeatherTheme();
$$('.switcher button').forEach(function(x){
var active=x.getAttribute('data-mode')===mode;
x.classList.toggle('active',active);
x.setAttribute('aria-pressed',active?'true':'false');
});
renderTimeline();
}else if(stopId===weatherStop.rain.id&&mode!=='rain'){
mode='rain';
storeSet('utca-weather',mode);
applyWeatherTheme();
$$('.switcher button').forEach(function(x){
var active=x.getAttribute('data-mode')===mode;
x.classList.toggle('active',active);
x.setAttribute('aria-pressed',active?'true':'false');
});
renderTimeline();
}
requestAnimationFrame(function(){
var card=document.querySelector('.card[data-stop="'+stopId+'"]');
if(card)card.scrollIntoView({behavior:'smooth',block:'start'});
});
}
function renderGroup(){
renderRoster();
renderStopPeople();
var list=$('#groupList');
if(!participants.length){
list.innerHTML='<div class="empty">Nog niemand zichtbaar. Zodra iemand zijn naam invult, verschijnt die hier.</div>';
$('#groupAverage').textContent='—';
renderFinalResult();return
}
var byId={};
stopsCommon.concat([weatherStop.sun,weatherStop.rain]).forEach(function(s){byId[s.id]=activeVenue(s).name});
var valid=[];
participants.forEach(function(p){var rr=participantResult(p);if(rr.pct!==null)valid.push(rr)});
var html='';
participants.forEach(function(p){
var r=participantResult(p),band=r.avg!==null?meterBands[bandForScore(r.avg)]:null;
var where=byId[p.currentStop]||(p.currentStop?'Ergens tussen twee slechte beslissingen':'Nog niet ingecheckt');
var age=p.currentStop?relativeAge(p.updatedAt):'';
var stale=checkinIsStale(p)?' stale':'';
var jump=p.currentStop?' jumpable':'';
var jumpAttrs=p.currentStop?' data-jump-stop="'+escapeHtml(p.currentStop)+'" role="link" tabindex="0" aria-label="Ga naar '+escapeHtml(where)+'"':'';
html+='<div class="person'+stale+jump+'"'+jumpAttrs+'><div><strong>'+escapeHtml(p.name)+(p.name.toLowerCase()===user.toLowerCase()?'<i class="self-dot" aria-hidden="true"></i>':'')+'</strong><small>'+where+(age?' · '+age:'')+(r.pct!==null?' · '+r.pct+'% naar de klote':'')+'</small></div><div class="score percent" style="background:'+(band?band.color:'#6d7780')+'">'+(r.pct!==null?r.pct+'%':'—')+'</div></div>'
});
list.innerHTML=html;
$$('[data-jump-stop]').forEach(function(el){
el.onclick=function(){jumpToStop(el.getAttribute('data-jump-stop'))};
el.onkeydown=function(e){
if(e.key==='Enter'||e.key===' '){
e.preventDefault();
jumpToStop(el.getAttribute('data-jump-stop'));
}
};
});
if(valid.length){
var sum=0;
valid.forEach(function(x){sum+=x.pct});
$('#groupAverage').textContent=Math.round(sum/valid.length)+'%'
}else $('#groupAverage').textContent='—';
herdMoment();renderFinalResult()
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]})}
function clearOwnSession(){storeRemove('utca-name');storeRemove('utca-stop');storeRemove('utca-ratings');storeRemove('utca-results-finalized');resultsFinalized=false;user='';currentStop='';ratings={};renderUser();renderTimeline();renderDayResult();renderFinalResult();var input=$('#nameInput');if(input)input.value=''}
function removeParticipant(name){
name=String(name||'').trim();if(!name)return;
var removingSelf=!!user&&name.toLowerCase()===user.toLowerCase();
if(standaloneMode||!window.fetch){participants=participants.filter(function(p){return p.name.toLowerCase()!==name.toLowerCase()});if(removingSelf)clearOwnSession();renderGroup();toast(name+' verwijderd');return}
fetch('/api/state?name='+encodeURIComponent(name),{method:'DELETE',headers:{'accept':'application/json'}}).then(function(r){if(!r.ok)throw new Error('delete failed');return r.json()}).then(function(data){participants=data.participants||[];if(removingSelf)clearOwnSession();renderGroup();toast(name+' verwijderd')}).catch(function(){toast('Verwijderen mislukt')});
}
function syncState(silent){if(!user)return;if(standaloneMode){participants=[{name:user,currentStop:currentStop,ratings:ratings}];renderGroup();if(!silent)toast('Lokaal opgeslagen');return}var payload={name:user,currentStop:currentStop,ratings:ratings};if(!window.fetch){participants=[{name:user,currentStop:currentStop,ratings:ratings}];renderGroup();return}fetch('/api/state',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}).then(function(r){if(!r.ok)throw new Error('offline');return r.json()}).then(function(data){participants=data.participants||[];renderGroup()}).catch(function(){participants=[{name:user,currentStop:currentStop,ratings:ratings}];renderGroup();if(!silent)toast('Lokaal opgeslagen')})}
function refreshState(){if(!user||!window.fetch||standaloneMode)return;fetch('/api/state',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('offline');return r.json()}).then(function(data){participants=data.participants||[];renderGroup()}).catch(function(){})}
function selectVenue(stopId,index){
var stop=null;
stopsCommon.forEach(function(s){if(s.id===stopId)stop=s});
if(!stop&&weatherStop[mode]&&weatherStop[mode].id===stopId)stop=weatherStop[mode];
if(!stop&&weatherStop.sun.id===stopId)stop=weatherStop.sun;
if(!stop&&weatherStop.rain.id===stopId)stop=weatherStop.rain;
if(!stop||!stop.alts)return;
var opts=venueOptions(stop);
if(index<0||index>=opts.length)return;
var arr=itinerary(),pos=arr.indexOf(stop),candidate=opts[index];
var prev=pos>0?activeVenue(arr[pos-1]):null,next=pos>=0&&pos<arr.length-1?activeVenue(arr[pos+1]):null;
if(sameVenue(prev,candidate)||sameVenue(candidate,next)){
toast('Niet twee keer dezelfde tent achter elkaar.');
return;
}
venueSelections[stopId]=index;
persistVenueSelections();
renderTimeline();
renderRoute();
renderGroup();
toast('Gekozen: '+opts[index].name);
}
function activateHere(id){
if(!user||!id)return;
if(currentStop===id)return;
setHere(id);
}
function bindEasyCheckinZones(){
$$('.card[data-stop]').forEach(function(card){
card.addEventListener('click',function(e){
if(!user)return;
if(e.target.closest('a,button,summary,details,.alternatives,.row,.stop-people,.stop-meter'))return;
activateHere(card.getAttribute('data-stop'));
});
});
$$('[data-rail-here]').forEach(function(node){
function activate(e){
if(e){
e.preventDefault();
e.stopPropagation();
}
activateHere(node.getAttribute('data-rail-here'));
}
node.addEventListener('click',activate);
node.addEventListener('keydown',function(e){
if(e.key==='Enter'||e.key===' '){
activate(e);
}
});
});
}
function updateCheckinUi(focusId){
var arr=itinerary(),st=stopStates(arr),rows=$$('#timeline .tl-row.stop'),walks=$$('#timeline .tl-row.walkrow'),position=st.cur>=0?st.cur+1:0;
rows.forEach(function(row,i){
var state=st.states[i],card=row.querySelector('.card[data-stop]'),node=row.querySelector('.tl-node'),btn=row.querySelector('[data-here]');
row.classList.remove('done','current','todo');row.classList.add(state);
if(card)card.classList.toggle('current',state==='current');
if(node)node.innerHTML=state==='done'?CHECK:'';
if(btn){var active=state==='current';btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',active?'true':'false');setHereButtonLabel(btn,'Check in ✓')}
});
walks.forEach(function(row,i){var done=st.cur>=0&&i+1<=st.cur;row.classList.toggle('done',done);row.classList.toggle('todo',!done)});
renderStopPeople();renderProgress(position,arr.length);renderJourneyHeader();
if(st.cur>=0){var current=rows[st.cur],next=rows[st.cur+1];[current,next].forEach(function(row){var photo=row&&row.querySelector('[data-place-photo]');if(photo)loadPlacePhoto(photo)})}
if(focusId)requestAnimationFrame(function(){positionCheckedCard(focusId)});
}
function setHere(id){
var turningOff=currentStop===id;
currentStop=turningOff?'':id;
if(turningOff)storeRemove('utca-stop');else storeSet('utca-stop',id);
updateCheckinUi(turningOff?'':id);
syncState(false);
toast(turningOff?'Check-in uitgezet':'Check-in gedeeld');
}
function setRating(id,value){
var clearing=Number(ratings[id])===value;
if(clearing)delete ratings[id];else ratings[id]=value;
persistRatings();
updateMeterUi(id);
renderDayResult();
var me=(participants||[]).find(function(p){return user&&p.name.toLowerCase()===user.toLowerCase()});
if(me)me.ratings=Object.assign({},ratings);
renderGroup();
syncState(false);
toast(clearing?'Meter gewist':bandForValue(value).label);
}

function scrollAppTop(){
var root=document.documentElement,old=root.style.scrollBehavior;
root.style.scrollBehavior='auto';
try{window.scrollTo(0,0)}catch(e){}
root.scrollTop=0;if(document.body)document.body.scrollTop=0;
requestAnimationFrame(function(){try{window.scrollTo(0,0)}catch(e){}root.scrollTop=0;if(document.body)document.body.scrollTop=0;root.style.scrollBehavior=old});
}
function setBottomTabActive(id){
$$('[data-tab-target]').forEach(function(b){var on=b.getAttribute('data-tab-target')===id;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
}
var navLock=0;
function hereTarget(){
var card=currentStop?document.querySelector('.card[data-stop="'+currentStop+'"]'):null;
return card||document.querySelector('#timeline .card[data-stop]')||$('#journeyBar');
}
function scrollToNavTarget(id){
var el=null;
if(id==='hier')el=hereTarget();
else if(id==='stand')el=$('#finalResult');
else if(id==='rest')el=$('#groep');
if(!el)return;
navLock=Date.now()+900;
setBottomTabActive(id);
el.scrollIntoView({behavior:motionAllowed()?'smooth':'auto',block:'start'});
}
function detectBottomTab(){
var probe=window.innerHeight*.38,result=$('#finalResult'),group=$('#groep'),here=hereTarget();
if(result){var rr=result.getBoundingClientRect();if(rr.top<=probe&&rr.bottom>=110)return'stand'}
if(group&&group.getBoundingClientRect().top<=probe)return'rest';
if(here){var r=here.getBoundingClientRect();if(r.top<=probe&&r.bottom>=110)return'hier'}
return'hier';
}
function updateJourneyCompact(){var bar=$('#journeyBar');if(!bar)return;bar.classList.toggle('compact',(window.scrollY||document.documentElement.scrollTop||0)>40)}
function bindBottomTabs(){
var buttons=$$('[data-tab-target]');if(!buttons.length)return;
buttons.forEach(function(b){b.onclick=function(){scrollToNavTarget(b.getAttribute('data-tab-target'))}});
var ticking=false;
window.addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;updateJourneyCompact();if(Date.now()>navLock)setBottomTabActive(detectBottomTab())})},{passive:true});
updateJourneyCompact();setBottomTabActive(user?detectBottomTab():'hier');
}

var onboardingStep=0;
function onboardingClone(el){
if(!el)return null;
var c=el.cloneNode(true);
if(c.removeAttribute)c.removeAttribute('id');
Array.prototype.slice.call(c.querySelectorAll('[id]')).forEach(function(x){x.removeAttribute('id')});
Array.prototype.slice.call(c.querySelectorAll('a,button,input,summary')).forEach(function(x){
x.setAttribute('tabindex','-1');
x.removeAttribute('href');
});
return c;
}
function setStaticOnboardingPhoto(el,src,alt,href){
if(!el||!src)return;['data-place-photo','data-place-lat','data-place-lng','data-photo-priority'].forEach(function(a){el.removeAttribute(a)});el.classList.add('loaded');
el.innerHTML='<a class="venue-photo-link" target="_blank" rel="noopener" href="'+escapeHtml(href||'#')+'" aria-label="Bekijk foto in Google Maps"><img alt="'+escapeHtml(alt||'')+'" loading="eager" decoding="async" fetchpriority="high" src="'+escapeHtml(src)+'"><span class="venue-photo-google" translate="no">Google Maps</span></a>';
}
function buildOnboardingStills(){
var program=$('[data-onboarding-visual="program"] .ob-canvas');
var here=$('[data-onboarding-visual="here"] .ob-canvas');
var meter=$('[data-onboarding-visual="meter"] .ob-canvas');
var options=$('[data-onboarding-visual="options"] .ob-canvas');
var route=$('[data-onboarding-visual="route"] .ob-canvas');
if(!program||!here||!meter||!options||!route)return;
program.innerHTML='';here.innerHTML='';meter.innerHTML='';options.innerHTML='';route.innerHTML='';
var journey=$('#journeyBar'),sectionTitle=$('.section-title'),firstStop=$('.tl-row.stop');
if(journey){var j=onboardingClone(journey);if(j){j.classList.remove('compact');var jp=j.querySelector('.tl-progress');if(jp){jp.hidden=false;var jpb=jp.querySelector('i');if(jpb)jpb.style.width='18%';var jpl=jp.querySelector('span:last-child');if(jpl)jpl.innerHTML='<strong>2</strong> / 11'}program.appendChild(j)}}
if(sectionTitle){var st=onboardingClone(sectionTitle);if(st)program.appendChild(st)}
if(firstStop){var fs=onboardingClone(firstStop);if(fs)program.appendChild(fs)}
var hereCard=$('.card[data-stop="'+weatherStop[mode].id+'"]')||$('.card[data-stop="lunch"]');
var hc=onboardingClone(hereCard);
if(hc){
hc.classList.add('current');
var hb=hc.querySelector('.here');
if(hb){hb.classList.add('active');setHereButtonLabel(hb,'Check in ✓')}
here.appendChild(hc);
var hp=hc.querySelector('[data-place-photo]');if(hp)setStaticOnboardingPhoto(hp,'/onboarding-checkin.webp?v=90','Foto van Kanoverhuur Utrecht','https://maps.google.com/?q=Kanoverhuur+Utrecht+Oudegracht+aan+de+Werf+275+Utrecht')
}
var meterCard=$('.card[data-stop="'+weatherStop[mode].id+'"] .stop-meter')||$('.card[data-stop="lunch"] .stop-meter');
var mc=onboardingClone(meterCard);
if(mc){
var buttons=mc.querySelectorAll('.stop-meter-buttons button');
Array.prototype.slice.call(buttons).forEach(function(b){b.classList.remove('active')});
if(buttons[2])buttons[2].classList.add('active');
var state=mc.querySelector('.stop-meter-state');
if(state)state.textContent='3/5';
var copy=mc.querySelector('.stop-meter-copy');
if(copy)copy.innerHTML='<strong>Lekker uit de hand</strong>';
meter.appendChild(mc);
}
var dr=onboardingClone($('#dayResult'));
if(dr){
var resultStrong=dr.querySelector('.result-main strong');
var resultBar=dr.querySelector('.result-bar i');
var resultCopy=dr.querySelector('.result-copy');
var resultMeta=dr.querySelector('.result-meta');
if(resultStrong)resultStrong.textContent='50%';
if(resultBar){resultBar.style.width='50%';resultBar.style.background=meterBands[3].color}
if(resultCopy)resultCopy.innerHTML='<strong>Lekker uit de hand</strong>';
if(resultMeta)resultMeta.textContent='Voorbeeld van je dagstand';
meter.appendChild(dr);
}
var optionCard=$('.card[data-stop="bars"]')||$('.card[data-stop="lunch"]');
var oc=onboardingClone(optionCard);
if(oc){
var op=oc.querySelector('.venue-photo');if(op)setStaticOnboardingPhoto(op,'/onboarding-options.webp?v=90','Foto van Café De Morgenster','https://maps.google.com/?q=Caf%C3%A9+De+Morgenster+Oudegracht+323+Utrecht')
var details=oc.querySelector('.alternatives');if(details)details.setAttribute('open','');
options.appendChild(oc);
}
var dash=onboardingClone($('.dashboard'));
if(dash)route.appendChild(dash);
var routeOnly=onboardingClone($('.route-only'));
if(routeOnly)route.appendChild(routeOnly);
}
function updateOnboarding(){
var slides=$$('[data-onboarding-slide]');
slides.forEach(function(s,i){s.classList.toggle('active',i===onboardingStep)});
var dots=$$('#onboardingProgress i');
dots.forEach(function(d,i){d.classList.toggle('active',i===onboardingStep)});
var back=$('#onboardingBack'),next=$('#onboardingNext');
if(back)back.setAttribute('aria-label',onboardingStep===0?'Terug naar naam':'Vorige');
if(next)next.textContent=onboardingStep===slides.length-1?'Ik heb er zin in →':'Volgende';
}
function openOnboarding(){
if(!user)return;
buildOnboardingStills();
onboardingStep=0;
updateOnboarding();
var overlay=$('#onboardingOverlay');
if(overlay)overlay.classList.add('show');
document.body.classList.add('onboarding-open');
}
function closeOnboarding(){
var overlay=$('#onboardingOverlay');
if(overlay)overlay.classList.remove('show');
document.body.classList.remove('onboarding-open');
scrollAppTop();setBottomTabActive('hier');setTimeout(scrollAppTop,80);
}
function onboardingBackToName(){
var previousName=user;
var overlay=$('#onboardingOverlay');
if(overlay)overlay.classList.remove('show');
document.body.classList.remove('onboarding-open');
storeRemove('utca-name');
user='';
renderUser();
renderTimeline();
var input=$('#nameInput');
if(input){
input.value=previousName||'';
setTimeout(function(){
input.focus();
try{input.setSelectionRange(input.value.length,input.value.length)}catch(e){}
},60);
}
}
function bindOnboarding(){
var next=$('#onboardingNext'),back=$('#onboardingBack'),skip=$('#onboardingSkip'),overlay=$('#onboardingOverlay');
if(next)next.onclick=function(){
var total=$$('[data-onboarding-slide]').length;
if(onboardingStep>=total-1){closeOnboarding();return}
onboardingStep++;
updateOnboarding();
};
if(back)back.onclick=function(){
if(onboardingStep===0){
onboardingBackToName();
return;
}
onboardingStep--;
updateOnboarding();
};
if(skip)skip.onclick=closeOnboarding;
var touchStartX=null;
if(overlay){
overlay.addEventListener('touchstart',function(e){
if(e.touches&&e.touches.length===1)touchStartX=e.touches[0].clientX;
},{passive:true});
overlay.addEventListener('touchend',function(e){
if(touchStartX===null||!e.changedTouches||!e.changedTouches.length)return;
var dx=e.changedTouches[0].clientX-touchStartX;
touchStartX=null;
if(Math.abs(dx)<55)return;
if(dx<0&&onboardingStep<4){onboardingStep++;updateOnboarding()}
if(dx>0&&onboardingStep>0){onboardingStep--;updateOnboarding()}
},{passive:true});
}
document.addEventListener('keydown',function(e){
var shown=$('#onboardingOverlay');
if(!shown||!shown.classList.contains('show'))return;
if(e.key==='Escape'){closeOnboarding();return}
if(e.key==='ArrowRight'&&onboardingStep<4){onboardingStep++;updateOnboarding()}
if(e.key==='ArrowLeft'){if(onboardingStep===0){onboardingBackToName()}else{onboardingStep--;updateOnboarding()}}
});
}
function login(){
var input=$('#nameInput'),v=input.value.trim().replace(/\s+/g,' ');
if(!v)return;
user=v.slice(0,24);
storeSet('utca-name',user);
storeRemove('utca-results-finalized');resultsFinalized=false;
currentStop='';
storeRemove('utca-stop');
renderUser();
renderTimeline();
syncState(false);
toast('Hoi '+user+'. Succes ermee.');
setTimeout(function(){openOnboarding()},90);
}
function bind(){
var loginBtn=$('#loginBtn'),nameInput=$('#nameInput'),logout=$('#logout'),rosterToggle=$('#rosterToggle');
if(rosterToggle)rosterToggle.onclick=function(){var w=$('#rosterWrap');if(!w)return;var open=w.classList.toggle('open');rosterToggle.setAttribute('aria-expanded',open?'true':'false')};
if(loginBtn)loginBtn.onclick=login;
if(nameInput)nameInput.addEventListener('keydown',function(e){if(e.key==='Enter'||e.keyCode===13)login()});
if(logout)logout.onclick=function(){
storeRemove('utca-name');storeRemove('utca-results-finalized');resultsFinalized=false;user='';renderUser();renderTimeline();
if(nameInput)nameInput.value='';
setTimeout(function(){if(nameInput)nameInput.focus()},50);
};
$$('.switcher button').forEach(function(button){
button.onclick=function(){
var oldWeatherId=weatherStop[mode].id;
mode=button.getAttribute('data-mode');
storeSet('utca-weather',mode);
applyWeatherTheme();
if(currentStop===oldWeatherId){currentStop=weatherStop[mode].id;storeSet('utca-stop',currentStop)}
ensureNoConsecutiveDuplicate();
renderWeatherSwitcher();
renderTimeline();renderDayResult();renderRoute();renderGroup();
};
});
}
function init(){try{applyWeatherTheme();ensureNoConsecutiveDuplicate();
var journeyCopy=$('#journeyCopy');
if(journeyCopy){
journeyCopy.onclick=function(){
var id=journeyCopy.getAttribute('data-current-stop');
if(id)jumpToStop(id);
};
journeyCopy.onkeydown=function(e){
if(e.key==='Enter'||e.key===' '){
e.preventDefault();
var id=journeyCopy.getAttribute('data-current-stop');
if(id)jumpToStop(id);
}
};
}renderWeatherSwitcher();renderTimeline();renderDayResult();renderRoute();renderGroup();bind();bindOnboarding();bindBottomTabs();renderUser();var boot=$('#bootError');if(boot)boot.classList.remove('show');if(user){setTimeout(scrollAppTop,0);setTimeout(scrollAppTop,120);setTimeout(function(){syncState(true)},0);if(!standaloneMode)setInterval(refreshState,15000)}}catch(e){var bootErr=$('#bootError');if(bootErr)bootErr.classList.add('show');var overlay=$('#loginOverlay');if(overlay)overlay.classList.remove('show');if(window.console&&console.error)console.error(e)}}
if('scrollRestoration' in history)history.scrollRestoration='manual';
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('focus',refreshState);
})();
if ('serviceWorker' in navigator && location.protocol === 'https:') {
window.addEventListener('load', function () {
navigator.serviceWorker.register('/sw.js', {scope: '/'}).catch(function () {});
});
}
