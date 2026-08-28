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
- **Open hele ronde in Google Maps** met actuele route en looptijd
- Drie alternatieven bij wisselbare stops
- **Info** voor locatie-informatie en **Boek** bij gereserveerde locaties
- **Ik ben hier**-check-in per stop
- Grote delen van een stopkaart en het tijdlijnbolletje werken ook als extra check-in-zone
- Per locatie zichtbaar wie daar aanwezig is
- **Waar is iedereen?** met actuele positie van de groep
- Tik op een deelnemer om direct naar zijn stop te springen
- **Naar de klote-meter** van 1 t/m 5 per relevante stop
- Tussentijdse dagstand en groepsgemiddelde
- Korte meterreactie in de bestaande tone of voice (`Verdacht fris` → `Balzak.`), waarbij score 4 bewust **Ik hier?** blijft
- Bij 6/6 op dezelfde stop verandert de actieve check-in-knop één keer kort naar **De kudde is compleet.**
- Bij de finish verschijnt een compacte einduitslag met meest/minst naar de klote en de meest stabiele scorelijn
- Vijfdelige onboarding bij iedere nieuwe login
- Mobile-first, donkere glass/liquid-interface
- Installeerbaar als **standalone webapp/PWA** op Android (Chrome) en iPhone
- Lokale fallback wanneer de gedeelde backend niet beschikbaar is

---

## Onboarding

Na het invoeren van een naam verschijnt een onboarding met vijf vaste slides:

1. **De dag** — Zon/Regen kiezen en het programma begrijpen
2. **Check-in** — `Ik ben hier`
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

Bij regen start het ochtendprogramma met **Café Orloff**. Alternatieven zijn onder andere Café 't Neutje, Café Clair en Café de Zaak.

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

`_worker.js` verzorgt `/api/state`, de D1-koppeling, asset-responses, correcte PWA-headers en de `X-Robots-Tag`.

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
```

Voorbeeld POST:

```json
{
  "name": "Batman",
  "currentStop": "pool",
  "intox": 3,
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
5. Na iedere push naar `main` publiceert Cloudflare Pages automatisch de nieuwste versie.

`_worker.js` verwacht de database als:

```js
env.DB
```

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

Iedere deelnemer voert een voornaam in en kan bij een stop op **Ik ben hier** drukken.

Voor makkelijker mobiel gebruik werken ook rustige delen van de stopkaart en het tijdlijnbolletje als check-in-zone. Knoppen zoals **Navigeer**, **Info**, **Boek**, alternatieven en de meter blijven daarvan uitgesloten.

De extra zones kunnen alleen inchecken. Uitchecken gebeurt bewust via de echte **Ik ben hier**-knop om onbedoelde taps te voorkomen.

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
Info / Boek → Ik ben hier → Naar de klote-meter
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
- zodra alle zes deelnemers op dezelfde stop staan, toont de bestaande **Ik ben hier**-knop één keer kort **De kudde is compleet.**;
- bij check-in op de finish verschijnt een compacte einduitslag op basis van de al aanwezige D1-meterdata.

Er zijn geen nieuwe backendvelden, API-routes of extra permanente UI-knoppen toegevoegd.
