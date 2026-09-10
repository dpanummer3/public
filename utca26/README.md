## v97.4 — v90 timeline rail restore

Deze release is bewust geen nieuwe timeline-iteratie. De timeline-rail is teruggezet naar de bewezen v90-opbouw met segmenten die exact op elkaar aansluiten. De latere `content-visibility`-optimalisatie is voor timeline-rijen verwijderd omdat die mobiele/Safari rendering kon verstoren. De rail blijft overal één neutrale kleur (`#31353a`); alleen de nodes tonen status. Alle overige v97.1-functionaliteit, reserveringstijden, onboarding en performance-optimalisaties blijven ongewijzigd. CSS cache-buster: **v97.4**; service-worker shell: **utca-shell-v48**.

## v97.1 — bugfix

Hotfix op v97. Alleen de foutieve aanroep naar `warmOnboardingAssets()` is verwijderd. De v97-prefetch van onboardingbeelden blijft intact. Om te voorkomen dat een browser/PWA de defecte v97-JavaScript uit cache blijft gebruiken, heeft alleen `app.js` cache-buster `v=97.1` gekregen en is de service-worker shell-cache verhoogd naar `utca-shell-v46`. Design, functionaliteit, tijden, containers, animaties en onboardingtekst zijn verder ongewijzigd.

## v97 — extra speed pass + onboarding route stat

Deze release bouwt direct voort op v96 en verandert geen functionaliteit of layoutstructuur. De app blijft werken zoals v96, maar met een extra optimalisatieslag voor laadsnelheid, runtime caching en onboarding. De vaste reserveringen blijven exact **Kanoverhuur 10:00–11:45**, **Pool 14:00–15:00**, **JEU 17:00–18:00** en **De Poort 19:00–21:00**.

- Onboarding slide **5 · Hele route** toont nu in de twee bestaande dashboard-tegels **109 min / HELE RONDE LOPEN** en **11 stops / ALLES GEREGELD**. De tegelgrootte en layout blijven identiek aan v96; alleen de tekst is aangepast.
- Onboarding-beelden worden na de eerste paint alvast rustig voorverwarmd in idle-tijd, zodat de onboarding sneller opent zonder de eerste render te blokkeren.
- Lokale onboarding-WebP's en manifest worden meegenomen in de shell-cache; shell-cacheversie verhoogd naar `utca-shell-v45`.
- Service worker gebruikt voor statische assets een snelle stale-while-revalidate-strategie en bewaart `/api/place-photo` responses in een aparte runtime cache voor snellere herhaalbezoeken.
- Venuefoto-`img` krijgt vaste `width`/`height` mee om layout-instabiliteit verder te beperken; lazy venuefoto's worden iets eerder gepakt via ruimere observer-marge.
- Extra `content-visibility:auto` toegevoegd voor zware, offscreen secties onder de timeline.
- Assetversies verhoogd naar **v97** voor CSS/JS/manifest en onboardingbeelden.

Net als v96 is deze release statisch gevalideerd; een echte Lighthouse/PageSpeed-score moet nog op de live productie-URL gemeten worden.

## v96 — performance + motion polish

Deze release trekt de twee vorige iteraties technisch recht zonder de inhoud of UX-logica te veranderen. De vaste reserveringen blijven exact **Kanoverhuur 10:00–11:45**, **Pool 14:00–15:00**, **JEU 17:00–18:00** en **De Poort 19:00–21:00**; de boekknoppen en overige itinerary-functionaliteit zijn ongewijzigd.

- JavaScript compacter gemaakt en dynamische timeline-interacties samengebracht via event delegation, zodat her-renders geen nieuwe set kliklisteners hoeven op te bouwen.
- Eén motion-systeem voor snelle feedback (`140ms`), normale UI-overgangen (`220ms`) en panel/sheet-beweging (`320ms`) met consistente easing.
- Subtiele press-feedback op interactieve controls; vloeiende open/dicht-transities voor deelnemers, alternatieven, login, onboarding, toast en bottom navigation.
- Weer- en locatiekeuzes gebruiken waar ondersteund de View Transition API, met een normale fallback op browsers zonder ondersteuning.
- Offscreen timeline-onderdelen gebruiken `content-visibility:auto` waar ondersteund om onnodig renderwerk te beperken.
- Polling wordt overgeslagen zolang het tabblad verborgen is.
- `background-attachment: fixed` verwijderd om mobiel scrollen/compositing lichter te houden.
- Service worker cachet de statische CSS/JS-shell; versie: `utca-shell-v44`.
- `prefers-reduced-motion` wordt gerespecteerd: beweging en smooth scrolling vallen dan terug naar direct gedrag.
- CSS assetversie: `v=96`; JavaScript assetversie: `v=96`.

De optimalisaties zijn statisch gevalideerd; deze release claimt bewust geen specifieke Lighthouse/PageSpeed-score zonder een meting op de uiteindelijke productie-URL.

## v95 — sticky chrome consistency

Deze release gebruikt de compacte sticky statusbalk als visuele basis voor de onderste navigatie.

- Onderste navigatie: dezelfde glass background, border, blur, shadow en 24px buitenradius als de sticky statusbalk.
- Mobiele zijmarges sluiten nu exact aan op de 11px contentmarge; vanaf grotere schermen volgt de navigatie de 14px appmarge met een max-width van 560px.
- Actieve tab gebruikt dezelfde lime primary treatment, rand en liftschaduw als de primaire knop in de sticky statusbalk.
- Hoogte en interne padding zijn opnieuw uitgebalanceerd voor vier tabs zonder wijzigingen aan labels, iconen of navigatiegedrag.
- Reserveringsankers uit v94 blijven ongewijzigd.
- CSS assetversie: `v=95`; service-worker shell-cache: `utca-shell-v43`.

# DE RONDE

Mobiele webapp/PWA voor de vriendendag in Utrecht op **26 september 2026**.

De app bevat het dagprogramma, actuele stop, check-ins, Google Places-foto's, alternatieven, route, deelnemersoverzicht, de **Naar de klote-meter**, **KLOTENTUSSENSTAND** en **KLOTENEINDSTAND**.

## v93 — cleanup + PageSpeed

Deze release bouwt rechtstreeks voort op v92 en verandert **geen design of functionaliteit**.

Aangepast:

- `index.html` blijft bewust netjes ingesprongen en leesbaar in **View Page Source**.
- Dubbele `.journeybar`-CSS is samengevoegd tot één regelset.
- Ongebruikte CSS-variable `--bg` verwijderd.
- Overbodige whitespace opgeschoond zonder selectors of waarden te wijzigen.
- Alle PNG-appiconen zijn **lossless opnieuw gecomprimeerd**; de pixels zijn identiek aan v92.
- PWA assetversie verhoogd naar `v=93`.
- Service-worker shell-cache verhoogd naar `utca-shell-v41`.
- Oude releasehistorie uit deze README verwijderd zodat de repository kleiner en overzichtelijker blijft.

De JS-logica, Cloudflare Worker, Google Places-logica, D1-contracten en onboardingbeelden zijn inhoudelijk ongewijzigd.

## Stack

- HTML
- CSS
- Vanilla JavaScript
- Cloudflare Pages
- Cloudflare Pages advanced mode via `_worker.js`
- Cloudflare D1
- Google Places API (New)
- PWA/service worker

Er worden geen frameworks, bundlers of externe JavaScript-libraries gebruikt.

## Bestanden

```text
/
├── index.html
├── app.css
├── app.js
├── _worker.js
├── manifest.webmanifest
├── sw.js
├── onboarding-checkin.webp
├── onboarding-options.webp
├── apple-touch-icon.png
├── favicon-32.png
├── icon-192.png
├── icon-512.png
├── icon-maskable-192.png
├── icon-maskable-512.png
├── robots.txt
└── README.md
```

## Wat de app doet

- Zon/Regen-route
- Sticky huidige-stopkaart
- Compacte bottom navigation
- 11 stops met tijden en loopinformatie
- Google Maps-navigatie per stop
- Eén Google Places-foto per locatie
- Tik op een foto om de exacte locatie in Google Maps te openen
- Google-foto wisselt mee wanneer een alternatief wordt gekozen
- Foto's worden slim lazy-loaded
- Bestaande foto's worden niet opnieuw geladen bij meterkliks of check-in
- Check-in per stop
- Zichtbaar wie op welke stop aanwezig is
- Naar de klote-meter 1–5
- Live deelnemersstatus via D1
- KLOTENTUSSENSTAND
- KLOTENEINDSTAND
- Vijfdelige onboarding
- Installeerbaar als homescreen-webapp/PWA

## Google Places-foto's

De browser krijgt de Google API-key nooit te zien. `_worker.js` gebruikt de server-side Cloudflare secret:

```text
GOOGLE_MAPS_API_KEY
```

Benodigde Google Cloud-configuratie:

1. Billing actief.
2. **Places API (New)** ingeschakeld.
3. API-key maken.
4. API-key beperken tot **Places API (New)**.
5. In Cloudflare Pages toevoegen als **Secret** met naam `GOOGLE_MAPS_API_KEY`.
6. Daarna opnieuw deployen.

De app gebruikt:

```text
GET /api/place-photo
GET /api/place-photo/media
```

Place IDs mogen lokaal worden onthouden voor snellere vervolgaanvragen. Google photo-resource-names en de Google-foto zelf worden niet permanent in de app opgeslagen.

## Cloudflare D1

Maak een D1 database aan en voeg aan het Pages-project deze binding toe:

```text
Name: DB
Type: D1 database
```

De tabel wordt door `_worker.js` automatisch aangemaakt wanneer dat nodig is.

De state-API is:

```text
GET    /api/state
POST   /api/state
DELETE /api/state?name=<naam>
```

## Deployment

De repository kan rechtstreeks door Cloudflare Pages worden gepubliceerd.

- Build command: leeg
- Build output: `.`
- Production branch: `main`
- D1 binding: `DB`
- Secret voor foto's: `GOOGLE_MAPS_API_KEY`

Na een nieuwe versie kan een geïnstalleerde webapp eenmaal volledig gesloten en opnieuw geopend worden zodat de nieuwe service-worker cache direct actief wordt.

## Performance-opzet

De app is bewust licht gehouden:

- geen framework
- geen externe fonts
- CSS en JavaScript als aparte cachebare bestanden
- kleine critical CSS inline voor de eerste login-paint
- `app.js` laadt met `defer`
- venuefoto's laden pas na login
- huidige/volgende relevante foto's krijgen prioriteit
- overige venuefoto's worden lazy-loaded
- onboardingbeelden zijn lokale WebP-assets
- statische assets krijgen via `_worker.js` langdurige immutable caching
- navigatie gebruikt network-first met een lichte offline fallback

## Privacy / indexing

De app staat bewust op:

```text
noindex,nofollow,noarchive
```

Daardoor is een lage Lighthouse SEO-score niet hetzelfde als een technisch probleem: openbare zoekmachine-indexering is voor deze MVP bewust uitgeschakeld.
