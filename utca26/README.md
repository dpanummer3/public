# UTCA // FÜR DIE MÄNNER

## v87 — PageSpeed without design/function changes

Deze release richt zich uitsluitend op de Lighthouse/PageSpeed-waarschuwingen van de eerste login-load. Design, route, check-ins, Naar-de-klote-meter, Places-foto's na login, bottom navigation, D1 en overige functionaliteit blijven gelijk.

- Kleine **critical CSS** voor het login-scherm staat inline zodat de eerste zichtbare interface niet meer hoeft te wachten op het volledige stylesheet.
- `app.css` wordt daarna parallel als preload/stylesheet geladen; de volledige app gebruikt exact dezelfde bestaande CSS zodra die klaar is.
- Google Places-foto's worden op het login-scherm niet meer achter de overlay opgehaald. Ze starten pas nadat een gebruiker is ingelogd. Dit voorkomt onzichtbare image-downloads tijdens de Lighthouse initial-load en pakt de audit **Improve image delivery** aan.
- De bottom-tab init leest op het login-scherm geen layout meer uit, waardoor een onnodige initiële forced reflow is verwijderd.
- De service-worker install-shell is teruggebracht tot alleen HTML/CSS/JS; app-iconen worden niet meer onnodig tijdens de eerste service-worker-install in de cache getrokken.
- `app.css` en `app.js` blijven immutable/cachebaar en de source blijft netjes opgesplitst en leesbaar.
- PWA-assets naar `v=87`; shell-cache naar `utca-shell-v35`.
- `noindex,nofollow,noarchive` blijft bewust staan. Daardoor kan de Lighthouse **SEO**-score lager blijven; dat is voor deze besloten vrienden-MVP geen PageSpeed-fout.

## v86 — clean source, PageSpeed-pass & klotenstanden

- De scorecontainer heet tijdens de dag **KLOTENTUSSENSTAND** en na **KLAAR** **KLOTENEINDSTAND**. De bottom-tab blijft bewust **Tussenstand**, zodat de navigatie kort en duidelijk blijft.
- `index.html` is opnieuw netjes semantisch genest en ingesprongen voor een rustige **View Page Source**. De originele HTML/SVG-attributen blijven daarbij exact behouden.
- Inline CSS/JavaScript blijft uit `index.html`: styling staat in `app.css`, logica in `app.js`, beide met `defer`/lange immutable cache voor snelle herhaalbezoeken.
- Alleen verouderde release-comments zijn uit de runtime-CSS verwijderd; geen design- of functiewijzigingen.
- Geen framework, dependency of extra netwerklaag toegevoegd; check-ins, Places-foto's, meter, D1 en navigatie blijven intact.
- PWA-assets naar `v=86`; shell-cache naar `utca-shell-v34`.

## v85 — compactere onboarding spacing

- De vijf onboarding-containers houden **exact dezelfde responsive afmetingen per device**; er is geen slide-afhankelijke hoogte toegevoegd.
- De totale onboarding-container is subtiel **14 px compacter** gemaakt, zodat de uitlegtekst dichter bij de navigatieknoppen staat.
- De bovenpadding van de onboarding-footer is met **3 px** verkleind; knophoogtes, safe-area, beelden en typografie blijven gelijk.
- Op kleinere/lagere telefoons wordt dezelfde reductie consequent toegepast, zonder de content te laten verspringen.
- Geen wijzigingen aan appfunctionaliteit, Google Places, check-ins, meter, timeline, bottom navigation of backend.
- Assets naar `v=85`; service-worker shell-cache naar `utca-shell-v33`.

## v84 — clean source + cachebare CSS/JS

- `index.html` is opgeschoond van circa **117 KB naar circa 12 KB** en bevat nu vooral nette, geneste HTML. Daardoor is **View Page Source** veel overzichtelijker.
- De bestaande styling staat ongewijzigd in `app.css`; één CSS-regel per selector/block houdt het bestand compact maar leesbaar.
- De bestaande clientlogica staat ongewijzigd in `app.js` en wordt met `defer` parallel met de HTML geladen. Geen framework of bundler toegevoegd.
- `app.css` en `app.js` krijgen via Cloudflare een **1 jaar immutable browsercache** met versiequery `v=84`. Na de eerste load hoeven die bestanden dus bij normale herhaalbezoeken niet opnieuw gedownload te worden.
- De service-worker shell bevat de twee kritieke app-assets ook voor de offline/PWA-fallback.
- Eerste HTML-response is veel kleiner; CSS en JavaScript kunnen ondertussen parallel worden opgehaald. Dit verlaagt parsewerk en verbetert vooral herhaalbezoeken zonder design of functionaliteit te wijzigen.
- De live Google Places-foto-optimalisaties, no-reload bij meter/check-in, statische onboardingfoto's, bottom navigation en sticky header blijven exact zoals in v83.
- `_worker.js`, `app.js`, `sw.js` en manifest zijn op syntax/validiteit gecontroleerd.
- PWA-assets naar `v=84`; shell-cache naar `utca-shell-v32`.

## v83 — bottom navigation gelijkgetrokken met sticky header

- De onderste navigatie behoudt exact dezelfde structuur, afmetingen, iconen en interactie.
- Alleen de **glass/transparency-laag** is subtiel gelijkgetrokken met de bovenste sticky `HUIDIGE STOP / VOLGENDE`-header.
- Bottom pill en losse Maps-cirkel gebruiken nu dezelfde `rgba(20,22,23,.68)` achtergrond, `saturate(120%) blur(30px)` en dezelfde rustigere schaduw als de sticky header.
- De actieve lime/blauwe tabstate, safe-area, scrolltargets en functionaliteit zijn ongewijzigd.
- Geen JavaScript- of backendwijzigingen; dit is bewust alleen een kleine CSS-consistency update.
- PWA-assets naar `v=83`; shell-cache naar `utca-shell-v31`.

## v82 — check-in zonder foto-reload + pagespeed cleanup

- **Check in ✓** bouwt de tijdlijn niet meer opnieuw op. Alleen de bestaande DOM-states worden bijgewerkt: actieve kaart, linker tijdlijn, check-in knop, aanwezige deelnemers, voortgang en HUIDIGE/VOLGENDE.
- Daardoor blijft het bestaande Google Places-`<img>` element bij check-in en uitchecken intact: de foto knippert niet en wordt niet opnieuw opgevraagd.
- De huidige en volgende venuefoto worden na de state-wissel alleen geprioriteerd als ze nog niet geladen waren. Een reeds geladen foto blijft onaangeroerd.
- Het invoeren/wissen van de Naar-de-klote-meter behoudt de v81 optimalisatie en rerendert de foto evenmin.
- Venue wisselen, Zon/Regen wisselen en andere wijzigingen die de locatie-inhoud echt veranderen mogen de tijdlijn nog wel opnieuw opbouwen.
- PageSpeed: de twee onboarding-WebP's worden niet meer op de eerste pageload gepreload of in de install-kritische service-worker shell opgehaald. Ze worden pas geladen wanneer de onboarding wordt opgebouwd na login, ruim vóór slide 2/4 in beeld komt.
- De statische onboarding-WebP's krijgen via `_worker.js` langdurige immutable browsercache. Google Places-media blijft bewust buiten deze cachelogica.
- Geen framework/dependency toegevoegd; ontwerp, backend/D1 en Google Places API-contract blijven intact.
- PWA-assets naar `v=82`; shell-cache naar `utca-shell-v30`.

## v81 — meter-updates zonder foto-reload

- Een klik op de **Naar de klote-meter** rerendert niet langer de volledige tijdlijn. Alleen de gekozen meterknop, scoretekst en meter-copy worden in-place bijgewerkt.
- Daardoor blijft de bestaande Google Places-afbeelding in dezelfde DOM-node staan en wordt hij niet opnieuw opgevraagd of opnieuw ingefaded wanneer je een cijfer kiest of weer uitzet.
- Ook periodieke groepsupdates vervangen de tijdlijn niet meer. Alleen de deelnemerschips op de relevante stopkaarten worden bijgewerkt. Dat voorkomt onnodige foto/API-reloads bij de 15-seconden sync.
- Check-in en venue-wissels blijven de tijdlijn wel opnieuw renderen waar dat functioneel nodig is.
- Live tussenstand en groepsinformatie blijven direct bijgewerkt; backend/D1-contracten zijn niet gewijzigd.
- PWA-assets naar `v=81`; shell-cache naar `utca-shell-v29`.

## v80 — strakkere onboarding + verdere cleanup

- Slide 2 en slide 4 behouden de vaste lokale WebP-foto’s uit v79, maar de onboarding-compositie is iets strakker gemaakt: minder loze padding, rustiger marges en een betere focus/crop binnen de bestaande kaart.
- De live app en live Google Places-foto’s zijn visueel en functioneel niet gewijzigd.
- Oude placeholder-CSS voor onboardingfoto’s verwijderd; die code werd sinds v79 niet meer gebruikt.
- De helper voor vaste onboardingfoto’s is compacter gemaakt zonder de werking te veranderen.
- Geen framework, dependency of nieuwe runtimecode toegevoegd.
- PWA-assets naar `v=80`; shell-cache naar `utca-shell-v28`.

## v79 — onboardingfoto's vast en direct zichtbaar

- Onboarding **slide 2 / Check-in** gebruikt nu een vaste lokale crop van de door jou gekozen **Kanoverhuur Utrecht**-foto. Daardoor staat die preview direct in beeld en wacht hij niet meer op de Places API.
- Onboarding **slide 4 / Wisselen** gebruikt nu een vaste lokale crop van de door jou gekozen **Café De Morgenster**-foto. Ook deze preview staat daardoor instant in beeld.
- Beide onboardingfoto's zijn gecomprimeerde lokale WebP-assets en worden in de `<head>` al gepreload voor snellere zichtbaarheid.
- De live Google Places-foto's in de echte stopkaarten blijven verder ongewijzigd en lazy/direct geladen zoals in v78.
- Kleine cleanup: vaste onboardingfoto's lopen nu via één compacte helperfunctie in plaats van losse placeholderlogica.
- PWA-assets naar `v=79`; shell-cache naar `utca-shell-v27`.

## v78 — snellere Places-foto’s + rustige onboarding-stills

- De bestaande stopkaarten en het design zijn ongewijzigd; alleen de fotoloading en onboarding-preview zijn geoptimaliseerd.
- De huidige en eerstvolgende stop starten hun foto-opvraag direct; overige foto’s blijven demand-based en beginnen eerder wanneer je ernaartoe scrollt.
- Google Place IDs worden lokaal bewaard (`utca-placeids-v1`). Google staat langdurige opslag van Place IDs toe; Google-foto’s en photo-resource-names worden niet opgeslagen.
- Na de eerste succesvolle lookup kan een volgende sessie de preciezere Place Details-route gebruiken in plaats van opnieuw een Text Search te doen.
- Place Photos worden op maximaal 900×420 px aangevraagd, passend bij het mobiele fotovak en lichter dan de eerdere 1200×720 response.
- Dubbele gelijktijdige aanvragen voor dezelfde zichtbare locatie worden binnen dezelfde pagina samengevoegd.
- Onboarding slide 2 (Kanoverhuur) gebruikt dezelfde live Google Places-foto en krijgt hoge laadprioriteit.
- Onboarding slide 4 is bewust API-onafhankelijk gemaakt met een vaste, lokale UI-preview. Een Google Places-foto is niet permanent in de repository opgeslagen, omdat Google Places-content niet als statisch asset mag worden gebundeld.
- De beeldfade is verkort van 280 ms naar 120 ms zodat een ontvangen foto vrijwel direct zichtbaar wordt.
- PWA-assets naar `v=78`; shell-cache naar `utca-shell-v26`.
- Geen framework of nieuwe dependency toegevoegd; HTML/CSS/vanilla JS blijft de architectuur.

## v77 — Tussenstand / Eindstand

- Bottom navigation is nu **Hier · Tussenstand · De rest**; de middelste tab springt rechtstreeks naar het scoreblok.
- Het voormalige **Einduitslag**-blok is gedurende de dag zichtbaar als **Tussenstand** en toont live de actuele percentages uit de Naar-de-klote-meter.
- Op de laatste stop blijft het blok **Tussenstand** totdat op **KLAAR** wordt gedrukt; daarna verandert de kop in **Eindstand** en wordt naar het blok gescrold.
- De drie bestaande uitslagkaarten en labels blijven visueel intact en worden met de actuele scores bijgewerkt.
- De losse Google Maps-knop, eenvoudige linker tijdlijn, rustige v67-stijl check-in, Google-photo placeholder en overige functionaliteit zijn ongewijzigd.
- PWA-assets naar `v=76`; shell-cache naar `utca-shell-v25`.


Mobiele webapp voor de vriendendag in Utrecht op **zaterdag 26 september 2026**.

De app is het gezamenlijke draaiboek voor de dag: programma volgen, navigeren, inchecken, zien waar de rest is, alternatieven kiezen en na iedere relevante stop de **Naar de klote-meter** invullen.

**Live:** https://utca26.pages.dev

> Dit is een vrienden-try-out / MVP. De pagina is bewust ingesteld op `noindex` en is bedoeld om via de directe link te gebruiken.

---

## v75 — rustige check-in terug (v67-gedrag)

- Check-in kaartanimatie/reflow verwijderd; geen beweging meer van beneden naar boven.
- Check-in knop wisselt weer rustig/direct van status zoals in v67; tekst `Check in ✓` blijft altijd zichtbaar.
- De eenvoudige linker tijdlijn uit v75/v65 blijft behouden: afgelegde segmenten zijn volledig lime (of blauw in Regen).
- Na check-in wordt de actieve stopkaart zonder scrollanimatie alleen zo nodig in beeld gezet.
- Bottom navigation, Google-photo placeholders, top-open gedrag en overige functionaliteit blijven intact.


## Wat de app doet

- Volledig dagprogramma met tijden, locaties en loopstukken
- **Zon / Regen**-variant met eigen route en accentkleur
- Sticky **Huidige stop / Volgende**-navigatie
- Google Maps-navigatie per locatie
- Eén Google Places-foto per actieve stopkaart, direct boven de locatienaam; wissel je naar een alternatief, dan wisselt de foto automatisch mee
- **Open hele ronde in Google Maps** met actuele route en looptijd
- Zwevende bottom navigation met **Hier · De dag · De rest** plus een losse Google Maps-knop, met eigen line-icons in dezelfde appstijl
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
- Bij de finish verschijnt **EINDUITSLAG** met drie losse scorekaarten en bijbehorende kleurbalken: **THE ABSOLUTE BOLLOCKS** — *ZONDAG?*, **DE KLOOTZAK** — *BEST OF BOTH WORLDS* en **THE LIONEL RICHIE** — *EASY LIKE A SONNTAG MORGEN*. **DE KLOOTZAK** is degene wiens eindpercentage het dichtst bij het exacte midden tussen de hoogste en laagste eindscore ligt
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

De slides gebruiken echte onderdelen uit de live interface als still. Slide 2 gebruikt een vaste lokale crop van de Kanoverhuur-foto; slide 4 gebruikt een vaste lokale crop van Café De Morgenster. Daardoor zijn beide onboardingbeelden direct zichtbaar en niet afhankelijk van een Places API-call. Niet-relevante onderdelen worden subtiel gedimd.

De terugknop op slide 1 gaat terug naar het naamveld. De ingevoerde naam blijft daarbij alvast ingevuld.

Na afronden of overslaan van de onboarding opent de app altijd **helemaal bovenaan**, zodat `UTCA // FÜR DIE MÄNNER`, de datum, ingelogde groep en Zon/Regen direct in beeld staan. Browser-scrollrestauratie wordt daarbij bewust genegeerd.

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
├── app.css
├── app.js
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
├── onboarding-checkin.webp
├── onboarding-options.webp
└── README.md
```

`index.html` bevat de semantische interface. `app.css` bevat alle styling en `app.js` bevat programma-data en client-side logica.

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

De huidige en eerstvolgende stop worden direct geladen; overige foto’s worden demand-based geladen zodra ze binnen ongeveer 900 px van de viewport komen. De app bewaart alleen Google Place IDs, geen Google photo-resource-names of fotobestanden. De worker stuurt fotoresponses met `no-store`. Iedere foto linkt terug naar de individuele bronfoto in Google Maps en toont binnen het fotovak de tekst **Google Maps** als bronvermelding.

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
  - **THE ABSOLUTE BOLLOCKS** — *ZONDAG?*
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
- als Google Places nog niet is ingesteld of geen foto teruggeeft, blijft het gereserveerde fotovak bewust leeg; zodra de API beschikbaar is vult dezelfde plek zich automatisch met de locatie-foto;
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


---

## v71 — cinematic timeline at half speed

Deze release verandert uitsluitend de snelheid van de Indiana-Jones-achtige tijdlijnanimatie uit v70. Design, check-in-logica, Google Places-foto's, route-data, Naar de klote-meter, EINDUITSLAG, backend en overige functionaliteit blijven gelijk.

- De tracer tekent het nieuwe traject nu op **50% van de vorige snelheid**.
- De animatieduur is verdubbeld van circa **1,25–1,95 seconde** naar circa **2,5–3,9 seconden**, afhankelijk van de afstand tussen de stops.
- De bewegende tracer-kop en de lime lijn blijven exact synchroon.
- De node-arrival gebeurt nog steeds pas nadat de tracer de volgende stop bereikt.
- `prefers-reduced-motion` blijft gerespecteerd.
- PWA assetversie verhoogd naar `v=71` en service-worker shell-cache naar `utca-shell-v21`, zodat bestaande homescreen-installaties de nieuwe timing ophalen.

---

## v72 — bottom navigation, top-open & photo placeholder

Deze release bouwt rechtstreeks voort op v71. De route-data, check-in-logica, cinematic timeline, Naar de klote-meter, EINDUITSLAG, D1/API-contracten en Google Places-endpoints zijn niet gewijzigd.

### Bottom navigation

- Nieuwe zwevende glass-tabbar onderaan met drie compacte tabs: **De dag**, **Tussenstand** en **Route**.
- De iconen zijn als lichte inline SVG line-icons opgebouwd en gebruiken dezelfde stroke, afgeronde vormen en lime/blauwe actieve accentkleur als de rest van de app.
- **De dag** gebruikt een timeline/list-icoon, **Tussenstand** een meter/gauge en **Route** een route/pin-icoon.
- Tikken op een tab scrolt vloeiend naar het bestaande relevante onderdeel; er is geen nieuwe pagina, router of framework toegevoegd.
- De actieve tab volgt de scrollpositie.
- De tabbar gebruikt iOS/Android safe-area padding en extra onderruimte zodat hij geen content afdekt.

### Openen vanaf boven

- Na de laatste onboarding-slide, **Overslaan** of een nieuwe sessie opent de app op scrollpositie 0.
- Browser `scrollRestoration` staat op `manual` om te voorkomen dat Safari/Chrome de PWA halverwege de vorige route terugzet.
- Dit verandert niets aan de bestaande knop/actie waarmee een gebruiker later bewust naar een specifieke stop springt.

### Google Places-fotovak

- Het bestaande Google Places-fotovak uit v68-v71 blijft nu **zichtbaar als een leeg, rustig glass-vak** zolang `GOOGLE_MAPS_API_KEY` nog niet is ingesteld.
- Er staat geen placeholdertekst, foutmelding of Google-label in het lege vak.
- Zodra de API later is ingesteld, laadt dezelfde plek automatisch de Google Places-foto en verschijnt de vereiste Google Maps-bronvermelding.
- Bij het wisselen van venue blijft de bestaande logica gelden: het fotovak wordt opnieuw gekoppeld aan de gekozen locatie en haalt daarvan de foto op.

### Versie/cache

- PWA assetversie verhoogd naar `v=72`.
- Service-worker shell-cache verhoogd naar `utca-shell-v22`.



---

## v73 — Hier / De dag / De rest + herstelde cinematic line

Deze release bouwt rechtstreeks voort op v72 en houdt dezelfde HTML/CSS/vanilla-JavaScript-architectuur, D1/API-contracten, locaties, Google Places-fotovakken, Naar de klote-meter en EINDUITSLAG.

### Bottom navigation

- De drie interne tabs zijn nu **Hier · De dag · De rest**.
- **Hier** springt naar de actieve stopkaart. Als er nog geen actieve check-in is, wordt de eerste stop gebruikt.
- **De dag** springt naar `#dag`, de volledige tijdlijn met alle stops.
- **De rest** springt naar `#groep` / **Waar is iedereen?**.
- De actieve tab volgt de scrollpositie; als de actuele stopkaart in beeld is, wordt **Hier** actief.
- **Route** is geen interne tab meer. Rechts naast de pill staat een losse ronde map-knop die de bestaande volledige Google Maps-route direct extern opent.
- De bestaande routeknop onderaan is voor backwards compatibility behouden.

### Cinematic timeline

- De Indiana-Jones-achtige routeanimatie is opnieuw robuust opgebouwd.
- In plaats van afhankelijk te zijn van een CSS/Web Animations transform tekent JavaScript de lime/blauwe lijn nu frame voor frame met `requestAnimationFrame`.
- De lijn begint zichtbaar bij de vorige node en groeit daadwerkelijk tot de volgende node; de bewegende kop blijft exact aan het uiteinde van de lijn.
- De v71 half-speed timing blijft behouden: circa **2,5–3,9 seconden**, afhankelijk van de afstand tussen twee stops.
- De volgende node landt pas wanneer de lijn hem bereikt.
- `prefers-reduced-motion` blijft gerespecteerd.

### Check-in

- De tekst **Check in ✓** blijft nu altijd boven de geanimeerde lime/blauwe fill staan.
- De fill en tekstkleur-morph zijn iets rustiger gemaakt.
- Het uitklappen van kaartinhoud duurt iets langer en beweegt vloeiender.
- De bestaande check-in data, sync en D1-functionaliteit zijn niet gewijzigd.

### Openen / Google Places

- De v72 top-open fix blijft: na onboarding opent de app helemaal bovenaan bij **UTCA // FÜR DIE MÄNNER**.
- De lege Google Places-fotovakken blijven staan totdat `GOOGLE_MAPS_API_KEY` later in Cloudflare wordt ingesteld.
- Wisselen van venue blijft automatisch dezelfde fotologica gebruiken.

### Versie/cache

- PWA assetversie verhoogd naar `v=73`.
- Service-worker shell-cache verhoogd naar `utca-shell-v23`.

## v75 — eenvoudige linker tijdlijn + stabiele check-in viewport

Deze release bouwt voort op v73 en wijzigt alleen de linker navigatielijn en het gedrag rond het in beeld houden van een zojuist ingecheckte stop.

### Linker navigatielijn

- De cinematic/Indiana-Jones tekenanimatie van de **verticale lijn links van de stopkaarten** is verwijderd.
- De lijn gebruikt weer het eenvoudige gedrag van v65: alle segmenten tot en met de huidige stop zijn direct volledig lime in Zon-modus en blauw in Regen-modus.
- Afgelegde stops tonen weer de bestaande checkmark-node; toekomstige segmenten blijven grijs.
- Dit heeft geen invloed op de horizontale dagvoortgangsbalk of andere animaties in de app.

### Check-in / kaartpositie

- Na een check-in wordt de gekozen stopkaart direct in de beschikbare viewport geplaatst, rekening houdend met de sticky huidige-stopbalk en de onderste navigatie.
- Als de hele kaart past, wordt hij volledig zichtbaar gecentreerd in de vrije ruimte; bij een zeer hoge kaart wordt de bovenkant netjes onder de sticky balk geplaatst.
- De bestaande zachte check-in/button- en kaart-expansieanimaties blijven behouden.
- De tekst **Check in ✓** blijft zichtbaar tijdens en na de kleurovergang.

### Ongewijzigd

- Hier / De dag / De rest + losse Maps-knop.
- Google Places-fotovakken en API-koppeling.
- Naar de klote-meter, EINDUITSLAG, locaties, alternatieven, D1/API-contracten en app-iconen.
- Service-worker shell-cache verhoogd naar `utca-shell-v24`; assets naar `v=74`.

