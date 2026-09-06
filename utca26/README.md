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
