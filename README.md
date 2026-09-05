# UTCA // FÜR DIE MÄNNER

Mobiele webapp voor de vriendendag in Utrecht op **zaterdag 26 september 2026**.

De app is het gezamenlijke draaiboek voor de dag: programma volgen, navigeren, inchecken, zien waar de rest is, alternatieven kiezen en na iedere relevante stop de **Naar de klote-meter** invullen.

**Live:** https://utca26.pages.dev

> Dit is een vrienden-try-out / MVP. De pagina is bewust ingesteld op `noindex` en is bedoeld om via de directe link te gebruiken.

---

## Wat de app doet

- Volledig dagprogramma met tijden, locaties en loopstukken
- **Zon / Regen**-variant met eigen route en accentkleur
- Sticky **Huidige stop / Volgende**-navigatie
- Google Maps-navigatie per locatie
- Eén Google Places-foto per actieve stopkaart, direct boven de locatienaam; wissel je naar een alternatief, dan wisselt de foto automatisch mee
- **Open hele ronde in Google Maps** met actuele route en looptijd
- Drie alternatieven bij wisselbare stops
- **Info** voor locatie-informatie en **Boek** bij gereserveerde locaties
- **Check in ✓**-knop per stop
- Grote delen van een stopkaart en het tijdlijnbolletje werken ook als extra check-in-zone
- Per locatie zichtbaar wie daar aanwezig is
- **Waar is iedereen?** met actuele positie van de groep
- Tik op een deelnemer om direct naar zijn stop te springen
- **Naar de klote-meter** van 1 t/m 5 per relevante stop
- Tussentijdse dagstand en groepsgemiddelde
- Korte meterreactie in de bestaande tone of voice (`Verdacht fris` → `Balzak.`), waarbij score 4 bewust **Ik hier?** blijft
- Bij 6/6 op dezelfde stop verandert de actieve check-in-knop één keer kort naar **Grupo completo ✓**
- Bij de finish verschijnt **EINDUITSLAG** met drie losse scorekaarten en bijbehorende kleurbalken: **THE ABSOLUTE BOLLOCKS** — *ZONDAG BESTAAT NIET*, **DE KLOOTZAK** — *BEST OF BOTH WORLDS* en **THE LIONEL RICHIE** — *EASY LIKE A SONNTAG MORGEN*. **DE KLOOTZAK** is degene wiens eindpercentage het dichtst bij het exacte midden tussen de hoogste en laagste eindscore ligt
- Vijfdelige onboarding bij iedere nieuwe login
- Mobile-first, donkere glass/liquid-interface
- Installeerbaar als **standalone webapp/PWA** op Android (Chrome) en iPhone
- Lokale fallback wanneer de gedeelde backend niet beschikbaar is

---

## Onboarding

Na het invoeren van een naam verschijnt een onboarding met vijf vaste slides:

1. **De dag** — Zon/Regen kiezen en het programma begrijpen
2. **Check-in** — `Check in ✓`
3. **Tussenstand** — Naar de klote-meter
4. **Wisselen** — drie alternatieven op loopafstand
5. **Hele route** — volledige ronde in Google Maps

De slides gebruiken echte onderdelen uit de live interface als still. Niet-relevante onderdelen worden subtiel gedimd zodat de belangrijkste interactie duidelijk blijft zonder de rest van de app onleesbaar te maken.

De terugknop op slide 1 gaat terug naar het naamveld. De ingevoerde naam blijft daarbij alvast ingevuld.

---

## Huidige route-opzet

Belangrijke huidige locaties zijn onder andere:

- Utrecht Centraal
- Kanoverhuur Utrecht
- Café Ledig Erf
- Poolcafé Hart van Utrecht
- De Beurs · Neude
- JEU de Boules Bar Utrecht
- Café De Postillon
- Eetcafé De Poort
- Café De Morgenster
- Broodje Bambi

Voor de lunch bij **Café Ledig Erf** zijn in de Zon-route de drie alternatieven:

- Graaf Floris — Vismarkt 13
- Eetcafé De Vingerhoed — Donkere Gaard 11
- Orloff aan de Kade — Oosterkade 18

Bij regen start het ochtendprogramma met **Café Orloff**. De drie alternatieven daar zijn Café 't Neutje, Graaf Floris en Café de Zaak.

---

## Techniek

De app gebruikt bewust een kleine stack:

- HTML
- CSS
- Vanilla JavaScript
- Cloudflare Pages
- Cloudflare Pages advanced mode via `_worker.js`
- Cloudflare D1 voor gedeelde groepsstatus

Er is geen framework, bundler of build-step nodig.

### Bestanden

```text
/
├── index.html
├── _worker.js
├── manifest.webmanifest
├── sw.js
├── icon-192.png
├── icon-512.png
├── icon-maskable-192.png
├── icon-maskable-512.png
├── apple-touch-icon.png
├── favicon-32.png
├── robots.txt
└── README.md
```

`index.html` bevat de interface, styling, programma-data en client-side logica.

`_worker.js` verzorgt `/api/state`, de D1-koppeling, de Google Places-fotoproxy (`/api/place-photo`), asset-responses, correcte PWA-headers en de `X-Robots-Tag`. De Google API-key blijft server-side als Cloudflare secret en komt niet in de browser of repository terecht.

`manifest.webmanifest` maakt de app voor Chromium herkenbaar als installeerbare webapp met `display: standalone`. De 192/512 px-iconen en maskable varianten worden door Android gebruikt. `sw.js` registreert een lichte service worker met netwerk-eerst navigatie en alleen een offline fallback voor de app-shell; `/api/state` blijft rechtstreeks via het netwerk lopen.

`robots.txt` is een geldige crawler-file. De pagina zelf gebruikt `noindex,nofollow,noarchive`.

---

## Installeren als webapp

De repository bevat nu een volledige Web App Manifest-configuratie voor Android/Chromium én de bestaande iOS-webappflow.

### Android · Chrome

Na deployment en een refresh hoort Chrome de site als app te herkennen:

```text
⋮ → Installeren en snelkoppelingen → App installeren
```

Na installatie opent UTCA met `display: standalone`, dus zonder de normale Chrome-adresbalk. Als op een toestel nog **Snelle link maken** verschijnt, verwijder dan eerst de oude snelkoppeling, laad de site opnieuw in Chrome en wacht enkele seconden totdat Chrome de nieuwe manifest-status heeft verwerkt.

### iPhone

Via **Deel → Zet op beginscherm** blijft de app als webapp te openen. De repository bevat daarnaast een `apple-touch-icon` en iOS-webappmetadata voor een consistente appweergave.

---

## Gedeelde groepsstatus

De backend bewaart per deelnemer:

- naam
- huidige stop
- meterstanden per stop
- gemiddelde score
- tijdstip van laatste update

De D1-tabel wordt automatisch aangemaakt wanneer die nog niet bestaat. Alleen deelnemers die in de afgelopen **48 uur** zijn bijgewerkt worden opgehaald.

### API

```text
GET    /api/state
POST   /api/state
DELETE /api/state?name=<naam>
GET    /api/place-photo?q=<naam+adres>&lat=<lat>&lng=<lng>
GET    /api/place-photo/media?name=<Google-photo-resource>
```

Voorbeeld POST:

```json
{
  "name": "Batman",
  "currentStop": "pool",
  "ratings": {
    "pool": 3
  }
}
```

---

## Cloudflare Pages

1. Koppel de GitHub-repository aan Cloudflare Pages.
2. Gebruik geen build-command; publiceer de repository direct.
3. Maak een D1-database aan.
4. Voeg een D1-binding toe met exact de naam `DB`.
5. Maak in Google Cloud een project met billing en schakel **Places API (New)** in.
6. Maak een Google Maps Platform API-key en beperk die sleutel bij **API restrictions** tot Places API (New).
7. Voeg in Cloudflare Pages onder **Settings → Variables and Secrets** een encrypted secret toe met exact de naam `GOOGLE_MAPS_API_KEY`. Doe dit voor Production en, als je previews gebruikt, ook voor Preview.
8. Redeploy daarna de Pages-projectdeployment.
9. Na iedere push naar `main` publiceert Cloudflare Pages automatisch de nieuwste versie.

Zonder `GOOGLE_MAPS_API_KEY` blijft de app gewoon werken en blijven de fotovakken verborgen; route, check-ins, meter en groepsstatus veranderen niet. De sleutel hoort **nooit** in GitHub of `index.html`. Voor kostenbeheersing is het verstandig in Google Cloud een budgetwaarschuwing en passende quota in te stellen.

`_worker.js` verwacht de database als:

```js
env.DB
```

en voor locatie-foto’s:

```js
env.GOOGLE_MAPS_API_KEY
```

De foto’s worden pas vlak voordat een stop in beeld komt opgevraagd. De app bewaart geen Google photo-resource-names en de worker stuurt fotoresponses met `no-store`. Iedere foto linkt terug naar de individuele bronfoto in Google Maps en toont binnen het fotovak de tekst **Google Maps** als bronvermelding.

---

## Niet indexeren

De app is bedoeld voor gebruik via de directe link en niet voor zoekmachines.

Daarom staan momenteel drie lagen aan:

```html
<meta name="robots" content="noindex,nofollow,noarchive" />
```

```text
X-Robots-Tag: noindex, nofollow, noarchive
```

En een geldige `robots.txt`:

```text
User-agent: *
Disallow:
```

De lege `Disallow` is bewust: crawlers mogen de pagina ophalen zodat ze de `noindex`-instructie kunnen lezen.

Dit is **geen toegangsbeveiliging**. Iedereen met de directe URL kan de app openen.

---

## Zon- en Regenmodus

**Zon** gebruikt lime als primaire accentkleur. **Regen** schakelt de interface-accenten naar blauw.

De **Naar de klote-meter** blijft altijd groen → geelgroen → geel → oranje → rood, omdat die kleuren een eigen semantische betekenis hebben.

---

## Check-ins

Iedere deelnemer voert een voornaam in en kan bij een stop op **Check in ✓** drukken.

Voor makkelijker mobiel gebruik werken ook rustige delen van de stopkaart en het tijdlijnbolletje als check-in-zone. Knoppen zoals **Navigeer**, **Info**, **Boek**, alternatieven en de meter blijven daarvan uitgesloten.

De extra zones kunnen alleen inchecken. Uitchecken gebeurt bewust via de echte **Check in ✓**-knop om onbedoelde taps te voorkomen.

---

## Naar de klote-meter

Bij relevante stops kan iedere deelnemer een score van **1 t/m 5** invullen:

**groen → geelgroen → geel → oranje → rood**

Een score kan opnieuw worden gekozen of worden gewist door dezelfde score nogmaals aan te tikken. De app gebruikt deze scores voor de persoonlijke dagstand en het groepsgemiddelde.

---

## Ontwerpprincipes

De interface is bewust:

- mobile-first
- donker en rustig
- glass / liquid-geïnspireerd
- sterk hiërarchisch
- beperkt in primaire acties
- consistent tussen Zon en Regen
- ontworpen om onderweg en na een paar drankjes snel te begrijpen te zijn

De belangrijkste interactie per stop blijft:

```text
Info / Boek → Check in ✓ → Naar de klote-meter
```

De onboarding geeft alleen het mentale model mee; de rest mag tijdens de dag ontdekt worden.

---

## Huidige status

Dit project is een **vrienden-try-out / MVP**, geen productieplatform.

Er is geen volwaardig accountsysteem of sterke authenticatie. Namen functioneren als lichte identificatie binnen deze specifieke groep. Voor deze use-case is eenvoud belangrijker dan een uitgebreide gebruikers- of rechtenstructuur.

---

## Datum

**UTCA // FÜR DIE MÄNNER**
**Zaterdag 26 september 2026**

## v27 — code cleanup & PageSpeed

Deze versie verandert niets aan functionaliteit, content of vormgeving. Alleen productie-optimalisaties zijn toegepast:

- inline CSS lossless gecomprimeerd en overbodige opmaak-whitespace verwijderd;
- HTML/JavaScript-opmaak compacter gemaakt zonder logica te wijzigen;
- de losse service-worker-registratie samengevoegd tot één scriptblok;
- manifest gecomprimeerd;
- statische app-iconen krijgen een lange browsercache; HTML blijft revalideren;
- service-worker cacheversie verhoogd zodat bestaande installaties de nieuwe build oppakken;
- Cloudflare Worker opgeschoond zonder de D1/API-contracten te wijzigen.

De PWA-installatie voor iPhone en Android blijft hetzelfde als in v26.


## v28 — iPhone safe status bar + retained PageSpeed build

Deze versie bouwt rechtstreeks voort op de opgeschoonde v27 en verandert niets aan programma, functionaliteit of vormgeving van de app zelf.

- iPhone Home Screen-webapp gebruikt nu een niet-transparante zwarte iOS-statusbalk, zodat de bovenste appregel niet meer onder de klok, notch of Dynamic Island terechtkomt;
- dit is Apple-specifieke webappmetadata en verandert de Android-layout niet;
- de bestaande standalone PWA-installatie voor Android blijft ongewijzigd;
- de v27 CSS/JavaScript/Cloudflare/PageSpeed-optimalisaties zijn behouden;
- service-worker cacheversie verhoogd zodat reeds geïnstalleerde webapps de nieuwe shell schoon kunnen ophalen.

## v45 — subtiele engagementmomenten

Deze versie bouwt rechtstreeks voort op de aangeleverde v44 en voegt alleen drie lichte groepsmomenten toe, zonder aparte gamificationlaag:

- meterkeuzes geven een korte reactie met de bestaande vijf labels; **Ik hier?** blijft exact behouden;
- zodra alle zes deelnemers op dezelfde stop staan, toont de bestaande **Check in ✓**-knop één keer kort **Grupo completo ✓**;
- bij check-in op de finish verschijnt een compacte einduitslag op basis van de al aanwezige D1-meterdata, inclusief **De balansman**: degene die qua eindpercentage het dichtst bij het midden tussen de hoogste en laagste score ligt.

Er zijn geen nieuwe backendvelden, API-routes of extra permanente UI-knoppen toegevoegd.


## Interface en gedrag

De losse **HOE WERKT DEZE APP +**-uitleg in het hoofdscherm is verwijderd. De onboarding is nu de enige tutorial/uitleglaag en verschijnt na het invoeren van een naam.


## Routevoortgang

De voortgang boven de route volgt nu **de huidige ingecheckte stop in de route**, niet het aantal stops waarop eerder daadwerkelijk is ingecheckt.

Voorbeeld:
- Utrecht Centraal = 1 van 11
- Kano / regenactiviteit = 2 van 11
- Lunch = 3 van 11
- ...
- Utrecht Centraal aan het einde = 11 van 11

Een stop overslaan verandert dit niet: check je direct bij lunch in, dan staat de voortgang op **3 van 11**. Ga je daarna terug en check je bij kano in, dan wordt dit weer **2 van 11**.


## Performance / cleanup

- Oude verborgen hero-copy, Henny-intro en niet meer gebruikte statuschips verwijderd.
- De dubbele statische timeline-fallback verwijderd; de route wordt één keer door JavaScript opgebouwd.
- Niet meer gebruikte `liveState`, `walkChip`, `live-mode`, `shared`-status en legacy `intox`-payload verwijderd.
- De verborgen dashboarddata blijft alleen aanwezig omdat onboarding-slide 5 die gebruikt.
- Service-worker cache verhoogd naar `utca-shell-v11` zodat oude shell-cache wordt opgeschoond.

- v61: voortgangsberekening vereenvoudigd naar de actuele routepositie; onnodige telling over alle eerdere states verwijderd.
- v61: bepaling van **DE KLOOTZAK** gebruikt nu één lineaire scan in plaats van een volledige sortering.
- v61: service-worker cache verhoogd naar `utca-shell-v12`.

- v62: onboarding modal weer compacter gemaakt (kortere panelhoogte, kleinere preview-containers, minder verticale spacing).
- v62: topregel visueel aangescherpt: `UTCA // FÜR DIE MÄNNER` onder uitgelijnd met de naam-pill en lettergrootte subtiel vergroot.
- v62: service-worker cache verhoogd naar `utca-shell-v13` zodat de onboarding-aanpassingen sneller zichtbaar zijn.

- v63: topregel opnieuw opgebouwd als compacte, optisch gecentreerde app-bar; merkblok en naam-pill zijn nu proportioneel op elkaar afgestemd.
- v63: merknaam en datum hebben nu een duidelijke typografische hiërarchie in plaats van twee even zware regels.
- v63: `html`, theme-color en standalone safe-area gebruiken dezelfde donkere appkleur (`#0c0d0e`) voor een rustiger overgang rond notch/Dynamic Island/punch-hole.
- v63: onboarding previews nog iets compacter gemaakt zonder inhoud of flow te wijzigen.
- v63: service-worker cache verhoogd naar `utca-shell-v14`.

- v64: de effen safe-area overlay uit v63 verwijderd. De echte app-background loopt weer door achter de iPhone-notch / Dynamic Island in standalone mode.
- v64: `viewport-fit=cover` en `black-translucent` behouden voor iOS edge-to-edge gedrag; `theme-color` blijft aanwezig voor Android/Chrome/PWA statusbar-integratie.
- v64: extra `color-scheme`/html-background override uit v63 teruggedraaid omdat die een zichtbare donkere bovenrand kon veroorzaken.
- v64: service-worker cache verhoogd naar `utca-shell-v15`.

- v65: statusbar/notch-surface niet langer bijna-zwart `#0c0d0e`, maar afgestemd op de echte bovenste app-background: Zon `#11150f`, Regen `#0d1518`.
- v65: HTML-underlay, CSS background, `<meta name="theme-color">` en PWA manifest gebruiken dezelfde surfacekleur. Dit voorkomt een zichtbare zwarte scheidslijn op iPhone-notch/Dynamic Island en Android statusbars/punch-holes voor zover de browser/OS die zone laat tinten.
- v65: theme-color wordt live meegewisseld met Zon/Regen.
- v65: service-worker cache verhoogd naar `utca-shell-v16`.

## v66 — EINDUITSLAG copy & hiërarchie

- Alleen het **EINDUITSLAG**-blok is visueel aangepast; de berekening en overige functionaliteit zijn ongewijzigd.
- Nieuwe labels en subtitels:
  - **THE ABSOLUTE BOLLOCKS** — *ZONDAG BESTAAT NIET*
  - **DE KLOOTZAK** — *BEST OF BOTH WORLDS*
  - **THE LIONEL RICHIE** — *EASY LIKE A SONNTAG MORGEN*
- De subtitels staan als compacte secundaire tekst onder de groene resultaatslabels.
- De bestaande responsive scorekaarten, namen, percentages en voortgangsbalken blijven intact.

## v67 — conservative code cleanup

Deze release bouwt rechtstreeks voort op v66 en verandert **geen design, route, data, berekeningen, interacties of backendlogica**. Omdat behoud van gedrag expliciet belangrijk is, is de cleanup bewust conservatief uitgevoerd.

- niet-functionele inline codecomment verwijderd;
- trailing whitespace in `index.html` opgeschoond;
- PWA asset-versies gelijkgetrokken naar `v=67`;
- service-worker shell-cache verhoogd naar `utca-shell-v17`, zodat bestaande homescreen-installaties de nieuwe app-shell schoon kunnen ophalen;
- README bijgewerkt naar de actuele EINDUITSLAG-copy en huidige release;
- alle app-iconen, inclusief Android maskable icons en het iOS touch icon, zijn **ongewijzigd** overgenomen uit v66;
- `_worker.js`, D1/API-contracten en alle client-side functies zijn inhoudelijk ongewijzigd.



## v68 — Google Places-foto’s in bestaande stopkaarten

Deze release bouwt rechtstreeks voort op v67. De bestaande kleuren, glass/liquid-stijl, tijdlijn, Zon/Regen-thema’s, teksten, alternatieven, navigatie, check-ins, groepsstatus, Naar de klote-meter en EINDUITSLAG zijn niet herontworpen.

- boven de bestaande locatienaam van iedere actieve stop staat één afgeronde venuefoto;
- de foto wordt opgehaald via **Google Places API (New) / Place Photos (New)**;
- de Google API-key staat uitsluitend server-side als Cloudflare secret `GOOGLE_MAPS_API_KEY`;
- foto’s laden lazy via `IntersectionObserver`, zodat niet alle stops direct netwerkverkeer veroorzaken;
- als bij een wisselbare stop een alternatief wordt gekozen, rendert de kaart opnieuw en wordt automatisch de foto van die nieuwe venue opgehaald;
- als Google Places geen foto teruggeeft of de key niet is ingesteld, wordt geen leeg fotovak getoond en blijft de oude v67-layout intact;
- de foto bevat een zichtbare **Google Maps**-bronvermelding en opent bij tikken de bronfoto in Google Maps wanneer Google die link meestuurt;
- Google photo-resource-names worden niet opgeslagen of gecachet;
- PWA assetversie verhoogd naar `v=68` en service-worker shell-cache naar `utca-shell-v18`.

### Google Maps Platform aandachtspunten

Gebruik van Places-foto’s valt onder de actuele Google Maps Platform-voorwaarden. Voor een publieke/production inzet moet je ook voldoen aan Google’s vereisten voor attributie en de vereiste Terms of Use / Privacy Policy voor jouw toepassing.

---

## v69 — smoother timeline & check-in motion

Deze release bouwt rechtstreeks voort op v68 en **verandert geen route-data, kleuren, locaties, Google Places-foto-logica, Naar de klote-meter, D1/API-logica of overige functionaliteit**. De bestaande interface blijft hetzelfde; alleen de overgang tussen bestaande states is vloeiender gemaakt.

### Nieuwe motion-laag

- De verticale tijdlijn springt niet meer direct naar de volgende status: het lime/blauwe voortgangsdeel **vult zichtbaar van de huidige stop richting de volgende stop**.
- Bij aankomst krijgt het nieuwe tijdlijnbolletje een korte, subtiele spring/pulse en krijgt de vorige stop zijn vinkje met een kleine pop-animatie.
- De horizontale `2 van 11 afgelegd`-progressbar loopt rustiger naar zijn nieuwe positie.
- `Check in ✓` krijgt een korte press/morph in plaats van onmiddellijk van donker naar actief te springen.
- Als check-in informatie een kaart hoger of lager maakt, **expandeert of krimpt de bestaande kaart geleidelijk**; onderliggende kaarten worden daardoor vanzelf soepel meegeschoven.
- Namen/chips die door een check-in in de kaart verschijnen, komen met een korte fade/slide binnen.
- De Naar de klote-meter behoudt exact dezelfde werking en kleuren, maar de geselecteerde score krijgt een kleine spring-transition.
- `prefers-reduced-motion` wordt gerespecteerd: gebruikers die systeemanimaties hebben verminderd krijgen de directe, niet-geanimeerde state-wissel.

De motion is met CSS en vanilla JavaScript uitgevoerd; er is **geen React Native, framework, animatie-library of extra build-step** toegevoegd.

---

## v70 — cinematic timeline draw + smoother check-in

Deze release vervangt alleen de motionlaag uit v69. **Design, kleuren, route-data, locaties, alternatieven, Google Places-foto's, Naar de klote-meter, EINDUITSLAG, D1/API-contracten en overige appfunctionaliteit blijven intact.**

### Indiana-Jones-achtige tijdlijn

- Bij een check-in naar een volgende stop verschijnt de nieuwe lime route **niet vooraf al ingevuld**.
- De reeds afgelegde route blijft zichtbaar; alleen het nieuwe traject blijft eerst grijs.
- Na de check-in/card-transition vertrekt een kleine lime tracer vanaf de huidige tijdlijnnode en **tekent de lijn fysiek van begin tot eind** naar de volgende stop.
- De tracer heeft een subtiele heldere kop zodat de beweging te volgen is, zonder het bestaande minimalistische ontwerp te veranderen.
- Het traject duurt afhankelijk van de afstand ongeveer **1,25–1,95 seconde**; bij het overslaan van meerdere stops loopt dezelfde tracer door over het hele nieuwe traject.
- Pas wanneer de tracer de bestemming bereikt, wordt het nieuwe traject permanent lime, springt de nieuwe node subtiel in en krijgt de vorige node zijn vinkje.
- In Regen-modus gebruikt dezelfde motionlaag de bestaande blauwe accentkleur.

### Check-in motion

- De bestaande `Check in ✓`-knop krijgt eerst een korte tactiele compressie voordat de state wordt vastgelegd.
- De actieve kleur vloeit daarna geleidelijk in, in plaats van op dezelfde paint direct te verschijnen.
- De eigen deelnemer wordt visueel direct in de nieuwe stopkaart getoond terwijl de bestaande backend-sync ongewijzigd doorloopt. Daardoor kan de kaart meteen vloeiend expanderen zonder op de netwerkresponse te wachten.
- Kaart-expansie/collapse is verlengd en gebruikt dezelfde rustige easing als de rest van de interface.
- De netwerkpayload, D1-opslag en gedeelde deelnemerslogica zijn niet gewijzigd; de onmiddellijke eigen chip is alleen een optimistische UI-weergave.

### Techniek

- Vanilla JavaScript + Web Animations API en CSS; **geen React Native of extra dependency**.
- `prefers-reduced-motion` blijft gerespecteerd.
- PWA assetversie verhoogd naar `v=70` en service-worker shell-cache naar `utca-shell-v20`, zodat bestaande homescreen-installaties de nieuwe motionlaag ophalen.
- Google Places-foto's blijven optioneel. Zonder `GOOGLE_MAPS_API_KEY` werkt de hele app en alle motion gewoon; alleen de venuefoto's blijven verborgen.
