# OPLEVERING — DE RONDE UX-overhaul

**Laatste functionele codewijziging:** iteratie 97 (commit `c2822e0`,
leaderboard-rangnummer top-uitgelijnd met de naam — zie hieronder).
Daarvoor, iteratie 96: definitieve oplossing voor de tijdlijn-icoon-
centrering. Achtergrond: iteraties 93-95 probeerden de stop-type-
icoontjes (trein, vlag, wijnglas, ...) steeds nauwkeuriger wiskundig te
centreren (optische correctie, CSS-transform, viewBox-verschuiving),
maar de gebruiker bleef het op een echte iPhone/Safari scheef zien —
uiteindelijk bleek de kern van het probleem dat deze iconen **inherent
asymmetrisch zijn by design** (een vlag heeft nu eenmaal de paal aan één
kant), waardoor geen enkele wiskundige centreringstechniek zowel de
herkenbare vorm kan behouden als gecentreerd kan ogen. Iteratie 96 lost
dit definitief op door de "todo"-rail-nodes een simpel, inherent
symmetrisch CSS-stipje te geven in plaats van het stop-specifieke
icoontje — een cirkel kan per definitie niet scheef renderen. De
specifieke iconen blijven gewoon zichtbaar op de stopkaart zelf. Ook de
repo zelf is
opgeschoond: `screenshots/`, `test-local.html` en `robots.txt` zijn
verwijderd (op verzoek van de gebruiker; geen van drie hoort bij de
daadwerkelijke productie-app). Dit alles is, net als iteratie 92
(tijdlijn-bolletjes zonder fototextuur), direct-gemelde feedback van de
gebruiker op een echt toestel, NA de oorspronkelijke deadline van
2026-09-17T10:41:38Z.
**Deadline van deze opdracht:** 2026-09-17T10:41:38Z (opgeleverd; deze
sessie werkt sindsdien op verzoek door aan directe gebruikersfeedback).
**Volledige, iteratie-voor-iteratie onderbouwing:** zie [`STATUS.md`](STATUS.md) —
dit document is een beknopte samenvatting daarvan, geen vervanging.

Dit is een onafhankelijke, doorlopende UX/design-overhaul van de mobiele PWA
"DE RONDE" voor de vriendendag in Utrecht op 26 september 2026. De app is
tientallen iteraties lang stap voor stap doorgelicht en verbeterd, elke
wijziging geverifieerd met echte Playwright-tests op zowel Chromium als
WebKit voordat die gecommit werd.

## Belangrijkste UX-beslissingen

- **Check-in kon per ongeluk geactiveerd worden door alleen tekst te lezen**
  (iteratie 1) — de beschrijvingstekst en foto-titel-overlay op een
  stopkaart waren onbedoeld ook incheck-triggers. Uitgesloten van de
  klikzone; alleen de expliciete "Check in ✓"-knop en de tijdlijnbol
  checken nu nog in.
- **Tijdlijn/rail-nodes** zijn meerdere rondes verfijnd op verzoek van de
  gebruiker: consistente maat (20×20px, was eerder 3 verschillende maten
  per status), symmetrische afstand tot de rail-lijn, en duidelijk
  zichtbare todo-iconen (was te vaag contrast).
- **Lime-accentkleur getemperd** (iteratie 62) op basis van gebruikers-
  screenshot + Adobe Color Wheel-onderzoek: de HSV-*value* (helderheid)
  verlaagd als primaire hendel tegen het "te fel/neon" gevoel, met behoud
  van de hue en de onderlinge kleurfamilie-verhoudingen.
- **Toegankelijkheid**: focus-trap in de onboarding-modal, 44×44px
  aanraakdoelen, `aria-live` op de toast (maar bewust NIET op elementen die
  ook door achtergrondpolling worden bijgewerkt, om screenreader-spam te
  voorkomen), dynamische (niet hardgecodeerde) slide-tellingen in alle
  vier onboarding-navigatiemethoden (knop/toetsenbord/swipe/terug-knop).
- **PageSpeed/Core Web Vitals**: een echte CLS-bug gevonden en gefixt
  (ontbrekende `.name-hint`-stijl in de kritische inline CSS liet de
  login-kaart springen bij eerste paint).
- **Tijdlijn-icoontje bevroor na foto-laden** (iteratie 88, direct gemeld
  door de gebruiker als "de ene keer een vinkje, de andere keer dat
  icoontje... lijkt op een caching probleem"): zodra een stopfoto laadde,
  werd het status-icoontje in die rail-node nooit meer bijgewerkt — een
  afgevinkte stop kon zo permanent het originele reisicoontje blijven
  tonen i.p.v. het vinkje. Niet letterlijk een cache-bug, maar wel een
  "bevroren weergave die niet meebeweegt"-symptoom dat er zo uitzag.
  Gefixt door de overbodige uitzondering te verwijderen.
- **Tijdlijn-bolletjes: fototextuur volledig verwijderd** (iteratie 92,
  op een echt toestel gemeld ná de deadline: "still no consistency...
  I like the above one better — just straight black background and lime
  green ✓"): sinds iteratie 65 kregen rail-nodes een kleine
  achtergrondfoto zodra Google Places een foto voor die locatie vond;
  ontbrak zo'n foto, dan bleef het bolletje plat zwart. Op een echt
  toestel, met wisselende foto-beschikbaarheid, ontstond zo een zichtbaar
  inconsistent beeld. Op expliciet verzoek is de fototextuur-behandeling
  helemaal verwijderd: alle rail-nodes zijn nu altijd een vlak, donker
  bolletje met alleen het lime-icoontje/vinkje.
- **Tijdlijn-icoontjes optisch gecentreerd** (iteratie 93, eveneens
  gemeld met een echt-toestel-screenshot): de icoontjes stonden met het
  blote oog niet precies in het midden van hun bolletje. CSS-layout en
  de zuivere geometrische bounding box van elk icoon bleken al correct
  gecentreerd — de werkelijke oorzaak was het optische (inkt-gewogen)
  zwaartepunt van stroke-based lijniconen (bv. de vlag, het wijnglas),
  dat meetbaar afweek van hun geometrisch midden. Elk van de 12 gebruikte
  iconen én het vinkje gerasterd en het inkt-gewogen zwaartepunt via
  canvas-pixelanalyse berekend, met een per-icoon correctie tot
  sub-pixel nauwkeurigheid. **Vervolg (iteratie 94)**: deze correctie
  werkte niet in Safari/WebKit — het gebruikte SVG-attribuut bleek daar
  stilzwijgend genegeerd te worden. Vervangen door een CSS-transform.
  **Vervolg (iteratie 95)**: de gebruiker bevestigde dat het óók ná die
  CSS-transform-fix op een echte iPhone nog steeds scheef stond (met
  cache, verkeerde versie en content-blockers expliciet uitgesloten).
  Overgestapt op een fundamenteel andere techniek: in plaats van een los
  `transform`-attribuut toe te voegen, verschuift de fix nu de `viewBox`
  van elk icoon-SVG zelf — een niet-optioneel basismechanisme van SVG
  dat elke renderer sowieso moet interpreteren om de afbeelding te
  tonen, in tegenstelling tot een aanvullende transform die een
  renderengine kan negeren. **Vervolg, definitief (iteratie 96)**: ook
  ná de viewBox-fix zag de gebruiker het op een echte iPhone nog steeds
  scheef — dit keer specifiek het vlag-icoon. De werkelijke oorzaak
  bleek dieper te zitten dan een renderfout: stop-type-iconen zoals een
  vlag zijn *inherent asymmetrisch by design* (de paal staat bewust aan
  één kant, zoals in elke iconenset), waardoor geen wiskundige
  centreringstechniek zowel de herkenbare vorm kan behouden als
  gecentreerd kan ogen. Definitief opgelost door de todo-rail-nodes een
  simpel CSS-stipje te geven i.p.v. het stop-specifieke icoontje — een
  cirkel kan per definitie niet scheef renderen, op geen enkel toestel.
  De iconen zelf blijven zichtbaar op de stopkaart.
- **Leaderboard-rangnummer top-uitgelijnd met de naam** (iteratie 97):
  het cijfer in de rangcirkel (1/2/3) stond verticaal gecentreerd in een
  44px cirkel, terwijl de naam ernaast bovenaan zijn regel begint —
  gemeten (fontmetrics + pixelscan op een hoge-resolutie screenshot) op
  ca. 11px zichtbaar verschil. Gefixt met `align-items:flex-start` +
  een berekende `padding-top`, teruggebracht tot 0,25px verschil —
  visueel bevestigd op zowel Chromium als WebKit.
- **Kleurstijl blijft de eigen, donkere DE RONDE-identiteit** — de
  Polarsteps-richting (op gebruikersverzoek onderzocht) is toegepast op
  informatiehiërarchie/kaartpatronen, niet als volledige paletomkering
  naar een licht thema; dat bleef bewust een expliciet af te wegen,
  losstaande grotere stap voor een latere iteratie.

## Twee terugkerende bugklassen (het grootste structurele resultaat)

1. **"Onvolledige kopie van een complete functie"** — een losse plek in de
   code die een deel van de logica van een canonieke functie dupliceert
   in plaats van die aan te roepen, en niet meesynchroniseert als de
   basislogica verandert. Dit patroon leverde de meeste en ernstigste
   bugs op, waaronder twee **echte cross-user datalekken op gedeelde
   toestellen**: de "×"-uitlogknop en de "naam corrigeren"-knop in de
   onboarding hielden allebei hun eigen onvolledige kopie bij van de
   sessie-resetlogica (`clearOwnSession()`), en vergaten daarbij
   `ratings`/`currentStop` te wissen — de volgende naam op hetzelfde
   toestel erfde dan per ongeluk de vorige sessie's gegevens. Ook
   gevonden via dit patroon: een weersomslag-desyncbug, een verouderde
   check-in die als "aanwezig" bleef hangen op de stopkaart, en (laatste
   vondst, iteratie 85) een bug waarbij springen naar een vriend op de
   andere weersvariant je eigen "huidige stop"-header liet terugvallen
   op "Utrecht Centraal", en (rechtstreeks door de gebruiker gemeld,
   iteratie 88) het bevroren tijdlijn-icoontje na foto-laden hierboven.
2. **Race conditions door ontbrekende sequentiebewaking op netwerk-
   responses** (iteratie 82-84) — `syncState()`, `refreshState()` en
   `removeParticipant()` verwerkten `/api/state`-responses onvoorwaardelijk,
   dus een trage/verouderde respons kon een latere, snellere respons
   overschrijven. Gevolg: de weergegeven locatie van een vriend kon
   teruggrijpen naar een oude check-in, of een net verwijderde vriend kon
   zichtbaar terugkeren. Gefixt met een gedeeld, monotoon oplopend
   `syncSeq`-volgnummer dat een respons alleen toepast als die nog steeds
   bij de nieuwste aanvraag hoort.

Beide bugklassen zijn, voor zover met de beschikbare tijd te verifiëren,
volledig uitgeroeid: na het fixen van elke klasse is gericht gezocht naar
overige instanties elders in de codebase.

## Testoverzicht

- **Elke wijziging** geverifieerd met Playwright op zowel **Chromium als
  WebKit** (`screenshots/capture.js`, 11-staps regressiereeks: login,
  onboarding, tijdlijn, check-in, meter, alternatieven, stand-tab,
  groep-tab, regenmodus).
- **Viewportranden**: 320px (smalste ondersteunde breedte, incl. de
  langste knoptekst), 375px, 390px, 430px.
- **Echte service-worker/offline-tests**: handmatige SW-registratie (nodig
  omdat `app.js` de SW alleen op `https:` registreert) + `context.setOffline
  (true)` om echt offline-gedrag te testen, niet alleen code te lezen.
- **Netwerk-race-condities**: Playwright's `page.route()` gebruikt om
  netwerkresponses kunstmatig te vertragen en in de verkeerde volgorde te
  laten aankomen — elke racebug is eerst tegen de *ongewijzigde* code
  bevestigd (bewijs dat de test 'm echt reproduceert) vóór de fix als
  bevestigd werd beschouwd.
- **Toetsenbord-op-scherm-scenario**: gesimuleerd op een klein toestel of
  het inlogscherm zichtbaar blijft als het toetsenbord ±280px inneemt.
- **Toegankelijkheid**: focus-trap (Tab/Shift+Tab) in de onboarding-modal,
  `aria-live`-gedrag, canvas-pixelsampling om te controleren of de
  maskable app-iconen visueel veilig zijn (geen belangrijke inhoud die
  wordt weggesneden door een adaptive-icon-masker).
- **PageSpeed/Core Web Vitals**: een echte audit gedraaid tegen
  `https://pagespeed.web.dev/` (alleen bekeken, niet ingelogd/gedeployed)
  om een echte CLS-regressie te vinden en te fixen.
- **Kleurcontrast**: WCAG-contrastratio's gecontroleerd na de lime-
  accentkleur-aanpassing.

**Niet getest** (buiten het bereik van deze sessie): een fysiek
iPhone/Safari-toestel (alleen Playwright's gebundelde WebKit-engine), en
de live productiesite zelf (die mag deze sessie uitdrukkelijk nooit
bewerken of er met een testnaam op inloggen — alleen lezen/bekijken was
toegestaan).

## Eerlijke lijst met resterende, bekende beperkingen

Rechtstreeks overgenomen uit STATUS.md's "Resterende problemen"-sectie —
geen van deze is een blokkerend probleem, allemaal bewust (nog) niet
opgepakt met een expliciete reden:

1. **"Minder AI visual style"** — een onderscheidend kop-lettertype
   (i.p.v. het systeemfont) en meer variatie in randafronding elders zijn
   nog niet doorgevoerd.
2. **Lange namen kunnen midden in een woord worden afgekapt** — het
   naaminvoerveld staat max. 24 tekens toe zonder melding aan de
   gebruiker. Geen layout-breuk, en het veld vraagt expliciet alleen een
   voornaam, dus in de praktijk een onwaarschijnlijke edge-case.
3. **Venuenaam kan per kijker verschillen** — welke alternatieve locatie
   "actief" is staat alleen lokaal opgeslagen, niet gesynchroniseerd
   tussen deelnemers. Een echte fix vereist een backend-schemawijziging;
   laag risico omdat de groep een alternatief in de praktijk gezamenlijk
   kiest.
4. **Geen test op een fysiek iPhone/Safari-toestel** — alleen Playwright's
   WebKit-engine.
5. **Het roster-uitklikpaneel sluit niet op de Escape-toets** — geen
   focus-trap zoals de onboarding-modal, dus geen echt
   toegankelijkheidsprobleem, wel een kleine ontbrekende UX-nicety.
6. **Dode `intox`-kolom** in `_worker.js`'s D1-schema — nergens gelezen of
   beschreven, waarschijnlijk een overblijfsel van vóór `ratings_json`
   bestond. Veroorzaakt zelf geen probleem, puur cosmetische opruiming.
7. **Polarsteps-richting, fase 2-3** (route-lijn met foto-avatars,
   metadata-regel verder groeperen) nog niet opgepakt — bewust een
   grotere, losstaande vervolgstap.
8. **CLS-score-verbetering nog niet herbevestigd op de live URL** — de
   fix is lokaal geverifieerd; een verse PageSpeed-meting op de
   daadwerkelijk gepubliceerde site moet de gebruiker zelf nog draaien
   na het publiceren van deze versie.

## Lokaal bekijken

```bash
cd de-ronde-ux-overhaul
python3 -m http.server 8099
```

Open daarna `http://localhost:8099/` in de browser (werkt zonder de
Cloudflare Worker/D1-backend — check-ins/groepsstatus werken dan alleen
lokaal-in-het-geheugen).

## Zelf publiceren naar Cloudflare Pages

Deze sessie mag zelf nooit deployen — publiceren is aan jou. Volledige
stap-voor-stap instructies (D1-database aanmaken, Google Places API-key,
Cloudflare Pages-instellingen) staan in [`README.md`](README.md) onder
**"Deployment"**, **"Cloudflare D1"** en **"Google Places-foto's"**. In het
kort:

- Build command: leeg — Build output: `.`
- D1-binding toevoegen met naam `DB` (het schema wordt automatisch
  aangemaakt door `_worker.js`)
- Secret `GOOGLE_MAPS_API_KEY` toevoegen voor locatiefoto's
- Na publiceren: een al geïnstalleerde webapp één keer volledig sluiten en
  opnieuw openen, zodat de nieuwe service-worker-cache direct actief wordt

## Bijgesloten

Een zip van deze exacte commit is apart aangeleverd via de
chat, gemaakt met `git archive --format=zip -o de-ronde-oplevering.zip
HEAD` — bevat precies de bestanden die in git zijn getrackt, niets meer.
