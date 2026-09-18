# STATUS — DE RONDE UX-overhaul (Claude Code, onafhankelijke poging)

## Uitgangssituatie
- Gestart: 2026-09-12T10:41:38Z
- Deadline (vast, verandert niet bij hervatten): 2026-09-17T10:41:38Z
- Dit is een **onafhankelijke tweede poging** naast een reeds lopende Codex-automation
  die dezelfde opdracht uitvoert op `~/Documents/Codex/2026-09-12/je-bent-verantwoordelijk-voor-het-verbeteren`.
  Op expliciet verzoek van de gebruiker werkt deze poging in een eigen kopie
  (deze map) en raakt de Codex-map niet aan. Beide starten vanaf dezelfde
  baseline-snapshot (`work/baseline` uit de Codex-taak) zodat een latere
  vergelijking eerlijk is.
- Broncode: losse `index.html`, `app.css`, `app.js`, `sw.js`, `_worker.js` (komt
  overeen met de opdrachtbeschrijving — de zips in Downloads waren oudere,
  zelfstandige snapshots en zijn niet gebruikt).
- Git-repo geïnitialiseerd in deze map; eerste commit = baseline.

## Belangrijke beperking — eerlijk vermeld
Deze sessie draait niet vanzelf 120 uur door op de achtergrond.

**Update (2026-09-12, ~20:20 lokaal) — omgeschakeld van geplande taak naar
zelf-lus binnen één sessie.** De losse **lokale geplande taak**
(`de-ronde-ux-overhaul`, via de Claude-desktopapp) — die elk uur een verse
sessie startte met toegang tot deze map, het lokale equivalent van Codex'
heartbeat — bleek onbetrouwbaar: elke automatisch gestarte, onbemande sessie
liep direct na het openen van de map vast omdat niemand aanwezig was om een
toestemmingsprompt weg te klikken (zie de losse notitie hieronder over de
16:04-run). Een poging om dit op te lossen met het `/loop`-skill (dat zelf
een `ScheduleWakeup`-timer binnen één sessie gebruikt) liep ook vast: elke
keer dat het skill via de Skill-tool opnieuw werd aangeroepen kwam er een
"Allow Claude to run skill /loop?"-dialoog terug, ook na "Always allow" —
vermoedelijk omdat de toestemming op de exacte, steeds iets andere
promptekst is gefingerprint in plaats van op skill+project.

**Huidige aanpak:** deze taak is nu **uitgeschakeld**
(`enabled:false` via `update_scheduled_task`) om nutteloze vastgelopen runs
elk uur te voorkomen. In plaats daarvan roept de sessie aan het eind van elke
beurt zelf `ScheduleWakeup` aan (1 uur, `noop:false`/`true` per beurt) met
een **platte instructie-prompt** (geen `/loop`-prefix, geen hernieuwde
Skill-aanroep) die vraagt: STATUS.md herlezen, deadline checken, één kleine
geverifieerde iteratie doen met Bash/Read/Edit/Write/Browser-tools
rechtstreeks, committen, STATUS.md bijwerken, zip maken, en aan het eind
opnieuw `ScheduleWakeup` aanroepen — zonder ooit de Skill-tool opnieuw te
gebruiken voor deze lus. Dit werkt zolang **deze specifieke sessie** open
blijft in de Claude-desktopapp (zelfde beperking als voorheen: geen cloud,
stopt als de app/sessie sluit) maar omzeilt het herhaalde-toestemmingsprobleem
omdat er geen nieuwe sessie en geen nieuwe Skill-aanroep meer nodig is per
tik. Als een toekomstige lezer van dit bestand een sessie is die via deze
`ScheduleWakeup` wakker is geworden: dit IS de bedoelde werkwijze, geen fout.

Elke run (handmatig of gepland):
1. Leest dit bestand en het laatste git-commit-log voor de huidige stand.
2. Werkt aan de volgende prioriteit (één kleine, geverifieerde iteratie).
3. Committeert een herstelbaar checkpoint na iedere afgeronde verbetering.
4. Werkt dit bestand bij vóór het einde van de sessie.

Als de eerste geplande run tegen een permissie-prompt aanloopt (bijv. voor
Bash/git/browsertools), kan dat die run laten hangen — eenmalig handmatig
"Run now" gebruiken zet de benodigde toestemmingen vast voor latere runs.

**Bevestigd voorgevallen (2026-09-12, ~19:10 lokaal):** na het verlagen van
het interval naar elk uur bleek de om 16:04 UTC automatisch gestarte run
(sessie `local_a1569294-...`) direct na stap 0 (map openen) vast te lopen —
geen enkele volgende tool-call, laatste activiteit 16:05:07 UTC, ruim 3 uur
lang niets meer gebeurd terwijl de sessie wel als "running" bleef staan.
Vermoedelijke oorzaak: map-toegang voor een gloednieuwe, onbemande sessie
vraagt mogelijk telkens opnieuw een goedkeuring die niemand kan wegklikken,
ook al staat `permissions.defaultMode` in dit project al op
`bypassPermissions` (die instelling wordt pas geladen ná het openen van de
map, dus lost dit specifieke probleem niet op). Vanuit een sessie die zelf
als scheduled-task-run telt (zoals deze) weigeren `stop_session` en
`run_scheduled_task` te werken ("unavailable in unattended sessions") — dus
dit kan alléén handmatig in de desktopapp worden losgetrokken: één keer zelf
op "Run now" klikken terwijl de app open is/iemand aanwezig is. Als een
volgende run dit leest en zelf ook binnen enkele seconden na stap 0 vastloopt
zonder verdere tool-calls: dit is die bug, geen nieuw te onderzoeken
probleem — meld het kort en stop, de gebruiker moet handmatig ingrijpen.

## Prioriteiten (uit de opdracht)
1. Dag 1: app draaien, kernroutes onderzoeken, uitgangssituatie met
   screenshots vastleggen, grootste problemen oplossen.
2. Dag 2: informatiehiërarchie, tijdlijn en navigatie (Polarsteps-richting).
3. Dag 3: check-ins, meter, alternatieven, onboarding.
4. Dag 4: toegankelijkheid, schermformaten, slechte verbinding, PWA, regressies.
5. Dag 5: resterende problemen, visuele consistentie, eindverificatie.

## Ontwerpbesluiten

**Iteratie 1 — tekst lezen mag nooit incheck-actie triggeren.**
Bij codeonderzoek (`app.js`, `bindDynamicUi`) bleek dat vrijwel het hele
stopkaartoppervlak — inclusief de beschrijvingstekst (`.desc`) en de
naam/locatie-overlay op de foto (`.media-title`) — als incheck-zone werkt:
één tik en de gebruiker wordt ingecheckt en gedeeld met de hele groep, zonder
enige visuele aankondiging dat die tekst tikbaar is. Geverifieerd met een
echte Playwright-run tegen de ongewijzigde baseline: na een tik op alleen de
beschrijvingstekst stond `aria-pressed` op de incheck-knop op `"true"` en
verscheen de deelnemer in de groepslijst. Dit is een blokkade/verwarrings-
probleem (silent, group-wide side effect van een leesactie) en dus hoogste
prioriteit volgens de opdracht.

Aanpak: de kleinst mogelijke wijziging — `.desc` en `.media-title` toegevoegd
aan de uitsluitingsselector van de kaart-klikhandler in `app.js`
(`bindDynamicUi`). De foto zelf triggerde al nooit een check-in (zit in een
`<a>`-link naar Google Maps, al uitgesloten). De expliciete "Check in ✓"-knop
en de tijdlijnbol blijven ongewijzigd werkend. Er is bewust *geen* nieuwe
visuele affordance toegevoegd aan de resterende kaartoppervlakte, omdat die
resterende oppervlakte na deze fix marginaal is (grotendeels lege padding) en
een toegevoegde "tap-me"-stijl daar het verkeerde signaal zou geven.

Bekend, nog niet opgelost: de tijdlijnbol (`.tl-node`, ~13–21px) is ook een
werkende incheck-trigger voor willekeurige stops en is ruim onder de vereiste
44×44px aanraakdoel. Kandidaat voor een toegankelijkheids-iteratie (dag 4).
Ook: "stale" (>30 min oude) check-ins worden alleen met `opacity:.72`
aangeduid (`.person.stale`), zonder tekstuele indicatie — mogelijke overtreding
van "kleur/opacity is nooit de enige statusaanduiding". Kandidaat voor een
latere iteratie.

## Ontwerpbesluiten (vervolg)

**Iteratie 2-poging (afgewezen door gebruiker) — "muy importante" is
opzettelijk, GEEN bug.** Tijdens onderzoek van de onboarding-flow (slide 2/5)
viel de zin "Maar bovenal is de Check in ✓ — muy importante vóór de METER."
op als vermeende taalfout (Spaans middenin Nederlandse copy) en is die
aangepast naar "ontzettend belangrijk". De gebruiker heeft deze wijziging
**expliciet afgewezen** met de melding: "Andere taal in de app is
intentional." De wijziging is teruggedraaid (`index.html` weer exact op de
vorige commit) en **niet** gecommit. **Kandidaat-fixes met vreemde-taal-
mengvormen in copy dus voortaan overslaan** — dit is een bewuste stijlkeuze
van de opdrachtgever, geen defect. Neem dit mee bij toekomstige tekst-scans:
alleen taalinconsistentie aanmerken als probleem als er een concreet
functioneel/begrijpelijkheidsprobleem is aangetoond (bv. gebruikerstest of
expliciete klacht), niet louter omdat een zin Nederlands met een ander taaltje
mengt.

## Ontwerprichting: Polarsteps (expliciet verzoek gebruiker)

De gebruiker heeft expliciet gevraagd de look-and-feel richting
polarsteps.com te bewegen (dit was al genoemd als "Polarsteps-richting" bij
dag 2 in de oorspronkelijke opdracht; nu concreet gemaakt met de URL). Live
onderzocht (Claude Browser, marketingsite polarsteps.com, PLAN/TRACK/RELIVE-
secties):

- **Kaart-hiërarchie:** een klein "DAY N"-label in kleine hoofdletters direct
  bóven de grote, vetgedrukte locatienaam — niet los in een hoek. Daaronder
  een compacte metadata-regel (vlag/land · weerpictogram + temperatuur).
- **Volledige foto met scrim + tekst-overlay:** locatienaam en land in wit
  over een donkere gradient onderin de foto — DE RONDE deed dit al deels.
- **Route als verbonden lijn met cirkelvormige foto-markers** (stippellijn +
  ronde avatar-thumbnails per stop) — conceptueel vergelijkbaar met DE
  RONDE's verticale rail+dot-tijdlijn, andere vorm (horizontaal op een kaart
  i.p.v. verticale lijst).
- **Kleurtaal van de marketingsite zelf:** crème/warm-wit achtergrond, marine-
  blauw tekst, koraalrood voor CTA's, met een speels handschrift-lettertype
  voor kleine accentlabels (PLAN/TRACK/RELIVE). Dit is de marketingsite, niet
  per se de in-app kleurstijl — DE RONDE's donkere thema met limegroen-accent
  is een bewuste, eigen identiteit (nachtje-uit-sfeer, "klote-meter"-humor).
  **Besluit:** geen volledige paletomkering (donker→crème) in één keer; dat
  is een grote, risicovolle herschrijving die tegen de "geen grote
  herschrijving"-grens aanloopt. In plaats daarvan: de *informatiehiërarchie
  en kaart/tijdlijn-patronen* van Polarsteps overnemen binnen het bestaande
  donkere DE RONDE-thema, stap voor stap over de resterende dagen.

**Gefaseerd plan (aan te vullen/bij te stellen per iteratie):**
1. ✅ (iteratie 4, dit is 'm) — "Stop N · 11"-label verplaatst van een losse
   hoek naar direct boven de locatienaam, in de lime-accentkleur, zoals
   Polarsteps' "DAY N" boven de titel.
2. Overweeg: tijdlijn-rail visueel dichter bij Polarsteps' route-lijn met
   ronde foto-avatars (in plaats van kleine kleurloze dots) — grotere
   ingreep, eerst losstaand uitproberen zonder de klikzones/aanraakdoelen
   van iteratie 3 te breken.
3. Overweeg: metadata-regel (tijd + eventueel weerpictogram) consistenter
   groeperen onder de titel i.p.v. gesplitst tussen mediakop en titelblok.
4. Niet doen zonder expliciete afweging: overstap naar een licht/crème
   kleurenschema — dat raakt vrijwel elk scherm en is te groot voor één
   iteratie; alleen oppakken als een latere iteratie specifiek daarvoor
   gereserveerd wordt, in kleine losstaande stappen, met screenshots per stap.

## Ontwerpbesluiten (vervolg 2)

**Iteratie 3 — tijdlijnbol-aanraakdoel van 42px naar 44px.**
Gemeten met `getBoundingClientRect`/`getComputedStyle` op een echte, ingelogde
pagina (Claude Browser, Chromium): `.tl-node[data-rail-here]::before` had al
sinds de baseline een onzichtbare hit-cirkel van 42×42px (2px onder de
44×44px-richtlijn), rond een zichtbare bol van 13–21px. Vóór het vergroten is
expliciet gecontroleerd of dat risico geeft op overlap tussen opeenvolgende
stops: de kortste gemeten afstand tussen twee tl-node-middens is 349px (bij
320px breedte), ruim boven 44px. Er is dus geen overlap-risico — de eerdere
aanname in STATUS.md dat dit "nader onderzocht" moest worden vóór een fix,
bleek na meting onnodig voorzichtig.

Aanpak: `width`/`height` van `.tl-node[data-rail-here]::before` in `app.css`
van 42px naar 44px. Eén regel, geen andere selectors geraakt.

## Ontwerpbesluiten (vervolg 3)

**Iteratie 4 — stopkaart-hiërarchie richting Polarsteps: "Stop N" boven de
titel in plaats van los in de hoek.**
Vóór deze wijziging stond "Stop 2 · 11" los rechtsboven in de mediakop
(`.media-top`, naast de tijdsbadge), terwijl naam en locatie (`.media-title`)
onderin de foto stonden — twee losse informatieblokken die niet als één
leeshiërarchie werkten. Polarsteps groepeert dit als één blok: klein "DAY N"-
label direct boven de grote titel. Aanpak: `<span class="media-index">`
verplaatst van `.media-top` naar binnenin `.media-title` (als eerste kind,
vóór `.name`), en de CSS omgezet naar een blok-label (`display:block`) in de
lime-accentkleur boven de titel, iets groter/vetter dan voorheen (11px/700
i.p.v. 10px/600) voor betere leesbaarheid tegen de foto.

**Bijvangst (geen aparte fix, maar wel relevant):** omdat `.media-index`
voorheen in `.media-top` zat — dat NIET in de uitsluitingsselector van de
kaart-klikhandler stond — was tikken op de oude "Stop N · 11"-tekst
vermoedelijk al vóór deze wijziging een (ongedocumenteerde) incheck-trigger,
net als de `.desc`/`.media-title`-tekst die in iteratie 1 is gefixt. Door de
verplaatsing naar binnen `.media-title` valt dit element nu automatisch onder
dezelfde, al bestaande uitsluiting. Expliciet geverifieerd (zie Testresultaten)
dat een tik op het nieuwe label geen incheck meer triggert.

## Uitgevoerde wijzigingen
1. `app.js` — `.desc,.media-title` toegevoegd aan de uitsluitingsselector in
   de klikhandler van `#timeline` (functie `bindDynamicUi`), zodat tikken op
   beschrijvingstekst of de naam/locatie-overlay niet langer incheckt.
2. `app.css` — `.tl-node[data-rail-here]::before` hit-target van 42×42px naar
   44×44px (voldoet nu aan de 44×44px-aanraakdoel-richtlijn).
3. `app.js` — `<span class="media-index">` verplaatst van `.media-top` naar
   binnenin `.media-title` (eerste kind, vóór `.name`). `app.css` —
   `.media-index` omgezet naar `display:block` label in `var(--limeTextHover)`
   boven de titel (was los blokje rechtsboven in de mediakop).

## Testresultaten
- **Gemeten (Playwright, Chromium, 390×844, lokale server):** vóór de fix
  triggert een tik op de beschrijvingstekst van de eerste stop een incheck
  (`aria-pressed` false→true, deelnemer verschijnt in groepslijst). Na de fix
  blijft `aria-pressed` op `false` bij dezelfde tik. Zie
  `screenshots/before/05-after-tapping-description-text.png` vs.
  `screenshots/after/05-after-tapping-description-text.png`.
- **Handmatig geverifieerd (Claude Browser, Chromium):** expliciete
  "Check in ✓"-knop checkt nog steeds in/uit; naam/locatie-tekst op de fotokaart
  triggert evenmin meer een check-in; meter (1–5) werkt ongewijzigd;
  "3 andere opties" (alternatieven) open/dicht ongewijzigd.
- **Niet getest:** WebKit, overige breedtes (320/375/430), regenmodus-thema in
  detail, offline/API-foutpaden.
- Alle screenshots in deze map zijn gemaakt met Playwright tegen een echte
  lokale server (`python3 -m http.server`) — geen mockups. "Voor" = ongewijzigde
  Codex-baseline geserveerd op poort 8100; "na" = deze projectmap op poort 8099.

**Deze run — poging 1 (afgewezen, geen wijziging):**
- Bij het handmatig doorlopen van de onboarding (Claude Browser/Chromium,
  375×812, lokale server poort 8099) en het regressiecontroleren van
  iteratie 1 is terloops geverifieerd dat: de expliciete "Check in ✓"-knop op
  stop 1 nog steeds werkt (deelnemer "TestUX" verschijnt met groene stip);
  tikken op de beschrijvingstekst van stop 2 (Kanoverhuur Utrecht) nog steeds
  geen incheck triggert (iteratie 1 intact); reserveringstijd Kanoverhuur
  ongewijzigd "10:00–11:45"; meter-blok en tijdlijn ongewijzigd zichtbaar.
  Geen van deze bevindingen leidde tot een codewijziging.

**Deze run — iteratie 3 (tijdlijnbol, gecommit):**
- **Gemeten vóór de fix (Claude Browser/Chromium, ingelogde sessie):**
  `getComputedStyle(node, '::before').width/height` op alle 11
  `.tl-node[data-rail-here]`-elementen gaf overal `42px x 42px`. Minimale
  afstand tussen twee opeenvolgende node-middens (via `getBoundingClientRect`)
  bij 320px breedte: 349px — geen overlap-risico.
- **Na de fix (na cache-bust reload van `app.css`):** dezelfde meting geeft
  overal `44px x 44px`.
- **Functionele regressiecontrole:** ingelogd als "TestUX", check-in via de
  tijdlijnbol van stop 2 (Kanoverhuur Utrecht) uitgevoerd → correcte stop
  wordt ingecheckt ("Check in ✓" actief, "TestUX" met groene stip verschijnt
  onder de juiste kaart, "Straks"-kop bovenin toont de juiste volgende stop
  "Café Ledig Erf"); reserveringstijd Kanoverhuur ongewijzigd "10:00–11:45".
- Getest op 375×812 en 320×700 (smalste ondersteunde breedte). WebKit niet
  getest.

**Iteratie 4 (deze run):**
- **Gemeten vóór/na (Claude Browser/Chromium, ingelogde sessie, fresh
  localStorage per test):** `document.querySelector('.media-top').outerHTML`
  bevatte na de wijziging alleen nog de tijdsbadge; `.media-title` bevat nu
  `<div class="media-index">Stop N · 11</div>` als eerste kind vóór `.name`.
  Visueel bevestigd op 375×812: "STOP 1 · 11" in lime verschijnt direct boven
  "Utrecht Centraal", zelfde patroon bij stop 2 ("STOP 2 · 11" boven
  "Kanoverhuur Utrecht").
- **Regressie-/incheck-test (belangrijk, expliciet dubbel gecontroleerd):**
  eerste test via een `find()`-tool-klik op tekst "Stop 1 · 11" gaf
  onverwacht `aria-pressed` false→true — bleek bij nader onderzoek een
  verkeerd element te zijn geraakt (de zoekopdracht gaf 2 dubbelzinnige
  matches). Opnieuw getest met (a) `element.closest(...)` direct in de
  DOM — bevestigt dat `.media-index` binnen de uitsluitingsselector valt,
  (b) een JS-`.click()` op het exacte element — `aria-pressed` bleef `false`,
  (c) een echte coördinaat-tik op de zichtbare tekst op het scherm —
  `aria-pressed` bleef `false`. Alle drie de methodes bevestigen: geen
  incheck bij tikken op het nieuwe label.
- **Overige regressiecontrole:** expliciete "Check in ✓"-knop op stop 1 werkt
  (deelnemer "David" verschijnt); tikken op beschrijvingstekst van stop 2
  triggert geen incheck (`aria-pressed` van alle 11 knoppen: alleen stop 1
  `true`, de rest `false` — iteratie 1 intact); reserveringstijd Kanoverhuur
  ongewijzigd "10:00–11:45".
- Getest op 375×812 (mobiel). Overige breedtes/WebKit niet opnieuw getest
  deze iteratie (al eerder gedaan voor iteratie 3, geen wijziging aan
  breedte-afhankelijke layout in deze stap).

## Ontwerpbesluiten (vervolg 4)

**Iteratie 5 — "stale" check-in (>30 min oud) krijgt een tekstlabel naast de
bestaande opacity-aanduiding.**
Codeonderzoek (`app.js`, functie die `#groupList` rendert) bevestigde het al
in STATUS.md genoteerde vermoeden: `checkinIsStale(p)` (waar: `updatedAt`
ouder dan 1800s) voegde alléén de CSS-klasse `.stale` toe
(`.person.stale{opacity:.72}` in `app.css`) — geen tekst, geen icoon. Wie
kleurenblind is, weinig contrast ziet, of gewoon niet let op een subtiel
opacity-verschil tussen twee rijen in de groepslijst, heeft geen enkele manier
om te zien dat een check-in verouderd is. Dit is een letterlijke overtreding
van de in de opdracht genoemde richtlijn "kleur/opacity is nooit de enige
statusaanduiding" en stond al als bekend, niet-opgelost probleem in deze
STATUS (sinds iteratie 1).

Wie er last van heeft: iedereen die de groepslijst ("Waar is iedereen?")
raadpleegt om te zien wie waar is — een verouderde locatie zonder label oogt
identiek betrouwbaar als een verse.

Aanpak — kleinst mogelijke wijziging: in de renderfunctie wordt
`checkinIsStale(p)` nu één keer opgeslagen (`isStale`) en hergebruikt voor
zowel de bestaande CSS-klasse als een nieuw tekstsuffix `' · verouderd'` dat
alleen wordt toegevoegd ná de bestaande "X min geleden"-tijdsaanduiding, dus
alleen zichtbaar wanneer er al een tijdsaanduiding staat. Geen wijziging aan
`app.css`, geen wijziging aan de 30-minutengrens, geen wijziging aan hoe
"vers" check-ins worden weergegeven.

**Testresultaten (gemeten, Claude Browser/Chromium, 375×812, lokale
`python3 -m http.server` op poort 8099):**
- De lokale statische server heeft geen werkende `/api/state` (backend is een
  Cloudflare Worker, niet gestart) — de app valt daardoor terug op de
  ingebouwde offline-fallback (alleen de eigen lokale gebruiker, zonder
  `updatedAt`, dus per ontwerp nooit "stale"). Om de stale-weergave toch
  écht te verifiëren (geen verzonnen screenshot) is `window.fetch` voor
  `/api/state` tijdelijk gemockt met een tweede deelnemer met een
  `updatedAt` van 2400s geleden (40 min) — dit oefent exact hetzelfde
  render-pad uit als een echte verouderde check-in via de Worker-backend.
- **Vóór de fix (op de vorige commit):** gerenderde tekst voor de gemockte
  deelnemer was `"Sanne … · 40 min geleden"` — geen enkele tekstuele
  aanduiding dat dit verouderd is; alleen `getComputedStyle(el).opacity` gaf
  `0.72` (onzichtbaar voor wie niet expliciet let op opacity-verschil).
- **Na de fix:** dezelfde deelnemer rendert nu
  `"Sanne … · 40 min geleden · verouderd"`, met de `.stale`-klasse en
  `opacity:0.72` nog steeds intact (dubbele aanduiding: kleur/opacity + tekst).
  Een verse check-in (`David`, `updatedAt` = nu) rendert ongewijzigd zonder
  het label: `"David … · zojuist"`.
- **Regressiecontrole (zelfde sessie, na page reload met echte
  offline-fallback):** aria-pressed van alle 11 check-in-knoppen ongewijzigd
  (index 0 blijft `true`, rest `false`); tik op `.desc` (stop 2) triggert nog
  steeds geen incheck (iteratie 1 intact); tik op `.media-index` ("Stop 1 · 11",
  iteratie 4) triggert nog steeds geen incheck; `.tl-node[data-rail-here]`
  hit-target nog steeds `44px x 44px` (iteratie 3 intact); reserveringstijden
  ongewijzigd: Kanoverhuur 10:00–11:45, Pool 14:00–15:00, JEU 17:00–18:00,
  De Poort 19:00–21:00 (via volledige pagina-tekst gecontroleerd).
- Getest op 375×812. Overige breedtes/WebKit niet opnieuw getest deze
  iteratie (geen wijziging aan breedte-afhankelijke layout).

## Uitgevoerde wijzigingen (vervolg)
4. `app.js` — in de groepslijst-renderfunctie: `checkinIsStale(p)` wordt nu
   opgeslagen in `isStale` en hergebruikt om naast de bestaande `.stale`-klasse
   ook een tekstsuffix `' · verouderd'` toe te voegen aan de regel met
   locatie + tijdsaanduiding, zodat een verouderde check-in niet alleen via
   opacity maar ook via tekst herkenbaar is.

## Ontwerpbesluiten (vervolg 5)

**Iteratie 6 — klote-meter-knoppen (1–5) van 40px naar 44px aanraakdoel.**
Zelfde categorie probleem als de tijdlijnbol in iteratie 3: `.stop-meter-
buttons button` (de score-knoppen 1–5 die na elk onderdeel verschijnen) was
40px hoog, 4px onder de 44×44px-richtlijn. Wie er last van heeft: iedereen
die na een stop de meter invult, vooral met een minder precieze vinger
(bijvoorbeeld al een paar drankjes op — precies het scenario waar deze app
voor is). Aanpak: `height:40px` → `height:44px`, één regel in `app.css`.

**Testresultaten (gemeten, Claude Browser/Chromium):**
- Vóór de fix: `getBoundingClientRect().height` op alle score-knoppen gaf
  40px. Na de fix: 44px, op zowel 375×812 als 320×700.
- Breedte op 375px: 53px per knop (ruim genoeg). Breedte op de smalste
  320px: 42px — 2px onder de richtlijn. Dit is een bestaand, apart en klein
  probleem (alleen op de smalste ondersteunde breedte, alleen de breedte, al
  vóór deze fix aanwezig) dat bewust niet is meegepakt om deze wijziging
  klein en enkelvoudig te houden — toegevoegd aan resterende problemen.
- Functioneel: klik op "Score 4" gaf `aria-pressed="true"` en statustekst
  "4/5". Regressiecontrole: tik op `.desc`/`.media-index` triggert nog
  steeds geen incheck (iteratie 1/4 intact); tijdlijnbol nog 44×44px
  (iteratie 3 intact); reserveringstijden Kanoverhuur/Pool/JEU ongewijzigd
  (via paginatekst gecontroleerd).

## Ontwerpbesluiten (vervolg 6)

**Iteratie 7 — klote-meter-knoppen ook 44px breed op 320px.**
Vervolg op het in iteratie 6 genoteerde restpunt: na de hoogte-fix (40→44px)
waren de score-knoppen op de smalste ondersteunde breedte (320px) nog 42px
breed. Gemeten (Claude Browser/Chromium, 320×700):
`.stop-meter-buttons` had `box-sizing:border-box`, buitenbreedte 236px,
padding 4px + gap 4px → knopbreedte 42px. Aanpak: padding naar 3px, gap naar
2px (container blijft 236px breed, alleen de verdeling verandert) →
knopbreedte precies 44px op 320px. Op 375px werden de knoppen breder (55px
i.p.v. voorheen 53px) — geen probleem, ruim boven de richtlijn.

**Testresultaten (gemeten):** vóór de fix 42×44px op 320px; na de fix
44×44px op 320px en 55×44px op 375px (browsercache van `app.css` moest eerst
expliciet omzeild worden om het echte effect te meten — niet de eerste keer
dat dat nodig was, zie eerdere iteraties). Regressiecontrole op 375px: klik
op "Score 3" gaf `aria-pressed="true"` + statustekst "3/5"; tik op
`.desc`/`.media-index` triggert nog geen incheck; tijdlijnbol nog 44×44px;
reserveringstijden Kanoverhuur (10:00–11:45) en Pool (14:00–15:00)
ongewijzigd zichtbaar in de paginatekst.

## Ontwerpbesluiten (vervolg 7)

**Iteratie 8 — "3 andere opties"-toggle van 19px naar 44px aanraakdoel.**
Zelfde categorie als de tijdlijnbol (iteratie 3) en de klote-meter-knoppen
(iteratie 6/7): de `<summary>` die de alternatieve-venue-lijst per stop
opent/sluit was slechts 19px hoog. Wie er last van heeft: iedereen die op
een café/restaurant-stop een alternatief wil kiezen (5 van de 11 stops
hebben dit). Aanpak: dezelfde onzichtbare-hitbox-techniek als de tijdlijnbol
— `summary{position:relative}` + een absoluut gepositioneerde `::before`
zonder zichtbare content, zodat de zichtbare tekst/onderstreping niet
verschuift.

**Belangrijk verschil met de tijdlijnbol-fix:** een eerste symmetrische
versie (±12px rondom het midden) bleek bij meting 2.4px te overlappen met de
eerste rij van de alternatievenlijst zodra die openstond — dat is precies
het soort overlap-risico dat bij de tijdlijnbol-fix vooraf werd uitgesloten
door de afstand tussen nodes te meten (349px, ruim voldoende), maar hier was
de beschikbare ruimte (18px boven, 10px onder) veel krapper. Aangepast naar
een asymmetrische hitbox (16px omhoog, 9px omlaag i.p.v. gecentreerd) zodat
de volledige 44px gehaald wordt zonder overlap. **Les voor vervolgiteraties
met deze techniek: bij een kleine/gecentreerde flow-element (i.t.t. een vrij
gepositioneerde node zoals de tijdlijnbol) altijd de daadwerkelijke ruimte
boven én onder apart meten vóór het kiezen van een hitbox-grootte, niet
zomaar symmetrisch centreren.**

**Testresultaten (gemeten, Claude Browser/Chromium, alle 6 alternatieven-
blokken op zowel 375×812 als 320×700):** hitbox overal exact 44px hoog, met
2px marge tot de Check in-knop erboven en 1px marge tot de alternatieven-
lijst eronder (geen overlap). Functioneel bevestigd met
`document.elementFromPoint()` + een echte klik 10px boven de zichtbare tekst
— dat raakt het `<summary>`-element en opent de lijst. Regressiecontrole:
geen incheck bij tekst-tap (iteratie 1/4 intact); klote-meter-knop blijft
werken; tijdlijnbol nog 44×44px (iteratie 3 intact); reserveringstijden
Kanoverhuur/Pool ongewijzigd.

## Ontwerpbesluiten (vervolg 8)

**Iteratie 9 — login- en onboarding-overlay lekken achtergrondinhoud door op
WebKit.** Bij de expliciet nog openstaande WebKit-verificatie (zie eerdere
"Resterende problemen") bleek met een echte Playwright-run tegen dezelfde
lokale server, zelfde CSS, zelfde computed styles (`getComputedStyle` gaf in
Chromium én WebKit identieke waarden voor `background`, `opacity`,
`backdrop-filter`, `z-index`) een compleet ander renderresultaat: in Chromium
is de achtergrond achter het naam-invulscherm en de onboarding vrijwel
volledig zwart (zoals bedoeld); in WebKit was de volledige tijdlijn — kaarten,
tijden, knoppen — glashelder leesbaar dóór de overlay heen. Waarschijnlijke
oorzaak: `.overlay`/`.onboarding-overlay` gebruiken `backdrop-filter:blur(22px)
saturate(150%)` bovenop kaarten die zelf ook `backdrop-filter` gebruiken
(`.card`) — gestapelde/geneste `backdrop-filter` is een bekende zwakke plek in
WebKit's compositing, en de blur+verdonkering bleek daar in de praktijk niet
zichtbaar te renderen, ondanks een correcte computed style.

Wie er last van heeft: iedereen die de app voor het eerst opent op iPhone/
Safari (expliciet vermeld installatiedoel in de opdracht/README) — het eerste
scherm ("naam invullen") en de onboarding ogen daar kapot/onafgewerkt omdat de
achtergrond er "doorheen" schemert in plaats van een rustig donker vlak te
tonen.

Aanpak — kleinst mogelijke, robuuste wijziging: de eigen achtergrondkleur van
beide overlays (niet de blur) verhoogd van `rgba(4,5,6,.62)` naar
`rgba(4,5,6,.94)`, zodat de overlay ook zonder werkende `backdrop-filter`
voldoende dekkend is. Geen wijziging aan de blur/saturate-waarden zelf (die
blijven de visuele "polish" bovenop de nu robuustere basisdekking) en geen
wijziging aan de bestaande timing/transities.

**Testresultaten (gemeten, Playwright, 390×844, lokale server, zowel Chromium
als WebKit):**
- Vóór de fix: `getComputedStyle` identiek in beide browsers
  (`background-color: rgba(4,5,6,0.62)`, `opacity:1`,
  `backdrop-filter: blur(22px) saturate(1.5)`, `z-index:80`), maar
  screenshots tonen in WebKit de volledige achtergrond leesbaar, in Chromium
  vrijwel niets. Zie (niet meer aanwezig na herrun, wel beschreven):
  `screenshots/webkit/01-login.png` en `02-onboarding-slide1.png` vóór de fix.
- Na de fix: opnieuw gemeten in beide browsers — achtergrond in WebKit nu ook
  grotendeels gedimd/onleesbaar (vergelijkbaar met Chromium), Chromium
  ongewijzigd (was al correct, alpha-verhoging heeft daar geen zichtbaar
  effect omdat de blur het al afdekte).
- Regressiecontrole (beide engines, volledige `capture.js`-flow): check-in via
  tekst blijft uit (`aria-pressed` false, iteratie 1 intact), expliciete
  check-in-knop werkt, meter invullen werkt, alternatieven openen werkt, Stand/
  De rest-tabs en regenmodus renderen zonder fouten. Geen paginaerrors buiten
  de al bekende, onschadelijke `/api/place-photo`/`/api/state` 404's van de
  lokale statische server (geen backend).
- **Belangrijk voorbehoud:** gemeten met Playwright's gebundelde WebKit-engine
  (`webkit-2359`), niet op een echt iPhone/Safari. Representatief voor Safari's
  renderengine maar geen vervanging voor een fysieke-toesteltest — nog niet
  uitgevoerd.

## Ontwerpbesluiten (vervolg 9)

**Iteratie 10 (geen codewijziging) — WebKit op 320/375/390/430px gemeten,
geen gebreken gevonden.** Vervolg op iteratie 9. Gemeten met Playwright in
zowel Chromium als WebKit op alle vier vereiste breedtes: geen horizontale
overflow (`document.documentElement.scrollWidth` == `clientWidth` overal), en
de eerder gefixte aanraakdoelen (tijdlijnbol, klote-meter-knoppen,
alternatieven-toggle — iteraties 3/6/7/8) zijn op 320px in WebKit exact even
groot (`44×44px`) als in Chromium. Geen wijziging nodig; sluit dit specifieke
punt uit "Resterende problemen" af (met het voorbehoud hieronder).

**Iteratie 11 — snel wisselen tussen Zon/Regen kon de gekozen weeroptie
helemaal niet opslaan (herhaald-tikken-bug).** Getest volgens de opdracht
expliciet genoemde route "herhaald tikken". Eerste rapid-tap-tests op de
check-in-knop en de klote-meter-knoppen (10× resp. 5× snel achter elkaar)
gaven geen problemen — die togglen synchroon en correct. De Zon/Regen-
schakelaar bleek wél kapot bij snel wisselen: `button.onclick` in `bind()`
wikkelde de state-mutatie (`mode=nextMode; storeSet('utca-weather',mode)`)
IN de callback van `uiTransition()` (`document.startViewTransition`), en die
callback wordt niet synchroon met de klik uitgevoerd. Bij snel afwisselend
tikken (Regen→Zon→Regen…) leest de guard `if(nextMode===mode)return` van de
volgende klik dan nog de OUDE `mode`-waarde (de vorige transitie-callback is
nog niet uitgevoerd), waardoor die klik als "al actief" wordt gezien en
volledig genegeerd wordt — geen render, geen opslag, geen feedback.

Eerst gemeten met Playwright's element-locators (`.click()` op
`[data-mode="rain"]`), maar dat bleek zelf onbetrouwbaar: er staan twéé
elementen met `data-mode="rain"` in de DOM (de echte schakelaar plus een
gekloonde "stilstaande" preview in onboarding-slide 1), en Playwrights
locator-resolutie raakte daardoor zelf inconsistent bij snelle herhaalde
clicks. Opnieuw, betrouwbaar gemeten met pure synchrone JS-clicks
(`document.getElementById('journeyBar').querySelector(...).click()`,
ondubbelzinnig gescopet tot de echte schakelaar): vóór de fix eindigde
`localStorage.utca-weather` na 12 snelle afwisselende klikken op `null` — de
weerskeuze werd dus **helemaal nooit opgeslagen**, erger dan een "verkeerde"
eindstand. Na de fix eindigde dezelfde test correct op `"sun"` (de laatste
klik in de reeks).

Aanpak — kleinst mogelijke wijziging: `mode=nextMode`, `storeSet(...)` en de
`currentStop`-aanpassing verplaatst van vóór/binnen naar vóór de
`uiTransition()`-aanroep, zodat de logische state synchroon met de klik
bijgewerkt wordt. Alleen de puur visuele render-aanroepen
(`applyWeatherTheme`, `renderWeatherSwitcher`, `renderTimeline`, enz.) blijven
in de `uiTransition`-callback voor de bestaande overgangsanimatie. Geen
wijziging aan `uiTransition`/`document.startViewTransition` zelf, geen
wijziging aan andere knoppen.

**Testresultaten (gemeten, Chromium, pure synchrone JS-clicks, 12× snel
afwisselend Regen/Zon):** vóór de fix `localStorage.utca-weather === null`
(nooit opgeslagen); na de fix `=== "sun"` (correcte eindstand). Regressie:
10× snel de check-in-knop getikt → correct terug naar uit (even aantal);
5× snel een meter-knop getikt → correct actief (oneven aantal); enkele
Zon/Regen-klik (niet-rapid) werkt ongewijzigd; volledige `capture.js`-vlucht
(login t/m regenmodus) draait foutloos door, iteratie 1 (geen incheck bij
tekst-tap) intact.

**Les voor vervolgiteraties:** bij testen met Playwright-locators die op
`data-*`-attributen matchen, eerst controleren of de onboarding-preview
(gekloonde DOM-fragmenten in `.ob-canvas`) dezelfde attributen dupliceert —
dat gaf hier een misleidend eerste testresultaat dat leek te zeggen dat de
fix niet werkte, terwijl de fix wel degelijk correct was. Scopen tot een
ondubbelzinnig element (bijv. via een uniek `id` als `#journeyBar`) vóórkomt
dit.

## Ontwerpbesluiten (vervolg 10)

**Iteratie 12 — verbindingsverlies getest; onopgevangen "Failed to fetch"
gevonden en gefixt in de fotolaad-functie.** Getest volgens de opdracht
expliciet genoemde route "verbindingsverlies", ditmaal met echte
netwerkonderbreking (Playwright `page.route('**/api/**', route =>
route.abort('internetdisconnected'))`) in plaats van de 404's/501's die de
lokale statische server toch al geeft. Functioneel bleek de app al robuust:
check-in en meter-invullen vallen correct terug op de lokale-opslag-modus met
een eerlijke `"Lokaal opgeslagen"`-toast, en na een pagina-herlaad (verbinding
nog steeds weg) blijven naam, huidige stop en meterscores volledig bewaard
(`localStorage`) — precies het gedrag dat de opdracht vraagt ("Bestaande
gebruikersgegevens blijven behouden").

Wél gevonden: `page.on('pageerror')` ving 11× een **onopgevangen**
`"Failed to fetch"` op tijdens deze test — een echte JavaScript-fout (zichtbaar
in de browserconsole, potentieel opgepikt door toekomstige crash-/analytics-
tooling), ondanks dat de gebruiker zelf niets verkeerd zag. Oorzaak:
`loadPlacePhoto()` in `app.js` hergebruikt één gedeelde fetch-`promise` in
*twee* onafhankelijke chains — `promise.then(...).catch(...)` (die de
gebruikers-fallback afhandelt, en die werkte al prima) én los daarvan
`promise.finally(function(){delete placePhotoInflight[key]})`, zónder eigen
`.catch()`. Een `.finally()` zonder opvolgende `.catch()` geeft bij een
afgewezen promise een eigen, apart onopgevangen "unhandled rejection" — dat is
onafhankelijk van of een ándere chain op dezelfde promise wél netjes vangt.

Wie er last van heeft: niemand zichtbaar vandaag (geen UI-effect), maar wel
een reëel risico voor toekomstig debuggen/monitoren (ruis in de console/
crashrapportage bij elke gefaalde foto-fetch, wat op een festival-dag met
wisselend bereik vaak zal voorkomen) en simpelweg incorrecte JS-hygiëne.

Aanpak — kleinst mogelijke wijziging: één `.catch(function(){})` toegevoegd
ná de bestaande `.finally(...)`-aanroep, zodat alléén die specifieke,
voorheen-ongevangen chain een no-op-vanger krijgt. De bestaande, al werkende
`promise.then(...).catch(...)`-chain (met de echte UI-fallback) is niet
aangeraakt.

**Testresultaten (gemeten, Chromium, echte `route.abort()`-netwerkonderbreking,
375×812):** vóór de fix 11 onopgevangen `"Failed to fetch"`-fouten tijdens
check-in + meter-invullen + reload; na de fix 0. Functioneel ongewijzigd in
beide gevallen: toast `"Lokaal opgeslagen"` bij check-in en meter, groepslijst
toont de lokale gebruiker met score, en na reload blijven naam/stop/ratings
correct bewaard. Regressie: volledige `capture.js`-vlucht (Chromium) draait
nog foutloos door; Zon/Regen-fix (iteratie 11) en tekst-tap-fix (iteratie 1)
beide nog intact.

## Ontwerpbesluiten (vervolg 11)

**Iteratie 13 — echte regressie gevonden en gefixt: kapotte HTML in de
groepslijst-scorebadge, live sinds iteratie 5.** De gebruiker stuurde een
echte iPhone/Safari-screenshot van "Waar is iedereen?": op desktop (Chrome)
zagen de percentage-badges er correct uit, maar op een echt iPhone toonde elke
badge een storende witte rechthoek achter het percentage, en de "—"
(geen score) werd een volle grijze balk in plaats van een klein streepje.

Onderzoek (Playwright, eerst WebKit, later bevestigd in beide engines):
`document.querySelectorAll('.score')` gaf **0** resultaten, terwijl de
gerenderde pillen er visueel wél uitzagen alsof de styling werkte. Reden:
`app.js` bevatte letterlijk `<divclass="score percent" style="...">` —
**geen spatie tussen `div` en `class`**, waardoor de browser dit als een
onbekend tag-achtig fragment parseert in plaats van een `<div>` met een
`class`-attribuut. Chromium en WebKit herstellen zich hier zichtbaar
verschillend van (vandaar "goed op desktop, kapot op iPhone"). Dit was **geen
pre-existente bug**: bevestigd met `git log`/`grep` dat de baseline (vóór
iteratie 1) hier correct `<div class="score percent"` had, en dat de spatie
verdween in de diff van **commit `c6df4bf`, iteratie 5** ("tekstlabel
'verouderd'..."), waarschijnlijk een tik-/kopieerfout tijdens die
stringvervanging. Deze regressie stond dus al sinds iteratie 5 (7+ iteraties)
onopgemerkt live, omdat geen van de tussentijdse regressiecontroles specifiek
de group-list-HTML-structuur inspecteerde — alleen functioneel gedrag
(aria-pressed, meter, alternatieven) en algemene screenshots, en dit gaf geen
JS-fout, dus het viel niet op zonder een echte close-up van dit specifieke
scherm.

Wie er last van had: iedereen die "Waar is iedereen?" bekeek op een echt
iPhone (of andere WebKit-browser) — een van de kernschermen van de app, die
er sinds iteratie 5 zichtbaar kapot uitzag voor die gebruikers, terwijl elke
screenshot die ík maakte er toevallig via Chromium of via een té grove
WebKit-vlucht (die dit specifieke scherm niet met echte scores testte) prima
uitzag.

Aanpak: de ontbrekende spatie teruggezet (`div class="score percent"`). Eén
teken, geen andere wijziging.

**Testresultaten (gemeten, Playwright, Chromium + WebKit, 375×812):** vóór de
fix `document.querySelectorAll('.score').length === 0` in WebKit, zichtbare
witte rechthoek-artefacten in screenshots; ná de fix `.score` matcht correct
(bevestigd via `elementsFromPoint` dat het element netjes gestapeld zit:
`.score`→`.person`→`.group`→`.app`), en een zoom-crop van de badge toont een
schone pil zonder artefact — visueel identiek aan de door de gebruiker
gedeelde, correcte desktop-screenshot. Volledige `capture.js`-regressievlucht
(login t/m regenmodus) draait foutloos door in zowel Chromium als WebKit;
iteratie 1/11/12 (tekst-tap, Zon/Regen-race, verbindingsverlies) alle nog
intact.

**Les voor vervolgiteraties:** een stringvervanging in geconcateneerde
HTML-templates kan een spatie laten vallen zonder dat er ooit een JS-fout
optreedt — de browser "vangt" het stilzwijgend op een manier die per engine
verschilt. Regressiecontrole op basis van alleen functioneel gedrag
(aria-pressed, toasts) mist dit soort bugs volledig; visuele controle is
nodig, en idealiter een expliciete `document.querySelectorAll(<verwachte
selector>).length` check vlak na elke wijziging aan een render-functie die
HTML-strings samenstelt, niet alleen ná wijzigingen die zulke functies
*direct* raken maar ook als steekproef bij latere iteraties.

## Ontwerpbesluiten (vervolg 12)

**Iteratie 14 — expliciete gebruikersfeedback: te weinig zichtbare voortgang
op de eigenlijke Polarsteps-ontwerprichting.** De gebruiker gaf aan dat de
verwachtingen voor deze UX/design-overhaul hoger liggen, met een expliciete
verwijzing naar polarsteps.com. Terechte correctie: iteraties 1–13 waren
overwegend bugfixes en aanraakdoel-hygiëne (waardevol, maar niet de kern van
"design overhaul"), terwijl het gefaseerde Polarsteps-plan (zie
"Ontwerprichting: Polarsteps" hierboven) na iteratie 4 grotendeels stil lag.

Aanpak — een echte, zichtbare stap in plaats van nog een micro-fix, gericht op
het stopkaart-component (het meest gebruikte, meest bepalende scherm-element):

1. **Minder chrome op de foto.** De losse tijd-badge (icoontje + tijd, als
   zwevend rondje linksboven op de foto) is volledig verwijderd. Dat was
   precies het soort "label boven elk blokje" dat de opdracht als
   Polarsteps-tegenpool noemt ("Minder chrome... ruimte doet het werk in
   plaats van lijnen").
2. **Tijd verhuisd naar de rustige metadata-regel.** In plaats van een aparte
   badge staat de tijd nu samen met de locatie op één rustige regel onder de
   titel ("Stationsplein, Utrecht · 09:30–09:45"), zoals Polarsteps' quiete
   metadata-regel onder de plaatsnaam — één informatieblok in plaats van twee
   losse.
3. **Grotere, dominantere foto.** `.card-media` aspect-ratio van 16/8.4
   (≈1.9:1, kort/breed) naar 16/11 (≈1.45:1) — merkbaar meer foto, meer
   "reisverhaal", minder lijst-rij.
4. **Zwaardere titel.** `.name` van 22px/700 naar 27px/800 (mobiel: 20→23px),
   voor een duidelijker "één grootste element per kaart"-hiërarchie zoals de
   opdracht vraagt.

Bewust ongewijzigd gelaten (uit eerdere, nog geldige afweging): het donkere
thema met limegroen-accent (Polarsteps' eigen crème/marineblauw/koraalrood is
de marketingsite-huisstijl, niet iets om te kopiëren — de opdracht vroeg
expliciet om Polarsteps' *ontwerplogica* over te nemen binnen DE RONDE's
eigen, herkenbare identiteit). Ook ongewijzigd: de tijdlijnrail met kleine
dots (Polarsteps' ronde foto-avatars op de route-lijn, punt 2 uit het
gefaseerde plan) — dat is een grotere, aparte ingreep die een eigen iteratie
verdient, nu dat de kaart zelf is aangepakt.

**Testresultaten (gemeten):** volledige `capture.js`-regressievlucht (login
t/m regenmodus) draait foutloos door in zowel Chromium als WebKit. Expliciet
gecontroleerd dat de bestaande incheck-uitsluiting (iteratie 1) intact blijft
nu `.location` ook de tijd bevat: `document.querySelector('.location').click()`
op stop "start" laat `aria-pressed` op `false` staan. Getest op 320px
(smalste breedte): langere adressen ("Oudegracht aan de Werf 275, Utrecht ·
10:00–11:45") wrappen netjes naar twee regels binnen de foto-scrim, geen
afkapping, geen overlap met de titel erboven. Reserveringstijden Kanoverhuur/
Pool ongewijzigd zichtbaar. Zie `screenshots/before/03-timeline-top.png`
(oorspronkelijke baseline-vormgeving, iteratie 1) vs.
`screenshots/after/03-timeline-top.png` (na deze iteratie) voor een direct
voor/na-beeld van het kaartontwerp.

**Eerlijk voorbehoud:** dit is één stap in een langer traject, geen
"klaar"-moment. De gebruiker heeft nog niet gereageerd op déze stap — de
volgende iteratie moet hun reactie eerst meewegen voordat verder wordt
gebouwd op deze richting (bijvoorbeeld door verder te gaan met de
route-lijn/foto-avatars, of juist bij te sturen als dit niet is wat werd
bedoeld).

## Ontwerpbesluiten (vervolg 13)

**Iteratie 15 — de tijdlijnrail zelf veranderde nooit van kleur bij
voortgang, alleen de bolletjes.** Vervolg op iteratie 14 (gebruiker wil meer
zichtbare Polarsteps-voortgang). Herlezing van de oorspronkelijke opdracht
leverde een concreet, nog niet vervuld puntje op uit de Polarsteps-sectie
zelf: "Doorlopende routelijn. Eén verticale rail die de hele dag verbindt en
visueel van staat verandert bij afgeronde stops." Codeonderzoek (`app.css`)
bevestigde: `.tl-rail::before`/`::after` (de verticale lijnsegmenten tussen
de bolletjes) hadden een vaste, statische grijze kleur (`#31353a`),
ongeacht voortgang — alléén de node (bolletje) zelf veranderde van kleur/
grootte bij done/current. Dat is precies het omgekeerde van wat de opdracht
vraagt: de *lijn* moet de doorlopen route tonen, niet alleen de losse
stippen.

Wie er last van heeft: iedereen die snel wil zien "hoever zijn we al" —
zonder kleurverandering in de lijn zelf oogt de tijdlijn als een lijst met
losse statussymbolen in plaats van een samenhangende, doorlopen route (het
kernbeeld dat Polarsteps juist wél geeft).

Aanpak — kleinst mogelijke wijziging, puur CSS: de JS zet allang `.done`/
`.current`/`.todo`-klassen op zowel stop- als looprijen (`stopStates()`/
`updateCheckinUi()`, ongewijzigd). Toegevoegd: `.tl-row.done .tl-rail::before,
.tl-row.done .tl-rail::after, .tl-row.current .tl-rail::before,
.walkrow.done .tl-rail::before{background:var(--lime)}`. Logica: een
afgeronde stop kleurt zowel de lijn ervoor als erna (je bent er voorbij);
de huidige stop kleurt alleen de lijn ervóór (je bent er, nog niet voorbij);
een afgeronde loopsectie kleurt zijn eigen segment. Geen JS-wijziging nodig
— de klassen bestonden al. `var(--lime)` pakt automatisch de regenmodus-
accentkleur over (zelfde patroon als de rest van de app), dus geen aparte
regenmodus-regel nodig.

**Testresultaten (gemeten, Playwright/Chromium):**
- Geen enkele check-in: eerste lijnsegment blijft grijs
  (`rgb(49,53,58)` = `#31353a`) — ongewijzigd gedrag.
- Ingecheckt bij stop 3: lijn van bovenaf tot en met stop 3 lime, direct
  daarna (richting stop 4, nog niet bereikt) weer grijs — visueel bevestigd
  met een screenshot en gemeten via `getComputedStyle`.
- Volledige rand-case (ingecheckt bij de láátste stop "finish"): alle
  voorgaande segmenten lime; het laatste segment ná de laatste stop bestaat
  sowieso niet (`:last-child .tl-rail::after{content:none}`, ongewijzigd) —
  geen breuk, geen dubbele/foute kleur.
- Regenmodus: lijnkleur volgt automatisch de blauwe accentkleur
  (`rgb(127,214,238)`) zonder extra CSS.
- Volledige `capture.js`-regressievlucht (Chromium + WebKit, login t/m
  regenmodus) draait foutloos door; iteratie 1 (tekst-tap) bevestigd intact.
- Niet opnieuw expliciet hermeten op 320/430px (puur kleurwijziging, geen
  maat-/layoutwijziging, dus geen breedte-afhankelijk risico) — wel al eerder
  bevestigd dat de rail-node-afstanden op 320px geen overlap geven
  (iteratie 3).

## Ontwerpbesluiten (vervolg 14)

**Gebruikersfeedback op iteratie 14/15: positief, met één gerichte
correctie.** De gebruiker bevestigde expliciet dat de nieuwe stopkaart-
vormgeving "helemaal perfect" is, met één concreet verzoek: het "· 11"
(puntje + totaalaantal) achter "STOP N" weghalen, verder niets veranderen.
Dit bevestigt dat de richting van iteratie 14 (minder chrome, grotere foto,
zwaardere titel) en 15 (kleurende routelijn) klopt met wat werd bedoeld —
belangrijk signaal om op door te bouwen bij een volgende designstap.

**Iteratie 16 — "STOP N · 11" wordt "STOP N".** Letterlijk verzoek,
letterlijk uitgevoerd: in `app.js` de tekst `' · '+arr.length` verwijderd uit
het `media-index`-label, zodat er alleen nog "Stop 1", "Stop 2", enz. staat.
Geen andere wijziging — expliciet gevraagd door de gebruiker
("verder niks veranderen").

**Testresultaten (gemeten):** visueel bevestigd op stop 1 t/m meerdere
stops dat het label nu "STOP N" toont zonder "· 11", zowel in de hoofd-
tijdlijn als in de onboarding-preview (die dezelfde markup hergebruikt).
Volledige `capture.js`-regressievlucht (Chromium + WebKit, login t/m
regenmodus) draait foutloos door; incheck-uitsluiting van iteratie 1
bevestigd intact (`aria-pressed` blijft `false` bij een tik op de
metadata-tekst). Reserveringstijden ongewijzigd (niet aangeraakt door deze
wijziging).

## Ontwerpbesluiten (vervolg 15)

**Iteratie 17 — onboarding-dialoog had geen focus-trap; toetsenbordgebruikers
konden "weglekken" naar de achtergrond.** De opdracht vraagt expliciet om
gecontroleerde "toetsenbordbediening, focus, dialooggedrag" — nog niet
systematisch getest in 16 iteraties. De onboarding-overlay heeft
`role="dialog" aria-modal="true"`, maar er was geen enkele focus-logica:
geen initiële focus bij openen, geen focus-restore bij sluiten, en geen
focus-trap (Tab kon vrij naar de achtergrondpagina lopen).

Bij het testen van de trap bleek het probleem groter dan verwacht: de
bestaande `onboardingClone()`-functie (die de "stilstaande" preview-
afbeeldingen in de onboarding bouwt door échte app-onderdelen te klonen)
zette al `tabindex="-1"` op `a,button,input,summary` binnen elke kloon — maar
**niet** op elementen met een expliciete `role="button"`/`tabindex="0"` die
geen van die tags zijn, zoals `.journeycopy` (`<div role="button"
tabindex="0">`) en de tijdlijnbol (`<span role="button" tabindex="0">`).
Gemeten (Playwright): na het focussen van de "Overslaan"-knop bracht Tab de
focus naar een gekloonde, onzichtbare `.journeycopy` mídden in de
onboarding-preview in plaats van naar de "Terug"-knop — een toetsenbord-
gebruiker "verdwaalde" dus in onzichtbare klooninhoud.

Wie er last van heeft: iedereen die de onboarding met het toetsenbord (of
een schermlezer) doorloopt in plaats van met de muis/vinger — Tab deed iets
onvoorspelbaars in plaats van keurig tussen Overslaan/Terug/Volgende te
blijven.

Aanpak — kleinst mogelijke, gerichte wijzigingen, alle drie in `app.js`:
1. `onboardingClone()`: selector uitgebreid van `'a,button,input,summary'`
   naar `'a,button,input,summary,[tabindex],[role="button"],[role="link"]'`,
   zodat ook divs/spans met een interactieve rol in klonen niet-tabbaar
   worden.
2. `openOnboarding()`: zet bij het openen focus expliciet op de
   "Volgende"-knop.
3. `closeOnboarding()`: zet bij het sluiten focus expliciet op de "Hier"-tab
   onderin (sluit aan bij de al bestaande `setBottomTabActive('hier')`-
   aanroep op dezelfde regel).
4. De bestaande `keydown`-handler (Escape/pijltjestoetsen) uitgebreid met een
   Tab/Shift+Tab-afhandeling die de focus tussen "Overslaan" en "Volgende"
   laat rondlopen (wrap), zodat de drie echte knoppen een gesloten lus vormen.
`onboardingBackToName()` had al correcte focus-restore naar het naamveld —
niet aangeraakt.

**Testresultaten (gemeten, Playwright/Chromium, echte toetsenbordinvoer via
`page.keyboard.press`):**
- Direct na openen: `document.activeElement.id === 'onboardingNext'`.
- Tab vanaf "Volgende": springt naar "Overslaan" (wrap, geen weglek meer naar
  de achtergrond of gekloonde preview-inhoud).
- Shift+Tab vanaf "Overslaan": springt terug naar "Volgende".
- Normale volgorde Overslaan→Terug→Volgende: nu correct, vóór de fix ging
  Overslaan→(gekloonde, onzichtbare `.journeycopy`)→... in plaats van direct
  naar Terug.
- Sluiten met Escape: focus verplaatst zich naar de "Hier"-tab onderin.
- Regressie: volledige `capture.js`-vlucht (Chromium + WebKit, login t/m
  regenmodus) draait foutloos door; incheck-uitsluiting (iteratie 1) en
  overige eerder gefixte iteraties niet geraakt (geen van de wijzigingen zit
  in gedeelde renderpaden).
- **Niet getest:** een echte schermlezer (VoiceOver/NVDA) — dit is
  geverifieerd via programmatische focus/toetsenbordsimulatie, niet met
  daadwerkelijke assistieve technologie.

## Ontwerpbesluiten (vervolg 16)

**Iteratie 18 — "minder AI visual style", op expliciet verzoek van de
gebruiker.** De gebruiker vroeg (naar aanleiding van de link naar de live
site utca26.pages.dev) of dit eruitziet als een AI-gemaakte app, en gaf na
mijn antwoord expliciet aan: "graag minder AI visual style". Mijn antwoord
identificeerde twee concrete, herkenbare "AI-template"-signalen los van de
duidelijk bespoke copy: (1) drie kleurige radial-gradient "gloed"-vlekken
op de achtergrond (lime/blauw/wit), een zeer herkenbaar "AI-hero-achtergrond"
patroon; (2) vrijwel elke interactieve control als volledige stadion-pil
(`border-radius:999px`) — knoppen, chips, badges, tabbladen, toast, meter-
track — een "alles is een capsule"-uniformiteit die ook sterk met AI-
gegenereerde UI geassocieerd wordt.

Aanpak — twee gerichte, low-risk wijzigingen, geen grote herschrijving en
geen wijziging aan de donker+limegroen-identiteit zelf (die blijft, alleen
de vorm-taal wordt minder generiek):
1. `--r-pill` (het CSS-token dat vrijwel elke knop/chip/badge/tab in de app
   stuurt) van `999px` naar `16px` — knoppen worden afgeronde rechthoeken in
   plaats van volledige pillen. Aangepast op drie plekken die dit token
   dupliceren: `app.css` (`:root`) én de kritische inline `<style>` in
   `index.html` (voor het allereerste, ongestileerde naamscherm vóór
   `app.css` laadt — anders zou die éérst nog met de oude pil-vorm flitsen).
2. De drie decoratieve radial-gradient achtergrondvlekken verwijderd uit
   `body{background-image:...}` én uit de `body.rain-mode`-variant, met
   behoud van de bestaande verticale verdonkerings-gradient (het rustige
   dieptegevoel blijft, de kleurige "gloed" is weg).

Bewust ongewijzigd gelaten: de kleine radial-gradient achter de
eindstand-kaart (`.finalresult::before`, een spotlicht-achtig accent achter
de winnaar) — dat is een doelgerichte, contextuele decoratie op één plek,
geen onderdeel van het generieke "overal gloed"-patroon waar de vraag over
ging. Ook ongewijzigd: lettertype (systeemfont), donkere basiskleur,
lime-accent, glassmorphism/backdrop-blur op de sticky elementen — dat zijn
grotere, subjectievere keuzes die een aparte, bewuste afweging verdienen
(zie "Resterende problemen").

**Testresultaten (gemeten):** volledige `capture.js`-regressievlucht
(Chromium + WebKit, login t/m regenmodus) draait foutloos door — puur
CSS-wijzigingen, geen enkele HTML/JS-structuur geraakt. Expliciet
hergemeten op 320px dat de eerder gefixte 44×44px-aanraakdoelen (tijdlijnbol,
klote-meter-knoppen, alternatieven-toggle — iteraties 3/6/7/8) ongewijzigd
`44px`/`44px` blijven (`border-radius` raakt de doosafmetingen niet, maar
expliciet bevestigd in plaats van aangenomen). Geen tekstoverloop of
overlappende bediening op 320px. Visueel gecontroleerd op login, tijdlijn,
meter, alternatieven, onboarding, groepslijst — consistent afgeronde
rechthoeken in plaats van pillen, achtergrond rustig zonder kleurvlekken,
verder identieke indeling/inhoud.

## Ontwerpbesluiten (vervolg 17)

**Iteratie 19 — vier expliciete verzoeken van de gebruiker in één keer
verwerkt.** Reactie op iteratie 18 was positief; vier concrete, losstaande
wensen aangeleverd:
1. **"THE ABSOLUTE BOLLOCKS" → "DE BALZAK"** en **"THE LIONEL RICHIE" →
   "DE LIONEL RICHIE"** — kopij-wijziging in `index.html` (`.final-stat-label`
   van de eindstand-/tussenstand-kaarten). Letterlijk uitgevoerd.
2. **"Stop N"-label volledig weg van de foto's** — vervolg op iteratie 16
   (die haalde alleen "· 11" weg, nu de héle `media-index`-regel verwijderd
   uit `app.js`). De voortgangsteller in de journeybar ("X / 11") en de
   tijdlijnrail zelf blijven de enige voortgangsindicatoren; dat is
   voldoende, dus geen functieverlies.
3. **"3 andere opties +" in lime**, consistent met de routelijn (iteratie 15)
   en de Check-in-knop. `.alternatives summary` van grijs/wit
   (`rgba(255,255,255,.6)`/`#fff`) naar `var(--limeText)`/
   `var(--limeTextHover)`, plus de onderstreping naar `var(--limeLine)`.
   Omdat dit dezelfde CSS-variabelen zijn als de routelijn/knoppen, past de
   kleur automatisch mee in regenmodus (blauw accent) — geen aparte regel
   nodig.
4. **Nog een stap "minder AI"** — vervolg op iteratie 18. Gekozen: gerichter
   gebruik van `backdrop-filter` (glassmorphism-blur), één van de twee
   destijds bewust uitgestelde vervolgstappen. `.card` (elke stopkaart) en
   `.dayresult` (dagstand-paneel) gebruikten blur zonder functionele reden —
   ze liggen niet over bewegende/scrollende inhoud, alleen over de statische
   paginaondergrond. Backdrop-filter verwijderd bij die twee (de
   halfdoorzichtige achtergrondkleur zelf blijft ongewijzigd), terwijl de
   werkelijk functionele blur (sticky journeybar, bottom-nav, modale
   overlays, toast — die wél over scrollende/wisselende inhoud liggen)
   ongewijzigd blijft. Bijkomend voordeel: minder GPU-compositing over 11
   gestapelde kaarten, dus ook een kleine, geen-nadelige performance-winst.

**Testresultaten (gemeten):** volledige `capture.js`-regressievlucht
(Chromium + WebKit, login t/m regenmodus) draait foutloos door. Kopij-
wijzigingen geverifieerd via `document.querySelectorAll('.final-stat-label')`
(geeft nu `["DE BALZAK","DE KLOOTZAK","DE LIONEL RICHIE"]`). Geen "Stop N"-
tekst meer aanwezig in de volledige paginatekst van alle 11 stops (via
`get_page_text` gecontroleerd). "3 andere opties +" visueel bevestigd in
lime met lime onderstreping op meerdere stops. Reserveringstijden Kanoverhuur
(10:00–11:45), Pool (14:00–15:00), JEU (17:00–18:00) en De Poort
(19:00–21:00) ongewijzigd zichtbaar in de volledige paginatekst.
Incheck-uitsluiting (iteratie 1) niet geraakt (geen wijziging aan de
klikhandler-logica).

## Ontwerpbesluiten (vervolg 18)

**Iteratie 20 — kritieke, tot nu toe onopgemerkte bug: cache-buster nooit
verhoogd, ondanks 19 iteraties aan wijzigingen in `app.css`/`app.js`.** Bij
het lezen van `sw.js` (nooit eerder geïnspecteerd in dit project) en
`README.md`'s eigen changelog viel op dat dit project een strikte,
zelf-gedocumenteerde conventie heeft: elke wijziging aan `app.css`/`app.js`
hoort gepaard te gaan met een verhoogde `?v=`-cache-buster in `index.html`
én `sw.js`, plus een nieuwe `SHELL_CACHE`-naam in de service worker — omdat
`_worker.js` deze twee bestanden serveert met
`cache-control: public, max-age=31536000, immutable` (één jaar, nooit
hervalideren). Zonder een gewijzigde URL blijft een browser die de site al
één keer bezocht heeft **voor altijd** de oude, ongewijzigde inhoud
gebruiken — ook na een herlaad, ook na het sluiten en heropenen van de
geïnstalleerde PWA.

`index.html`/`sw.js` stonden nog steeds op `app.css?v=97.4` en
`app.js?v=97.1` (`SHELL_CACHE='utca-shell-v48'`) — exact de baseline-waarden
van vóór iteratie 1. Alle 19 iteraties sindsdien hebben dus `app.css`/`app.js`
inhoudelijk gewijzigd zonder de cache-buster te verhogen. Dit had geen
zichtbaar effect in mijn eigen testen (lokale `python3 -m http.server`
negeert query-strings en cachet niets een jaar lang), maar zou bij een
daadwerkelijke Cloudflare Pages-deploy betekenen dat **niemand die de site
al eerder bezocht — inclusief iedereen die de live versie al heeft
bekeken vóór deze overhaul — ook maar één van de 19 iteraties te zien zou
krijgen**, tenzij ze handmatig hun browsercache wissen.

Wie er last van heeft: praktisch iedereen in de vriendengroep, want de live
site (`utca26.pages.dev`) is al bezocht vóór dit overhaul-traject begon.

Aanpak: cache-buster voor `app.css`/`app.js` verhoogd naar `v=98` in
`index.html`, `sw.js` (`APP_SHELL`) én `test-local.html` (voor de
consistentie, al is dat bestand niet onderdeel van de deploy);
`SHELL_CACHE` verhoogd naar `utca-shell-v49`. Manifest/iconen/onboarding-
afbeeldingen zijn inhoudelijk ongewijzigd gebleven in alle 19 iteraties, dus
die versienummers bewust niet aangeraakt (geen echte staleness daar, wel
onnodige herdownload als ze toch verhoogd zouden worden). Een changelog-
regel toegevoegd aan `README.md` in de bestaande stijl van het project
("v98"), inclusief een expliciete waarschuwing voor toekomstige iteraties om
dit niet opnieuw te vergeten.

**Testresultaten (gemeten):** `node --check` op `sw.js` en `app.js`
bevestigt geldige syntax na de wijziging. Lokale server bevestigt dat
`/app.css?v=98` en `/app.js?v=98` correct 200 OK teruggeven. Volledige
`capture.js`-regressievlucht (Chromium + WebKit) draait foutloos door —
verwacht, want dit is een pure cache-metadata-wijziging zonder functionele
impact op gedrag. **Niet en kan niet lokaal getest worden:** het daadwerkelijke
service-worker-installatie-/activatiegedrag (registreert alleen op HTTPS,
niet op `http://localhost`) en of Cloudflare's edge-cache een reeds
gecachete oude versie van `/app.css`/`app.js` bij deploy daadwerkelijk
vervangt — dat kan alleen na een echte deploy geverifieerd worden (bv. met
devtools Application-paneel: Service Worker + Cache Storage inspecteren, of
een harde reload vs. gewone reload vergelijken).

**Les voor vervolgiteraties (belangrijk, ook voor de gebruiker bij
handmatig verder werken):** verhoog `?v=` voor `app.css`/`app.js` in
`index.html` + `sw.js`, en `SHELL_CACHE` in `sw.js`, bij ELKE wijziging aan
die twee bestanden — niet alleen bij grote releases. Dit is nu tot v98
verhoogd; een volgende iteratie die deze bestanden wijzigt moet naar v99,
enzovoort.

## Ontwerpbesluiten (vervolg 19)

**Iteratie 21 — echte functionele bug gevonden via een gebruikersscreenshot:
de eindstand toonde niet de werkelijke top 3.** De gebruiker stuurde een
screenshot van de groepslijst + tussenstand waarin "Jeff" apart zichtbaar was
met 67% — hoger dan "Jeroen" op plek 2 (63%) — terwijl Jeff nergens in de
tussenstand-podium stond. Bij het naleggen van `renderFinalResult()` bleek de
ranglijst NOOIT een echte top-3-op-score te zijn geweest: plek 1 = hoogste
score, plek 3 = laagste score, maar **plek 2 = wie het dichtst bij het
rekenkundig gemiddelde van hoog en laag zit** — niet per se de op één na
hoogste score. Bij 4+ deelnemers kon dit dus willekeurig iemand met een
hogere score dan "plek 2" volledig van het podium laten verdwijnen, precies
wat er in de screenshot gebeurde (Jeff's 67% lag verder van het midden
(62,5%) dan Jeroens 63%, dus won Jeroen de "midden"-plek terwijl Jeff — met
een hogere, "ergere" score — nergens stond).

Wie er last van heeft: iedereen zodra er 4 of meer deelnemers een score
hebben — de kernfunctie van de app (wie staat waar in de "naar de klote"-
ranglijst) gaf dan een onjuist, soms behoorlijk misleidend beeld.

Aanpak: de `hi`/`lo`/`mid`/`balance`-heuristiek vervangen door een echte
sortering: alle unieke scores aflopend sorteren, de top 3 unieke scores
vullen plek 1/2/3 (gelijke scores blijven zoals voorheen samengevoegd met
"&"). Bijkomende verbetering: als er minder dan 3 unieke scores zijn (bv.
maar 1 deelnemer heeft gescoord), worden de overige plekken nu leeg
("—") in plaats van dezelfde persoon 3× te herhalen — dat laatste was de
bestaande, ongewenste bijwerking van de oude logica bij weinig deelnemers.

Daarnaast drie gerichte, expliciet gevraagde wijzigingen: **"TUSSENSTAND" →
"DEGRADATIESTRIJD"** (alleen de tussentijdse titel; "EINDSTAND" bij een
afgeronde dag blijft ongewijzigd, niet genoemd door de gebruiker) in zowel
de statische HTML als de JS-fallback; en de drie `.final-stat-sub`-regels
("ZONDAG?", "BEST OF BOTH WORLDS", "EASY LIKE A SONNTAG MORGEN") volledig
verwijderd uit `index.html`.

**Testresultaten (gemeten, Playwright/Chromium, gemockte `/api/state` met
exact het scenario uit de screenshot: Karel&Rik 75%, Jeff 68%, Jeroen 63%,
Kevin&Deef 50%):** vóór de fix zou Jeroen (dichtst bij midden 62,5%) plek 2
krijgen en Jeff nergens verschijnen; na de fix: plek 1 Karel & Rik 75%, plek
2 **Jeff 68%**, plek 3 Jeroen 63% — Kevin & Deef (50%) terecht buiten de
top 3. Rand-geval: met precies 1 gescoorde deelnemer tonen plek 2 en 3 nu
correct "—" i.p.v. dezelfde naam herhaald. Titel toont "DEGRADATIESTRIJD";
geen `.final-stat-sub`-elementen meer in de DOM. Volledige
`capture.js`-regressievlucht (Chromium + WebKit) draait foutloos door.
Reserveringstijden en incheck-uitsluiting (iteratie 1) niet geraakt.

## Ontwerpbesluiten (vervolg 20)

**Iteratie 22 — vervolg op iteratie 21: "DE BALZAK"/"DE KLOOTZAK"/
"DE LIONEL RICHIE" ook weg.** Gebruiker had in de vorige screenshot alleen
de `.final-stat-sub`-regels (ZONDAG?, etc.) benoemd; de `.final-stat-label`-
regels (de rangnamen zelf) bleven nog staan en zijn nu op expliciet verzoek
ook verwijderd uit `index.html`. Elke podiumplek toont nu alleen nog naam +
percentage + balk, geen naam-label meer. Alleen `index.html` gewijzigd
(geen `app.css`/`app.js`), dus geen cache-buster-verhoging nodig — die twee
bestanden hebben sowieso al een always-revalidate cache-header
(`max-age=0, must-revalidate`), in tegenstelling tot `app.css`/`app.js`.

**Testresultaten (gemeten):** `document.querySelectorAll('.final-stat-label').length`
geeft `0` na de wijziging. Visueel bevestigd (screenshot van `#finalResult`
rechtstreeks, om scroll-timing-onbetrouwbaarheid van eerdere iteraties te
omzeilen) dat de kaarten er clean uitzien: rangnummer, naam(en), percentage,
balk — verder niets. Volledige `capture.js`-regressievlucht (Chromium +
WebKit) draait foutloos door. Iteratie 21's ranglijst-fix (top 3 op score)
ongewijzigd correct: Jeff (68%) blijft op plek 2 in dezelfde testdata.

## Ontwerpbesluiten (vervolg 21)

**Iteratie 23 — `.roster-stack`-blur meegenomen in de "minder chrome"-lijn.**
Laatste openstaande punt uit de iteratie-19-notitie: de rechtsboven
avatar-stack-knop ("C 1/6") gebruikte nog decoratieve `backdrop-filter`
zonder functionele reden (`.topline` is niet sticky, ligt niet over
scrollende/wisselende inhoud — zelfde categorie als `.card`/`.dayresult` vóór
iteratie 19). Backdrop-filter verwijderd, achtergrondkleur (`rgba(28,30,30,.52)`)
ongewijzigd gelaten. Sticky/modale elementen (journeybar, bottom-nav,
overlays, toast) blijven bewust ongewijzigd geblurd.

**Testresultaten (gemeten):** visueel gecontroleerd (ingelogd, 390×844) dat
de "C 1/6"-pill leesbaar en verzorgd blijft zonder blur. Volledige
`capture.js`-regressievlucht (Chromium + WebKit) draait foutloos door.
Reserveringstijden Kanoverhuur/Pool/JEU ongewijzigd zichtbaar in de volledige
paginatekst. `app.css` gewijzigd, dus cache-buster verhoogd naar `v=99` in
`index.html`/`sw.js`/`test-local.html` en `SHELL_CACHE` naar
`utca-shell-v51` (conventie uit iteratie 20).

## Ontwerpbesluiten (vervolg 22)

**Iteratie 24 — drie gerichte kopij-wijzigingen, op basis van een echte
schermafbeelding van de gebruiker.** Screenshot toonde de groepslijst met
de kleine ondertitel "laatste check-ins & tussenstand" onder de kop "Waar is
iedereen?", en de tweede onboarding-slide met de bestaande check-in-uitleg.
Drie letterlijke wijzigingen in `index.html`:
1. **"Waar is iedereen?" → "Laatste check-ins & tussenstand"** als kop zelf;
   de losse, kleine grijze ondertitel-`<span>` met dezelfde tekst is
   verwijderd (was overbodig geworden).
2. Onboarding slide 2, eerste alinea: "Iemand kwijt? Onderin de app en per
   event zie je live waar iedereen is." → **"Dit is voor de tussenstand."**
   (rest van de zin, inclusief "Aangekomen bij een stop? Tik op
   **Check in ✓**.", ongewijzigd).
3. Onboarding slide 2, vetgedrukte "punch"-regel: "Maar bovenal is de
   Check in ✓ — muy importante vóór de METER." →
   **"Want er is een METER die muy importante is."** — de bewuste
   taalmenging "muy importante" blijft behouden (expliciet beschermd sinds
   de afgewezen "fix" in iteratie 2).

**Testresultaten (gemeten):** visueel bevestigd (390×844, verse
`localStorage`) dat de groepslijst-kop nu direct "Laatste check-ins &
tussenstand" toont zonder aparte ondertitel, en dat onboarding-slide 2 exact
de nieuwe tekst toont. Volledige `capture.js`-regressievlucht (Chromium +
WebKit) draait foutloos door. Alleen `index.html` gewijzigd — geen
cache-buster-verhoging nodig (`index.html` heeft al een
always-revalidate-cache-header, in tegenstelling tot `app.css`/`app.js`).

## Ontwerpbesluiten (vervolg 23)

**Iteratie 25 — de tijdlijnbol krijgt een echte foto, zoals Polarsteps'
ronde route-avatars.** Laatste, bewust uitgestelde punt uit het gefaseerde
Polarsteps-plan (punt 2), nu zorgvuldig opgepakt met behoud van alle eerder
gefixte aanraakdoelen. Voorafgaand een mislukte bug-zoektocht in
`renderDayResult`/`bandForScore`/`computeSchedule`/`venueOptions`/
`meterStops`/`persistVenueSelections` (allemaal correct bevonden, geen
wijziging) en een test van de nooit eerder beproefde "verwijder deelnemer"-
knop in het uitklapbare deelnemerspaneel: correct bevonden (bij een
onbereikbare backend faalt de verwijdering eerlijk met een toast in plaats
van stilzwijgend te desyncen; bij succes werkt de UI-update correct) — geen
van beide leverde een fix op, dus doorgegaan naar de grotere, geplande stap.

Aanpak — laag risico door strikte scheiding van "bestaand gedrag" en
"nieuwe laag erbovenop": de bestaande onzichtbare 44×44px-hitbox
(`.tl-node[data-rail-here]::before`, iteratie 3) is **niet aangeraakt**. Een
nieuwe, losse `syncRailPhoto()`-functie in `app.js` kopieert de al-geladen
kaartfoto (hergebruikt de bestaande foto-cache/laadlogica, géén nieuwe
netwerk-aanvraag) naar de bijbehorende tijdlijnbol zodra die foto klaar is
— zowel bij een verse fetch (`applyPlacePhoto`) als bij hergebruik van een
al elders geladen foto (`loadPlacePhoto`'s twin-pad). Pas als een foto
daadwerkelijk laadt krijgt de bol de klasse `.has-photo` en een grotere maat
(26px todo, 28px done, 30px current — dezelfde progressie als voorheen,
alleen groter zodat een foto herkenbaar is); zonder foto (bijvoorbeeld
lokaal, of als de Google Places-API niet reageert) blijft de bol exact zoals
voorheen (13/19/21px, geen wijziging, geen kapotte/lege foto-placeholder).
Het vinkje bij "done" krijgt een `drop-shadow` voor leesbaarheid tegen een
foto-achtergrond; de kleine pulserende middenstip bij "current" wordt
onderdrukt zodra er een foto is (die zou anders midden op de foto zweven).

**Testresultaten (gemeten, Playwright, gemockte `/api/place-photo` met een
echte testafbeelding):**
- Foto laadt → `.has-photo` correct toegevoegd, `background-image` correct
  ingesteld, maat 26/28/30px per state, vinkje nog zichtbaar bij "done".
- Klikken op de tijdlijnbol-met-foto checkt nog steeds correct in
  (`aria-pressed` false→true) — bestaande interactie ongewijzigd.
- **Kritieke regressietest:** de onzichtbare aanraakdoel-hitbox
  (`::before`) blijft `44px × 44px` — expliciet gemeten, iteratie 3 intact.
- Zonder foto-API (normale lokale toestand): bol blijft exact `13px`, geen
  `.has-photo`-klasse, `background-image:none` — volledig ongewijzigd
  gedrag, geen regressie voor het (huidige, meest voorkomende) geval dat de
  Google-foto-API niet bereikbaar is.
- Minimale afstand tussen twee opeenvolgende bol-middens op 320px: 393px —
  ruim boven de grootste bolmaat (30px), geen overlap-risico (zelfde controle
  als iteratie 3, opnieuw bevestigd na de maatvergroting).
- Getest in zowel Chromium als WebKit op 320px — identiek, geen
  browser-specifiek renderprobleem.
- Volledige `capture.js`-regressievlucht (Chromium + WebKit) draait foutloos
  door. Reserveringstijden ongewijzigd.
- `app.css` én `app.js` gewijzigd → cache-buster verhoogd naar `v=100` in
  `index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
  `utca-shell-v52`.

## Ontwerpbesluiten (vervolg 24)

**Iteratie 26 — echte bug: onboarding toonde een verkeerde, hardgecodeerde
looptijd ("109 min" i.p.v. de werkelijke "± 90 min").** Voorafgaand drie
grondige, niet-vruchteloze controles die geen wijziging opleverden (allemaal
correct bevonden, dus expliciet gedocumenteerd als geverifieerd i.p.v.
aangenomen):
- Score-/planningslogica (`bandForScore`, `percentFromAverage`,
  `computeSchedule`, `venueOptions`, `meterStops`,
  `persistVenueSelections`) opnieuw nagelezen — geen fouten gevonden.
- De nooit eerder geteste "verwijder deelnemer"-knop in het uitklapbare
  deelnemerspaneel: bij een onbereikbare backend faalt de verwijdering
  eerlijk met een toast (geen stille desync); bij succes werkt de
  UI-update correct. Geen wijziging nodig.
- **"Open hele ronde in Google Maps"-link écht getest in een live browser**
  (niet lokaal, want vereist internettoegang naar Google): de link bevat 9
  waypoints (11 stops totaal inclusief begin/eind). Vooraf leek dit een
  risico (bekende limieten bij sommige Google Maps-URL-vormen), maar
  Google Maps rendert alle 11 locaties en de looproute correct (1u51m,
  8,2km) — geverifieerd door de daadwerkelijke gegenereerde URL te openen.
  Geen wijziging nodig.

Bij het nalezen van `buildOnboardingStills()` (de functie die de
onboarding-previews samenstelt uit echte, gekloonde app-onderdelen) viel op
dat de route-slide (5 · Hele route) de gekloonde dashboard-tegels
overschrijft met **letterlijk hardgecodeerde tekst**: `'109 min'` en
`'11 stops'`, in plaats van de daadwerkelijk berekende waarden te tonen (in
tegenstelling tot alle andere onboarding-previews, die levende klonen zijn).
Gemeten: de échte `#routeWalk` op de hoofdpagina toont momenteel **"± 90
min"** (zonmodus) — een verschil van 19 minuten (~21%) met wat de onboarding
belooft. "11 stops" klopte toevallig nog wel (bevestigd via
`itinerary().length`), maar was even hardgecodeerd en dus even fragiel.

Wie er last van heeft: iedereen die de onboarding doorloopt vóór de
eigenlijke dag — ze krijgen een onjuiste verwachting van de looptijd te
zien, die vervolgens niet overeenkomt met wat de app daadwerkelijk toont.
Precies het soort stille, "vergeten mee te updaten"-fout als de
cache-buster-vergissing uit iteratie 20.

Aanpak: de hardgecodeerde strings vervangen door de bestaande, live
berekeningsfuncties: `'± '+totalWalkMinutes()+' min'` en
`itinerary().length+' stops'` — exact dezelfde functies die de echte
dashboard-tegel al gebruikt, dus gegarandeerd altijd in sync, ook als de
route/venue-keuzes ooit veranderen.

**Testresultaten (gemeten, Playwright, verse browsercontext per test omdat
een eerdere, langer openstaande Claude-Browser-tab een verouderde
`app.js`-versie in het browsergeheugen bleek te houden — een test-artefact,
geen echt cachingprobleem, apart bevestigd door de daadwerkelijk
geserveerde bestandsinhoud rechtstreeks op te vragen):**
- Zonmodus: echte dashboard `± 90 min`, onboarding-slide 5 nu ook
  `± 90 min` (vóór de fix: `109 min`).
- Regenmodus (via `localStorage`, want de weerschakelaar zit achter de
  login-overlay vóór inloggen): echte dashboard `± 95 min`, onboarding-slide
  5 nu ook `± 95 min` — bevestigt dat de waarde correct meebeweegt met de
  modus, niet nog een keer hardgecodeerd is per modus.
- "11 stops" ongewijzigd correct in beide modi.
- Volledige `capture.js`-regressievlucht (Chromium + WebKit) draait foutloos
  door.
- `app.js` gewijzigd → cache-buster verhoogd naar `v=101` in
  `index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
  `utca-shell-v53`.

## Ontwerpbesluiten (vervolg 25)

**Iteratie 27 — nog een echte bug, gevonden met dezelfde methode als
iteratie 21/26: de onboarding-check-in-slide toonde in regenmodus de
verkeerde locatie-foto én een verkeerde Google Maps-link.** Vervolg op de
suggestie om de rest van `buildOnboardingStills()` net zo grondig na te
lopen als de route-slide. De "Tik als je er bent"-slide (2 · Check-in)
kloont de kaart van de HUIDIGE weer-afhankelijke stop
(`weatherStop[mode].id`) — in regenmodus dus Café Orloff, correct qua naam/
adres/tijd. Maar de foto-overschrijving eronder was onvoorwaardelijk
hardgecodeerd op **Kanoverhuur Utrecht** (`onboarding-checkin.webp`, alt-
tekst "Foto van Kanoverhuur Utrecht", Google Maps-link naar Kanoverhuur's
adres) — ongeacht welke stop daadwerkelijk gekloond was.

Gemeten (Playwright, regenmodus via `localStorage.utca-weather`): kaart
toonde correct "Café Orloff" / "Donkere Gaard 8, Utrecht", maar de foto
eronder had alt-tekst "Foto van Kanoverhuur Utrecht" en een Google Maps-
link naar Kanoverhuur's adres (Oudegracht aan de Werf 275) — een complete
mismatch tussen wat de kaart zegt en wat de foto/link beweren.

Wie er last van heeft: iedereen die vóór het inloggen (of via een eerder
bezoek) voor regen heeft gekozen en dan de onboarding doorloopt — precies
de eerste indruk van de app toont een intern tegenstrijdige kaart.

Aanpak — kleinst mogelijke, robuuste fix: er bestaat maar één echte,
vooraf-vastgelegde foto (`onboarding-checkin.webp`, een kano-foto die
specifiek bij Kanoverhuur hoort — zie de opdracht: geen live API-calls voor
test-/onboardingbeelden). Een tweede, bijpassende foto voor Café Orloff
bestaat niet. Twee eerder overwogen opties verworpen: (1) altijd de
Kanoverhuur-kaart clonen ongeacht modus — bleek niet te werken, want in
regenmodus bestaat er in de live tijdlijn helemaal geen kaart met
`data-stop="weather-sun"` om te clonen (de tijdlijn toont maar één van de
twee weerstops tegelijk); (2) de foto sowieso tonen met aangepaste
alt-tekst — zou nog steeds een kano-foto met een Café-Orloff-naam laten
zien, óók verwarrend. Gekozen fix: de statische foto-overschrijving alleen
toepassen **als `mode==='sun'`** (dus alleen wanneer de geclonede kaart
daadwerkelijk Kanoverhuur is). In regenmodus blijft de kaart's eigen,
normale foto-status behouden (lokaal geen foto — neutrale plaatshouder;
in productie met een werkende Google Places-API zou de kaart daar al vóór
het clonen gewoon zijn eigen, correcte foto hebben geladen via het
bestaande live-laadpad).

**Testresultaten (gemeten, Playwright, verse browsercontext per modus):**
- Regenmodus (ná de fix): kaartnaam "Café Orloff" (ongewijzigd correct),
  foto-alt-tekst leeg, foto-link `null` — geen tegenstrijdige claim meer.
  Visueel bevestigd: neutrale plaatshouder-achtergrond i.p.v. de verkeerde
  kano-foto.
- Zonmodus (regressiecontrole): ongewijzigd — kaartnaam "Kanoverhuur
  Utrecht", foto-alt "Foto van Kanoverhuur Utrecht", link naar Kanoverhuur's
  adres — exact zoals vóór deze wijziging.
- Volledige `capture.js`-regressievlucht (Chromium + WebKit) draait foutloos
  door.
- `app.js` gewijzigd → cache-buster verhoogd naar `v=102` in
  `index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
  `utca-shell-v54`.

## Ontwerpbesluiten (vervolg 26)

**Iteratie 28 — resterende hardcoding in `buildOnboardingStills()` opgeruimd
(kleine defensieve fix), plus twee gebieden grondig gecontroleerd zonder
nieuwe bug.** Vervolg op iteraties 26/27's methode, ditmaal toegepast op de
resterende onboarding-slides en de roster/group-renderpaden.

1. **Program-slide (1 · De dag) toonde een hardgecodeerde "2 / 11"-
   voortgangsvoorbeeld.** Anders dan de route- en check-in-bugs was dit nu
   niet fout (11 klopt toevallig nog steeds met `itinerary().length`), maar
   wel even fragiel — zou stil verkeerd worden als het aantal stops ooit
   verandert. Aanpak: de teller "2" blijft een illustratief voorbeeld
   (niet iemands echte voortgang, want er is nog niet ingecheckt), maar de
   noemer en het bijbehorende balkpercentage komen nu uit
   `itinerary().length`, dus altijd in sync. Gemeten: label toont nog
   steeds `"2 / 11"` en balk `"18%"` (2/11 afgerond) — zelfde uitkomst als
   voorheen, nu alleen berekend i.p.v. getypt.
2. **Overige onboarding-slides (meter, opties) nagelopen op dezelfde klasse
   fout als iteratie 27 — geen probleem gevonden.** De opties-slide kloont
   altijd de "bars"-stop (niet weer-afhankelijk), dus geen mode-mismatch
   mogelijk. De meter-slide kloont alleen het meter-widget zelf (geen naam/
   foto-elementen), dus ook geen mismatch mogelijk. Beide bevestigd via
   codeonderzoek, geen wijziging nodig.
3. **Roster-telling ("X/6") gecontroleerd op stale-hardcoding — bleek
   bewust, geen bug.** De `_worker.js`-backend staat tot 12 deelnemers toe
   (`LIMIT 12`), maar de "6" in de UI is geen technische limiet die kan
   "achterlopen" — het is de daadwerkelijke, in de opdracht vastgelegde
   groepsgrootte (drie tweepersoonskano's, twee pooltafels voor zes
   personen). Bewust ongewijzigd.

**Testresultaten (gemeten):** volledige `capture.js`-regressievlucht
(Chromium + WebKit) draait foutloos door. Reserveringstijden, de
tijdlijnbol-fotoavatars (iteratie 25) en de check-in-slide-fix (iteratie 27)
niet geraakt. `app.js` gewijzigd → cache-buster verhoogd naar `v=103` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v55`.

## Ontwerpbesluiten (vervolg 27)

**Iteratie 29 — de volledige dagplanning met de hand nagerekend (geen bug),
en de sinds iteratie 11 openstaande lange-namen-kwestie eindelijk opgelost.**

Eerst een uitputtende, cijfer-voor-cijfer controle van `computeSchedule()`/
`walkDisplay()` over de HELE dag (alle 11 stops + 10 looproutes), met de
hand nagerekend tegen de brontijden in `stopsCommon`/`weatherStop`: elke
aankomst-, vertrek- en speling-berekening klopt exact, inclusief alle vier
vaste reserveringen (Kanoverhuur 10:00–11:45, Pool 14:00–15:00, JEU
17:00–18:00, De Poort 19:00–21:00) en de terugwaartse tijdsberekening voor
de vijf dynamische tussenstops. Geen fout gevonden — eerste keer dat de
volledige planning zo expliciet, met concrete getallen, is geverifieerd in
dit project.

**Lange namen (open sinds iteratie 11).** Het naamveld (`maxlength="24"`)
geeft al real-time feedback door simpelweg te stoppen met tekens accepteren
zodra je typt, maar zonder enige uitleg wáárom — een gebruiker met een
langere naam ziet alleen dat er niets meer gebeurt. Aanpak — klein, alleen
zichtbaar wanneer relevant: een nieuw hint-regeltje (`#nameHint`) onder het
naamveld dat **leeg blijft** zolang er ruim binnen de limiet getypt wordt,
en pas verschijnt ("nog N tekens") zodra er nog 6 tekens of minder over
zijn. Voor de overgrote meerderheid (korte voornamen) verandert er dus
niets zichtbaar; wie tegen de grens aan typt krijgt alsnog eerlijke uitleg
in plaats van een onverklaarde blokkade. Geen wijziging aan de limiet zelf.

**Testresultaten (gemeten, Playwright):** bij 5 tekens geen hint (leeg);
bij 18 tekens (6 resterend) "nog 6 tekens"; bij 20 tekens "nog 4 tekens";
bij 24 tekens (limiet bereikt) "nog 0 tekens"; bij een poging tot 30 tekens
blijft de daadwerkelijke waarde correct gekapt op 24 (`maxlength` werkt
ongewijzigd). Visueel bevestigd dat het lege hint-regeltje bij een korte
naam geen waarneembaar verschil geeft t.o.v. de vorige login-schermen.
Volledige `capture.js`-regressievlucht (Chromium + WebKit) draait foutloos
door. `app.css` én `app.js` gewijzigd → cache-buster verhoogd naar `v=104`
in `index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v56`.

## Ontwerpbesluiten (vervolg 29)

**Iteratie 30 — echte bug gevonden bij code-review van de backend-validatie
in `_worker.js`: een mislukte sync liet de hele groep verdwijnen.**

Frisse review van `_worker.js` (naam-/stop-/ratings-validatie, XSS-oppervlak
in `renderGroup()`) leverde geen misbruikbare gaten op — `p.name` en
`p.currentStop` worden altijd via `escapeHtml()` in de DOM gezet, `where`
komt alleen uit een vaste, vertrouwde lookup. Wel een echte functionele bug
gevonden in `syncState()` (`app.js`): als de POST naar `/api/state` faalt
(spotty wifi bij een locatie, kort netwerkverlies — heel plausibel op de
dag zelf), verving de foutafhandeling de HELE `participants`-lijst door een
array met alleen jezelf erin. Wie op dat moment inchecte of een score
invulde, zag dus zijn/haar hele vriendengroep tijdelijk verdwijnen uit
"Tussenstand"/"Groep" — met de geruststellende maar misleidende melding
"Lokaal opgeslagen", terwijl het er eigenlijk uitzag alsof iedereen weg was.
Pas de volgende automatische 15s-refresh herstelde de lijst (of nooit, als
die ook faalde).

**Wie het raakt:** iedereen die inlogt/incheckt/scoort op een moment dat de
verbinding met de Cloudflare-worker even hapert — bij een evenement met
wisselend bereik in cafés/sporthallen een reëel scenario.

**Fix (kleinst mogelijk):** in de `.catch()` van `syncState()` wordt bij een
mislukte sync niet meer de hele lijst vervangen, maar wordt alleen de eigen
rij in de bestaande `participants`-array bijgewerkt (of toegevoegd als die
nog ontbrak) — de rest van de groep blijft gewoon zichtbaar. De
`standaloneMode`- en `!window.fetch`-paden (file://, of browsers zonder
`fetch`) zijn bewust ongemoeid gelaten: daar bestaat er sowieso geen
gedeelde serverstatus, dus "alleen jezelf tonen" is daar het juiste gedrag.

**Testresultaten (Playwright, met `page.route()` om `/api/state` te
simuleren):** eerste POST (bij inloggen) succesvol gemaakt met een
geveinsde respons van 3 deelnemers (`TestUser`, `Jeroen`, `Jeff`) →
"Tussenstand" toont alle drie. Daarna een check-in getriggerd terwijl de
tweede POST bewust laten mislukken (`route.abort()`): vóór de fix zakte de
lijst terug naar alleen `["TestUser"]` (bug gereproduceerd op zowel
Chromium als WebKit), ná de fix blijft `["TestUser","Jeroen","Jeff"]`
intact op beide engines. Volledige `capture.js`-regressievlucht (Chromium +
WebKit) draait daarna foutloos door. Alleen `app.js` gewijzigd →
cache-buster verhoogd naar `v=105` in `index.html`/`sw.js`/`test-local.html`,
`SHELL_CACHE` naar `utca-shell-v57`.

## Ontwerpbesluiten (vervolg 30)

**Iteratie 31 — "iedereen verwijderen"-knop in het deelnemerspaneel was
een te klein, onbeveiligd, onomkeerbaar aanraakdoel.**

Bij het onderzoeken van de `DELETE /api/state`-flow bleek: het
deelnemerspaneel (open via het rondje-stapeltje rechtsboven) toont voor
ELKE deelnemer — niet alleen jezelf — een klein "×"-knopje dat die persoon
met één tik direct en definitief verwijdert (naam, huidige stop én alle
scores, zonder undo). Twee losstaande problemen versterkten elkaar: (1) het
knopje was maar 24×24 CSS-pixels, ruim onder de 44×44-norm die de rest van
deze app consequent aanhoudt, en (2) er was geen enkele bevestiging — één
per ongeluk geraakte tik in een chip-lijst (notoir tikgevoelig, zeker in
een uitgelaten sfeer met telefoons die van hand tot hand gaan) wist
iemands hele dag onherstelbaar.

**Wie het raakt:** iedereen in de vriendengroep, via een tik van wie dan
ook — het is geen "verwijder mezelf"-knop maar een "verwijder wie dan
ook"-knop, gedeeld zonder enige vorm van rollen of rechten (bewust, want
er is geen inlogsysteem — maar dat maakt bescherming tegen míst-tikken
belangrijker, niet minder).

**Fix (kleinst mogelijk, geen nieuwe dialoog/afhankelijkheid):** het "×"
kreeg eerst de bestaande 44×44-onzichtbare-hitbox-behandeling
(`::before`, zelfde patroon als `.tl-node[data-rail-here]`) zonder de
zichtbare chip groter te maken. Daarna een "tik nogmaals om te
bevestigen"-patroon: de eerste tik verandert het knopje in een rode "✓"
("wapent" het, 3 seconden geldig) zonder iets te verwijderen; pas een
tweede tik ná die eerste, terwijl het nog gewapend is, voert de
verwijdering echt uit. Na 3 seconden, of bij een tik ergens anders op de
pagina, wordt het knopje automatisch weer ontwapend. Geen nieuwe
`confirm()`-dialoog (past niet bij de custom, dialoogloze stijl van de
rest van de app) — wel dezelfde bescherming.

**Testresultaten (Playwright, `page.route()` voor `/api/state` incl.
`DELETE`):** hitbox gemeten op 44×44px op beide engines; één tik verwijdert
niets en zet `.confirm`-status aan; na 3,2s is die status vanzelf weer uit
en verwijdert een volgende losse tik nog steeds niets (opnieuw alleen
wapenen); twee tikken vlak na elkaar verwijderen de deelnemer wél (aantal
chips 2→1) — op zowel Chromium als WebKit. Volledige `capture.js`-
regressievlucht draait foutloos door. `app.css` én `app.js` gewijzigd →
cache-buster verhoogd naar `v=106` in `index.html`/`sw.js`/`test-local.html`,
`SHELL_CACHE` naar `utca-shell-v58`.

## Ontwerpbesluiten (vervolg 31)

**Iteratie 32 — toetsenbord-tab kon uit de onboarding-modal "ontsnappen"
naar een verborgen Google Maps-link.**

Onderzoek van de onboarding-focus-trap/toetsenbordnavigatie (Tab-cyclus,
Escape) liet zien dat de bestaande trap-logica zelf klopt (Escape sluit,
Tab wrapt correct tussen Skip↔Volgende) — maar de trap ving niet alles.
`onboardingClone()` zet terecht `tabindex="-1"` en verwijdert `href` op
alle interactieve elementen in een gekloonde preview-kaart, zodat een
toetsenbordgebruiker niet per ongeluk in de "stille" achtergrond-preview
belandt. Alleen: `setStaticOnboardingPhoto()` (gebruikt voor de
foto-vervanging op de check-in- en opties-slide) injecteert daarna een
GLASHELDER NIEUW `<a href="https://maps.google.com/..." target="_blank">`
-element — dat draait pas ná de opschoning van `onboardingClone()`, dus
mist die bescherming volledig. Met de muis onzichtbaar (de hele
`.onboarding-visual` heeft `pointer-events:none`), maar met Tab wél
gewoon bereikbaar en met Enter/Space gewoon activeerbaar: een
toetsenbordgebruiker die door de onboarding tabt, kan zo ongemerkt
wegnavigeren naar Google Maps, midden in de introductie-flow.

**Wie het raakt:** iedereen die de onboarding met het toetsenbord
doorloopt in plaats van met de muis/vinger — bevestigd reproduceerbaar op
Chromium; op WebKit (headless, standaardinstelling) doet Safari zelf al
geen Tab naar links, maar met "Volledige toegang via toetsenbord" aan
(een instelling die toegankelijkheidsgebruikers vaak wél aanzetten) geldt
hetzelfde risico.

**Fix (kleinst mogelijk, zelfde patroon als elders):** in
`setStaticOnboardingPhoto()` de injected `<a>` exact zo behandeld als
`onboardingClone()` dat al met andere interactieve elementen doet:
`tabindex="-1"` gezet en `href`/`target`/`rel` volledig weggelaten (puur
decoratief, want deze functie wordt uitsluitend op onboarding-previews
aangeroepen — de échte, klikbare foto-links in de live app lopen via een
ander pad en zijn hier niet geraakt).

**Testresultaten (Playwright, toetsenbord-tab door alle 5 onboarding-
slides):** vóór de fix landde de focus op Chromium tweemaal op de
Maps-link (check-in-slide en opties-slide), met een echte `href` naar
Google Maps — bug gereproduceerd. Ná de fix: geen enkele focus-landing
meer binnen `.onboarding-visual`, op zowel Chromium als WebKit. Volledige
`capture.js`-regressievlucht draait foutloos door. Alleen `app.js`
gewijzigd → cache-buster verhoogd naar `v=107` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v59`.

## Ontwerpbesluiten (vervolg 32)

**Iteratie 33 — mislukte achtergrond-verversingen (`refreshState`, elke
15s) waren volledig onzichtbaar; de gebruiker kon nooit weten dat zijn
eigen beeld van de groep vastliep.**

Vervolg op de `refreshState()`-faalpad-vraag uit de vorige planning.
Iteratie 30 loste al op dat een mislukte `syncState()` (bij het inchecken)
niet meer de hele deelnemerslijst wiste. Maar de periodieke
achtergrondverversing (`refreshState()`, elke 15s + bij terugkeer naar de
tab) faalde tot nu toe volledig stil (`.catch(function(){})`) — geen
toast, geen badge, niets. De per-persoon "verouderd"-badge
(`checkinIsStale`) helpt hier niet: die rekent puur op `p.updatedAt` van
de LAATST ontvangen data en telt door met de actuele kloktijd, dus die
badge verschijnt netjes zelfs als je eigen client allang niet meer kan
verversen — maar er is niets dat vertelt dat JOUW verbinding zelf al een
tijd geen contact meer heeft. Op een kanotocht, of ergens met slecht
bereik, kon een gebruiker zo urenlang naar een bevroren "Tussenstand"
kijken zonder enig signaal dat het beeld niet meer klopt.

**Wie het raakt:** iedereen wiens toestel de gedeelde backend tijdelijk
niet kan bereiken (dode zone, wifi-wisseling tussen locaties, telefoon
per ongeluk in vliegtuigmodus) — een reëel scenario op deze dag, en eerder
al de aanleiding voor de iteratie-30-fix.

**Fix (kleinst mogelijk, geen nieuwe permanente UI):** een kleine
`markReachable(ok)`-helper die alleen bij een ECHTE overgang (verbonden
→onverbonden, of andersom) een bestaande toast toont — "Geen verbinding —
laatst bekende stand" resp. "Weer verbonden — bijgewerkt". Geen toast bij
het allereerste contact (voorkomt een overbodige melding bij het gewoon
opstarten van de app) en geen herhaalde meldingen zolang de storing
aanhoudt (geen spam bij elke mislukte 15s-poging). Bewust geen nieuwe
permanente badge/banner toegevoegd — past niet bij de "minder chrome"-
richting van eerdere iteraties (23), en de bestaande toast-component was
al precies het juiste, tijdelijke middel hiervoor.

**Testresultaten (Playwright, `page.route()` met een schakelbare
faal-modus voor GET, getriggerd via `window.dispatchEvent(new
Event('focus'))` i.p.v. 15s wachten):** eerste succesvolle verversing na
inloggen → geen toast (stil, zoals bedoeld); verbinding laten wegvallen →
"Geen verbinding — laatst bekende stand" verschijnt; een tweede
opeenvolgende mislukking → geen nieuwe toast (geen spam, bevestigd via
`showing:false`); verbinding herstellen → "Weer verbonden — bijgewerkt"
verschijnt. Alle vier de overgangen kloppen op zowel Chromium als WebKit.
Volledige `capture.js`-regressievlucht draait foutloos door. Alleen
`app.js` gewijzigd → cache-buster verhoogd naar `v=108` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v60`.

## Ontwerpbesluiten (vervolg 33)

**Iteratie 34 — alternatieven-opties-rijen te laag (40px), stale
documentatieregel gecorrigeerd, en één bewust niet-gefixte bevinding
gedocumenteerd.**

Onderzoek van de alternatieven-kaart-flow (gesuggereerde kandidaat) volgens
hetzelfde patroon als iteraties 7/8/31: `.alt-select` (elke individuele
optie-rij in de opengeklapte "N andere opties"-lijst) had geen expliciete
hoogte en kwam bij een kort adres/opmerking uit op 40px — onder de
44×44-norm die de rest van de app al drie keer eerder consistent kreeg
toegepast. `Wie het raakt:` iedereen die een alternatieve locatie kiest via
deze rijen, vooral op een klein scherm terwijl de groep staat te overleggen.
**Fix:** `min-height:44px` + verticale centrering (`display:flex;
flex-direction:column;justify-content:center`) op `.alt-select`, zodat een
kort tekstblok netjes uitgevuld wordt i.p.v. bovenaan te blijven plakken.
Rijen die door langere tekst al ≥44px waren (twee-regelige varianten,
57-77px) blijven ongewijzigd. **Getest (Playwright, `getBoundingClientRect`
op alle `.alt-select`-elementen):** vóór de fix meerdere rijen op 40px, ná
de fix exact 44px voor diezelfde rijen, langere rijen ongemoeid. Visueel
gecontroleerd (screenshot `08-alternatives-open`): geen waarneembaar
verschil in de opmaak, gewoon iets luchtiger. Volledige `capture.js`-
regressievlucht foutloos op Chromium + WebKit. Alleen `app.css` gewijzigd →
cache-buster verhoogd naar `v=109` in `index.html`/`sw.js`/`test-local.html`,
`SHELL_CACHE` naar `utca-shell-v61`.

Bijvangst tijdens hetzelfde onderzoek: de "Resterende problemen"-regel over
`.roster-stack`-blur bleek al sinds iteratie 23 opgelost maar nooit
afgevinkt — gecorrigeerd (zie hieronder), zodat een volgende iteratie er
niet nogmaals tijd aan verspilt.

**Bewust niet gefixt, wel gedocumenteerd — venuenaam per kijker kan
verschillen.** Bij het uitpluizen van dezelfde alternatieven-flow bleek dat
`venueSelections` (welke van de 2-3 alternatieve locaties "actief" is voor
een stop) puur lokaal per toestel wordt opgeslagen (`localStorage`, nooit
gesynchroniseerd naar `/api/state`). De naam die "Tussenstand"/"Groep" toont
voor waar een vriend is (`byId[p.currentStop]`) wordt dus altijd berekend
met de EIGEN, lokale venuekeuze van de kijker — niet met wat die vriend
daadwerkelijk gekozen/bezocht heeft. In theorie kunnen twee vrienden, elk
op hun eigen telefoon, dus een verschillende locatienaam zien voor
dezelfde persoon bij dezelfde stop. In de praktijk zeer laag risico: de
groep kiest een alternatief altijd gezamenlijk, staande bij elkaar, dus
ieders lokale keuze zal doorgaans vanzelf overeenkomen met de werkelijkheid
— vergelijkbaar met de al eerder bewust ongefixte "lange namen"-edge-case.
Een echte fix vereist een backend-schemawijziging (welke specifieke
locatie meegeven bij het inchecken) — buiten de scope van een geïsoleerde
kleine-stap-iteratie zonder overleg. Kandidaat voor een latere, grotere
iteratie als het daadwerkelijk tot verwarring leidt.

## Ontwerpbesluiten (vervolg 34)

**Iteratie 35 — systematische 44×44-audit over alle hoofdschermen; drie
echte, nog niet gefixte aanraakdoelen gevonden en verholpen.**

Op verzoek een volledige sweep met dezelfde `getBoundingClientRect()`-
methode die al vier keer eerder een bug vond (iteraties 7, 8, 31, 34),
nu over ELK zichtbaar interactief element (`button`, `a[href]`, `input`,
`summary`, `[role="button"/"link"]`) op elk hoofdscherm (login, timeline,
ingecheckt, alternatieven, stand, groep, roster-paneel, regenmodus). Van
de ~200 losse metingen bleken de meeste ruis (verborgen onboarding-
achtergrond, of elementen die al een onzichtbare `::before`-hitbox hebben
zoals de `.roster-chip`-verwijderknop uit iteratie 31 — mijn eerste script
mat alleen de zichtbare box, niet de `::before`; na het meenemen van de
`::before`-computed-style bleken die al in orde). Drie ECHTE, nog niet
gefixte gevallen bleven over:

1. `.roster-stack` (de "Ingelogde deelnemers"-knop rechtsboven, opent het
   deelnemerspaneel) — `min-height:40px`, 4px onder de norm.
2. `.userchip button` ("Naam wissen"/uitloggen) — 36×36px, een echte
   ronde knop zonder enige hitbox-uitbreiding.
3. `.switcher button` (Zon/Regen-knoppen) — `height:28px`, ruim onder de
   norm, en een frequent gebruikte knop (elke keer dat het weer omslaat).

`Wie het raakt:` iedereen die een van deze drie knoppen aantikt — vooral
de weer-switcher, die op deze dag met wisselende buien realistisch
meerdere keren aangeraakt wordt.

**Fix:** `.roster-stack` kreeg simpelweg `min-height:44px` (net als de
`.alt-select`-fix uit iteratie 34, geen downside om het zichtbare vlak
4px te laten groeien). `.userchip button` en `.switcher button` kregen
elk een onzichtbare 44×44 `::before`-hitbox (zelfde patroon als
`.roster-chip button`/`.tl-node[data-rail-here]`), zodat de compacte
ronde knop resp. de kleine pil-knoppen in de journeybar-header visueel
ongewijzigd blijven.

**Testresultaten (Playwright, op Chromium + WebKit):** alle drie de
hitboxes/boxes meten nu exact 44px op de kritieke as. Specifiek voor de
`.switcher`-knoppen (het risicovolste geval, omdat de uitgebreide
hitbox in de journeybar-header dicht bij andere klikbare content zit)
een gerichte klik net buiten de zichtbare knop maar binnen de nieuwe
onzichtbare hitbox: schakelt correct naar regenmodus, zonder dat er
onbedoeld gescrold werd of de "spring naar huidige stop"-actie ernaast
werd geraakt. Visueel gecontroleerd (screenshot `03-timeline-top`): geen
waarneembaar verschil in de header-opmaak. Volledige `capture.js`-
regressievlucht foutloos. Alleen `app.css` gewijzigd → cache-buster
verhoogd naar `v=110` in `index.html`/`sw.js`/`test-local.html`,
`SHELL_CACHE` naar `utca-shell-v62`.

**Bewust niet meegenomen, wel gevonden en gedocumenteerd:** `.journeycopy`
(de klikbare "spring naar huidige stop"-tekst in de journeybar, `role=
"button"`) heeft GEEN vaste hoogte en meet intrinsiek maar 15-24px, ruim
onder de norm. Een `::before`-hitbox hier is risicovoller dan bij de
andere drie: dit element zit direct boven `.journey-next-row` (met
`margin-top:9px`), en een verticaal uitgebreide onzichtbare hitbox zou
mogelijk in die buurrij kunnen bijten of tot verwarrende dubbele
tapgebieden leiden — dat vereist zorgvuldige visuele/klik-precisie-
verificatie die deze iteratie niet meer paste. Kandidaat voor een
volgende iteratie met gerichte aandacht voor die laag-risico-marge.

## Ontwerpbesluiten (vervolg 35)

**Iteratie 36 — `.journeycopy` alsnog naar 44px, na grondig onderzoek van
de in iteratie 35 uitgestelde overlap-zorg.**

Eerst de exacte lay-out opgemeten (Playwright, `getBoundingClientRect()`):
`.journey-next-row`/`.journey-next-copy` (de rij onder `.journeycopy`)
blijkt GEEN eigen klik-handler te hebben in `app.js` — alleen `#journeyCopy`
zelf en `#journeyNav` (de aparte "Navigeer"-knop, al 44px via
`--h-sec`) zijn interactief. In compacte modus (na scrollen) staat
`#journeyNav` bovendien in een aparte grid-kolom naast `.journeycopy`, dus
een verticale hitbox-uitbreiding die zich aan `.journeycopy`'s eigen
breedte houdt kan `#journeyNav` sowieso nooit horizontaal raken. Het enige
echte risico was dus nul, niet "voorzichtig maar onduidelijk" zoals
iteratie 35 het inschatte.

**Fix, ronde 1 (onvolledig):** `position:relative` + een `::before` van
`top:0;height:44px` op `.journeycopy`. Bij het verifiëren met een puntsgewijze
`elementFromPoint()`-scan bleek dit in compacte modus maar tot ongeveer
17px van de bedoelde 44px daadwerkelijk te werken — de onderliggende
`.journey-next-copy`-tekst (die zelf geen click-handler heeft, dus geen
foutieve actie, maar wél de hit-test "won") lag in normale documentvolgorde
ná `.journeycopy` en overschaduwde het grootste deel van de onzichtbare
hitbox. **Fix, ronde 2:** `z-index:1` toegevoegd aan `.journeycopy` zodat
de hitbox zelf de hit-test wint over die latere buurinhoud.

**Testresultaten (Playwright, `elementFromPoint()` op elke 2px van de
hitbox, plus een expliciete klik op het midden van de échte
Navigeer-knop):** vóór `z-index` werkte de hitbox tot slechts ~17/44px in
compacte modus; ná `z-index` resolvet elk punt van 0 t/m 42px correct naar
`journeyCopy`, in zowel normale als compacte modus, op Chromium én
WebKit. Een klik midden op de losstaande Navigeer-knop resolvet nog
steeds correct naar `journeyNav` — geen enkele swallow van die knop.
Volledige `capture.js`-regressievlucht foutloos, visueel geen
waarneembaar verschil (screenshot `03-timeline-top`). Alleen `app.css`
gewijzigd → cache-buster verhoogd naar `v=111` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v63`.

## Ontwerpbesluiten (vervolg 36)

**Iteratie 37 — service worker/cache-invalidatie voor het eerst écht
getest (geen bug gevonden, wel een belangrijke blinde vlek in de
teststrategie ontdekt en gedicht).**

Belangrijke ontdekking vooraf: `app.js` registreert de service worker
alleen wanneer `location.protocol==='https:'` — op de lokale testserver
(`http://localhost:8099`, gebruikt in ALLE voorgaande 36 iteraties) wordt
`sw.js` dus NOOIT geregistreerd. De hele cache-buster-discipline die sinds
iteratie 20 wordt volgehouden (elke keer `?v=N` ophogen bij een
app.css/app.js-wijziging) is dus 36 iteraties lang nooit end-to-end
empirisch getest — alleen op vertrouwen in de conventie uitgevoerd.

**Aanpak:** een losse, wegwerpbare test-harness-HTML-pagina (niet
onderdeel van de app, alleen in de tijdelijke testserver-root gezet en na
afloop weer verwijderd) die `/sw.js` rechtstreeks registreert, buiten de
`https`-gate van `app.js` om — zo wordt de ECHTE `sw.js` getest zonder de
appcode te hoeven aanpassen. Daarna een volledige deploy-simulatie: de
huidige `SHELL_CACHE`-naam en `?v=`-nummers in een tijdelijke kopie van
`sw.js` verhoogd (zoals een echte volgende iteratie zou doen),
`registration.update()` aangeroepen, en de cache-status vóór en ná
gecontroleerd.

**Testresultaten (Playwright, Chromium):** vóór de simulatie: SW
controleert de pagina, `utca-shell-v63` bevat exact de 6 verwachte
`v=111`-assets. Direct na `registration.update()` gaat de nieuwe worker
door naar `activating` (dankzij de bestaande `self.skipWaiting()`) zonder
dat er tabs gesloten hoeven worden. Na één simpele reload: de NIEUWE
worker controleert de pagina, de OUDE cache (`utca-shell-v63`) is volledig
verdwenen (correct opgeruimd door de bestaande `activate`-handler), en de
NIEUWE cache (`utca-shell-v64`) bevat precies de 6 bijgewerkte
`v=112`-assets. Geen console-errors, geen wees-cache-entries, geen
tussentijdse inconsistente staat. **De update-/cache-invalidatiemechaniek
werkt dus exact zoals bedoeld — geen bug gevonden**, maar dit is de eerste
keer dat dit daadwerkelijk is aangetoond in plaats van aangenomen.

Geen codewijziging nodig; geen cache-buster-verhoging (dit was pure
verificatie, geen wijziging aan `app.css`/`app.js`). De tijdelijke
test-harness (`sw-harness.html`) en de teruggedraaide `sw.js`-kopie zijn
na afloop verwijderd/hersteld — geen sporen in de repo.

## Ontwerpbesluiten (vervolg 37)

**Iteratie 38 — offline-navigatie werkt goed, maar `cacheFirst()` had een
onafgevangen `fetch`-afwijzing gevonden en gefixt.**

Voortbouwend op de losse test-harness-techniek uit iteratie 37: een
volledige offline-simulatie (`context.setOffline(true)` in Playwright) na
een normaal online bezoek. **Goed nieuws:** de kernapp laadt perfect
offline vanuit cache — inlogstatus, styling, volledige dagplanning, zelfs
een nooit eerder bezocht diep pad valt netjes terug op de gecachete shell
(`caches.match('/')`). Geen enkel regressiepunt op dat vlak.

Bij het uitpluizen van de console-output (wél zichtbare foutmeldingen,
ook al brak de UI niet) bleek `cacheFirst()` — gebruikt voor de
`/api/place-photo`-metadata-lookup — als ENIGE van de twee cache-
strategieën in `sw.js` geen `.catch()` op zijn interne `fetch()` te
hebben. `staleWhileRevalidate()` (voor app.css/app.js/manifest/webp's)
vangt een mislukte fetch al netjes af met `.catch(()=>cached)`; `cacheFirst`
had die vangnet niet. Bij een offline aanvraag voor een foto die nog
nooit eerder is opgehaald (dus geen cache-hit), resulteerde dit in een
onafgevangen `fetch`-afwijzing die tot bij de aanroepende `fetch()` in
`app.js` doorstootte als een generieke "Failed to fetch"-exception.

**Wie het raakt:** in de praktijk niemand zichtbaar — `app.js` ving deze
afwijzing zelf al af (`applyPlacePhoto`'s `.catch()` verwijdert gewoon de
laad-status) — maar het is een reële, onnodige onafgevangen `Promise`-
afwijzing binnenin de service worker zelf, en dus het verschil tussen "een
nette HTTP-foutrespons" en "een onvoorspelbaar netwerkfout-pad" voor een
toekomstige aanroeper die daar niet óók een vangnet voor heeft.

**Fix:** `.catch(()=>cached||new Response(null,{status:503}))` toegevoegd
aan `cacheFirst`, exact het patroon dat `staleWhileRevalidate` al gebruikt,
plus een garantie dat er ALTIJD een geldige `Response` teruggaat naar
`respondWith()` (nooit `undefined`, nooit een afwijzing).

**Testresultaten (Playwright, met de losse SW-testharness):** vóór de fix
gaf een `fetch()` naar een nooit-gecachete foto-URL, offline, `{"threw":
true,"message":"Failed to fetch"}` — bug gereproduceerd. Ná de fix:
`{"ok":false,"status":503,"threw":false}` — een nette, voorspelbare
HTTP-respons. De volledige offline-shell-test (kernapp + diep pad) blijft
foutloos werken; de console toont nu "503" i.p.v. rauwe
netwerkfout-regels. Volledige `capture.js`-regressievlucht foutloos op
Chromium + WebKit. Alleen `sw.js` gewijzigd (geen app.css/app.js-
wijziging) → `SHELL_CACHE` verhoogd naar `utca-shell-v64` (cache-buster
`v=111` voor app.css/app.js blijft ongewijzigd, aangezien die bestanden
zelf niet zijn aangepast).

## Ontwerpbesluiten (vervolg 38)

**Iteratie 39 — meter-/beoordelingsrekenwerk cijfer-voor-cijfer
nagerekend (geen bug), net als de dagplanning-verificatie in iteratie 29.**

Eerst met de hand nagerekend welke van de 11 itinerary-stops daadwerkelijk
`meter:true` hebben: `start` en `finish` niet, de overige 9 (weer-stop,
lunch, pool, neude, jeu, oudegracht, dinner, bars, final) wel — dus het
maximum "X van 9 onderdelen ingevuld" klopt met de brondata.

Daarna `averageFromRatings()`/`percentFromAverage()`/`bandForScore()` met
Playwright getest tegen 11 losse, met de hand vooraf uitgerekende
scenario's: 1/2/3 beoordelingen (gemiddeldes 3.0, 4.0, 3.0), een
score-wisseling (tik nogmaals om te wissen, gemiddelde 2.0), alle 9
stops op 1 (gemiddelde 1.0, 0%) en op 5 (gemiddelde 5.0, 100%), en —het
belangrijkste, want dit is precies waar eerdere off-by-one-fouten in dit
project zaten (iteratie 21's ranking-bug) — de vier exacte
scharnierpunten van `bandForScore` (1.5, 2.5, 3.5, 4.5) plus een
niet-schone breuk (1,2,2 → 1,6667). Elk van de 11 scenario's: percentage,
bandlabel ÉN de "Gemiddeld X,X/5 · Y van 9"-tekst kwamen exact overeen
met de met de hand uitgerekende verwachting, inclusief de afronding bij
de scharnierpunten (bv. 2.5 → precies band 3 "Lekker uit de hand", niet
band 2 — `v<2.5` sluit 2.5 zelf terecht uit). Geen fout gevonden.

Geen codewijziging, geen cache-buster-verhoging (pure verificatie).

## Ontwerpbesluiten (vervolg 39)

**Iteratie 40 — de "Stand"-tab-screenshot loog al 39 iteraties lang: geen
app-bug, maar een timing-bug in `capture.js` zelf.**

Op zoek naar een kandidaat met échte zichtbare impact eerst WebKit op
320px breedte (nog niet eerder getest) doorlopen met een automatische
horizontale-overflow-check op elk scherm — geen enkel overflow-probleem
gevonden, layout houdt overal stand tot op de smalste geteste
iPhone-breedte.

Bij het daarna handmatig doorlezen van de resulterende screenshots viel
wél iets op: de "Stand"-tab-screenshot (`09-stand-tab.png`) toonde een
willekeurige tussenstop-kaart uit de tijdlijn (Café De Postillon) met een
groot zwart gat erboven — niet de bedoelde "DEGRADATIESTRIJD"-ranglijst.
Grondig root-cause-onderzoek (scroll-positie op verschillende momenten
gemeten): de `[data-tab-target="stand"]`-knop scrollt WEL correct naar
`#finalResult` — maar `capture.js` wachtte na die klik maar 300ms,
terwijl de smooth-scroll-animatie naar dat (na inchecken/beoordelen/
alternatieven-openen ver naar beneden verschoven) doel op dit systeem
ruim 1000ms nodig had om te settelen. De screenshot werd dus letterlijk
halverwege de scroll-animatie genomen — een puur test-timing-probleem,
geen bug in `app.js`'s scroll-doel-logica zelf.

**Waarom dit 39 iteraties onopgemerkt bleef:** de Chromium-screenshots
(`screenshots/after/`) zijn gitignored — nooit gecommit, dus nooit
zichtbaar bij het terugbladeren door de repo-historie. De WÉL gecommitte
WebKit-versie bleek toevallig altijd op tijd te settelen (WebKit's
smooth-scroll-timing verschilt kennelijk van Chromium's in deze
testomgeving), dus die verborg het probleem toevallig. Alleen door deze
iteratie zelf, live, de Chromium-uitvoer te bekijken kwam het aan het
licht.

**Fix (in de testinfrastructuur, niet in de app):** een
`waitForScrollSettled()`-hulpfunctie in `capture.js` die `window.scrollY`
polt totdat die niet meer verandert (met een ruime `maxMs`-veiligheidsklep),
i.p.v. een vaste timeout te gokken — toegepast op alle drie de
bottom-tab-scrollacties (`stand`, `rest`, `hier`/regenmodus). Dit maakt
de regressievlucht zelf betrouwbaarder voor toekomstige iteraties,
ongeacht hoe ver een toekomstige toevoeging de pagina nog verder maakt.

**Testresultaten:** ná de fix toont `09-stand-tab.png` op zowel Chromium
als WebKit correct de "DEGRADATIESTRIJD"-ranglijst met de juiste actieve
tab-highlight. De reeds gecommitte WebKit-versie bleek byte-identiek aan
de nieuwe (bevestigt dat WebKit hier al goed zat); de overige screenshots
(`10-group-tab`, `11-rain-mode`) blijven correct. Geen wijziging aan
`app.css`/`app.js`/`sw.js` → geen cache-buster-verhoging nodig; alleen
`screenshots/capture.js` gewijzigd.

## Ontwerpbesluiten (vervolg 40)

**Iteratie 41 — echte (geen test-artefact) bug gevonden: de "Stand"-knop
onderin bleef na het scrollen soms permanent verkeerd gemarkeerd als
"De rest".**

Vervolg op de vraag of echte gebruikers ook last hebben van de in
iteratie 40 ontdekte lange scroll-duur. Antwoord: nee, een animerende
smooth-scroll van >1 seconde voelt voor een mens niet "kapot" aan (je
ZIET de pagina bewegen) — maar het onderzoek legde wél een aparte, echte
bug bloot. `scrollToNavTarget()` zet bij een tik op een onderin-tabblad
een `navLock` van 900ms: zolang die loopt, negeert de scroll-listener de
automatische tabblad-detectie en blijft het net getikte tabblad
gemarkeerd. Met Playwright de actieve tabblad-status elke 100ms bemonsterd
tijdens een tik op "Stand" op een pagina die (na inchecken, beoordelen en
alternatieven openen) een lange scroll vereist: de scroll settelde pas na
~830-930ms — VLAK NA het verlopen van de 900ms-lock. Zodra de lock
verliep, greep de automatische detectie in vóórdat de knop "Stand" zelf
als blijvend correct werd bevestigd, en `detectBottomTab()` bleek op de
uiteindelijke (door document-einde ingekorte) scrollpositie een net iets
te strenge 38%-drempel te hanteren voor `#finalResult` — met als gevolg
dat de markering permanent bleef hangen op "De rest" in plaats van terug
te springen naar "Stand", zelfs nadat de scroll allang klaar was.

**Wie het raakt:** iedereen die "Stand" (of "De rest") aantikt op een
moment dat de pagina al behoorlijk lang is (laat op de dag, na veel
inchecks/beoordelingen/geopende alternatieven) — precies het scenario dat
op de dag zelf steeds waarschijnlijker wordt naarmate de route vordert.
Ook het "KLAAR"-knopje aan het einde van de dag (dat los van
`scrollToNavTarget()` zijn eigen `setBottomTabActive('stand')` deed,
zonder ooit `navLock` te zetten) had exact dezelfde kwetsbaarheid, op het
meest betekenisvolle moment van de hele dag.

**Fix (kleinst mogelijk):** de `navLock`-duur verhoogd van 900ms naar
1800ms — ruim boven de gemeten ~930ms-scrollduur, met marge voor een nog
langere pagina later op de dag. Dezelfde `navLock`-toewijzing ook
toegevoegd aan het "KLAAR"-knopje, dat dit eerder helemaal miste.

**Testresultaten (Playwright, 100ms-bemonstering over 2 seconden na de
tik):** vóór de fix bleef de markering na ~930ms permanent op "De rest"
hangen (11 van de 20 metingen fout, allemaal na het verlopen van de oude
lock). Ná de fix: alle 20 metingen tonen "Stand" correct, op zowel
Chromium als WebKit. Volledige `capture.js`-regressievlucht foutloos.
Alleen `app.js` gewijzigd → cache-buster verhoogd naar `v=112` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v65`.

Kleine restkwestie, bewust niet meegenomen: de onderliggende
38%-drempel in `detectBottomTab()` zelf kan in theorie nog steeds een
fractie te streng zijn als een gebruiker via HANDMATIG scrollen (niet via
een tabblad-tik) toevallig op exact dezelfde krappe scrollpositie
uitkomt — een veel onwaarschijnlijker scenario dan de nu opgeloste,
betrouwbaar reproduceerbare tik-variant. Kandidaat voor een latere
iteratie als het daadwerkelijk voorkomt.

## Ontwerpbesluiten (vervolg 41)

**Iteratie 42 — weer-alternatieven-hypothese grondig onderzocht en
uitgesloten: geen bug, want onbereikbaar met de echte brondata.**

Vervolg op de al langer openstaande vraag over `ensureNoConsecutiveDuplicate()`
+ `venueSelections` bij het wisselen van Zon/Regen. Vermoeden: deze functie
wijzigt bij een weer-wissel STIL (geen toast, in tegenstelling tot
`selectVenue()`'s eigen expliciete toast bij een handmatige keuze) welke
alternatieve locatie "actief" is voor de aangrenzende `lunch`-stop, als de
nieuwe weer-locatie toevallig hetzelfde adres deelt met wat de gebruiker
daar al had gekozen — een potentieel verwarrende, onzichtbare wijziging
buiten de gebruiker om.

**Onderzoek (Playwright, adressen van alle 11 stops uitgelezen in zowel
Zon- als Regenmodus):** met de STANDAARD (index-0) selecties bevat geen
van beide weermodi ook maar één aangrenzend adrespaar dat overeenkomt —
`ensureNoConsecutiveDuplicate()` heeft dus met de daadwerkelijke,
opgeleverde locatie-content NOOIT iets om stil te corrigeren, in geen van
beide modi. Omdat de aangrenzende stops van alle NIET-weergerelateerde
stops nooit veranderen (alleen de weer-stop zelf wisselt van locatie), kan
een eenmaal geldige, door de gebruiker gekozen combinatie ook nooit later
alsnog in conflict komen door een weer-wissel — behalve specifiek bij
`lunch`, en juist daar bleek al geen enkel adres van de weer-varianten
(Kanoverhuur/Café Orloff) overeen te komen met `lunch` of een van diens
drie alternatieven.

**Conclusie:** de stille-overschrijf-code in `ensureNoConsecutiveDuplicate()`
is met de huidige, opgeleverde locatie-content niet bereikbaar — puur
defensieve code voor een scenario dat met deze brontekst niet kan
voorkomen. Geen bug, geen fix nodig; wel een geruststellende, expliciete
bevestiging in plaats van een aanname. Geen codewijziging.

## Ontwerpbesluiten (vervolg 42)

**Iteratie 43 — de in iteratie 41 als "onwaarschijnlijk" bestempelde
`detectBottomTab()`-restkwestie bleek juist BREED bereikbaar: gewoon
handmatig naar beneden scrollen was al genoeg.**

Direct vervolg op de vraag of de 38%-drempel-kwestie uit iteratie 41
daadwerkelijk triggerbaar is via realistisch handmatig scrollen. Bleek
JA — en veel makkelijker dan gedacht: het document heeft maar één
werkelijk maximale scrollpositie, en `#finalResult` (aan het einde van de
pagina) kan daardoor NOOIT verder omhoog scrollen dan die ene, vaste
grens — ongeacht OF je daar via een tabblad-tik komt (nu al beschermd
door de iteratie-41-`navLock`-fix) OF via gewoon met de vinger/muiswiel
naar beneden scrollen tot het einde van de pagina (compleet onbeschermd,
want `navLock` wordt alleen bij een tabblad-tik gezet). Met Playwright
bevestigd op zowel Chromium als WebKit: een simpele scroll-naar-beneden
(géén tabblad aangeraakt) laat het "De rest"-tabblad onderin actief
blijven staan, terwijl de zichtbare inhoud overduidelijk de
"DEGRADATIESTRIJD"-ranglijst is.

**Wie het raakt:** iedereen die simpelweg naar het einde van een
langere-dan-gemiddelde pagina scrolt (bv. na het inchecken/beoordelen van
meerdere stops) om de tussenstand of eindstand te bekijken, zonder ooit
een tabblad aan te raken — een compleet normale, veelvoorkomende actie,
niet de zeldzame edge-case die eerder werd aangenomen.

**Fix:** `detectBottomTab()` kreeg een extra "aan het einde van het
document"-check (`window.scrollY+window.innerHeight>=
document.documentElement.scrollHeight-4`) die, gecombineerd met
`#finalResult` nog zichtbaar (`rr.bottom>0`), de bestaande 38%-drempel
voor "Stand" aanvult i.p.v. vervangt — bij de werkelijke bodem van de
pagina wint "Stand" nu altijd, ongeacht de exacte pixelpositie van
`#finalResult` zelf.

**Testresultaten (Playwright, directe `scrollTo`-simulatie van het
absolute paginaeinde, zonder enige tabblad-tik):** vóór de fix bleef "De
rest" foutief actief op zowel Chromium als WebKit; ná de fix toont beide
engines correct "Stand". De iteratie-41-regressietest (tabblad-tik,
100ms-bemonstering) blijft foutloos. Volledige `capture.js`-
regressievlucht foutloos; het "De rest"-tabblad (`10-group-tab.png`)
blijft correct actief in zijn eigen scenario (`#groep` zit niet aan het
paginaeinde, dus ongewijzigd). Alleen `app.js` gewijzigd → cache-buster
verhoogd naar `v=113` in `index.html`/`sw.js`/`test-local.html`,
`SHELL_CACHE` naar `utca-shell-v66`.

## Ontwerpbesluiten (vervolg 43)

**Iteratie 44 — vierde bug in dezelfde familie: `jumpToStop()` zette
helemaal geen `navLock`/`setBottomTabActive()`, met een op WebKit
(de motor die het dichtst bij een echte iPhone komt) reproduceerbaar
vastgelopen tabblad tot gevolg.**

Rechtstreeks vervolg op de vraag of `jumpToStop()` (aangeroepen bij een
klik op een vriend in de groepslijst, of op de "spring naar huidige
stop"-tekst in de journeybar) dezelfde kwetsbaarheid heeft als de nu
drie keer gefixte tabblad-familie (iteraties 30, 33, 41, 43). Eerste test
(inchecken bij een late stop, dan via journeyCopy terugspringen) toonde
geen probleem — de standaard-fallback van `detectBottomTab()` is toevallig
altijd "hier", dus een gemiste her-detectie viel daar niet op. Tweede,
realistischer test legde het wél bloot: tik op "De rest" (zet de 1800ms-
`navLock` en markeert "De rest"), spring binnen die tijd naar een vriend
ergens anders in de tijdlijn via de groepslijst — `jumpToStop()` start zijn
eigen scroll-animatie zonder ooit `navLock` aan te raken. Op Chromium
duurde de animatie toevallig lang genoeg om na het verlopen van de oude
lock nog een correctie-scroll-event te laten vuren; op **WebKit was de
animatie al eerder klaar, waardoor na het verlopen van de lock geen
scroll-event meer vuurde en de markering permanent op "De rest" bleef
hangen** — terwijl overduidelijk een tijdlijnkaart in beeld was.

**Wie het raakt:** iedereen die naar "De rest" tikt en vervolgens (binnen
zo'n 1,8 seconde, heel gewoon bij vlot doortikken) een vriend in de
groepslijst aantikt om naar hun stop te springen — vooral relevant op
WebKit/Safari, dus precies het motortype dat op de dag zelf op de meeste
telefoons draait.

**Fix:** `jumpToStop()` zet nu, net als `scrollToNavTarget()`, meteen zijn
eigen `navLock` (1800ms) en roept expliciet `setBottomTabActive('hier')`
aan vóór de scroll start — ongeacht of je naar je eigen stop of die van
een vriend springt, want in beide gevallen kijk je naar de tijdlijn
("Hier"), nooit naar "Stand" of "De rest".

**Testresultaten (Playwright):** vóór de fix bleef "De rest" op WebKit
foutief actief na de spring-naar-vriend-actie (Chromium toevallig wel
goed); ná de fix tonen beide engines correct "Hier". Alle eerdere
regressietests uit iteraties 40-43 (tabblad-tik-flikkering, handmatig
scrollen naar het paginaeinde, spring-naar-eigen-stop) blijven foutloos.
Volledige `capture.js`-regressievlucht foutloos op Chromium + WebKit.
Alleen `app.js` gewijzigd → cache-buster verhoogd naar `v=114` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v67`.

## Ontwerpbesluiten (vervolg 44)

**Iteratie 45 — ECHTE GEBRUIKERSMELDING: zwart scherm bij "Zet op
beginscherm" vanuit Safari. Kritieke bug gevonden en gefixt.**

De gebruiker meldde live: *"als ik hem add naar mijn homescreen vanaf
safari krijg ik een zwart scherm en werkt de laatste iteratie niet"* —
later vanzelf opgelost na herladen, maar bevestigd: *"in het verleden
gebeurde het nooit"*. Direct onderzocht in plaats van aangenomen dat het
met een simpele cache-verversing wel goed zou komen.

**Root cause gevonden:** `index.html` gebruikt al sinds lang vóór deze
sessie een FOUC-preventiepatroon: de hele app blijft `visibility:hidden`
totdat `app.css` via een `<link rel="preload" ... onload="...
classList.add('css-ready')">` is geladen. Zolang `css-ready` niet gezet
is, blijft ALLES onzichtbaar — behalve de donkere achtergrondkleur
(`#11150f`), die al vóór het laden van app.css inline in de `<head>`
staat. **Als die ene `onload` om welke reden dan ook nooit vuurt (het
verzoek hangt, in plaats van te slagen óf expliciet te falen), blijft de
app voor altijd onzichtbaar — een letterlijk zwart scherm, precies het
gemelde symptool.** Er was geen `onerror`-vangnet en geen enkele timeout.

Dit is geen nieuw-geïntroduceerde fout van deze sessie; dit patroon staat
al sinds ver vóór iteratie 1 ongewijzigd in `index.html` (alleen de
`?v=`-nummers zijn elke iteratie opgehoogd). Het is een sluimerend risico
dat blijkbaar
nooit eerder daadwerkelijk raakte totdat een service-worker-update
(mogelijk samenvallend met de vele `SHELL_CACHE`-bumps deze sessie) het
`app.css`-verzoek liet hangen tijdens een koude start van de
homescreen-app — precies het scenario waarin `add to homescreen`-apps op
iOS bekendstaan om net iets anders te reageren dan een gewone Safari-tab.

**Wie het raakt:** IEDEREEN die de app op het beginscherm zet — en
specifiek een blijvend zwart scherm zonder enige foutmelding of
herstelmogelijkheid, behalve toevallig herladen. Op de dag zelf, met
weinig geduld en zonder devtools, had dit een vriend volledig kunnen
buitensluiten.

**Fix (klein, robuust, geen nieuwe afhankelijkheden):**
1. `onerror="document.documentElement.classList.add('css-ready')"`
   toegevoegd aan de preload-link — vangt een expliciete laadfout op.
2. Een piepklein, niet-uitgesteld inline `<script>` direct erna:
   `setTimeout(function(){document.documentElement.classList.add(
   'css-ready')},2500)` — een harde vangnet-timeout die de app ALTIJD
   zichtbaar maakt na 2,5 seconden, ongeacht of `app.css` slaagt, faalt,
   of gewoon blijft hangen. Omdat de `<head>` al kritieke inline CSS
   bevat die het inlogscherm redelijk oogt zonder `app.css`, is de
   ergst denkbare uitkomst nu "even een kale flits" i.p.v. een blijvend
   zwart scherm.
3. Dezelfde twee toevoegingen ook in `test-local.html`.
4. `SHELL_CACHE` verhoogd naar `utca-shell-v68` zodat de gecachete
   offline-fallback van `/` (index.html) ook de fix bevat — geen
   `?v=`-wijziging nodig voor `app.css`/`app.js` zelf, want die zijn
   inhoudelijk ongewijzigd (index.html wordt sowieso altijd network-first
   opgehaald bij een echte navigatie, dit is puur voor de offline-cache).

**Testresultaten (Playwright, `app.css`-verzoek kunstmatig voor altijd
laten hangen — nooit vervuld, nooit afgewezen, exact het vermoede
faalscenario):** vóór de fix bleef `css-ready` na 3+ seconden nog
steeds `false` op zowel Chromium als WebKit — bug bevestigd
gereproduceerd. Ná de fix: `css-ready` correct `true` na de 2,5s-
timeout, op beide engines. Normale, snelle laadpaden blijven
ongewijzigd snel (`css-ready` binnen ~530ms, ruim vóór de vangnet-
timeout, op beide engines) — geen enkele regressie voor het normale
geval. Volledige `capture.js`-regressievlucht foutloos.

## Ontwerpbesluiten (vervolg 45)

**Iteratie 46 — vervolg op de zwarte-scherm-fix: dezelfde blinde vlek
bestond ook voor `app.js` zelf, nu ook gedicht.**

Direct na iteratie 45 zelf verder gezocht naar vergelijkbare "als dit ene
signaal nooit afgaat, blijft het voor altijd hangen"-patronen — precies
wat aan de gebruiker was aangeboden. Twee kandidaten gevonden:

1. Losstaande venue-fotos (`applyPlacePhoto()`/`img.onload`/`onerror`):
   als een fotoverzoek blijft hangen, blijft dat ene kaartje voor altijd
   op `opacity:0` staan — puur cosmetisch, de rest van de kaart (titel,
   beschrijving, knoppen) blijft volledig werken. Bewust NIET gefixt:
   geen enkele impact op de bruikbaarheid van de app.
2. **`<script defer src="/app.js?...">` zelf had geen enkel vangnet.**
   Als dit bestand niet laadt (netwerkfout) — of erger, een keer een
   syntaxfout bevat — dan is er geen enkele foutmelding: de gebruiker ziet
   een schijnbaar normaal, gestyled inlogscherm (dankzij de kritieke
   inline CSS) dat volledig NIETS doet bij een tik op de knop, zonder een
   spoor van uitleg waarom. Dit is subtieler maar potentieel net zo
   verwarrend als het zwarte scherm — de gebruiker ziet geen duidelijk
   "kapot"-signaal, alleen een knop die niets doet.

**Fix:** een `window.__appJsLoaded=true;` als allereerste statement in
`app.js` (vóór zelfs de IIFE-opening) — dit wordt gegarandeerd gezet
zodra het bestand ook maar begint te parsen/uitvoeren, en blijft
`undefined` bij zowel een netwerkfout als een fatale syntaxfout (beide
voorkomen dat er ook maar iets uitvoert). In `index.html`/`test-local.html`
een tweede `setTimeout` (3500ms, na de bestaande 2500ms css-ready-timeout)
die — als `__appJsLoaded` dan nog steeds ontbreekt — het bestaande
`#bootError`-element (al aanwezig sinds vóór deze sessie, maar tot nu toe
alleen gebruikt als `init()` zelf een uitzondering gooit) rechtstreeks via
inline `style.cssText` zichtbaar maakt — bewust NIET afhankelijk van
`app.css` (die kan zelf ook nog vastzitten), met een eigen complete,
leesbare styling.

**Testresultaten (Playwright, `app.js`-verzoek kunstmatig laten
mislukken):** vóór de fix bleef de boot-foutmelding volledig verborgen,
gaf de pagina geen enkel signaal. Ná de fix verschijnt de bestaande
Nederlandse foutmelding ("De interactieve laag kon niet starten...")
duidelijk zichtbaar, op zowel Chromium als WebKit. Normale laadpaden
tonen na 4 seconden nog steeds `bootErrorDisplay:"none"` (geen
vals-positief). Volledige `capture.js`-regressievlucht foutloos. Alleen
`app.js` gewijzigd (1 regel) → cache-buster verhoogd naar `v=115` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v69`.

## Ontwerpbesluiten (vervolg 46) — directe gebruikersfeedback

**Gebruiker: "Ga verder met itereren, want er moet sowieso altijd een
locatiefoto aanwezig zijn. Daarnaast zijn de bolletjes met de vinkjes in
de tijdlijn niet mooi gedesigned. Daar kunnen wel een paar iteraties
overeen."** Twee losse verbeterpunten, expliciet toestemming voor
meerdere iteraties op het tweede punt. Iteratie 47 pakt eerst het eerste
punt aan (en legt meteen de basis voor het tweede).

**Iteratie 47 — altijd een locatievisual aanwezig, ook zonder
Google-foto.**

Probleem: bij het ontbreken van een echte foto (geen netwerk, geen/
verlopen Google Maps API-sleutel, geen foto bekend bij Google, of gewoon
traag) bleef `.card-media` een vrijwel onzichtbaar, leeg zwart vlak —
`img{opacity:0}` totdat `.loaded`, zonder enig ander zichtbaar element
erachter. Op de lokale testomgeving (geen API-sleutel) is dit
permanent zichtbaar voor elke kaart; ook in productie kan dit gebeuren
zodra Google geen foto heeft voor een specifieke locatie of de foto-fetch
faalt. Precies het scenario dat de gebruiker meldde.

**Fix:** een altijd-aanwezige, ontworpen val-terug-visual toegevoegd
áchter de echte foto: een subtiel limegroen-getint radiaal verloop met
het bij die stop horende icoon (trein, kano, kop koffie, bal, bier,
jeu-de-boules-ballen, cocktail, wijn, avondeten, broodje, vlag — alle
elf al lang aanwezig in `ICONP`/`svgIcon()`, maar tot deze iteratie
nooit daadwerkelijk gebruikt in de tijdlijn zelf). Zodra een echte foto
wél succesvol laadt, schuift die er via de bestaande opacity-transitie
overheen — geen zichtbaar verschil met vroeger wanneer het wél werkt,
wel altijd een verzorgd resultaat wanneer het niet werkt.

**Technisch:** `placePhotoHtml()` kreeg een derde parameter (`icon`,
afkomstig van de stop-data `x.icon`) en rendert nu een
`.venue-photo-fallback`-laag mét `svgIcon(icon)` vóór de bestaande
`<a>/<img>`-foto-link — puur een toevoeging, geen wijziging aan de
bestaande foto-laad-/caching-logica. Werkt automatisch ook voor de
onboarding-preview (kloont de live kaart) en blijft consistent in
regenmodus. De losstaande onboarding-stilfoto's (`onboarding-checkin.
webp`/`onboarding-options.webp`, sinds iteratie 27) gebruiken hun eigen,
altijd-werkende statische-asset-pad en zijn hier niet door geraakt.

**Testresultaten:** visueel gecontroleerd op alle stops (trein-icoon bij
Utrecht Centraal, kano bij Kanoverhuur, kop koffie bij Café Orloff in
regenmodus) — telkens een verzorgd, herkenbaar icoon i.p.v. een leeg
zwart vlak. Onboarding-check-in-slide ongewijzigd correct (eigen
statische foto). Volledige `capture.js`-regressievlucht foutloos op
Chromium + WebKit. `app.css` én `app.js` gewijzigd → cache-buster
verhoogd naar `v=116` in `index.html`/`sw.js`/`test-local.html`,
`SHELL_CACHE` naar `utca-shell-v70`.

**Vervolg:** het tweede punt (tijdlijn-"bolletjes"/rail-nodes) volgt in
een of meer volgende iteraties — `.tl-node.has-photo` bestaat al als
CSS-aanknopingspunt en kan nu dezelfde iconen hergebruiken voor een
rijker ontwerp.

## Ontwerpbesluiten (vervolg 47) — tijdlijn-rail-nodes, ronde 1

**Iteratie 48 — de "todo"-bolletjes op de rail kregen hetzelfde icoon als
de locatievisual, plus een echte bug gevonden en gefixt onderweg.**

Direct vervolg op het tweede feedbackpunt. Eerst het huidige ontwerp
opgemeten: "done" 19px met vinkje, "current" 21px met een lime ringetje +
binnenstipje, "todo" een kaal, klein (13px), laag-contrast bolletje —
precies zoals de gebruiker beschreef, niet mooi.

**Fix, deel 1 (ontwerp):** de "todo"-bolletjes tonen nu hetzelfde
stop-icoon als de locatievisual uit iteratie 47 (hergebruik van
`ICONP`/`svgIcon()`), in een subtiele, gedempte kleur op een iets groter
(13px→17px) en beter zichtbaar bolletje (achtergrond/rand-contrast licht
verhoogd). "Done" en "current" ongewijzigd — die twee waren al duidelijk
en onderscheidend.

**Fix, deel 2 (echte bug, gevonden tijdens het testen van deel 1):** bij
het eerste testen bleek het icoon te verdwijnen zodra je daadwerkelijk
incheckt — precies het "wisselende-status-familie"-patroon dat al vier
keer eerder een bug opleverde (iteraties 30, 33, 41, 43, 44). Root cause:
`railHtml()` (gebruikt bij de EERSTE render van de hele tijdlijn) kreeg
wél het nieuwe icoon-argument, maar `updateCheckinUi()` — een VOLLEDIG
aparte, lichtgewicht her-render-functie die bij elke check-in/uitcheck
wordt gebruikt in plaats van de hele tijdlijn opnieuw op te bouwen —
zette `node.innerHTML` rechtstreeks op een kopie van de OUDE logica
("done" → vinkje, anders leeg), zonder ooit van het nieuwe icoon te
weten. Resultaat: iconen zichtbaar bij het eerste laden, maar ze
verdwenen zodra er ook maar één keer werd ingecheckt bij wéér het even.
Gefixt door dezelfde icoon-logica ook in `updateCheckinUi()` toe te
passen (met een guard tegen overschrijven zodra een node al een echte
foto-achtergrond heeft via `.has-photo`).

**Testresultaten (Playwright, complete check-in-flow doorlopen: vóór
inchecken → inchecken bij stop 1 → inchecken bij stop 2):** vóór de fix
verdwenen de iconen bij ALLE nog-niet-bezochte stops zodra er één keer
werd ingecheckt (bug gereproduceerd op alle 9 resterende "todo"-nodes).
Ná de fix blijven ze correct zichtbaar door de hele flow heen, op elk
moment. Icoon-vorm visueel gecontroleerd op 6× vergroting (duidelijk
herkenbaar vorkje-icoon voor "lunch"). Volledige `capture.js`-
regressievlucht foutloos op Chromium + WebKit. `app.css` én `app.js`
gewijzigd → cache-buster verhoogd naar `v=117` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v71`.

**Vervolg:** nog niet aangepakt in deze ronde: de `.has-photo`-variant
zelf (nooit lokaal te testen zonder een echte Google-API-sleutel), en of
"current"/"done" ook nog een opfrisbeurt verdienen nu de "todo"-staat is
opgewaardeerd. Kandidaat voor de volgende iteratie(s), zoals de gebruiker
toestond.

## Ontwerpbesluiten (vervolg 48) — tijdlijn-rail-nodes, ronde 2 (kritisch bekeken, geen wijziging)

**Iteratie 49 — vier concrete controles op de rail-nodes uitgevoerd, geen
van alle leverde een duidelijke verbetering op.**

1. **"current" naast het nieuwe "todo"-icoon:** met de hand vergroot
   (5×) naast elkaar bekeken — de heldere, gloeiende lime-stip blijft
   overduidelijk het meest opvallende element t.o.v. de gedempte
   todo-iconen. Een icoon toevoegen aan "current" zou de nu juist
   duidelijke hiërarchie (stip=hier, vinkje=klaar, icoon=nog komen)
   eerder verwateren dan verbeteren. Geen wijziging.
2. **Overgangsanimatie todo→current:** elke 40ms bemonsterd tijdens het
   inchecken. De icoon-inhoud verdwijnt direct (niet geanimeerd, zoals
   altijd al het geval was voor de vinkje-wissel), de grootte
   (17px→21px) schuift daarna vloeiend door de bestaande transition.
   Dit gedrag bestond al vóór iteratie 48 voor de vinkje-staat — geen
   nieuwe sprong, geen regressie.
3. **Contrast in regenmodus + op 320px breedte:** icoon (vaste
   grijstint, geen kleurvariabele) blijft in regenmodus prima leesbaar;
   bij 320px breedte geen overflow of te-klein-om-te-zien-effect.
4. **De verticale rail-lijn (2px, `#31353a`):** verhouding tot de nu
   17px todo-bolletjes nog steeds evenwichtig, geen aanpassing nodig.

**Conclusie:** na kritische beoordeling langs vier concrete assen is er
voor dit moment geen duidelijke vervolgverbetering te vinden die het
waard is om door te voeren — een micro-wijziging forceren zou geen
echte verbetering zijn. Terug naar de normale iteratie-cadans met vrije
onderwerpkeuze; de rail-node-serie kan later hervat worden als er een
concreet, nieuw punt naar voren komt (bv. zodra `.has-photo` in de
praktijk getest kan worden). Geen codewijziging.

## Ontwerpbesluiten (vervolg 49)

**Iteratie 50 — WebKit op 375px en 430px breedte doorgelicht (nog
openstaand punt uit "Resterende problemen"), geen probleem gevonden.**

320px was al gedekt (iteratie 42); 375px (bv. iPhone SE 2/3/13 mini) en
430px (bv. iPhone Pro Max) nog niet. Met dezelfde automatische
horizontale-overflow-detectie als iteratie 42, plus handmatige visuele
controle van de dichtst-bezette schermen (alternatieven open,
deelnemerspaneel open, Stand-tab), over de volledige `capture.js`-flow
op beide nieuwe breedtes.

**Resultaat:** geen enkel overflow-probleem op beide breedtes. Visueel
ook geen ongemakkelijke rek (bij 430px) of samendrukking (bij 375px) —
de `max-width:780px`-opzet met relatieve spacing schaalt netjes mee. Als
bijvangst nog eens bevestigd dat de Stand-tab-fix uit iteratie 43 ook
correct werkt bij een KORTERE viewport-hoogte (667px i.p.v. de overal
elders geteste 844px), wat de scroll-drempelberekening (`38% van
viewport-hoogte`) anders laat uitvallen — nog steeds correct. Geen
codewijziging; het "WebKit op overige breedtes"-punt in "Resterende
problemen" hieronder is bijgewerkt.

## Ontwerpbesluiten (vervolg 50)

**Iteratie 51 — echte, nog niet eerder gevonden bug: twee vrienden met
dezelfde (of anders gehoofdletterde) naam zouden elkaars check-in/
beoordelingen stilletjes overschrijven.**

Frisse blik op de groeps-/ratings-flow. De `participants`-tabel in
`_worker.js` gebruikt `name TEXT PRIMARY KEY COLLATE NOCASE` — d.w.z. de
naam is de sleutel, hoofdletterongevoelig, en elke `POST /api/state` doet
een `ON CONFLICT(name) DO UPDATE`. Zonder enige duplicaat-controle aan de
kliëntkant betekent dit: als twee ECHTE, verschillende vrienden dezelfde
voornaam intikken (of dezelfde naam met een andere hoofdletter, bv.
"Jeroen" vs "jeroen") deelt de backend hen stilzwijgend ÉÉN rij — de
laatste sync wint, incheck-status en beoordelingen van de eerste worden
overschreven, en `participants.length` klopt niet meer (bv. nooit 6,
waardoor `herdMoment()`'s "iedereen is er"-viering nooit meer afgaat).
Bij een vriendengroep van zes (vaak met vergelijkbare voornamen) een
reëel, niet-theoretisch risico — en potentieel erg verwarrend als het
gebeurt ("waarom staat mijn incheck opeens ergens anders?").

**Fix (klein, niet-blokkerend):** het bestaande `#nameHint`-regeltje
(sinds iteratie 29, tot nu toe alleen voor het aftellen van tekens)
hergebruikt en uitgebreid met een duplicaat-controle. `init()` haalt nu,
als er nog niemand is ingelogd, één keer stilletjes (`best-effort`, geen
melding bij falen) de bestaande deelnemerslijst op via `GET /api/state` —
dezelfde aanpak/foutafhandeling als `refreshState()`. Zodra iemand een
naam intikt die (hoofdletterongevoelig, getrimd) al voorkomt in die
lijst, toont het hint-regeltje een neutrale waarschuwing i.p.v. de
teken-teller. Bewust NIET blokkerend — het kán legitiem dezelfde persoon
zijn die opnieuw inlogt op een nieuw toestel, dus alleen een zachte
aansporing om een andere naam te kiezen, geen harde blokkade.

**Testresultaten (Playwright, `/api/state` GET gemockt met één bestaande
deelnemer "Jeroen"):** geen match → hint blijft leeg; exacte match
("Jeroen") → waarschuwing; hoofdletter-variant ("jeroen") → waarschuwing;
met spaties eromheen ("  JEROEN  ") → waarschuwing (dankzij bestaande
`.trim()`); inloggen blijft in alle gevallen gewoon mogelijk. De
bestaande teken-teller-hint (iteratie 29) blijft ongewijzigd correct
werken wanneer er geen duplicaat is. Visueel gecontroleerd: de melding
past netjes op twee regels, blokkeert de knop niet. Werkt identiek op
Chromium en WebKit. Volledige `capture.js`-regressievlucht foutloos.
Alleen `app.js` gewijzigd → cache-buster verhoogd naar `v=118` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v72`.

## Ontwerpbesluiten (vervolg 51)

**Iteratie 52 — "Open hele ronde in Google Maps"-link écht getest tegen
de live Google Maps-dienst, geen bug, wel een relevante grens ontdekt.**

Deze knop (`renderRoute()`, gegenereerd via de `api=1`
Google-Maps-URL-schema met `origin`/`destination`/`waypoints=...%7C...`)
was nooit eerder daadwerkelijk tegen de echte dienst getest — alleen de
URL-opbouw zelf gecontroleerd. Met de echte, door de app gegenereerde
link (11 stops: 1 origin + 9 waypoints + 1 destination) rechtstreeks in
een browser geopend.

**Resultaat: werkt volledig correct.** Alle 11 adressen laden in de
juiste volgorde, Google berekent de complete wandelroute (1u51m, 8,2km)
en toont de kaart met alle tussenstops precies zoals bedoeld. Wel
opgevallen: Google Maps toont de melding "Route kan niet verder worden
gewijzigd" — een aanwijzing dat 9 waypoints ergens dicht bij de praktische
grens van dit gratis URL-schema zit. Met de huidige, vaste dagindeling
(11 stops, nooit door de gebruiker uit te breiden) geen enkel probleem;
puur ter info vastgelegd mocht een toekomstige, andere dagindeling ooit
meer stops krijgen. Geen codewijziging.

## Ontwerpbesluiten (vervolg 52)

**Iteratie 53 — alle vijf reserverings-links écht getest tegen de
werkelijke externe websites, geen linkrot gevonden.**

Vervolg op iteratie 52's aanpak: ook de losse `reserve:`-links per stop
(Kanoverhuur, Poolcafé, JEU de boules bar, De Utrechter, 't Taphuys) zijn
hardgecodeerde, externe URL's die nooit eerder daadwerkelijk zijn
bezocht — een reëel risico op linkrot sinds het schrijven van de
brontekst (een site kan zijn reserveringspagina verplaatst/hernoemd
hebben). Alle vijf rechtstreeks in een browser geopend:

- `kanoverhuurutrecht.nl/reserveren` → echt reserveringsformulier ✓
- `poolenutrecht.nl/reserveren/` → echt reserveringsformulier ✓
- `jeudeboulesbar.nl/reserveren/` → echte reserveringspagina ✓
- `deutrechter.nl/` → correcte homepage, titel klopt ✓
- `taphuys.nl/utrecht/groepen` → correcte groepen-pagina, titel klopt
  exact met de tekst in de app ("Diner + zelf bier/wijn tappen") ✓

Geen enkele dode link, verkeerde doorverwijzing of verlopen pagina. De
twee `tel:`-links (Beers & Barrels, De Poort) zijn beide correct
opgemaakte Utrechtse 030-nummers (niet daadwerkelijk gebeld, dat viel
buiten de scope van veilig testen). Geen bug gevonden, geen
codewijziging — een geruststellende bevestiging dat de externe links in
de app nog steeds kloppen.

## Ontwerpbesluiten (vervolg 53)

**Iteratie 55 — de volledige dag van stop 1 t/m "KLAAR" in één
doorlopende test gedaan; nog niet eerder als één ononderbroken geheel
getest.**

Losse onderdelen van de incheck-flow zijn al vaak getest, maar niet de
VOLLEDIGE keten van alle 11 stops achter elkaar inchecken, inclusief het
uiteindelijke "KLAAR"-knopje aan het eind. Met Playwright alle 11 stops
op volgorde ingecheckt en bij elke stap gecontroleerd: het aantal
"done"/"current"/"todo"-rijen (moet altijd samen op 11 uitkomen), de
"STRAKS"-tekst (volgende stop) en de voortgangsteller ("N / 11").

**Resultaat: alle 11 stappen kloppen exact**, zonder één afwijking. Ook
het "KLAAR"-knopje zelf getest (na twee beoordelingen ingevuld te
hebben): de titel wisselt correct van "DEGRADATIESTRIJD" naar
"EINDSTAND", het "Stand"-tabblad blijft correct actief (bevestigt dat de
`navLock`-bescherming uit iteratie 43/44 ook hier, in dit specifieke
klikpad, gewoon werkt), en `resultsFinalized` wordt correct opgeslagen.
Visuele bijvangst: het "KLAAR"-knopje kleurt bij afronding terecht rood
i.p.v. lime — een al langer bestaand, correct ontwerpdetail dat nu voor
het eerst expliciet is opgemerkt en bevestigd. Getest op Chromium +
WebKit, identiek resultaat. Geen bug gevonden, geen codewijziging.

## Ontwerpbesluiten (vervolg 55) — directe gebruikersfeedback

**Gebruiker (met screenshot van eigen iPhone):** *"Ik wil achter de
percentages bij degradatiestrijd en eindstand in kleine grijze letters
zoals erboven bij David staat -> verouderd. Dus zelfde type font grootte
achter 70% en andere percentages hebben staan. Als er alleen een
minnetje dan geen -> 'naar de klote' hebben staan. Maak het mooi en
consistent zodat het past bij de rest van de app."*

**Iteratie 56 — klein grijs onderschrift "naar de klote" toegevoegd aan
de DEGRADATIESTRIJD/EINDSTAND-ranglijst.**

De ranglijst (`#finalResult`) toonde tot nu toe alleen een kale,
vetgedrukte "70%" zonder enige duiding — terwijl de "Laatste check-ins &
tussenstand"-lijst er direct boven wél al een klein grijs "50% naar de
klote"-label had (via `.person small`, 13px, `var(--text2)`). De
gebruiker wilde dezelfde stijl consistent doorgevoerd zien in de
ranglijst zelf, met als expliciete uitzondering: geen label wanneer er
nog geen score is (het streepje "—").

**Fix:** een nieuw `.final-stat-caption`-element toegevoegd per
ranglijst-slot (1e, 2e, 3e plaats), met exact dezelfde tekstopmaak als
`.person small` (13px, `var(--text2)`, normale letterdikte — geen
hoofdletters/letter-spacing, in tegenstelling tot het al langer
bestaande maar ongebruikte `.final-stat-sub` dat WEL zo'n stijl had maar
niet paste bij wat gevraagd was). Rechts uitgelijnd, direct onder de
naam/percentage-regel, zodat het visueel bij het percentage hoort.
`renderFinalResult()`'s `setResult()` vult "naar de klote" alleen in
wanneer er een echte score is; `clearResult()` (het streepje-geval)
laat het expliciet leeg, aangevuld met een CSS `:empty{display:none}`-
vangnet zodat een lege caption ook geen onnodige witruimte overhoudt.

**Testresultaten (Playwright):** zonder score → caption leeg én
onzichtbaar; met een echte score (75%) → caption toont "naar de klote"
en is zichtbaar; de nog-niet-gescoorde 2e/3e plek blijft correct zonder
caption. Visueel gecontroleerd: het label staat nu net zo netjes en
consistent als de referentie ("verouderd") die de gebruiker aanwees.
Volledige `capture.js`-regressievlucht foutloos op Chromium + WebKit.
`app.css`, `app.js` én `index.html` gewijzigd → cache-buster verhoogd
naar `v=119` in `index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE`
naar `utca-shell-v73`.

## Ontwerpbesluiten (vervolg 57) — verificatie, geen codewijziging

Twee losse controles, geen van beide leverde een bug op:

1. **Tijdlijn-rail-nodes (todo/current/done) nogmaals, expliciet visueel
   gecontroleerd** naar aanleiding van de eerdere gebruikersvraag over
   "de bolletjes met de vinkjes" (iteraties 47-49). Alle drie de
   stop-statussen los ingecheckt en op hoge zoom gefotografeerd: `todo`
   toont het venue-icoon (bv. trein/koffiekopje) in een grijze cirkel,
   `current` een pulserende lime stip-in-ring, `done` een lime cirkel met
   dikke witte vinkjes-lijn — alle drie consistent van vorm/grootte en
   identiek gerenderd op Chromium én WebKit. Geen visuele inconsistentie
   gevonden; de iteratie 47-49-fix blijft dus staan als afgerond.
2. **Alternatieve-locatie "info"-link spot-check**: "Kafé België,
   Oudegracht 196, Utrecht" (een alternatief bij twee verschillende
   stops) opgezocht via de daadwerkelijke Google Maps-zoeklink uit de
   app. Bestaat echt, juiste naam/adres, 4,5 sterren, momenteel open —
   geen data-fout. (Overige ~17 alternatieve-locatielinks nog niet één
   voor één nagelopen; laag risico, want het zijn generieke
   Google Maps-zoeklinks met verwaarloosbare kans op linkrot.)

Geen van beide controles gaf aanleiding tot een codewijziging; geen
cache-buster-verhoging nodig deze iteratie.

## Ontwerpbesluiten (vervolg 58)

**Frisse code-doorloop van `_worker.js`** (nog niet eerder in deze reeks
grondig doorgelicht): schema-migratie, rate-/inputvalidatie, Google
Places-proxy en cache-headers stuk voor stuk nagelopen. Twee dingen die
op het eerste gezicht bugs leken, bleken bij verificatie bewust en
correct: `herdMoment()`'s `participants.length!==6` klopt exact met de
"X/6"-teller in `renderRoster()` (de vriendengroep is zes personen), en
het Spaanse "Grupo completo ✓"-label daarin is dezelfde opzettelijke
taalgrap als eerder vastgesteld bij de onboarding-copy — geen bug.
Verder geen functionele fout gevonden in `_worker.js` zelf.

**Kleine, echte inconsistentie gevonden en gefixt:** `test-local.html`
verwees nog naar `manifest.webmanifest?v=93` en
`apple-touch-icon.png?v=93`, terwijl het echte bestand `index.html` (en
de bestanden zelf) al sinds eerdere iteraties op `v=97` staan — een
kleine drift die al eerder als "bestaand, niet dit getroffen" was
gemarkeerd. Nu rechtgetrokken naar `v=97` op beide regels. Geen
zichtbaar effect (de onderliggende bestanden waren zelf niet gewijzigd),
puur consistentie. Geverifieerd met Playwright dat `test-local.html`
nog foutloos laadt op Chromium; de WebKit-console toont een
`Origin null`-CORS-melding bij het openen via `file://`, maar die bleek
al aanwezig vóór deze wijziging (bevestigd door de fix tijdelijk te
stashen en de test opnieuw te draaien) — dus geen regressie, puur een
bestaande beperking van lokaal file://-testen zonder server.

**Drie extra alternatieve-locatie-links gecontroleerd** (vervolg op
iteratie 57's Kafé België-check): "Café DeRat" (Lange Smeestraat 37),
"Ubica" (Ganzenmarkt 24) en "Orloff aan de kade" (Oosterkade 18) — alle
drie bestaan echt, met exact kloppende naam en adres. Noemenswaardig:
"Café DeRat" is inderdaad zonder spatie de officiële bedrijfsnaam
(bevestigd via het eigen domein cafederat.nl) — geen typo in de
app-data, zoals op het eerste gezicht leek. Resterende ~14
alternatieve-locatielinks nog niet stuk voor stuk nagelopen; nog steeds
laag risico.

## Ontwerpbesluiten (vervolg 59) — echte data-fout gevonden en gefixt

**Zes verdere alternatieve-locatielinks gecontroleerd** (Polleke,
Tapperij/Bierlokaal de Luifel, Grillroom Huzur, Cafetaria Ten Beste,
Eetcafé De Vingerhoed, Café Vredenburg): vijf klopten, maar één bleek
verouderd.

**Bug: "Tapperij de Luifel" bestaat niet meer onder die naam.** De
zoeklink zelf werkte nog (Google's fuzzy search vond op basis van adres
alsnog de juiste locatie), maar de huidige, echte bedrijfsnaam is
"Bierlokaal de Luifel" — bevestigd via zowel de Google Business-vermelding
als de eigen website (luifelutrecht.nl, zelf kortweg "De Luifel"
genoemd). Iemand die op de kaart bij Neude 35 aankomt en "Tapperij de
Luifel" verwacht, ziet dus een andere naam op de gevel/website dan de app
toont. (Ter vergelijking: "Eetcafé De Vingerhoed" is WEL gecontroleerd en
bewust ongewijzigd gelaten — die extra kwalificatie staat wél nog in het
eigen domein `eetcafedevingerhoed.nl`, dus geen naamswijziging, alleen
een andere titel-weergave op de Maps-kaart zelf.)

**Fix:** `name` en de `info`-zoekopdracht van deze `neudeAlts`-vermelding
in `app.js` aangepast van "Tapperij de Luifel" naar "Bierlokaal de
Luifel". Geverifieerd op Chromium + WebKit: de nieuwe naam staat in de
DOM, de oude naam komt nergens meer voor, en het daadwerkelijk selecteren
van dit alternatief (via de "andere opties"-lijst bij de Neude-stop)
toont correct "Bierlokaal de Luifel" als actieve locatienaam. `app.js`
gewijzigd → cache-buster verhoogd naar `v=120` in
`index.html`/`sw.js`/`test-local.html`, `SHELL_CACHE` naar
`utca-shell-v74`.

## Ontwerpbesluiten (vervolg 60) — PageSpeed/Core Web Vitals-audit, echte CLS-bug gevonden

**Op verzoek van de gebruiker**: de live site (alleen bekijken, niet
ingelogd) doorgelicht met echte PageSpeed Insights
(pagespeed.web.dev) tegen `https://utca26.pages.dev`. Uitslag mobiel:
Performance 75, Accessibility 100, Best Practices 100. FCP/LCP/TBT waren
al uitstekend (0,8s / 0,8s / 0ms) — de score werd bijna volledig
kapotgetrokken door **Cumulative Layout Shift: 1,364** (alles boven 0,25
geldt al als "slecht"). PageSpeed wees de schuld vrijwel volledig aan
`<div class="login">` (twee shifts van 0,684 en 0,654 — samen 1,338 van de
1,364).

**Root cause gevonden.** `index.html` laadt `app.css` bewust non-blocking
(via een `<link rel="preload">`-met-`onload`-truc, zodat de eerste paint
niet wacht op het externe stylesheet) en compenseert dat met een stuk
kritieke CSS inline in `<head>`, zodat het inlogscherm er identiek
uitziet vóór en na het laden van `app.css`. Die inline kopie miste echter
één regel: `.name-hint` (het lege hint-tekstblokje direct onder het
naam-veld) had in `app.css` een gereserveerde `min-height:16px;
margin-top:6px`, maar stond niet in de inline kritieke CSS. Vóór
`app.css` laadt, nam dat blokje dus 0px in beslag; zodra `app.css`
binnenkomt, springt het er plotseling bij — en omdat de login-kaart met
`align-items:flex-end` onderaan het scherm vastzit, verschuift de hele
kaart (en dus vrijwel het hele eerste scherm) mee. Op een snelle lokale
verbinding is dit onzichtbaar (milliseconden), maar onder PageSpeed's
Slow 4G-simulatie (en op een trage 4G-verbinding in het echt) is het
venster tussen "alleen inline CSS" en "app.css toegepast" groot genoeg om
als merkbare sprong gemeten te worden.

**Fix:** de ontbrekende `.name-hint`-regel toegevoegd aan de inline
kritieke CSS in zowel `index.html` als `test-local.html`, exact gelijk
aan de regel in `app.css`. Geverifieerd met een deterministische
Playwright-test (rendering met `app.css` geblokkeerd vs. normaal geladen,
`.login`'s `getBoundingClientRect()` vergeleken): vóór de fix een sprong
van 23,19px in hoogte/positie, ná de fix nog maar 1,19px (afrondings-
ruis, geen echte layout-fout meer) — op zowel Chromium als WebKit.
Volledige `capture.js`-regressievlucht foutloos op beide engines. Alleen
`index.html` (en `test-local.html`) gewijzigd, geen `app.css`/`app.js`-
inhoud aangepast → alléén `SHELL_CACHE` verhoogd naar `utca-shell-v75`
(zelfde aanpak als iteratie 45, om de offline-gecachete `index.html` te
verversen), `app.css`/`app.js`-versienummers ongewijzigd.

**Overige PageSpeed-bevindingen, bewust niet aangepast:**
- SEO-score 50 door "Page is blocked from indexing", "Links are not
  crawlable" en een ontbrekende meta-description — dit is precies de
  bedoeling: de app heeft overal `noindex,nofollow,noarchive` staan
  omdat het een privé-hulpmiddel voor deze ene vriendengroep is, geen
  publieke website. Dit "fixen" zou tegen een bewuste privacykeuze
  ingaan.
- Diagnostiek "Avoid non-composited animations — 97 animated elements
  found" beïnvloedt de score zelf niet (Lighthouse noemt dit expliciet
  informatief). Kandidaat om ooit naar te kijken, maar geen prioriteit
  nu de belangrijkste CLS-oorzaak is opgelost.
- De "Agentic Browsing"-categorie (1/3, experimenteel/nieuw in
  Lighthouse, gaat over `llms.txt` en AI-crawlers) is niet relevant voor
  een besloten vriendengroep-app; bewust genegeerd.

## Ontwerpbesluiten (vervolg 61) — directe gebruikersfeedback, rank-cirkels

**Gebruiker (met eigen iPhone-screenshot, rode markering om de
DEGRADATIESTRIJD-ranglijst):** *"Dit is niet mooi het rondje met de
cijfer erin voor de naam ziet eruit alsof het niet in balans is. Voor
het menselijk oog is het uit balans en niet rechtlijnig genoeg."*

**Onderzoek:** de rangnummer-cirkels (`.final-rank`, de "1"/"2"/"3" naast
elke naam) bleken inderdaad meetbaar uit het lood te staan — niet qua
vorm (34×34px, dus een perfecte cirkel), maar qua **positie van het
cijfer erin**. Met een Playwright-meting (`Range.getBoundingClientRect()`
op de tekstinhoud t.o.v. de cirkel) bleek het cijfer op Chromium 7,33px
ruimte boven en 8,67px ruimte onder over te laten — het cijfer stond dus
zichtbaar iets hoger dan het midden, exact het soort detail dat het
menselijke oog wel opvalt zonder dat je meteen kunt benoemen waarom.
Oorzaak: de cirkel erft de globale `line-height:1.29`, en font-ascent/
descent van cijfers is nooit symmetrisch rond de basislijn — bij
`display:grid;place-items:center` wordt daardoor de hele *regelbox*
gecentreerd, niet het zichtbare cijfer zelf. Bijkomend probleem: zonder
`font-variant-numeric:tabular-nums` is het cijfer "1" een stuk smaller
dan "2"/"3", waardoor de drie cirkels ook onderling niet gelijk aanvoelen.

**Fix:** `.final-rank` kreeg `line-height:1` (regelbox laten samenvallen
met de fontgrootte in plaats van de globale 1,29) en
`font-variant-numeric:tabular-nums` (alle cijfers even breed). Resultaat
gemeten: op **WebKit (het toestel van de gebruiker) nu perfect
gecentreerd** (8,17px boven én onder, exact gelijk); op Chromium nog een
verwaarloosbare rest-asymmetrie van 1px (7,5 vs 8,5, <3% van de
cirkeldiameter) — een resterend lettertype-metriek-verschil tussen de
twee renderers dat geen verdere handmatige pixel-correctie waard is (dat
zou het al perfecte WebKit-resultaat juist weer verstoren). Horizontaal
zijn alle drie cijfers nu exact even breed en gelijk gecentreerd op
beide engines. Geverifieerd met een visuele voor/na-vergelijking op hoge
zoom en de volledige `capture.js`-regressievlucht, foutloos op Chromium +
WebKit. Alleen `app.css` inhoudelijk gewijzigd → cache-buster verhoogd
naar `app.css?v=121` (app.js blijft op `v=120`, dat bestand is niet
aangeraakt), `SHELL_CACHE` naar `utca-shell-v76`.

## Ontwerpbesluiten (vervolg 62) — lime-accent getemperd via Adobe Color

**Gebruiker:** *"Okay ik vind de kleuren op zich wel goed, maar het lime
green bij de knoppen en de tijdslijn wellicht iets te fel. Zou je de app
ook even door deze site halen, om de kleuren goed te krijgen:
https://color.adobe.com/create/color-wheel"*

**Analyse:** de basis-lime (`--lime:#bdf53a`) bleek in HSV H=78°
(geel-groen) S=76% **V=96%** — de zeer hoge Value (helderheid) in
combinatie met een geel-groene tint (het hue-bereik waar het menselijk
oog het meest gevoelig voor is) verklaart waarom het als "fel"/neon
aanvoelt, ook al is de saturatie zelf niet extreem.

**Adobe Color Wheel gebruikt** (color.adobe.com/create/color-wheel, geen
account nodig, alleen bekeken/gebruikt als kleurgereedschap): de exacte
huidige hex `#BDF53A` ingevoerd op het kleurenwiel, en vervolgens de
Value in de saturatie/helderheid-kiezer bewust iets teruggedraaid (van
96% naar 87%, S licht mee omlaag van 76% naar 74%) — resultaat
`#ADDE3A`. Dezelfde tint (H≈78°) dus zelfde merkidentiteit, alleen
minder "neon"/schreeuwerig.

**Consistente toepassing:** niet alleen `--lime` zelf, maar ook de drie
afgeleide tinten (`--limeText`, `--limeTextHover`, en de twee
kleurstops van de `--prim`-knopgradient) opnieuw berekend door voor elk
exact dezelfde HSV-verhouding t.o.v. de oude basis-lime toe te passen op
de nieuwe basis-lime — zodat de onderlinge verhoudingen (hover iets
lichter, tekstvariant iets gedempter) intact blijven. Ook alle 14
losse plekken in `app.css` die de oude lime-RGB rechtstreeks
hardcodeerden (randen, gloeieffecten, achtergrondtints) systematisch
vervangen. Contrast tegen de knoptekst (`--primInk`) en de
achtergrondkleur blijft ruim boven WCAG AAA (12,6:1 / 11,7:1, was 15,4:1
/ 14,3:1) — meer dan genoeg leesbaarheid overgehouden ondanks de
verlaagde helderheid. De blauwe "regenmodus"-kleuren (`body.rain-mode`)
bewust niet aangeraakt, dat is een apart, functioneel kleurenschema.

**Kritieke check:** de inline kritieke CSS in `index.html`/
`test-local.html` (dezelfde login-knop-gradient als in `app.css`, voor
de non-blocking-CSS-truc uit iteratie 60) hier ook meteen consistent
bijgewerkt — anders was precies dezelfde CLS-val als iteratie 60
opnieuw ontstaan, nu voor kleur i.p.v. layout. Geverifieerd met dezelfde
"app.css geblokkeerd vs. geladen"-vergelijkingstest: de knop-kleur is nu
byte-voor-byte identiek vóór en na het laden van `app.css`.

**Getest:** visuele screenshots van login-knop, tijdlijn-knoppen
("NAVIGEER", "Hier"-tab, "3 andere opties") en de DEGRADATIESTRIJD-
ranglijst (de rank-1-cirkel uit iteratie 61) op zowel Chromium als
WebKit — merkbaar rustiger, nog steeds duidelijk lime en goed leesbaar.
Volledige `capture.js`-regressievlucht foutloos op beide engines,
inclusief regenmodus (ongewijzigd blauw, ter controle). `app.css` en de
inline kritieke CSS in `index.html`/`test-local.html` gewijzigd →
cache-buster verhoogd naar `app.css?v=122`, `SHELL_CACHE` naar
`utca-shell-v77` (`app.js` ongewijzigd op `v=120`).

## Ontwerpbesluiten (vervolg 63) — rangnummer-cirkel top-uitgelijnd met naam/percentage

**Gebruiker:** *"Denk dat het mooier is dat het bolletje waar de cijfer
instaat, de bovenkant van de naam raakt en de bovenkant van het
percentage raakt. Maar ik ben niet de allerbeste (UX) designer. Dus als
je betere ideeën hebt voor maar uit."*

**Analyse:** `.final-stat` gebruikte `align-items:center`, wat de
rank-cirkel verticaal centreert tegen de VOLLEDIGE hoogte van de rij
(naam+percentage, onderschrift, voortgangsbalk samen) — daardoor hing de
cirkel zichtbaar lager dan de naam/het percentage. Gemeten met
Playwright: de cirkel stond 9,5px lager dan de bovenkant van de naam en
8,5px lager dan de bovenkant van het percentage. Het idee van de
gebruiker (boven laten samenvallen) is hier ook design-technisch de
juiste keuze: een rangnummer hoort optisch bij de naam die het rangschikt,
niet bij het geheel van naam+onderschrift+balk.

**Bijvangst:** een eerste poging met alleen `align-items:flex-start`
schoot juist 5-6px door (cirkel te hoog t.o.v. de naam). Oorzaak: een
vergeten `margin-top:5px` op `.final-stat-main`, over uit een eerdere
ontwerpversie met een `.final-stat-label`-kicker-tekst erboven die niet
meer in de huidige HTML voorkomt (`.final-stat-label` wordt nergens meer
gebruikt in `index.html`/`app.js`) — een echte, kleine orphaned-CSS-bug.

**Fix:** `.final-stat` naar `align-items:flex-start`, en de overbodige
`margin-top:5px` op `.final-stat-main` verwijderd. Resultaat gemeten:
de bovenkant van de cirkel valt nu exact samen met de bovenkant van de
naam (0px verschil) en nagenoeg exact met de bovenkant van het
percentage (1px, door het kleine fontgrootteverschil tussen naam-21px en
percentage-18px — geen reëel probleem). Visueel gecontroleerd op zowel
een korte naam (Stef) als een lange, tweeregelige naam
("Maximiliaan-Alexander") op Chromium + WebKit: blijft in beide gevallen
goed leesbaar en netjes uitgelijnd, ook de nog-niet-gescoorde
plek-2/3-rijen. Volledige `capture.js`-regressievlucht foutloos. Alleen
`app.css` inhoudelijk gewijzigd → cache-buster verhoogd naar
`app.css?v=123`, `SHELL_CACHE` naar `utca-shell-v78` (`app.js`
ongewijzigd op `v=120`).

## Ontwerpbesluiten (vervolg 64) — rank-cirkel vergroot tot naam+onderschrift-hoogte

**Gebruiker (vervolg op iteratie 63, mid-turn):** *"Even over de
screenshot ik wil dat het bolletje met de cijfer groter wordt. Bovenkant
van de tekst van de ingelogde naam, onderkant van de bol naar de
onderkant van de tekst -> 'naar de klote'. Zo is het nog meer in
balans. Maar nogmaals ik ben nu de hele tijd aan het bijsturen. Dit kan
je toch ook wel zelf verzinnen dat het er mooier uitziet."*

De laatste zin is terechte, bruikbare feedback: de gebruiker moet dit nu
een paar keer preciezer specificeren dan nodig zou moeten zijn.
Meegenomen voor volgende ontwerp-iteraties: bij een concrete "dit klopt
optisch niet"-melding eerst zelf een stap verder redeneren over de
onderliggende oorzaak/verhouding, niet alleen de letterlijke coördinaten
fixen.

**Overwogen aanpak:** een CSS Grid-herstructurering waarbij de cirkel
via `align-self:stretch` + `aspect-ratio:1` precies de hoogte van
naam+onderschrift van élke rij afzonderlijk zou volgen, bewust NIET
gekozen — dat zou de cirkel bij rijen zónder score (plek 2/3, geen
onderschrift) een ander formaat geven dan bij plek 1, wat de ranglijst
juist onrustiger/inconsistenter zou maken. In plaats daarvan: één vaste,
grotere maat voor alle drie de cirkels (uniform, zoals een ranglijst
hoort te zijn), afgemeten op het gangbare geval (naam op één regel +
onderschrift).

**Fix:** `.final-rank` van 34×34px naar 44×44px, lettergrootte van het
cijfer van 15px naar 18px (proportioneel meegeschaald). Omdat de cirkel
al boven aan de rij was uitgelijnd (iteratie 63), hoefde alleen de
hoogte te groeien om ook de onderkant te laten samenvallen. Gemeten: de
bovenkant van de cirkel valt nog steeds exact samen met de bovenkant van
de naam (0px), en de onderkant valt nu op ~1px van de onderkant van
"naar de klote" — op zowel Chromium als WebKit. De optische
cijfer-centrering uit iteratie 61 (line-height:1 + tabular-nums) blijft
correct werken op de nieuwe grootte (WebKit zelfs weer pixel-perfect
symmetrisch). Bij een lange, tweeregelige naam blijft het resultaat prima
leesbaar (de cirkel haalt dan de onderkant van het onderschrift niet
meer, maar er ontstaat geen overlap of layoutbreuk — een acceptabele,
bewuste afwijking t.o.v. het edge-case-alternatief van per-rij dynamische
hoogtes). Volledige `capture.js`-regressievlucht foutloos op Chromium +
WebKit. Alleen `app.css` gewijzigd → cache-buster verhoogd naar
`app.css?v=124`, `SHELL_CACHE` naar `utca-shell-v79` (`app.js`
ongewijzigd op `v=120`).

## Ontwerpbesluiten (vervolg 65) — tijdlijn-rail-nodes: geen zoom meer bij foto-laden

**Gebruiker:** *"Bij de tijdslijn de bolletjes. Als je check in doet,
dan zoom je in. Niet meer doen. Behoudt dezelfde image van het bolletje
maar geef er een beetje shadow of gradient over. Wat het beste werkt met
de rest van de app. Check voor consistentie. En ook voor binnen het
bolletje geef behulp van een icoontje aan dat je daar bent net zo
minimaal als de rest van icoontjes nadat je al verder bent met de check
ins."*

**Root cause gevonden:** zodra de locatiefoto voor een stop klaar is met
laden (`syncRailPhoto()`), kreeg het bijbehorende rail-bolletje de klasse
`has-photo`, en die klasse verhoogde de afmeting fors t.o.v. de normale
status-grootte: todo 17px→26px, done 19px→28px, current 21px→30px — een
sprong van 9px (40-50%) met een CSS-transitie erop, precies zichtbaar als
een "inzoomende" cirkel. Omdat de foto voor de huidige stop meestal
ongeveer rond het moment van inchecken klaar is met laden, viel dit
moment in de praktijk vaak samen met het inchecken zelf — vandaar de
waarneming "als je check in doet, dan zoom je in".

**Bijvangst:** bij de "current"-status werd bovendien de kleine lime
stip (`::after`, het "je bent hier"-signaal) volledig verborgen zodra er
een foto bijkwam (`content:none`) — zonder vervanging. Zodra de foto voor
je huidige stop laadt, verdween dus het enige signaal dat je daar
ingecheckt stond, wat precies aansluit bij het tweede deel van de
gebruikersvraag (een icoontje dat aangeeft dat je er bent, ook met foto).

**Fix:**
1. Alle `has-photo`-afmetingsverhogingen verwijderd (`width`/`height`
   voor de basis-, done- en current-varianten) — de cirkel houdt nu
   altijd zijn normale statusgrootte (17/19/21px), foto of niet foto.
2. Een donkere gradient-scrim toegevoegd over de foto zelf, in
   `syncRailPhoto()` (`app.js`): `linear-gradient(180deg,rgba(5,6,7,.32),
   rgba(5,6,7,.62))` vóór de foto-URL in dezelfde `background-image`.
   Bewust dezelfde kleurwaarde (`rgba(5,6,7,…)`) als de bestaande
   `.media-scrim` op de grote kaartfoto's, voor visuele consistentie met
   de rest van de app — geen losse, nieuwe kleur verzonnen.
3. De `content:none`-onderdrukking van de lime "je bent hier"-stip bij
   current+foto verwijderd, en dezelfde `drop-shadow`-legibiliteitsfix
   die het vinkje/icoontje al had uitgebreid naar deze stip
   (`.tl-node.has-photo svg,.tl-node.has-photo::after{filter:...}`) — nu
   blijft er in élke status een minimaal icoontje/stip zichtbaar boven op
   de foto, consistent met hoe het vinkje dat al deed.

**Getest:** omdat de echte Google Places-foto's een backend nodig hebben
(niet beschikbaar in lokale tests), is `has-photo` + een placeholder-
achtergrond programmatisch gesimuleerd via Playwright. Gemeten: de
afmeting van elk bolletje is exact hetzelfde vóór en na het toevoegen van
`has-photo` (17/19/21px, geen sprong meer) op zowel Chromium als WebKit.
Visueel gecontroleerd: het vinkje (done) en de "je bent hier"-stip
(current) blijven beide duidelijk zichtbaar boven op de foto dankzij de
schaduw, en de gradient geeft een rustige, met de rest van de app
consistente donkere waas over de foto. Volledige
`capture.js`-regressievlucht foutloos op Chromium + WebKit, inclusief
regenmodus (ongewijzigd). `app.css` én `app.js` gewijzigd →
cache-buster verhoogd naar `app.css?v=125`, `app.js?v=121`,
`SHELL_CACHE` naar `utca-shell-v80`.

## Ontwerpbesluiten (vervolg 66) — weersomslag-desync: check-in werd niet gedeeld bij wisselen zon/regen

**Frisse code-doorloop** van een nog niet eerder bekeken hoek:
`applyWeatherTheme()`/`renderWeatherSwitcher()` en de click-handler van de
zon/regen-schakelaar in `bindOnboarding`/`bindDynamicUi`.

**Bug gevonden:** de schakelaar migreert `currentStop` correct wanneer je
op het weer-afhankelijke onderdeel bent ingecheckt (bv. je stond
ingecheckt bij "Kanoverhuur Utrecht" onder zon, en schakelt naar regen —
`currentStop` wordt lokaal keurig `weather-rain`, en dat wordt ook naar
`localStorage` weggeschreven). Maar in tegenstelling tot **elke andere**
plek die `currentStop` wijzigt (`setHere()`, login, initiale laadbeurt),
ontbrak hier de `syncState()`-aanroep die dit naar de gedeelde
`/api/state`-database pusht. Het exacte patroon dat deze sessie al vaker
heeft blootgelegd (iteraties 30/33/41/43/44/48/65): een losse
update-plek die de rest van de logica niet volledig spiegelt. Concreet
gevolg: als iemand van weer wisselt terwijl hij op de weerstop staat
ingecheckt, blijven zijn vrienden (via `/api/state`, en de 15-seconden-
polling-`refreshState()`, die alleen leest en nooit schrijft) zijn OUDE
locatie zien totdat hij toevallig een andere actie doet die wél
synchroniseert.

**Fix:** één regel toegevoegd — `syncState(true)` direct na de
`currentStop`-migratie, alleen in de tak waar dat ook daadwerkelijk
gebeurt (dus geen overbodige netwerkaanroep als je niet op de weerstop
stond). Geverifieerd met een Playwright-test die de daadwerkelijke
`POST /api/state`-aanvraag onderschept: na check-in bij Kanoverhuur en
wisselen naar regen verschijnt correct een POST met
`"currentStop":"weather-rain"`, op zowel Chromium als WebKit; zonder
check-in bij de weerstop blijft de POST terecht uit (geen onnodige
sync). Volledige `capture.js`-regressievlucht foutloos op beide engines.
Alleen `app.js` inhoudelijk gewijzigd → cache-buster verhoogd naar
`app.js?v=122`, `SHELL_CACHE` naar `utca-shell-v81` (`app.css`
ongewijzigd op `v=125`).

## Ontwerpbesluiten (vervolg 67) — opvolging iteratie 66, plus een landmine in de onboarding-navigatie

**Opvolging van iteratie 66's eigen prioriteit (6):** alle plekken die
`currentStop`/`ratings` wijzigen nagelopen op ontbrekende `syncState()`-
aanroepen. Vijf mutatieplekken gevonden; alle vijf bleken correct (de
initiële laadbeurt en de logout-flow horen bewust NIET te synchroniseren
— syncen bij logout zou je eigen check-in/rating-geschiedenis bij
iedereen wissen, puur omdat je zelf uitlogt). Geen nieuwe bug hier, maar
wel een nuttige bevestiging dat iteratie 66's fix compleet was.

**Frisse code-doorloop van de onboarding-flow** (nog niet eerder
bekeken): een echte landmine gevonden, nog niet actief gebroken maar wel
een zichzelf-herhalend patroon uit deze sessie (parallelle logica die
niet gesynchroniseerd blijft — zie iteraties 30/33/41/43/44/48/65/66).
De "Volgende"-knop (`next.onclick`) berekent het aantal slides dynamisch
uit de DOM (`$$('[data-onboarding-slide]').length`), maar de
swipe-gebaar-handler en de `ArrowRight`-toetsenbordnavigatie hadden de
laatste-slide-grens hardgecodeerd op `onboardingStep<4`. Toevallig klopt
dat nu precies (5 slides, index 0-4), dus zichtbaar geen bug vandaag —
maar zodra een toekomstige iteratie een slide toevoegt of verwijdert
zonder deze twee losse `4`'s te vinden, zou swipen/pijltjestoetsen
vastlopen vóór de laatste slide terwijl de knop wél tot de echte laatste
slide komt.

**Fix:** beide hardgecodeerde `4`'s vervangen door dezelfde dynamische
berekening die de knop al gebruikt
(`$$('[data-onboarding-slide]').length-1`) — nu delen alle drie de
navigatiewegen (knop, swipe, toetsenbord) precies dezelfde bron van
waarheid. Geverifieerd met Playwright op Chromium + WebKit: 7×
`ArrowRight` op 5 slides eindigt correct op index 4 (niet verder), 7×
`ArrowLeft` sluit de onboarding correct af via `onboardingBackToName()`;
7× swipe-links eindigt eveneens correct op index 4. Gedrag is identiek
aan vóór de fix — dit is een preventieve fix, geen zichtbare
gedragsverandering. Volledige `capture.js`-regressievlucht foutloos op
beide engines. Alleen `app.js` gewijzigd → cache-buster verhoogd naar
`app.js?v=123`, `SHELL_CACHE` naar `utca-shell-v82`.

## Ontwerpbesluiten (vervolg 68) — resterende locatielinks afgerond + grote test-local.html-drift gevonden

**Alternatieve-locatielinks afgerond**: de laatste drie nog niet
gecontroleerde alternatieven (Café Le Journal, Café de Zaak, Graaf
Floris) geverifieerd tegen de echte Google Maps-data — alle drie
correct. Hiermee zijn nu alle ~13 alternatieve locaties uit het
programma stuk voor stuk gecontroleerd sinds iteratie 57 (één echte
naamsfout gevonden en gefixt, in iteratie 59); dit punt kan van de
prioriteitenlijst af.

**Grote drift in `test-local.html` gevonden.** Bij het routinematig
controleren van de al langer als "dood" bekende `.final-stat-label`-
CSS-regel (kandidaat-opruiming uit iteratie 63) bleek deze WEL nog
gebruikt te worden — alleen in `test-local.html`, niet in `index.html`.
Verdere vergelijking van de twee bestanden (die byte-voor-byte gelijk
zouden moeten zijn op de absolute/relatieve pad-prefixes na) legde een
flinke opeenstapeling van niet-gesynchroniseerde inhoud bloot,
kennelijk van vóór deze sessie of van vroeg in deze sessie, nooit
opgemerkt omdat het geen `app.css`/`app.js`-wijzigingen betrof:
- `--r-pill` stond op `999px` (volledig pil-vormig) i.p.v. de echte
  `16px` — alle pil-knoppen zouden in `test-local.html` zichtbaar
  anders (extremer rond) ogen dan in het echte `index.html`.
- De `#groep`-sectiekop was een oudere versie ("Waar is iedereen?" +
  losse ondertitel) i.p.v. de huidige "Laatste check-ins &
  tussenstand".
- **`#nameHint` ontbrak volledig uit de HTML** — exact het element
  waarvan de ontbrekende CSS in iteratie 60 de grote CLS-regressie
  veroorzaakte. Met het element zelf afwezig kon die hele fix nooit
  zichtbaar getest worden via `test-local.html`.
- De ranglijst-sectie (`#finalResult`) miste de drie
  `.final-stat-caption`-elementen uit iteratie 56 volledig, en had in
  plaats daarvan nog de oude, allang losgelaten `.final-stat-label`/
  `.final-stat-sub`-grapjestekst ("THE ABSOLUTE BOLLOCKS", "DE
  KLOOTZAK", "THE LIONEL RICHIE", "EASY LIKE A SONNTAG MORGEN" etc.) —
  de hele "naar de klote"-onderschriftfunctie uit iteratie 56 was dus
  onzichtbaar bij lokaal testen via dit bestand.
- Twee stukjes onboarding-copy (de derde slide) waren een oudere
  formulering die niet meer overeenkwam met `index.html`.

**Fix:** alle bovenstaande punten één-op-één overgenomen uit
`index.html`. Geverifieerd met `diff` (paden genormaliseerd) dat de
twee bestanden nu weer volledig identiek zijn. Met Playwright via
`file://` bevestigd dat `test-local.html` foutloos laadt op Chromium +
WebKit, dat `#nameHint` nu bestaat, en dat de "naar de klote"-caption nu
wél verschijnt. (WebKit toont wat CORS-waarschuwingen voor
`/api/place-photo`-aanvragen bij het openen via `file://` — een
al eerder gedocumenteerde, onvermijdelijke beperking van lokaal
`file://`-testen zonder server, geen regressie.) Geen `app.css`/
`app.js`-wijziging, dus geen cache-buster nodig (`test-local.html`
zit niet in `sw.js`'s precache-lijst).

**Les voor vervolgiteraties**: de conventie "werk `test-local.html`
synchroon bij met elke `index.html`-wijziging" is dit sessie voor de
EIGEN wijzigingen steeds gevolgd, maar deze drift bewijst dat er
kennelijk oudere content is blijven hangen die nooit is meegenomen. Bij
twijfel voortaan een snelle `diff` tussen de twee bestanden trekken
(paden even normaliseren) in plaats van aan te nemen dat ze synchroon
lopen.

## Ontwerpbesluiten (vervolg 69) — verouderde check-ins bleven als "aanwezig" op de stopkaart hangen

**Frisse code-doorloop** van de deelnemers-/aanwezigheidslogica
(`venueOptions`/`selectVenue`/`renderRoute`/`peopleAtStopHtml` — nog niet
eerder in deze sessie bekeken). Geen bug in de eerste drie (de
dubbele-locatie-check in `selectVenue()` en de proactieve versie in
`ensureNoConsecutiveDuplicate()` zijn correct van elkaar gescheiden voor
hun eigen triggers; `renderRoute()`'s Google Maps-routebouw gebruikt
consequent `activeVenue()` en dus ook de door de gebruiker gekozen
alternatieven).

**Bug gevonden in `peopleAtStopHtml()`.** De "Laatste check-ins &
tussenstand"-lijst (`renderGroup()`) markeert een check-in ouder dan 30
minuten al langer correct als "verouderd" (via `checkinIsStale()`,
zichtbaar in de screenshot die de gebruiker eerder deelde: "1 d
geleden · verouderd"). Maar de kleine naam-chips die onder een
STOP-KAART verschijnen ("wie is hier") gebruikten diezelfde
`checkinIsStale()`-functie helemaal niet — die bestond en werd elders al
gebruikt, maar was hier vergeten toe te passen. Gevolg: als iemand na
zijn eerste check-in nooit meer expliciet incheckt (bv. telefoon leeg,
simpelweg vergeten), bleef zijn naam-chip voor de rest van de dag
permanent op die EERSTE stopkaart staan, terwijl de check-ins-lijst
elders al netjes "verouderd" toonde. Precies het soort verwarring dat
deze app juist moet voorkomen — vrienden die denken dat iemand nog ergens
is terwijl de data allang niet meer klopt.

**Fix:** `peopleAtStopHtml()`'s filter uitgebreid met
`&&!checkinIsStale(p)` voor andere deelnemers (je eigen chip blijft
ongemoeid, die komt uit je eigen live lokale status, nooit uit
mogelijk-verouderde serverdata). Geverifieerd met een Playwright-test
die de `/api/state`-respons mockt met een verse (1 min oud) en een
verouderde (40 min oud) nepdeelnemer op dezelfde stop: de verse chip
verschijnt correct onder de stopkaart, de verouderde niet — op zowel
Chromium als WebKit — terwijl de "Laatste check-ins"-lijst beide nog
gewoon toont (met "verouderd" bij de oude). Volledige
`capture.js`-regressievlucht foutloos. Alleen `app.js` gewijzigd →
cache-buster verhoogd naar `app.js?v=124`, `SHELL_CACHE` naar
`utca-shell-v83`.

## Ontwerpbesluiten (vervolg 70) — tijdlijn-rail-nodes: één maat, symmetrische afstand tot de lijn

**Gebruiker:** *"De tijdslijn met bolletjes ziet er nog steeds niet mooi
en consistent uit. [...] de bolletjes hebben ook verschillende groottes
nu, de lijnen vanaf de bolletje hebben verschillende afstanden. Dat wil
niet zeggen dat ik wil dat de lijnen de bolletjes raken daar kan wel een
heel klein beetje afstand tussen zitten."*

**Eerst gemeten, niet aangenomen** (zelfde methode als eerdere
optische-uitlijnfixes): met Playwright de daadwerkelijke gerenderde
maten en de computed `top`/`height` van de `.tl-rail::before`/`::after`-
lijnsegmenten opgevraagd voor alle drie statussen. Bevestigde exact wat
de gebruiker zag:
- De bolletjes waren inderdaad drie verschillende maten: todo 17px,
  done 19px, current 21px.
- De lijnsegmenten zelf hadden een VASTE positie (`top:-5px;height:32px`
  boven, `top:57px` onder) die niet meebewoog met de bolletje-maat — dus
  hoe groter het bolletje, hoe kleiner de resterende afstand: de ruimte
  boven een bolletje varieerde van 3px (current) tot 5px (todo), de
  ruimte onder van 7px (done/current) tot 8px (todo) — en de ruimte
  boven was sowieso al structureel kleiner dan de ruimte onder,
  ongeacht de bolletje-maat (scheve, niet-symmetrische afstand rond elk
  bolletje).

**Fix:** alle drie statussen (todo/done/current, incl. de
foto-achtergrond-variant uit iteratie 65 en de blauwe regenmodus-
kleuren) naar één vaste maat van 20px — status blijft duidelijk
onderscheiden via kleur/vulling/icoon (grijs+icoon voor todo,
lime-ring+stip voor current, lime-vlak+vinkje voor done), niet meer via
grootte. Vervolgens de lijnsegmenten herberekend voor exact 6px
symmetrische afstand aan beide kanten van dat ene, vaste formaat
(`::before` 3px korter, `::after` 1px later beginnend). Dit sluit ook
aan bij de eerder vastgelegde "Polarsteps-richting" (project-notitie):
Polarsteps' eigen tijdlijn gebruikt ook doorgaans één vaste
marker-grootte, status alleen via kleur/icoon.

**Geverifieerd**: na de fix meten alle drie statussen exact 20px en
exact 6px ruimte boven én onder, op zowel Chromium als WebKit — ook met
een gesimuleerde locatiefoto (uit iteratie 65) blijft dit gelijk.
Visueel gecontroleerd op hoge zoom: de rail oogt nu als één
doorlopende, gelijkmatige lijn met gelijk-grote stopmarkeringen, ook in
regenmodus. Volledige `capture.js`-regressievlucht foutloos op beide
engines. Alleen `app.css` gewijzigd → cache-buster verhoogd naar
`app.css?v=126`, `SHELL_CACHE` naar `utca-shell-v84` (`app.js`
ongewijzigd op `v=124`).

## Ontwerpbesluiten (vervolg 71) — todo-icoontjes op de tijdslijn te vaag om te zien

**Gebruiker:** *"Vind de tijdslijn overigens nog steeds niet mooi en
consistent en bolletjes die niet geactiveerd zijn niet goed zichtbaar
met icoontje."*

**Analyse:** iteratie 70 loste de maat-/afstandsinconsistentie op, maar
er bleef een REST-inconsistentie over die de gebruiker hier terecht
oppikt: een groot verschil in visueel gewicht tussen de statussen. Een
volledig gerenderde screenshot van de tijdlijn liet zien dat de
"todo"-cirkels (nog niet bezocht) een venue-icoontje toonden op
10×10px, met een dunne lijndikte (1.6) en een gedempte kleur
(`rgba(235,235,245,.5)`, zo'n 50% dekking) — tegenover het vetgedrukte
lime vinkje (done) en de heldere lime ring+stip (current). Bij een
DUN icoon met weinig "inkt" op zo'n klein formaat werkt dezelfde
opaciteit die voor gewone TEKST prima leesbaar is, in de praktijk veel
zwakker: er is simpelweg te weinig gekleurd oppervlak om 50% dekking
zichtbaar te maken. Bovenal: de gedempte stijl suggereert onbedoeld ook
"uitgeschakeld/niet beschikbaar", terwijl een nog-niet-bezochte stop
juist volledig interactief en aanklikbaar is — het verkeerde signaal.

**Fix:** de todo-icoontjes teruggebracht naar dezelfde grootte als de
andere statussen (11×11px, was 10×10px), lijndikte verhoogd van 1.6
naar 2, en de kleur naar `rgba(255,255,255,.88)` (bijna volle
dekking) — status wordt nu uitsluitend via KLEUR onderscheiden (lime
voor bereikt/huidig, wit/neutraal voor nog te gaan), niet meer via
opaciteit/dofheid, wat ook beter aansluit bij "nog te gaan = gewoon
klikbaar" i.p.v. "uitgeschakeld". Ook de basis-cirkel (achtergrond/rand,
gebruikt door de todo-status) iets steviger gemaakt
(achtergrond .09→.13, rand .24→.36) voor een beter gedefinieerde ring.

**Geverifieerd**: op hoge zoom (4x device-scale) is het icoon nu
scherp en duidelijk afleesbaar tegen een goed gedefinieerde ring, op
zowel Chromium als WebKit, en ook in regenmodus. Volledige
`capture.js`-regressievlucht foutloos op beide engines. Alleen
`app.css` gewijzigd → cache-buster verhoogd naar `app.css?v=127`,
`SHELL_CACHE` naar `utca-shell-v85` (`app.js` ongewijzigd op `v=124`).

## Ontwerpbesluiten (vervolg 72) — regenmodus-onboarding toonde nooit een echte locatiefoto

**Frisse code-doorloop** van de onboarding-preview-logica
(`onboardingClone()`/`buildOnboardingStills()`, nog niet eerder in deze
sessie bekeken).

**Bug gevonden:** de "Hier"-onboardingslide toont een voorbeeldkaart van
de weer-afhankelijke stop. Bij zonmodus wordt daar bewust een vaste,
mooi uitgesneden voorbeeldfoto (`onboarding-checkin.webp`) overheen
gezet — logisch, want dat asset toont specifiek Kanoverhuur. Bij
regenmodus ontbreekt die statische override (terecht: hetzelfde
zon-plaatje tonen voor de regen-stop zou fout zijn), dus die slide moet
terugvallen op het gewone, dynamische Google Places-foto-systeem voor
Café Orloff. Dat systeem wordt echter alleen geactiveerd door
`initPlacePhotos()`, en die functie werd tot nu toe uitsluitend
aangeroepen vanuit `renderTimeline()` — nooit nadat de
onboarding-preview-kloon in de DOM werd gezet. Geverifieerd met een
Playwright-test die `/api/place-photo`-netwerkverzoeken onderschept: bij
regenmodus werd er nooit een aanvraag voor Café Orloff gedaan, en de
slide toonde daardoor eeuwig alleen het generieke fallback-icoon i.p.v.
een echte foto — een merkbaar kwaliteitsverschil tussen zon- en
regenmodus die verder nergens bewust zo bedoeld was.

**Fix:** één regel — `initPlacePhotos();` toegevoegd aan het einde van
`buildOnboardingStills()`, na het opbouwen van alle vijf slide-klonen.
Omdat de zonmodus-versie en de "opties"-slide altijd een statische foto
krijgen (die functie verwijdert daarbij bewust de
`data-place-photo`-attributen), pikt deze extra aanroep uitsluitend de
regenmodus-"Hier"-kloon op die nog geen foto heeft — geen dubbele of
overbodige aanvragen voor de andere slides.

**Geverifieerd**: met dezelfde netwerk-onderschepping bevestigd dat de
Café Orloff-foto-aanvraag nu wél verschijnt bij regenmodus, op zowel
Chromium als WebKit; zonmodus blijft ongewijzigd de statische foto
tonen (geen regressie). Ook bevestigd dat de ECHTE tijdlijn-foto's (bv.
Utrecht Centraal, Kanoverhuur) na het sluiten van de onboarding nog
gewoon correct laden — de extra `initPlacePhotos()`-aanroep verstoort
de bestaande IntersectionObserver-logica niet. Volledige
`capture.js`-regressievlucht foutloos op beide engines. Alleen `app.js`
gewijzigd → cache-buster verhoogd naar `app.js?v=125`, `SHELL_CACHE`
naar `utca-shell-v86` (`app.css` ongewijzigd op `v=127`).

## Ontwerpbesluiten (vervolg 73) — echte databug: uitloggen via × liet ratings achter voor de volgende naam

**Frisse code-doorloop** van de deelnemer-verwijder-/uitlogflow
(`removeParticipant`, het two-tap-confirm-mechanisme uit iteratie 31,
`clearOwnSession`). De eerste twee bleken correct (het arm/disarm-gedrag
klopt voor alle combinaties: zelfde knop nogmaals, andere knop, klik
ernaast).

**Bug gevonden: een DERDE, apart uitlog-pad.** Naast `clearOwnSession()`
(gebruikt door de roster-verwijderflow) bleek de "×"-knop bovenin naast
je naam — de knop die de privacy-tekst zelf expliciet belooft
("× naast je naam = uitloggen en opnieuw beginnen") — zijn EIGEN,
losstaande kopie van die logica te hebben, in plaats van gewoon
`clearOwnSession()` aan te roepen. En die kopie was onvolledig: hij
verwijderde `utca-name` en `utca-results-finalized` wel, maar
`utca-stop` én `utca-ratings` (en de bijbehorende `currentStop`/
`ratings`-variabelen) helemaal niet.

**Concreet, echt scenario:** David beoordeelt een stop en checkt in,
tikt dan op "×" om uit te loggen (bv. om het toestel aan Stef te geven).
Stef typt zijn naam in en logt in. Omdat `ratings` nooit was
teruggezet, stuurt Stefs eigen inlog-sync Davids beoordeling gewoon mee
naar de GEDEELDE server-database onder Stefs naam — Stef zou dus een
score krijgen voor een stop die hij nooit zelf heeft beoordeeld.
Geverifieerd met een Playwright-test die dit scenario exact naspeelt en
de daadwerkelijke `POST /api/state`-payload afvangt: vóór de fix bevatte
Stefs inlog-POST `"ratings":{"weather-sun":4}` (Davids beoordeling), op
zowel Chromium als WebKit.

**Fix:** de "×"-knop roept nu gewoon `clearOwnSession()` aan (die alles
correct terugzet: naam, stop, ratings, resultsFinalized) in plaats van
zijn eigen onvolledige kopie — de prettige UX-toevoeging (focus terug
naar het naamveld na het wissen) is behouden. Geverifieerd: na de fix
bevat Stefs inlog-POST correct `"ratings":{}`, op beide engines. Ook
gecontroleerd dat het inlogscherm na het klikken op "×" nog steeds
correct verschijnt met het naamveld leeg en gefocust — geen
regressie in dat gedrag. Volledige `capture.js`-regressievlucht
foutloos. Alleen `app.js` gewijzigd → cache-buster verhoogd naar
`app.js?v=126`, `SHELL_CACHE` naar `utca-shell-v87` (`app.css`
ongewijzigd op `v=127`).

## Ontwerpbesluiten (vervolg 74) — dezelfde databug nogmaals gevonden, in de "naam corrigeren"-knop van de onboarding

**Direct toegepast**: de expliciete instructie om na iteratie 73 te
zoeken naar ANDERE plekken die een "volledige" functie zouden moeten
aanroepen maar in plaats daarvan hun eigen onvolledige kopie hebben.
`grep` op alle `storeRemove('utca-*')`-aanroepen liet zien dat
`storeRemove('utca-name')` op een TWEEDE plek voorkwam, buiten
`clearOwnSession()`: in `onboardingBackToName()` (de functie achter de
"Terug"-knop/pijltje-links op de allereerste onboardingslide, bedoeld
om een typefout in je zojuist ingevoerde naam te herstellen).

**Zelfde bugpatroon als iteratie 73:** deze functie zette `user`/
`utca-name` terug (zodat het inlogscherm weer verschijnt), maar liet
`utca-stop`, `utca-ratings`, `utca-results-finalized` en de
bijbehorende `currentStop`/`ratings`/`resultsFinalized`-variabelen
volledig met rust. In de praktijk is dit pad lastiger te misbruiken dan
de "×"-knop uit iteratie 73 (je zit dan al aan het BEGIN van de
onboarding, ver voordat er iets te beoordelen valt) — maar niet
onmogelijk: als er ooit verouderde `ratings` in `localStorage` blijven
hangen (bijvoorbeeld via een pad dat nog niet is gevonden), zou het
opnieuw intypen van een naam en op "Terug" tikken diezelfde stale data
alsnog laten meeliften naar de volgende inlog.

**Fix:** dezelfde aanpak als iteratie 73 — `clearOwnSession()`
aanroepen in plaats van de eigen kopie, met behoud van de twee dingen
die deze functie SPECIFIEK anders moet doen dan een gewone uitlog: de
onboarding-overlay expliciet sluiten, en de vorige naam terugzetten in
het invoerveld (zodat je 'm kunt corrigeren i.p.v. opnieuw intypen).

**Geverifieerd** met een Playwright-test die opzettelijk verouderde
`utca-ratings` in `localStorage` zet vóór het inloggen (om het
lastig-te-bereiken pad toch te kunnen testen): na het tikken op "Terug"
staat de vorige naam nog correct in het veld (UX behouden) én is
`utca-ratings` nu leeg; de daaropvolgende, gecorrigeerde inlog stuurt
correct `"ratings":{}` — op zowel Chromium als WebKit. Volledige
`capture.js`-regressievlucht foutloos op beide engines. Alleen `app.js`
gewijzigd → cache-buster verhoogd naar `app.js?v=127`, `SHELL_CACHE`
naar `utca-shell-v88` (`app.css` ongewijzigd op `v=127`, toevallig
hetzelfde nummer).

## Ontwerpbesluiten (vervolg 75) — verificatie: geen verdere "onvolledige kopie"-bugs of nieuwe issues gevonden

**Direct vervolg op de vraag uit iteratie 74**: expliciet gezocht naar
verdere plekken met hetzelfde "eigen onvolledige kopie i.p.v. de
volledige functie aanroepen"-patroon rond `syncState()`/
`renderTimeline()`. Alle vier `/api/state`-aanroepen (`syncState`,
`refreshState`, en `removeParticipant`'s twee takken) en alle
`participants=`-toewijzingen zitten uitsluitend in die drie, al
gecontroleerde functies — geen vijfde, losse plek gevonden. Ook
`resultsFinalized`/`utca-results-finalized` nagelopen: alle vijf
plekken die dit aanraken (initiële laadbeurt, het "KLAAR"-knop-moment,
`renderFinalResult`'s leesactie, en de nu beide gefixte
`clearOwnSession`/`login`) zijn compleet en consistent.

**Fris gecontroleerd, verder geen bug gevonden:**
- `renderJourneyHeader()`/`renderProgress()` — correcte
  huidige-stop-bepaling, "KLAAR"-afsluiting en voortgangsbalk, geen
  duplicatie-risico met andere renderfuncties.
- `participantResult`/`averageFromRatings`/`percentFromAverage` — de
  1-5-naar-percentage-berekening en de "X van Y onderdelen
  ingevuld"-telling gebruiken beide dezelfde, dynamisch berekende
  `meterStops()` (afgeleid van de `meter:true`-vlag op de itinerary-
  data) als enige bron van waarheid — geen apart, hardgecodeerd lijstje
  dat uit de pas kan lopen.
- `bandForScore()` (index 1-5, gebruikt voor kleurband-lookup) en
  `bandForValue()` (retourneert direct het band-object, met een eigen
  `Math.round`) bleken bij nadere inspectie twee ONAFHANKELIJKE, maar
  wiskundig volledig equivalente implementaties van dezelfde
  afrondingslogica (geverifieerd voor alle randgevallen op de
  .5-grenzen). Geen bug — beide geven altijd hetzelfde resultaat — maar
  wel pure redundantie. Bewust niet samengevoegd deze iteratie: dat is
  cosmetische opruiming zonder functionele noodzaak, geen bugfix, en
  dus buiten scope voor een kleine, veilige iteratie.
- `fmtTime()` (inclusief middernacht-edge-case: 1440 minuten → "00:00")
  en `walkDisplay()` (loop-/speling-berekening) — correct.

Geen codewijziging deze iteratie, dus geen cache-buster nodig. Dit is
een bewuste, legitieme verificatie-iteratie (zelfde patroon als
iteraties 37/39/42/50/52-55) — grondig zoeken leidt niet elke keer tot
een nieuwe bug, en dat is op zich een goed teken over de huidige
codekwaliteit na 74 eerdere iteraties.

## Ontwerpbesluiten (vervolg 76) — naam met emoji kon precies op de 24-tekengrens breken

**Bredere zoektocht** (per de instructie na iteratie 75: niet alleen het
"onvolledige kopie"-patroon, breder naar andere soorten bugs) leidde
naar de naam-validatie/-afkapping. `v.slice(0,24)` (in `app.js`'s
`login()`, en tweemaal in `_worker.js` voor zowel het opslaan als het
verwijderen van een deelnemer) knipt op **UTF-16-code-units**, niet op
hele tekens. Een emoji (of ander teken buiten het Basic Multilingual
Plane) telt als TWEE code-units — als zo'n teken precies op de
24e/25e positie valt, knipt `.slice(0,24)` het emoji middendoor. Het
resultaat is een "lone surrogate": geen geldig Unicode-teken meer, wat
in de UI als een kapot tofu-blokje oogt en bij het opslaan in de
SQLite-database (die UTF-8 verwacht) stilzwijgend vervangen wordt door
een replacement-character — een echte, zij het smalle, dataintegriteits-
kwestie. Bereikbaar via plakken van tekst of bepaalde emoji-toetsenbord-
invoermethoden, niet alleen theoretisch (bevestigd met een concrete
Playwright-reproductie: `"aaa...a" + 🎉 + "bbbbb"` met het emoji precies
op de grens gaf een losse hoge surrogate in zowel de opgeslagen naam als
de `POST /api/state`-payload, vóór de fix, op zowel Chromium als
WebKit).

**Fix:** `str.slice(0,24)` vervangen door `Array.from(str).slice(0,24).
join('')` op alle drie plekken — dit itereert per Unicode-codepoint
i.p.v. per UTF-16-eenheid, dus een emoji telt als één ondeelbaar teken
en wordt óf volledig meegenomen óf volledig weggelaten, nooit
doormidden geknipt. Voor gewone ASCII/Latijnse namen (de realistische
usecase voor deze vriendengroep) is de uitkomst byte-voor-byte
identiek aan de oude aanpak — geverifieerd met een directe vergelijking.

**Geverifieerd:** de Playwright-reproductie met het emoji op de
tekengrens geeft na de fix een intact emoji terug (24 codepoints, geen
losse surrogate meer), zowel in de lokale opslag als in de
`POST /api/state`-payload, op Chromium en WebKit. De `_worker.js`-kant
apart bevestigd met een losse Node-simulatie van exact dezelfde
expressie (kan niet lokaal als echte Cloudflare Worker draaien).
Volledige `capture.js`-regressievlucht foutloos op beide engines — geen
regressie voor normale namen. Alleen `app.js` (client) en `_worker.js`
(server, niet door deze sessie gedeployed) inhoudelijk gewijzigd →
cache-buster verhoogd naar `app.js?v=128`, `SHELL_CACHE` naar
`utca-shell-v89` (`app.css` ongewijzigd op `v=127`).

## Ontwerpbesluiten (vervolg 77) — toast-meldingen waren onzichtbaar voor screenreaders

**Frisse invalshoek** (per de instructie na iteratie 76: breder zoeken):
eerst gecontroleerd of er nog méér tekstinvoervelden met dezelfde
Unicode-aanname als de naam bestonden — er is er maar één (`#nameInput`)
in de hele app, en de overige `.slice(0,N)`-plekken werken allemaal op
systeem-gegenereerde waarden (stop-ID's, rating-sleutels,
foto-zoekopdrachten), nooit op vrije gebruikersinvoer — dus geen verdere
instantie van iteratie 76's bugklasse.

**Focus-trap van de onboarding-modal expliciet getest** (Tab en
Shift+Tab, 12x achter elkaar) uit voorzorg tegen een mogelijk lek naar
de onderliggende (verborgen maar niet `display:none`) pagina-inhoud:
bleek al volledig correct — de natuurlijke DOM-volgorde plaatst de
"←"-terugknop al tussen "Overslaan" en "Volgende", en de JS ving alleen
de twee randgevallen (laatste→eerste, eerste→laatste) af. Geen bug.

**Bug gevonden: het `#toast`-element had geen enkel ARIA-attribuut.**
`toast()` wordt door de hele app gebruikt voor belangrijke statusfeedback
("Hoi [naam]. Succes ermee.", "Check-in gedeeld", "Meter gewist",
"Verwijderen mislukt", offline-status, etc.) — maar zonder
`aria-live`/`role` hoort een screenreader-gebruiker DAAR NOOIT IETS VAN.
Ter vergelijking: `#journeyBar` en `#nameHint` hebben wél al
`aria-live="polite"` — het toast-element was de enige uitzondering.

**Fix:** `role="status" aria-live="polite" aria-atomic="true"`
toegevoegd aan het `#toast`-element in zowel `index.html` als
`test-local.html`. `role="status"` is het standaard ARIA-patroon voor
dit soort tijdelijke statusmeldingen; `aria-atomic="true"` zorgt dat de
VOLLEDIGE nieuwe boodschap wordt voorgelezen bij elke wijziging (niet
alleen het verschil), belangrijk omdat `toast()` de tekst steeds in zijn
geheel vervangt. Puur additief, geen enkele visuele wijziging — geen
regressierisico.

**Geverifieerd**: de attributen staan correct in de DOM en de
toast-tekst wordt nog steeds correct bijgewerkt bij het inloggen, op
zowel Chromium als WebKit. Volledige `capture.js`-regressievlucht
foutloos. Alleen markup gewijzigd (geen `app.css`/`app.js`-inhoud) →
alleen `SHELL_CACHE` verhoogd naar `utca-shell-v90` (zelfde aanpak als
iteraties 45/60/68 voor index.html-only-wijzigingen).

## Ontwerpbesluiten (vervolg 78) — vervolg op de accessibility-doorloop, één bewuste niet-actie

**Directe opvolging van iteratie 77's vervolgpunt 4**: gecontroleerd of
andere dynamisch-bijgewerkte statuselementen (`#dayCopy`, `#dayMeta`,
`#groupAverage`, `#rosterCount`) ook `aria-live` nodig hebben, zoals
`#toast`/`#nameHint` dat al hebben. **Bewuste conclusie: NEE, niet
toevoegen.** `#toast` en `#nameHint` worden uitsluitend bijgewerkt door
een DIRECTE actie van de gebruiker zelf (inloggen, typen, check-in) —
een goede match voor `aria-live`. `#dayCopy`/`#dayMeta`/`#groupAverage`/
`#rosterCount` worden ECHTER OOK elke 15 seconden bijgewerkt door de
achtergrond-polling (`refreshState()`) zodra een ANDERE deelnemer iets
doet — `aria-live` daarop zetten zou een screenreader-gebruiker om de
15 seconden lastigvallen met meldingen over acties van andere mensen,
een bekend anti-patroon (over-aankondigen van niet-zelf-geïnitieerde
wijzigingen). Dit is dus geen gemiste kans maar een bewust juiste
huidige staat.

**Aria-label-audit** van alle interactieve elementen (statische knoppen
in `index.html` én dynamisch gegenereerde knoppen in `app.js`: roster-
verwijderknoppen, meter-ratingknoppen 1-5, alternatieve-locatie-
selectieknoppen, Info/Boek-links): allemaal al voorzien van een
bruikbare `aria-label` of duidelijke zichtbare teksinhoud. Geen gat
gevonden.

**Focus/legibiliteit-check** met dezelfde lens als iteratie 71 (dunne
SVG-iconen op lage opaciteit): het `.venue-photo-fallback`-icoon (de
treinsilhouet-watermark in een leeg fotokader, 20% dekking) visueel
gecontroleerd op hoge zoom — in tegenstelling tot de todo-tijdlijn-
iconen uit iteratie 71 is dit hier een bewust subtiel, groot (44px+)
decoratief plaatshouder-element, geen primaire statusindicator, en het
oogt in de praktijk prima leesbaar/herkenbaar als bedoeld. Geen bug.

**Noemenswaardige, niet-functionele bevinding**: de `intox`-kolom in
`_worker.js`'s database-schema (`CREATE TABLE ... intox INTEGER NOT
NULL DEFAULT 1 CHECK(intox BETWEEN 1 AND 5) ...`) blijkt daadwerkelijk
dode schema — nergens in `_worker.js` of `app.js` gelezen of
beschreven, waarschijnlijk een overblijfsel van een vroegere
schema-opzet vóór `ratings_json` bestond. Bewust NIET verwijderd deze
iteratie: net als `bandForScore`/`bandForValue` in iteratie 75 is dit
cosmetische opruiming zonder functionele noodzaak (de kolom veroorzaakt
zelf geen enkel probleem, dankzij de `DEFAULT 1`), en dus buiten scope
voor een kleine, veilige iteratie.

Geen codewijziging deze iteratie behalve de reeds genoemde
cache-buster-non-issue — dit is een legitieme verificatie-/audit-
iteratie met één belangrijke bevestigde-juiste-staat (geen aria-live-
overkill) en één bewust ongemoeide dode-schema-notitie.

## Ontwerpbesluiten (vervolg 79) — verificatie: nog een reeks niet eerder bekeken hoeken doorgelicht, geen bug

**Frisse code-doorloop** van een aantal kleinere, nog niet eerder in
deze sessie bekeken helperfuncties en CSS-gebieden:
- `uiTransition()` — gebruikt de View Transitions API met correcte
  fallback wanneer die niet beschikbaar is of `motionAllowed()` false
  teruggeeft; `try/catch` vangt ook een eventuele runtime-fout op.
  Correct.
- `scrollAppTop()` — forceert scroll-naar-boven op een betrouwbare
  manier (tijdelijk `scroll-behavior:auto`, dubbele aanroep incl. een
  `requestAnimationFrame`-tik, herstelt daarna de oorspronkelijke
  scroll-behavior). Correct, geen race gevonden.
- `safeJson()`/`escapeHtml()` — beide robuuste, kleine utility's; geen
  probleem.
- **Externe-link-veiligheid**: alle `target="_blank"`-links (zowel
  statisch in `index.html` als dynamisch gegenereerd in `app.js`, via
  `externalAttrs()` en de "Info"/route-links) hebben consequent
  `rel="noopener"`. `externalAttrs()` laat `target="_blank"` bovendien
  terecht helemaal weg voor `tel:`-links. Geen gat.
- **`env(safe-area-inset-*)`-gebruik** in `app.css` doorgenomen (notch/
  home-indicator-marges voor bottom-nav, journeybar, roster). Ziet er
  doordacht uit, maar kan niet empirisch geverifieerd worden zonder een
  fysiek toestel met notch/home-indicator (Playwright/headless
  browsers rapporteren hier altijd 0) — al eerder gedocumenteerd als
  bekende beperking, niet opnieuw als actiepunt toegevoegd.
- **`resultsFinalized`/"KLAAR"-knop is bewust NIET tussen deelnemers
  gesynchroniseerd** (zit niet in `syncState()`'s payload): gecontroleerd
  of dit een gemiste synchronisatie is (in de stijl van iteraties
  66/73/74) — dat is het NIET. "KLAAR" markeert wanneer JIJ persoonlijk
  je eigen laatste stop hebt bereikt, niet een groepsbrede
  "de-dag-is-voorbij"-vlag; dat andere deelnemers dit niet op hun eigen
  scherm zien totdat zij zelf hun laatste stop bereiken is exact zoals
  bedoeld.

Geen codewijziging, dus geen cache-buster nodig. Nog een legitieme
verificatie-iteratie zonder nieuwe bug — bevestigt dat de eerder
gevonden bugklassen (onvolledige kopieën, Unicode-truncatie,
ontbrekende aria-live) grondig zijn uitgeroeid en niet breder
terugkomen in deze hoeken van de code.

## Ontwerpbesluiten (vervolg 80) — echte offline-test met een werkende service worker, geen bug maar wel een testtool-eigenaardigheid

**Op verzoek**: i.p.v. nog meer helperfuncties na te lezen, dit keer een
ECHTE, empirische test van het offline-gedrag — precies de methode uit
iteratie 37 (`http://localhost` registreert de SW nooit via `app.js`
zelf, dus handmatig `navigator.serviceWorker.register('/sw.js')`
aangeroepen om de HTTPS-only-guard te omzeilen).

**Geverifieerd, allemaal correct:**
1. Na registratie precacht de SW exact de verwachte `APP_SHELL`-lijst
   onder de huidige `SHELL_CACHE`-naam (`utca-shell-v90`) — gecontroleerd
   door de daadwerkelijke Cache Storage-inhoud uit te lezen.
2. **Chromium**: een volledige `page.reload()` terwijl de browser-context
   op offline staat laadt de pagina foutloos vanuit de cache — titel,
   login-overlay en `app.js` allemaal correct aanwezig, geen
   console-/pagina-fouten.
3. **WebKit**: hetzelfde scenario (zowel via `reload()` als `goto()`)
   gooit een `"WebKit encountered an internal error"` in Playwright's
   eigen navigatie-afhandeling — MAAR een directe `page.evaluate()` na
   die worp laat zien dat de pagina zelf wél degelijk correct is
   herladen (juiste titel, login-overlay aanwezig, 61KB gerenderde
   HTML). Dit is dus een **Playwright/WebKit-testtool-eigenaardigheid**
   in de combinatie offline-context + service-worker-navigatie, geen
   fout in de app zelf — belangrijk om te weten voor toekomstige
   iteraties die dit soort tests herhalen, zodat deze specifieke worp
   niet ten onrechte als een echte bug wordt aangemerkt.
4. Een foto-aanvraag voor een NIET-gecachete locatie terwijl offline
   geeft via de SW's `cacheFirst(PHOTO_CACHE,...)`-pad netjes een
   `503`-response terug (geen hang, geen onafgehandelde netwerkfout) —
   precies wat `loadPlacePhoto()`'s foutafhandeling verwacht, dus de
   fallback-icoon-weergave blijft werken.

Ook `_worker.js`'s Google Places-integratie (`handlePlacePhoto`/
`handlePlacePhotoMedia`) nog een keer grondig nagelopen: geen bug
gevonden (de placeId-hergebruik-validatie, de Utrecht-begrenzing en de
`no-store`-cache-header op de foto-media zijn allemaal bewust en
consistent).

Geen codewijziging, dus geen cache-buster nodig. Waardevolle, andere-
invalshoek-verificatie (echte browser-/SW-gedrag i.p.v. code lezen) die
bevestigt dat de offline-afhandeling robuust is.

## Ontwerpbesluiten (vervolg 81) — drie echte mobiele scenario's empirisch getest, geen bug

**Toetsenbord-op-scherm-scenario**: op een klein toestel (375×667)
gesimuleerd wat er gebeurt als het toetsenbord ±280px van het scherm
inneemt (realistische iOS-toetsenbordhoogte incl. QuickType-balk) — het
inlog-invoerveld en de knop blijven op zowel Chromium als WebKit volledig
zichtbaar, dankzij de `100dvh`/`align-items:flex-end`-combinatie die
meebeweegt met de kleiner wordende viewport. Geen bug: de login-kaart
"volgt" het toetsenbord automatisch naar boven i.p.v. eronder te
verdwijnen.

**Smalste ondersteunde breedte (320px) met de langste knoptekst**: de
laatste onboardingslide toont "Ik heb er zin in →" i.p.v. het kortere
"Volgende" — gecontroleerd of dit op 320px nog past. Doet het: geen
tekstoverloop, geen pagina-brede scroll, nette uitlijning op beide
engines (visueel bevestigd met een screenshot).

**Roster-uitklikpaneel (`#rosterToggle`/`#rosterWrap`) — focus-gedrag
gecontroleerd**: de dichtgeklapte staat gebruikt `visibility:hidden` +
`pointer-events:none` (niet `display:none`), wat de verwijderknoppen
binnenin correct uitsluit van de Tab-volgorde zolang het paneel dicht
is — geen "onzichtbare focus-val". Wél genoteerd: er is geen Escape-
toets-afhandeling om het paneel te sluiten. Bewust NIET als bug
aangemerkt: dit is een simpel uitklikpaneel zonder focus-trap (in
tegenstelling tot de onboarding-modal), dus het ontbreken van Escape is
een kleine, lage-prioriteit UX-nicety, geen toegankelijkheidsprobleem.

Geen codewijziging, dus geen cache-buster nodig. Nog een reeks
empirisch geverifieerde, robuuste scenario's — bevestigt verder dat de
basis van de app na 80 eerdere iteraties stevig staat.

## Ontwerpbesluiten (vervolg 82) — echte databug: verouderde netwerkrespons kon de weergegeven locatie laten teruggrijpen op een oudere check-in

**Wat was het probleem?** `syncState()` (aangeroepen bij elke check-in)
en `refreshState()` (de achtergrond-poller die elke paar seconden de
groepsstatus ververst) verwerkten allebei het antwoord van
`/api/state` onvoorwaardelijk: `participants=data.participants||[];
renderGroup()`. Er was geen enkele bescherming tegen een netwerk-
respons die *later binnenkomt dan een nieuwere aanvraag, maar over een
ouder moment gaat*. Bij twee snel opeenvolgende check-ins (bijv. eerst
"Utrecht Centraal", vlak daarna "Kanoverhuur Utrecht") met wisselende
netwerklatency — heel plausibel op wisselende café-wifi tijdens de
kroeg-tocht — kon de trage respons van de EERSTE (inmiddels
verouderde) check-in alsnog na de tweede binnenkomen en de
groepsweergave laten terugspringen naar de oude locatie. Dit raakt de
kern van de app: vrienden zien dan een foutieve, verouderde locatie
van elkaar, zonder enige foutmelding.

**Empirisch bevestigd** met een Playwright-test die `/api/state`
onderschept en bewust vertraagt: de eerste check-in ("start") kreeg
een kunstmatige vertraging van 1200ms, de tweede ("weather-sun") 30ms.
Resultaat vóór de fix: op ~400ms toonde de groepslijst correct
"Kanoverhuur Utrecht" (de snelle, meest recente respons), maar op
~1.7s — zodra de trage/verouderde respons alsnog binnenkwam — sprong
het terug naar "Utrecht Centraal". Reproduceerbaar op zowel Chromium
als WebKit.

**Fix**: een monotoon oplopend sequentienummer (`syncSeq`), opgehoogd
bij elke nieuwe aanroep van zowel `syncState()` als `refreshState()`
(beide praten met hetzelfde `/api/state`-eindpunt en muteren dezelfde
`participants`-state, dus dezelfde bescherming moet voor beide gelden).
Elke aanroep onthoudt zijn eigen volgnummer (`var seq=++syncSeq`) en
past zijn respons alleen toe als dat nummer nog steeds het nieuwste is
(`if(seq!==syncSeq)return;`) — zowel in het success-pad als in het
catch-fallback-pad van `syncState()`. Zo wint altijd de respons van de
*laatst gestarte* aanvraag, ongeacht in welke volgorde de antwoorden
binnenkomen.

**Test**: dezelfde vertraagde-respons-Playwright-test opnieuw gedraaid
na de fix — op zowel Chromium als WebKit blijft de groepslijst nu
correct op "Kanoverhuur Utrecht" staan, ook nadat de verouderde,
trage respons alsnog binnenkomt. Volledige `capture.js`-regressiereeks
(11 stappen) opnieuw gedraaid: geen fouten, geen regressies.

Dit is qua ernst vergelijkbaar met de databugs uit iteratie 73/74 (ook
toen een subtiele, alleen-onder-race-condities zichtbare fout in de
kernfunctionaliteit "waar is iedereen"), maar dan een timing-bug i.p.v.
een onvolledige-kopie-bug — een nieuwe bugklasse voor dit project.

Cache-buster: `app.js?v=129`, `SHELL_CACHE='utca-shell-v91'`
(`app.css` ongewijzigd, blijft `v=127`).

## Ontwerpbesluiten (vervolg 83) — dezelfde race-conditieklasse nogmaals gevonden, nu in de verwijder-vriend-functie

**Directe opvolging van iteratie 82** ("zoek na het fixen van een
bugklasse naar andere instanties van hetzelfde patroon"): `app.js`
bevat drie plekken die `/api/state`-responses verwerken en
`participants` overschrijven — `syncState()` en `refreshState()`
(vorige iteratie al beveiligd met het `syncSeq`-volgnummer) én
`removeParticipant()` (de "×" op een deelnemerchip in het
uitklikpaneel, na dubbeltikken ter bevestiging). Die derde plek was
over het hoofd gezien en had nog steeds de onbeveiligde
`participants=data.participants||[]`-toewijzing.

**Waarom dit potentieel nog vervelender is dan de vorige bug**: hier
kan een trage, VEROUDERDE achtergrondpoll (`refreshState()`, elke 15s)
die al onderweg was vóórdat een vriend werd verwijderd, na de
succesvolle verwijdering alsnog binnenkomen — en die vriend dan
zichtbaar laten TERUGKEREN in de deelnemerslijst, ook al is die net
bewust en bevestigd verwijderd.

**Empirisch bevestigd**: eerst getest tegen de ONGEWIJZIGDE code (via
`git stash` op alleen `app.js`) met een Playwright-test die een
absichtelijk trage achtergrondpoll (900ms, met de nog-niet-verwijderde
deelnemer "Ghost" erin) laat racen tegen een snelle, echte
verwijdering (dubbeltik op de "×", 50ms-respons zonder "Ghost"). Zoals
verwacht: "Ghost" kwam op zowel Chromium als WebKit terug in de lijst
zodra de trage poll alsnog binnenkwam — de bug is dus echt en
reproduceerbaar, niet alleen in theorie.

**Fix**: dezelfde `syncSeq`-bescherming toegepast op
`removeParticipant()`'s DELETE-aanvraag. Net als bij de vorige fix
wordt de deelnemerslijst alleen overschreven als dit nog steeds de
laatst gestarte aanvraag is; in tegenstelling tot `syncState()` blijven
de neveneffecten van een gelukte verwijdering (`clearOwnSession()` bij
zelf-verwijderen, de bevestigingstoast) WEL altijd uitgevoerd, ook als
de deelnemerslijst-update zelf als verouderd wordt genegeerd — de
verwijdering is een expliciete, bevestigde gebruikersactie en moet
nooit stilzwijgend "niet gebeurd" lijken, ook al wint een andere
respons de weergave-race.

**Test**: dezelfde race-test opnieuw gedraaid na de fix — op zowel
Chromium als WebKit blijft "Ghost" nu verwijderd, ook nadat de trage,
verouderde poll alsnog binnenkomt. Volledige `capture.js`-
regressiereeks (11 stappen) opnieuw gedraaid: geen fouten.

Cache-buster: `app.js?v=130`, `SHELL_CACHE='utca-shell-v92'`
(`app.css` ongewijzigd, blijft `v=127`).

## Ontwerpbesluiten (vervolg 84) — vierde `/api/state`-plek gedicht, drie nieuwe hoeken doorgelicht (geen verdere bug)

**Afronding van de audit uit iteratie 82/83**: naast `syncState()`,
`refreshState()` en `removeParticipant()` bleek `init()` nóg een vierde
plek te hebben die een `/api/state`-respons onvoorwaardelijk in
`participants` schrijft — de eenmalige GET die vóór het inloggen
draait (voor de "naam bestaat al"-hint). Dit bleek in de praktijk veel
lastiger te laten manifesteren als zichtbare bug dan de eerdere drie:
die GET-callback roept nooit `renderGroup()`/`renderRoster()` aan, dus
een verouderd antwoord corrumpeert alleen de `participants`-variabele
in het geheugen zonder de DOM meteen te beïnvloeden — pas de
eerstvolgende render (bijv. de volgende achtergrondpoll, tot 15s later)
zou het zichtbaar maken, en dan meestal alweer overschreven door verse
data. Een Playwright-test die dit expliciet probeerde te reproduceren
liet geen zichtbare regressie zien, zelfs niet tegen de ongewijzigde
code. Toch is voor consistentie dezelfde `syncSeq`-bescherming ook hier
toegevoegd (nul risico, dezelfde aanpak als de andere drie plekken) —
eerlijkheidshalve genoteerd als defensieve afronding, niet als een
bewezen zichtbare bug zoals iteratie 82/83.

**Drie andere hoeken doorgelicht, geen bug gevonden**:
1. Alle `currentStop=`-toewijzingen in `app.js` nagelopen op de
   "onvolledige kopie"-patroon (de bugklasse van iteraties 30-74) —
   `setHere()` is nog steeds de enige plek die daadwerkelijk incheckt
   en consistent `storeSet`/`storeRemove` + `syncState()` aanroept;
   `activateHere()`, `login()` en `clearOwnSession()` roepen die
   canonieke functie aan of resetten expliciet en volledig. Geen
   afwijkende instantie gevonden.
2. `storeGet()`/`storeSet()`/`storeRemove()` (de localStorage-wrappers)
   bleken al robuust: elke functie vangt exceptions op quota-fouten of
   ontbrekende `window.localStorage` (bijv. Safari private browsing) af
   en valt terug op een in-memory `memoryStore`-object. Geen wijziging
   nodig.
3. `icon-192.png`/`icon-maskable-192.png` en `icon-512.png`/
   `icon-maskable-512.png` bleken byte-voor-byte identiek (gecontroleerd
   met `shasum`) — de "maskable"-varianten hebben dus geen eigen
   safe-zone-marge, wat normaliter een risico is (een adaptive-icon-
   masker op Android kan dan belangrijke inhoud wegsnijden). Met een
   Playwright-canvas-pixelsample gecontroleerd of dit in de praktijk een
   probleem is: de achtergrond is een uniforme, bijna-zwarte kleur tot
   in de hoeken (geen transparantie) en de "U"-letter staat ruim
   gecentreerd, ruim binnen elke redelijke maskvorm — dus visueel geen
   probleem, ook al zijn het technisch geen "echte" maskable-bestanden.
   Geen wijziging nodig; genoteerd als bewuste niet-actie.

**Test**: volledige `capture.js`-regressiereeks (11 stappen) opnieuw
gedraaid na de `init()`-wijziging: geen fouten.

Cache-buster: `app.js?v=131`, `SHELL_CACHE='utca-shell-v93'`
(`app.css` ongewijzigd, blijft `v=127`).

## Ontwerpbesluiten (vervolg 85) — echte databug: naar een vriend op de andere weersvariant springen brak je eigen "huidige stop"

**Waar kwam dit vandaan?** In de groepstab kan je op een vriend tikken
om naar hun huidige stop te springen (`jumpToStop()`, via
`data-jump-stop` op elke deelnemer-rij). Als die vriend is ingecheckt
bij de ANDERE weersvariant dan jouw eigen telefoon toont (bijv. zij
zagen kano/zonmodus, jij staat lokaal op regenmodus, of andersom — elk
toestel onthoudt de weerskeuze puur lokaal), schakelt `jumpToStop()`
terecht je eigen weermodus om zodat die stopkaart zichtbaar wordt. Maar
in tegenstelling tot de weerswisselknop in de header (de CANONIEKE
functie, gefixt in iteratie 66 na precies dit soort desync) hield
`jumpToStop()` geen rekening met je eigen actieve check-in: als je
zelf op dat moment stond ingecheckt bij de weersstop van je OUDE modus,
liet de omschakeling die check-in eenvoudigweg "los" zonder 'm mee te
verhuizen naar de nieuwe modus — een schoolvoorbeeld van de
"onvolledige kopie van een complete functie"-bugklasse die dit hele
project al vanaf iteratie 30 typeert.

**Zichtbaar gevolg**: `renderJourneyHeader()` zoekt `currentStop` op in
de actieve `itinerary()` (die per weersmodus verschilt); vindt-ie geen
match, dan valt-ie stilzwijgend terug op index 0. Resultaat: de
"huidige stop"-kop in de header sprong na het tikken op de vriend
INCORRECT terug naar "Utrecht Centraal", ook al stond je zelf nog
gewoon ingecheckt bij de kanoverhuur — verwarrend en foutief voor
degene die net alleen even wilde kijken waar een vriend was.

**Empirisch bevestigd**: eerst tegen de ongewijzigde code getest (via
`git stash`) met een Playwright-scenario waarin "Ik" inge­checkt sta bij
`weather-sun` en een gesimuleerde deelnemer "Friend" bij
`weather-rain` staat — na het tikken op Friend's rij sprong
`#journeyNow`/`data-current-stop` inderdaad terug naar "Utrecht
Centraal"/`start` op zowel Chromium als WebKit. (Een eerste testversie
ging er ten onrechte van uit dat de eigen `currentStop`-waarde
ONGEWIJZIGD moest blijven — maar de juiste, consistente correctie is
dat 'm MEEVERHUIST naar de nieuwe modus, exact zoals de weerswissel-
knop dat al deed sinds iteratie 66. De test is daarop aangepast vóór
de fix als bevestigd werd beschouwd.)

**Fix**: `jumpToStop()` herschreven naar hetzelfde patroon als de
weerswisselknop — bij een moduswissel wordt, als `currentStop` de OUDE
weersstop was, deze meeverplaatst naar de NIEUWE weersstop
(`storeSet`+`syncState(true)`), en worden dezelfde volgrender-aanroepen
(`renderDayResult`/`renderRoute`/`renderGroup`, in een `uiTransition`)
gedaan die de weerswisselknop ook al deed maar die in `jumpToStop()`
ontbraken.

**Test**: dezelfde Playwright-test (met de gecorrigeerde, juiste
verwachting) opnieuw gedraaid na de fix — op zowel Chromium als WebKit
volgt de eigen check-in nu correct de moduswissel. Volledige
`capture.js`-regressiereeks (11 stappen) opnieuw gedraaid: geen fouten.

Cache-buster: `app.js?v=132`, `SHELL_CACHE='utca-shell-v94'`
(`app.css` ongewijzigd, blijft `v=127`).

## Ontwerpbesluiten (vervolg 86) — drie nieuwe hoeken doorgelicht, geen bug gevonden

**Geen codewijziging deze iteratie** — na de databug van iteratie 85
grondig gezocht naar een volgende genuine instantie van hetzelfde
"onvolledige kopie"-patroon en naar nieuwe empirische randgevallen,
maar alle drie de onderzochte hoeken bleken al correct:

1. **Render-consistentie na venuekeuze**: nagelopen of `selectVenue()`
   (een alternatieve locatie kiezen) alle afgeleide UI bijwerkt die van
   `activeVenue()` afhangt. `renderTimeline()` roept intern al
   `renderJourneyHeader()` aan, dus de "huidige stop"-kop klopt
   automatisch mee. `renderDayResult()` (de degradatiemeter) en
   `renderRoute()`'s Google Maps-link hangen bewust NIET af van de
   gekozen locatie-naam (de meter gaat over cijfers, de route-link over
   adressen die met of zonder alt-keuze identiek zijn) — dus het
   ontbreken van die aanroepen in `selectVenue()` is correct, geen
   gemiste plek.
2. **Twee-tik-bevestiging bij het verwijderen van een deelnemer, tijdens
   een achtergrond-rerender**: als je één keer op de "×" tikt (arm de
   bevestiging) en de achtergrondpoll herbouwt `#roster`'s HTML vóórdat
   je de tweede, bevestigende tik geeft, wijst de globale
   `removeArmed`-referentie dan naar een losgekoppeld DOM-element.
   Empirisch getest met Playwright (arm → forceer een rerender via
   `visibilitychange` → tik nogmaals): op zowel Chromium als WebKit
   wordt de tweede tik correct als een NIEUWE (eerste) bevestigings-tik
   behandeld in plaats van een verwijdering te forceren op het verkeerde
   element — geen crash, geen foutieve verwijdering, gewoon één keer
   extra tikken nodig. Veilig gedrag, geen wijziging nodig.
3. **"Klik ergens anders"-logica die de bevestiging annuleert**: de
   `document`-brede click-listener (`disarmRemove()` bij een klik
   buiten een `[data-remove-person]`-knop) en de `roster`-listener
   (die bij een klik op een ANDERE verwijderknop eerst ontwapent en dan
   de nieuwe knop bewapent) blijken door de bubbling-volgorde
   (roster vóór document) nooit met elkaar in de weg te zitten — bij
   het wisselen tussen twee verwijderknoppen wordt nooit onterecht
   dubbel ontwapend of de zojuist bewapende knop meteen weer
   gedeactiveerd.

Geen wijziging nodig, dus geen cache-buster-bump. Nog een reeks
empirisch geverifieerde randgevallen — bevestigt verder dat de
kernfunctionaliteit stevig staat na 85 eerdere iteraties.

## Ontwerpbesluiten (vervolg 87) — leaderboard-tekstoverflow en "Grupo completo"-race doorgelicht, geen bug; CSS/_worker.js-laag nu ook meegenomen

**Geen codewijziging deze iteratie.** Op advies van de vorige iteratie
bewust een ander soort hoek geprobeerd dan de app.js-logica van de
laatste weken: de CSS-laag van de eindstand/leaderboard, en nogmaals
`_worker.js`.

1. **Lange-naam-overflow in de DEGRADATIESTRIJD-leaderboard**:
   `.final-stat-main` is een flex-rij (`justify-content:space-between`)
   met de naam en het percentage naast elkaar — leek op het eerste
   gezicht risicovol voor een enkel, 24 tekens lang, spatieloos woord
   (flex-items krimpen normaal niet onder hun intrinsieke breedte).
   Empirisch getest op 320px breedte met Playwright, zowel met een
   gelijkspel tussen drie lange namen (die samengevoegd worden met
   " & ") als losstaand geredeneerd over een spatieloos scenario: bleek
   dat `.final-stat-main strong` al `min-width:0` + `word-break:
   break-word` heeft staan — dus zelfs een onbreekbaar lang woord wordt
   netjes midden-in afgebroken in plaats van te overlappen met het
   percentage of de kaart te laten overstromen. Dit dekt exact het punt
   dat al genoemd stond in "Resterende problemen" (`#nameInput`'s
   `maxlength=24` kan een naam midden-woord afbreken) — bevestigd dat
   dit ook in de leaderboard-context al goed is opgevangen. Geen
   wijziging nodig.
2. **"Grupo completo ✓"-races**: wanneer alle zes deelnemers op
   dezelfde stop inchecken, toont `herdMoment()` 2,6 seconden lang een
   feestelijke knoplabel voordat deze teruggezet wordt naar "Check in
   ✓". Nagegaan of een achtergrondpoll die binnen dat venster
   binnenkomt (`refreshState()` → `renderGroup()` → `herdMoment()`
   opnieuw) het label voortijdig kan resetten: dat gebeurt niet, dankzij
   de bestaande `storeGet(key)`-vlag die een tweede afvuring van
   hetzelfde herd-moment blokkeert. De enige manier om het label
   voortijdig te laten verdwijnen is als de gebruiker zelf binnen die
   2,6 seconden een andere actie doet die `renderTimeline()` opnieuw
   aanroept (bijv. een andere locatie kiezen) — een smalle, cosmetische
   edge case zonder impact op de data, niet de moeite van een fix waard.
3. **`_worker.js`'s `cleanRatings()`**: nogmaals doorgelicht (na
   iteraties 76/78/80); geconstateerd dat `Number(value)` ook een
   boolean `true` zou omzetten naar een geldige score `1` — een lichte,
   theoretische validatie-losheid, maar zonder enig praktisch risico
   gezien het vertrouwde, kleine-vriendengroep-gebruiksmodel van deze
   app (geen adversariale gebruikers). Geen wijziging nodig.

## Ontwerpbesluiten (vervolg 88) — directe gebruikersfeedback: echte databug, tijdlijn-icoontje bevroor na foto-laden

**Gebruikersmelding**: "de ene keer is het een vinkje... de andere keer is
het dat icoontje... lijkt ook wel een caching probleem te zijn." Dit was
géén losse designwens maar een concrete waarneming op een echt gebruikt
toestel.

**Root cause gevonden**: `syncRailPhoto()` zet bij het laden van een
locatiefoto de klasse `has-photo` op de tijdlijn-rail-node (om de
achtergrondfoto te tonen). `updateCheckinUi()` — de lichte, incrementele
update die bij elke check-in draait — had daarnaast de voorwaarde
`if(node&&!node.classList.contains('has-photo'))` vóórdat het node-
icoontje (vinkje/reisicoon/leeg) werd bijgewerkt. Zodra een node eenmaal
een foto had geladen, werd het icoontje binnenin dus NOOIT meer
bijgewerkt — het bleef voor altijd bevroren op wat het toevallig toonde
op het moment dat de foto laadde. Omdat foto's vaak laden terwijl een
stop nog "todo" is (reisicoontje, bv. het kano-icoon), en de daadwerkelijke
check-in status daarna verandert (current → done), bleef zo'n stop na het
inchecken permanent het originele reisicoontje tonen in plaats van het
vinkje — precies "de ene keer een vinkje, de andere keer dat icoontje",
afhankelijk van de toevallige timing van het foto laden t.o.v. het
inchecken. `railHtml()` (de canonieke, volledige tijdlijn-opbouw in
`renderTimeline()`) had deze voorwaarde niet en berekende het icoontje
altijd correct — weer een instantie van het "onvolledige kopie van een
complete functie"-patroon (nu de 8e keer deze sessie: iteraties
66/67/69/72/73/74/85, plus deze).

Niet letterlijk een HTTP/service-worker-cachingprobleem (de gok van de
gebruiker), maar wel een treffende omschrijving van het symptoom: een
verouderde, "bevroren" weergave die niet meebeweegt met de echte status —
vergelijkbaar genoeg om de verwarring te verklaren.

**Empirisch bevestigd**: eerst tegen de ongewijzigde code getest met
Playwright (locatiefoto's kunstmatig direct laten resolven, dan inchecken
bij een latere stop zodat de tussenliggende stop "done" wordt) — de
rail-node bleef inderdaad het kano-icoon tonen in plaats van het vinkje,
op zowel Chromium als WebKit. (Een eerste testopzet ging er ten onrechte
van uit dat tweemaal op dezelfde stop-knop tikken 'm "done" zou maken —
in werkelijkheid wordt een stop pas "done" zodra een LATERE stop de
huidige wordt; de test is gecorrigeerd voordat de bevinding als bewezen
gold.)

**Fix**: de `has-photo`-voorwaarde uit `updateCheckinUi()` verwijderd —
het icoontje wordt nu altijd bijgewerkt, ongeacht of de node een
achtergrondfoto heeft. Dit is veilig: `syncRailPhoto()` raakt alleen
`style.backgroundImage`/de `has-photo`-klasse aan, nooit de innerHTML, en
de bestaande CSS (`.tl-node.has-photo svg{filter:drop-shadow(...)}`,
sinds iteratie 65) past de leesbaarheids-schaduw sowieso toe op ELK
SVG-kindelement, ongeacht wanneer dat is toegevoegd.

**Test**: dezelfde Playwright-test opnieuw gedraaid na de fix — op zowel
Chromium als WebKit toont de rail-node nu correct het vinkje zodra de
stop "done" wordt, ook als de foto allang daarvoor was geladen. Volledige
`capture.js`-regressiereeks (11 stappen) opnieuw gedraaid op beide
engines: geen fouten.

Cache-buster: `app.js?v=133`, `SHELL_CACHE='utca-shell-v95'`
(`app.css` ongewijzigd, blijft `v=127`).

## Ontwerpbesluiten (vervolg 89) — verificatie na iteratie 88, geen verdere bug; bewust behoudend zo dicht bij de deadline

**Geen codewijziging deze iteratie.** Nog ~2u45m tot de deadline; conform
de gebruikersinstructie om dicht bij de deadline behoudender te zijn
(liever een verificatie documenteren dan een onzekere wijziging
committen), gericht gezocht naar directe vervolginstanties van iteratie
88's bugklasse en naar andere "canonieke vs. incrementele update"-paren,
zonder iets te forceren:

1. **`has-photo`-patroon elders**: gecontroleerd of de exacte bugklasse
   uit iteratie 88 (een `classList.contains(...)`-voorwaarde die een
   incrementele DOM-update blokkeert) nog ergens anders voorkomt. Na de
   fix is `has-photo` nu alleen nog een plek waar de klasse wordt
   GEZET (`syncRailPhoto()`), nergens meer gecontroleerd — bevestigd met
   een grep over de hele `app.js`. De enige overige
   `classList.contains(...)`-guards (`'loaded'` in `loadPlacePhoto()`,
   `'show'` in de onboarding-Escape-handler) zijn allebei legitiem: ze
   voorkomen resp. een dubbele foto-fetch en ongewenste toetsenbord-
   afhandeling terwijl de onboarding dicht is — geen van beide blokkeert
   een statusupdate.
2. **Meter (Naar de klote-meter) incrementele update**: `updateMeterUi()`
   (draait bij elke score-tik) vergeleken met `meterHtml()` (de volledige
   opbouw in `renderTimeline()`) — alle drie de dynamische onderdelen
   (knop-actief-status, "X/5"-tekst, bandlabel-copy) worden door
   `updateMeterUi()` correct en volledig meegenomen. `setRating()` roept
   daarnaast ook `renderDayResult()`, een optimistische eigen
   `participants`-update + `renderGroup()`, én `syncState(false)` aan —
   compleet, geen gemiste plek.
3. **`renderStopPeople()`** (de incrementele "wie staat hier"-update)
   roept al de CANONIEKE `peopleAtStopHtml()` rechtstreeks aan in plaats
   van eigen logica te dupliceren — al sinds de fix van iteratie 69 het
   juiste patroon, hier nogmaals bevestigd.

Geen wijziging nodig, dus geen cache-buster-bump. Blijft bij de huidige,
al opgeleverde stand (`app.js?v=133`, `SHELL_CACHE='utca-shell-v95'`,
`app.css?v=127`, commit `dd375bc`).

## Ontwerpbesluiten (vervolg 90) — korte verificatie, nog ~2u tot de deadline

**Geen codewijziging.** `renderProgress()` (voortgangsbalk boven de
tijdlijn) gecontroleerd — wordt door zowel `renderTimeline()` (volledige
opbouw) als `updateCheckinUi()` (incrementeel) met dezelfde argumenten
aangeroepen; één canonieke functie, geen dubbele logica. Verder geen
nieuwe hoek gevonden die met hoge zekerheid een echte bug opleverde;
conform de instructie om dicht bij de deadline niets te forceren, hier
gestopt met zoeken voor deze ronde. Geen cache-buster-bump nodig.

## Ontwerpbesluiten (vervolg 91) — derde verificatieronde zonder nieuwe bug: codebase stabiel geacht

**Geen codewijziging.** Laatste check: `buildOnboardingStills()` (de
onboarding-voorbeeldschermen) kloont live DOM-elementen (`onboardingClone`)
i.p.v. eigen renderlogica te dupliceren, dus de rail-icoontje-fix uit
iteratie 88 werkt daar automatisch door zonder apart onderhoud nodig te
hebben — geen incomplete-kopie-risico in dit pad.

Na drie verificatierondes op rij (89, 90, 91) zonder nieuwe bevinding,
bovenop de directe-gebruikersfeedback-fix van iteratie 88, wordt de
codebase op dit moment stabiel genoeg geacht om de zoektocht naar nieuwe
losse bugs hier te laten rusten richting de deadline. Geen
cache-buster-bump nodig — huidige, opgeleverde stand blijft
`app.js?v=133`, `SHELL_CACHE='utca-shell-v95'`, `app.css?v=127`
(commit `dd375bc`).

## Resterende problemen
- "Minder AI visual style" (iteraties 18-19: radius, achtergrondvlekken,
  gerichter backdrop-blur op kaarten). Nog resterend, bewust NIET zonder
  overleg genomen: een onderscheidend kop-lettertype i.p.v. het systeemfont,
  en meer variatie in randafronding op overige plekken. (De `.roster-stack`-
  blur die hier eerder nog als openstaand genoemd stond, is al in iteratie 23
  verwijderd — deze regel was verouderd en is bij iteratie 34 gecorrigeerd.)
  Blur op sticky/modale/vaste elementen (journeybar, bottom-nav, overlays,
  toast) bewust ongewijzigd — dat is wél functioneel (ligt over scrollende/
  wisselende inhoud).
- Overige gebruiksroutes uit de opdracht (offline-gedrag, lange namen
  buiten wat hieronder getest is, API-fouten) nog niet systematisch doorlopen.
- Lange namen (iteratie 11-onderzoek, geen codewijziging): geverifieerd dat
  `#nameInput` een `maxlength="24"` heeft die een lange naam midden in een
  woord afkapt (bv. "Maximiliaan-Alexander van der Berghuizen" wordt
  "Maximiliaan-Alexander va" in chips/groepslijst) zonder enige melding aan de
  gebruiker. Geen overflow/layoutbreuk, dus geen blokkerend probleem, en het
  veld vraagt expliciet alleen een voornaam ("Alleen je voornaam is genoeg") —
  in de praktijk dus een onwaarschijnlijk edge-case. Bewust niet gefixt deze
  iteratie (kleine kans op impact, onduidelijk of een fix niet zelf weer
  redesign-risico geeft); kandidaat voor een latere iteratie als het
  daadwerkelijk voorkomt.
- Venuenaam per kijker kan verschillen (iteratie 34-onderzoek, geen
  codewijziging): `venueSelections` (welke alternatieve locatie "actief" is)
  staat alleen lokaal (`localStorage`), niet gesynchroniseerd naar
  `/api/state`. Twee vrienden kunnen in theorie een andere locatienaam zien
  voor dezelfde persoon bij dezelfde stop. Laag risico (de groep kiest een
  alternatief altijd gezamenlijk), en een echte fix vereist een
  backend-schemawijziging — bewust niet gefixt zonder overleg, kandidaat
  voor een latere, grotere iteratie.
- WebKit nu wél voor het eerst getest (iteratie 9/10, `screenshots/capture.js`
  ondersteunt nu `chromium`/`webkit` als 4e argument) — de bestaande
  capture-flow (login, onboarding, check-in, meter, alternatieven,
  stand/groep-tabs, regenmodus) draait op 390×844, en is inmiddels ook
  doorgelicht op 320px (iteratie 42) en 375px/430px (iteratie 50) — geen
  overflow- of lay-outproblemen op geen van alle. Nog steeds niet gedaan:
  test op een echt iPhone/Safari (alleen Playwright's gebundelde
  WebKit-engine, geen fysiek toestel).
- Vreemde-taal-copy in onboarding NIET aanmerken als probleem — zie
  "Ontwerpbesluiten (vervolg)" hierboven (expliciet door gebruiker afgewezen).
- Zie "Ontwerprichting: Polarsteps" hierboven voor het gefaseerde plan
  richting die stijl — punten 2 en 3 daar zijn nog niet opgepakt (grotere,
  bewust nog niet opgepakte ingreep — losse iteraties tot nu toe waren
  bewust kleine, geïsoleerde fixes).
- De `intox`-kolom in `_worker.js`'s database-schema is dode schema
  (iteratie 78-onderzoek, geen codewijziging): nergens gelezen of
  beschreven, waarschijnlijk een overblijfsel van vóór `ratings_json`
  bestond. Veroorzaakt zelf geen probleem (heeft een `DEFAULT 1`) —
  bewust niet verwijderd, cosmetische opruiming zonder functionele
  noodzaak, kandidaat voor een latere, expliciet-opruim-gerichte
  iteratie als daar ooit ruimte voor is.
- Het roster-uitklikpaneel (`#rosterToggle`) sluit niet op de
  Escape-toets (iteratie 81-onderzoek, geen codewijziging) — bewust
  laag-prioriteit: geen focus-trap zoals de onboarding-modal, dus geen
  echt toegankelijkheidsprobleem, puur een kleine UX-nicety die
  ontbreekt.

## Permissies (belangrijk voor vervolgruns)
Op expliciet verzoek van de gebruiker staat `.claude/settings.local.json` nu
op `permissions.defaultMode: "bypassPermissions"` voor deze projectmap
(geen prompts meer tijdens onbeheerde iteraties), met een `deny`-lijst als
vangnet voor de acties die toch al harde grenzen waren: `git push*`,
`git reset --hard*`, `rm -rf /*`/`~*`/`/Users*`, `wrangler deploy*`/
`publish*`. Dit hoeft niet opnieuw ingesteld te worden.

## Eerstvolgende actie
(Deze sectie loopt herhaaldelijk stale vol met per-iteratie-correcties —
voor de volledige geschiedenis, zie de git-log van dit bestand zelf.
Opnieuw ingekort bij iteratie 76, zelfde aanpak als iteratie 68: alleen
de ECHTE actuele stand.)

**Stand van zaken (na iteratie 91):** alle bekende designfeedback is
verwerkt (zie git-log iteraties 47-76 voor details: locatievisual,
tijdlijn-rail-nodes inclusief maat/afstand/icoon-consistentie,
ranglijst-onderschriften en -rangcirkels, lime-accentkleur). Sinds
iteratie 30 ligt de nadruk vooral op systematisch bug-jagen. Twee
terugkerende, nuttige patronen zijn dit sessie gevonden en (voor zover
bekend) volledig uitgeroeid:
1. Een losse "update-plek" die een deel van de logica van een volledige
   render-/sync-functie dupliceert i.p.v. 'm aan te roepen, en niet
   meesynchroniseert als die basislogica verandert (tabblad-
   highlighting-bugs iteraties 30/33/41/43/44/48; weersomslag-syncbug
   iteratie 66; onboarding-navigatie-landmine iteratie 67; verouderde-
   check-in-chips iteratie 69; regenmodus-onboarding-foto iteratie 72;
   en de zwaarste twee — de "×"-uitlogknop en `onboardingBackToName()`
   met elk hun eigen onvolledige kopie van `clearOwnSession()`,
   iteraties 73-74, qua ernst vergelijkbaar met de dubbele-naam-databug
   uit iteratie 51). Bij iteratie 75 gericht nagezocht op verdere
   instanties rond `syncState`/`renderTimeline` — niets meer gevonden.
2. Tekst-truncatie op UTF-16-code-units i.p.v. Unicode-codepoints,
   waardoor een emoji op de tekengrens kon breken (iteratie 76, in
   zowel `app.js` als `_worker.js`).
3. Ontbrekende accessibility-attributen: het `#toast`-element had geen
   `aria-live`, waardoor screenreader-gebruikers geen enkele
   statusmelding ("Check-in gedeeld", "Meter gewist", etc.) te horen
   kregen — nu `role="status" aria-live="polite" aria-atomic="true"`
   (iteratie 77). De onboarding-modal's focus-trap (Tab/Shift+Tab) is
   apart getest en bleek al correct. Vervolg-audit in iteratie 78:
   overige statuselementen (`#dayCopy`/`#dayMeta`/`#groupAverage`/
   `#rosterCount`) BEWUST geen `aria-live` gegeven — die worden ook
   door achtergrond-polling bijgewerkt (elke 15s), dus zouden
   screenreader-gebruikers om de 15s lastigvallen met acties van
   andere mensen; alle interactieve knoppen bleken al correct
   gelabeld.
4. Een nieuwe bugklasse voor dit project: een race condition door het
   ontbreken van een sequentiebewaking op asynchrone netwerkresponses.
   `syncState()` en `refreshState()` verwerkten allebei het antwoord
   van `/api/state` onvoorwaardelijk, dus een trage/verouderde respons
   kon een latere, snellere respons overschrijven en de weergegeven
   locatie van een vriend laten teruggrijpen op een oude check-in —
   empirisch bevestigd met een Playwright-test die netwerkvertraging
   simuleert. Gefixt met een monotoon `syncSeq`-volgnummer dat een
   respons alleen toepast als 'm nog steeds de nieuwste aanvraag is
   (iteratie 82). Bij het gericht nazoeken van diezelfde bugklasse
   bleek `removeParticipant()` (de "×" op een deelnemerchip) dezelfde
   onbeveiligde overschrijving te hebben — een verwijderde vriend kon
   zichtbaar terugkeren als een trage, verouderde achtergrondpoll na de
   verwijdering alsnog binnenkwam. Ook empirisch bevestigd (eerst tegen
   de ongewijzigde code, om te bewijzen dat de test de bug echt
   reproduceert) en met dezelfde `syncSeq`-bescherming gefixt
   (iteratie 83). Een vierde plek (`init()`'s eenmalige pre-login GET)
   bleek hetzelfde patroon te missen maar had geen zichtbaar effect
   (geen render-aanroep in die callback) — voor de consistentie toch
   dezelfde bescherming toegevoegd (iteratie 84).
5. Nogmaals hetzelfde "onvolledige kopie"-patroon (punt 1), nu in
   `jumpToStop()`: bij het springen naar een vriend op de andere
   weersvariant schakelde de functie de eigen weermodus om zonder — in
   tegenstelling tot de weerswisselknop (al gefixt in iteratie 66) —
   een eigen actieve weersstop-check-in mee te verhuizen, waardoor de
   "huidige stop"-header terugviel op "Utrecht Centraal". Empirisch
   bevestigd en gefixt naar hetzelfde patroon als de weerswisselknop
   (iteratie 85).
6. Nogmaals hetzelfde patroon (8e keer), nu direct gemeld door de
   gebruiker: `updateCheckinUi()` (de lichte incrementele tijdlijn-update)
   had een `has-photo`-uitzondering die `railHtml()` (de volledige,
   canonieke opbouw) niet had, waardoor een tijdlijn-icoontje permanent
   bevroor zodra de bijbehorende locatiefoto was geladen — een afgevinkte
   stop kon zo het originele reisicoontje blijven tonen i.p.v. het
   vinkje. Empirisch bevestigd en gefixt door de uitzondering te
   verwijderen (iteratie 88).

**Bij visuele/uitlijning-meldingen**: eerst zelf een stap verder
redeneren over de onderliggende verhouding/oorzaak, en meten met
Playwright i.p.v. aannemen (expliciete gebruikerswens, iteratie 64) —
en bij twijfel of twee bestanden die "hetzelfde" horen te zijn (zoals
`index.html`/`test-local.html`) dat ook echt zijn, gewoon `diff`
trekken (iteratie 68 vond zo een grote, langlopende drift).

**Al afgerond, GEEN kandidaat meer:** alle ~13 alternatieve-
locatielinks gecontroleerd (iteraties 57-59, 68); `test-local.html`
weer volledig gelijk aan `index.html` (iteratie 68); `.final-stat-label`
is GEEN dode CSS (actief gebruikt in `test-local.html`); venue-
selectielogica, routebouw, rating-aggregatie, tijdformattering,
alternatieven-rendering doorgelicht — geen bug (iteraties 69, 75, 78);
accessibility-audit (aria-live-kandidaten + aria-labels) afgerond
(iteraties 77-78); externe-link-veiligheid (`noopener`),
`uiTransition`/`scrollAppTop`-helpers, en het bewust niet-gesynchroniseerd
zijn van `resultsFinalized` doorgelicht — geen bug (iteratie 79); ECHTE
offline-/service-worker-test (registratie, precache, offline reload,
foto-cache-fallback) en `_worker.js`'s Google Places-integratie
doorgelicht — beide robuust, geen bug (iteratie 80); mobiel-
toetsenbord-scenario, smalste-breedte-knoptekst en het roster-
uitklikpaneel's focus-gedrag empirisch getest — alle drie robuust
(iteratie 81).

**Kandidaten voor een volgende iteratie, in aflopende prioriteit:**
1. Een nieuwe PageSpeed-run tegen de live site zodra de gebruiker deze
   iteraties zelf heeft gedeployed, om te bevestigen dat de CLS-score
   in de praktijk ook echt daalt (kon deze sessie niet zelf worden
   geverifieerd — er wordt nooit gedeployed vanuit deze sessie).
2. De bewust uitgestelde punten in "Resterende problemen" hierboven
   (venuenaam-per-kijker, lange namen, de dode `intox`-kolom) als ze
   daadwerkelijk relevant worden.
3. "Avoid non-composited animations" (97 elementen, PageSpeed-
   diagnostiek zonder score-impact, bewust nog niet opgepakt — een
   volledige refactor is een te grote, risicovolle ingreep voor de
   marginale winst).
4. Een frisse code-doorloop van een nog niet bekeken hoek van `app.js`
   of `_worker.js`.

Blijf bij elke wijziging aan `app.css`/`app.js` de cache-buster-conventie
uit iteratie 20 volgen (huidige versies: `app.css?v=127`, `app.js?v=133`,
`SHELL_CACHE='utca-shell-v95'` — verhoog verder bij de eerstvolgende
wijziging aan die bestanden; controleer bij twijfel altijd `git log` en
de `?v=`-nummers in `index.html` voor de werkelijk actuele stand, niet
alleen deze sectie).

## Afronding voor de deadline

Stand bevroren voor de deadline van 2026-09-17T10:41:38Z. Laatste
commit: `3c760e4`. In totaal 91 iteraties uitgevoerd over deze sessie
(zie "Ontwerpbesluiten (vervolg 1)" t/m "(vervolg 91)" hierboven voor de
volledige, iteratie-voor-iteratie onderbouwing). Het opleveringspakket
(zip van de code + [`OPLEVERING.md`](OPLEVERING.md), met daarin de
belangrijkste UX-beslissingen, een testoverzicht en een eerlijke lijst
met resterende beperkingen) is bij de gebruiker afgeleverd. De laatst
verstuurde zip (commit `dd375bc`) is functioneel identiek aan deze
laatste stand — de iteraties 89-91 bevatten alleen documentatie-
correcties, geen codewijzigingen.

## Ontwerpbesluiten (vervolg 92) — na de deadline: directe gebruikersfeedback op een echt toestel, tijdlijn-bolletjes definitief vereenvoudigd

**Gebruikersmelding, met screenshot van een echt toestel**: "Still no
consistency after all those iterations. I like the above one better
just straight black background and lime green ✓. Fix it please. Also
with cache. switching around. Now it's just a mess."

**Root cause**: sinds iteratie 65 kregen tijdlijn-rail-nodes een kleine
achtergrondfoto van de locatie zodra Google Places een foto voor die
venue vond (`syncRailPhoto()` zette dan de `has-photo`-klasse +
`background-image`). Als voor een bepaalde locatie GEEN foto gevonden
werd (of nog niet geladen was op het moment van bekijken), bleef die
rail-node gewoon een vlak, donker bolletje — zonder foto-textuur. Op een
echt toestel, met wisselende netwerk-omstandigheden en niet voor elke
locatie een beschikbare Google-foto, ontstond zo precies het
"inconsistente" beeld dat de gebruiker meldde: sommige bolletjes met een
subtiele fototextuur erachter, andere plat zwart — ook al was het
onderliggende vinkje/icoontje zelf (sinds de iteratie-88-fix) intern
altijd correct.

**Besluit**: op expliciet, direct verzoek van de gebruiker de
fototextuur-behandeling van rail-nodes volledig verwijderd — alle
rail-nodes zijn nu ALTIJD een vlak, donker bolletje met alleen het
lime-icoontje/vinkje, ongeacht of er een locatiefoto beschikbaar is.
Dit is bewust een designwijziging (vereenvoudiging), niet enkel een
bugfix: de fototextuur was een deliberate keuze uit iteratie 65 (richting
Polarsteps' "ronde foto-markers"), maar de gebruiker geeft nu expliciet
de voorkeur aan de eenvoudigere, altijd-consistente variant.

**Uitgevoerd**: `syncRailPhoto()` en de aanroepen ervan verwijderd uit
`app.js` (in `applyPlacePhoto()` en `loadPlacePhoto()`); de bijbehorende
`.tl-node.has-photo{...}`-CSS-regels verwijderd uit `app.css`. Geen enkele
verwijzing naar `has-photo` resteert in de codebase (gecontroleerd met
grep).

**Test**: empirisch bevestigd met Playwright (locatiefoto kunstmatig
laten laden, daarna gecontroleerd dat de rail-node GEEN `has-photo`-
klasse of `background-image` krijgt) op zowel Chromium als WebKit.
Volledige `capture.js`-regressiereeks (11 stappen) opnieuw gedraaid op
beide engines: geen fouten. Visueel gecontroleerd via screenshot: het
checked-in bolletje toont nu een consistente, lime-omrande cirkel met
vinkje, exact zoals de gebruiker aangaf.

**Over de "cache switching around"-opmerking**: dit is vermoedelijk niet
een letterlijke nieuwe cachingbug, maar het gevolg van het feit dat deze
sessie nooit zelf naar de productiesite mag/kan deployen — de gebruiker
bekeek waarschijnlijk een eerder gedeployde, oudere versie van de app
(van vóór de iteratie-88-fix, of zelfs van vóór iteratie 65's introductie
van de fototextuur), waardoor twee verschillende bolletje-stijlen door
elkaar leken te lopen. Nu de fototextuur volledig is verwijderd, is dit
sowieso opgelost zodra de gebruiker deze nieuwste versie zelf publiceert
en de PWA op het toestel eenmaal volledig sluit en heropent (zoals ook
in `OPLEVERING.md`/`README.md` staat).

Cache-buster: `app.css?v=128`, `app.js?v=134`,
`SHELL_CACHE='utca-shell-v96'`.

## Ontwerpbesluiten (vervolg 93) — repo opgeschoond, tijdlijn-icoontjes optisch gecentreerd

**Repo-opschoning, op verzoek van de gebruiker**: `screenshots/`
(dev-only Playwright-testtooling), `test-local.html` (overbodig —
`index.html` werkt identiek lokaal via `python3 -m http.server`) en
`robots.txt` (dood gewicht: `_worker.js` hardcodet zijn eigen
`/robots.txt`-response en leest het bestand nooit) uit de git-repo
verwijderd. `.gitignore` uitgebreid; `OPLEVERING.md`/`README.md`
bijgewerkt om niet meer naar de verwijderde bestanden te verwijzen.

**Tijdlijn-icoontjes optisch gecentreerd, op directe gebruikersfeedback
met screenshots van een echt iPhone-toestel**: de gebruiker meldde dat
de icoontjes in niet-geactiveerde (todo) rail-nodes met het blote oog
niet precies in het midden van het bolletje staan — voor het
poolcafé-icoontje specifiek "iets meer naar rechts", en "dat geldt ook
voor andere icoontjes naar alle andere kanten".

**Eerst gemeten, niet aangenomen**: de CSS-laag zelf bleek al perfect —
`getBoundingClientRect()` op een echte gerenderde tijdlijn-node liet
zien dat de SVG exact (0,0 offset) gecentreerd wordt binnen de
`.tl-node`-cirkel dankzij `display:grid;place-items:center`. Ook de
zuiver geometrische bounding-box van elk icoon-pad binnen zijn eigen
24×24-viewBox bleek al vrijwel perfect gecentreerd. De werkelijke
oorzaak zat een niveau dieper: het **optische (met inkt/lijndikte
gewogen) zwaartepunt** van de meeste icoon-glyphs (stroke-based lijn-
iconen zoals trein, fles wijn, cocktailglas, vlag) wijkt wél meetbaar af
van hun geometrisch middelpunt — bv. `flag` had een zwaartepunt-afwijking
van (-1.38, -2.26) op een schaal van 24, `cocktail`/`wine` rond -1.6 tot
-1.4 verticaal, `boules` +1.86 verticaal. Dit is precies wat het menselijk
oog waarneemt als "niet gecentreerd", ook al is de wiskundige bounding
box in orde.

**Methode**: elk van de 12 daadwerkelijk gebruikte icoon-glyphs (en
apart het vinkje voor "done") gerasterd op hoge resolutie (24×20px per
eenheid) en het met alpha/inkt-dekking gewogen zwaartepunt berekend via
canvas-pixelanalyse (dezelfde meetmethode als eerder gebruikt voor de
maskable-icon-veiligheidscontrole, iteratie 84). Voor elk icoon een
correctie-`transform="translate(dx,dy)"` toegevoegd (nieuwe
`ICON_OPTICAL_OFFSET`-tabel in `svgIcon()`, en een losse correctie op de
`CHECK`-vinkje-constante) zodat het optische zwaartepunt exact op
(12,12) — het echte midden — komt te liggen.

**Resultaat, opnieuw gemeten na de fix**: alle 12 icoon-glyphs zitten nu
binnen 0,07 eenheden (op een schaal van 24) van het exacte midden — op
het weergegeven formaat van 11px een sub-pixel afwijking, ruim onder de
waarneembaarheidsdrempel. Het vinkje zit na correctie op 0,0002/-0,008
eenheden van het midden. Visueel gecontroleerd met een vergrote render:
het kruispunt van het poolcafé-icoontje valt nu exact op het
middelpunt van de cirkel.

**Test**: volledige `capture.js`-regressiereeks (11 stappen) opnieuw
gedraaid op zowel Chromium als WebKit: geen fouten. Deze fix werkt
identiek op alle platforms (het is een correctie op de SVG-geometrie
zelf, geen CSS/browser-specifieke hack), dus ook op de iPhone/Safari
waar de gebruiker het oorspronkelijke probleem zag.

Cache-buster: `app.js?v=135`, `SHELL_CACHE='utca-shell-v97'`
(`app.css` ongewijzigd, blijft `v=128`; `test-local.html` bestaat niet
meer, dus vanaf nu hoeft de cache-buster alleen in `index.html`/`sw.js`
bijgewerkt te worden).

## Ontwerpbesluiten (vervolg 94) — correctie op iteratie 93: de centrerings-fix werkte niet in Safari/WebKit

**Fout in iteratie 93, direct gemeld door de gebruiker**: "In de browser
(Firefox macOS) is het wel goed, maar in Safari, en daarna een webapp,
nog steeds net zo scheef." De claim in iteratie 93 dat de fix
"platform-onafhankelijk" zou zijn, klopte dus NIET — puur code lezen
en op één engine testen was hier onvoldoende; het verschil zat 'm
precies in iets dat alleen zichtbaar wordt als je de daadwerkelijke
CSS-toepassing per engine meet, niet de eindwaarde.

**Root cause, gevonden door te meten i.p.v. aan te nemen**: de
correctie uit iteratie 93 gebruikte het SVG-attribuut
`transform="translate(x y)"` op een `<g>`-element, ingevoegd via
`node.innerHTML=...` (net als de rest van deze app z'n markup opbouwt).
`getComputedStyle(g).transform` liet zien dat Chromium dit attribuut
keurig omzet naar `matrix(1,0,0,1,x,y)`, maar **WebKit gaf `"none"`
terug — het `transform`-attribuut werd domweg genegeerd** wanneer de
`<g>` op deze manier (via HTML-string-parsing van "foreign content",
niet via `createElementNS`) in de pagina terechtkomt. De icoon-
rasterisatie zelf bleek daarna, ter controle, wél identiek tussen
Chromium en WebKit (apart gemeten met dezelfde pixel-gewogen
zwaartepunt-methode als iteratie 93, op beide engines: verschillen in
de duizendsten, verwaarloosbaar) — dus de eerdere aanname "iconen zelf
renderen overal hetzelfde" klopte wél; alleen de manier waarop de
correctie werd toegepast, faalde stilzwijgend op één engine.

**Fix**: `transform="translate(x y)"` (SVG-attribuut) vervangen door
`style="transform:translate(Xpx,Ypx)"` (CSS-property) op dezelfde
`<g>`-elementen in `svgIcon()` en de `CHECK`-constante. CSS `transform`
wordt, in tegenstelling tot het SVG-attribuut, door beide engines
consistent toegepast — geverifieerd doordat `getComputedStyle(g)
.transform` nu op zowel Chromium als WebKit exact dezelfde
`matrix(1,0,0,1,x,y)` teruggeeft.

**Test**: opnieuw expliciet gecontroleerd op de ECHTE, live pagina (niet
alleen in isolatie) dat de `<g>`'s computed transform op beide engines
identiek is, voor zowel de todo-iconen als het vinkje. Volledige
`capture.js`-regressiereeks (11 stappen) opnieuw gedraaid op Chromium en
WebKit: geen fouten.

**Les voor mezelf**: "getest op Chromium en WebKit" betekende in
iteratie 93 dat de EINDWAARDE (het pixel-gewogen zwaartepunt) op één
engine (Chromium) gemeten was, en de code er in beide engines
"hetzelfde uitziet" werd aangenomen zonder de daadwerkelijke CSS-
toepassing ook op WebKit te controleren. Bij cross-browser-gevoelige
technieken (SVG-attributen, transform-toepassing op via innerHTML
ingevoegde foreign content) moet de VERIFICATIESTAP zelf op alle
relevante engines draaien, niet alleen de uiteindelijke meting op één
ervan.

Cache-buster: `app.js?v=136`, `SHELL_CACHE='utca-shell-v98'`
(`app.css` ongewijzigd, blijft `v=128`).

## Ontwerpbesluiten (vervolg 95) — iteratie 94's fix bleek op een écht toestel alsnog niet te werken: overgestapt op een fundamenteel robuustere techniek

**Gebruiker bevestigde, na uitsluiting van alle andere factoren**: de
juiste zip (`de-ronde-iteratie94.zip`, met de WebKit-`transform`-fix uit
iteratie 94) was daadwerkelijk geüpload naar GitHub, Cloudflare had
opnieuw gedeployed, Safari-geschiedenis was gewist vóór elke test, en
AdGuard Pro filtert alleen CDN-verkeer (niet deze site zelf) — dus geen
van de gebruikelijke verdachten (cache, verkeerde versie, content-
blocker) verklaarde het probleem. De icoontjes stonden zowel in Safari
als in de geïnstalleerde webapp nog steeds net zo scheef als vóór
iteratie 93/94. Dit bevestigt een genuine discrepantie tussen wat
Playwright's gebundelde WebKit-engine laat zien (waar de iteratie-94-fix
wél correct werkte, expliciet met `getComputedStyle` geverifieerd) en
hoe een echte iPhone/Safari het daadwerkelijk rendert.

**Belangrijke procesbeperking, expliciet door de gebruiker aangegeven**:
geen diagnostiek meer die actie van de gebruiker vereist (geen
screenshots, geen Web Inspector/kabel-gedoe) — de app wordt straks door
5 andere mensen (4x iOS, 1x Android) gebruikt, dus de oplossing moet
vanuit de code zelf robuust zijn, niet afhankelijk van een
diagnostische ronde per persoon.

**Besluit: van `transform` naar `viewBox`-verschuiving.** In plaats van
de iconen op hun originele plek te laten staan en er een `transform`
overheen te leggen (waarvan al gebleken was dat minstens één
renderengine dat mechanisme kan negeren, afhankelijk van hoe de SVG in
de DOM terechtkomt), verschuift de fix nu de `viewBox` van elk
icoon-SVG zelf. `viewBox` is geen los, optioneel toe te passen
attribuut zoals `transform` bovenop een via `innerHTML` ingevoegd
element — het is het fundamentele coördinatenstelsel-mechanisme van SVG
zelf, dat elke renderengine zonder uitzondering moet interpreteren om
de afbeelding überhaupt te kunnen tekenen. Er is geen "negeer dit
attribuut"-uitwijkmogelijkheid mogelijk zoals bij een aanvullende
transform.

**Wiskundige afleiding** (voor de volledigheid): als een icoon zijn
inkt-gewogen zwaartepunt oorspronkelijk op positie `(12+e_x, 12+e_y)`
heeft binnen zijn `0 0 24 24`-viewBox, dan brengt een nieuwe viewBox
`"e_x e_y 24 24"` dat exact naar het midden van de weergave — zonder dat
er een aparte transform-stap nodig is. (Bij de eerdere `transform`-
aanpak moest de content zelf worden verschoven met `-e_x,-e_y`; bij
deze `viewBox`-aanpak is de benodigde verschuiving van het
coördinatenstelsel juist `+e_x,+e_y` — het tegenovergestelde teken. Dit
teken is bij de eerste implementatiepoging fout gegaan en meteen
zelf opgemerkt via dezelfde pixel-gewogen hermeting, vóór het als
definitief werd beschouwd.)

**Test**: dezelfde pixel-gewogen zwaartepuntmeting als iteratie 93
opnieuw gedraaid op zowel Chromium als WebKit — alle 12 iconen en het
vinkje zitten weer binnen 0,07 eenheden van het exacte midden, op beide
engines identiek. Op de live pagina gecontroleerd dat de daadwerkelijke
`viewBox`-attribuutwaarde (bijv. `"-0.2 -1 24 24"` voor het todo-icoon,
`"0.09 0.32 24 24"` voor het vinkje) op beide engines exact
overeenkomt. Volledige `capture.js`-regressiereeks (11 stappen) op
beide engines: geen fouten.

**Waarom dit ditmaal wél in Safari zou moeten werken**: `viewBox`-
interpretatie is geen apart, uitschakelbaar renderingpad zoals
`transform` op een innerHTML-ingevoegd element bleek te zijn — het is
de basis van hoe elke SVG-renderer, inclusief WebKit op iOS, de
coördinaten-naar-pixel-mapping berekent. Zonder toegang tot een fysiek
Apple-toestel kan dit niet met 100% zekerheid bevestigd worden, maar dit
is qua onderliggend mechanisme een fundamenteel andere en aantoonbaar
robuustere aanpak dan de vorige twee pogingen.

Cache-buster: `app.js?v=137`, `SHELL_CACHE='utca-shell-v99'`
(`app.css` ongewijzigd, blijft `v=128`).

## Ontwerpbesluiten (vervolg 96) — definitieve oplossing: todo-icoontjes per stop-type vervangen door één symmetrisch stipje

**Iteratie 95 (viewBox-fix) bleek op een écht toestel alsnog scheef**,
opnieuw gemeld met een screenshot van de live productiesite
(`utca26.pages.dev`), ditmaal specifiek van het "flag"-icoontje (laatste
stop). Root-cause-analyse: het vlag-icoon is **inherent asymmetrisch by
design** — de paal staat bewust links met de vlag die naar rechts
uitwaaiert, exact zoals elke bekende iconenset (Feather, Font Awesome)
een vlag tekent, simpelweg omdat dat is hoe een vlag eruitziet. Zowel de
zuiver geometrische bounding-box-meting (iteratie 93, offset slechts
-0.1/24) als de inkt-gewogen-zwaartepunt-meting (iteratie 93-95, offset
-1.38/-2.26 na correctie teruggebracht tot <0.07) toonden AL bijna
perfecte centrering volgens hun eigen wiskundige definitie — en toch
zag de gebruiker het duidelijk scheef, omdat het menselijk oog bij een
vlag-icoon op de paal-positie focust, niet op een gewogen gemiddelde
van de hele vorm. Voor een inherent asymmetrisch icoon bestaat er geen
enkele wiskundige "centrerings"-definitie die tegelijk (a) het icoon
laat kloppen als herkenbare vlag én (b) oogt als gecentreerd — die twee
eisen spreken elkaar hier tegen. Ditzelfde geldt in mindere mate voor de
andere stop-type-iconen (trein, wijnglas, cocktailglas, etc.), die
allemaal om herkenbaarheidsredenen een asymmetrische vorm hebben.

**Definitieve, onomstotelijke oplossing** (op expliciet verzoek van de
gebruiker, na drie mislukte wiskundige correctiepogingen — geen verdere
meet- of correctiepoging meer op de icoon-geometrie zelf): de
verschillende stop-type-iconen (trein/kano/koffie/vork/bal/bier/
jeu-de-boules/cocktail/wijn/sandwich/vlag) worden niet langer getoond in
de "todo"-rail-node. In plaats daarvan toont een niet-geactiveerd
bolletje voortaan een simpel, inherent symmetrisch stipje via een
CSS `::after`-pseudo-element (`border-radius:50%`) — exact dezelfde,
al langer bewezen techniek als de "huidige stop"-indicator (die nooit
enige centrerings-klacht heeft opgeleverd, precies omdat een cirkel
triviaal symmetrisch is op elke renderer, altijd). De specifieke
stop-iconen blijven gewoon zichtbaar op de stopkaart zelf (als
foto-placeholder-icoon in `placePhotoHtml()`, ongewijzigd) — alleen het
piepkleine 11px-rail-bolletje, waar precieze visuele centrering
onmogelijk te garanderen bleek voor asymmetrische glyphs, is
vereenvoudigd. `railHtml()`/`updateCheckinUi()` geven voor de
"todo"-status nu lege inhoud terug (`''`) i.p.v. `svgIcon(...)`; het
ongebruikt geworden `icon`-parameter is ook uit `railHtml()` verwijderd.
`ICONP`/`svgIcon()`/`ICON_OPTICAL_OFFSET` blijven bestaan en ongewijzigd
functioneren voor hun andere gebruiksplek (de foto-placeholder op de
stopkaart, `placePhotoHtml()`), waar geen centrerings-klacht over is
geweest.

**Waarom dit ditmaal wél absoluut zeker werkt, op elk toestel**: een
cirkel getekend met `border-radius:50%` op een vierkant element heeft
per definitie geen enkele mogelijkheid om asymmetrisch te renderen —
er is geen pad-geometrie, geen inkt-verdeling, geen paal-versus-vlag-
afweging meer. Dit is geen wiskundige benadering meer die "dicht genoeg
bij" het midden probeert te komen, maar een vorm die het simpelweg niet
anders KAN zijn dan gecentreerd.

**Test**: volledige `capture.js`-regressiereeks (11 stappen) op zowel
Chromium als WebKit: geen fouten. Visueel gecontroleerd: het stipje
staat zichtbaar, rustig en overduidelijk in het midden van de rail-node.

Cache-buster: `app.js?v=138`, `app.css?v=129`,
`SHELL_CACHE='utca-shell-v100'`.

## Ontwerpbesluiten (vervolg 97) — leaderboard: rangnummer top-uitgelijnd met de naam

**Gebruikersmelding, met screenshot**: de gebruiker was tevreden met de
icoontjes-fix, maar wilde in de DEGRADATIESTRIJD-leaderboard de
bovenkant van elk rangnummer ("1", "2", "3") precies op dezelfde hoogte
hebben als de bovenkant van de naam ernaast (bv. "Karel"), met het
percentage en onderschrift daarmee consistent.

**Gemeten, niet aangenomen**: eerst via CSS-fontmetrics (ascent/descent
van `canvas.measureText()`) berekend waar de zichtbare "inkt" van het
cijfer en de naam daadwerkelijk beginnen t.o.v. hun line-box. Ter
controle ook nagemeten met een tweede, onafhankelijke methode: een
echte screenshot van de gerenderde pagina op hoge resolutie
(`deviceScaleFactor:4`) laten inladen in een canvas en rij-voor-rij
scannen naar de eerste zichtbare afwijking van de achtergrondkleur
(met een correcte achtergrond-kleursample midden in de cirkel, niet in
een hoek die buiten de ronde vorm valt — die fout zat in een eerste,
verworpen meetpoging). Beide methodes kwamen onafhankelijk uit op
hetzelfde: het cijfer begon zijn zichtbare inkt ca. **11px lager** dan
de naam, ook al waren de buitenste elementen (`.final-rank` cirkel,
`.final-stat-body`) zelf al top-uitgelijnd via `align-items:flex-start`
— want het cijfer stond middels `display:grid;place-items:center`
verticaal GECENTREERD binnen de 44px cirkel, terwijl de naam gewoon
bovenaan zijn eigen regel begint.

**Fix**: `.final-rank` van `display:grid;place-items:center` naar
`display:flex;justify-content:center;align-items:flex-start;
padding-top:1.75px` — de padding-waarde is berekend uit de gemeten
11px-afwijking en direct daarna leeg geverifieerd.

**Test**: na de fix opnieuw gemeten met dezelfde pixel-scanmethode:
verschil teruggebracht van ~11px naar **0,25px** (praktisch onmeetbaar/
onzichtbaar) op Chromium. Ook op WebKit visueel bevestigd met een
screenshot (rangnummer en naam sluiten daar zichtbaar netjes op elkaar
aan) — een losse `locator.screenshot()`-aanroep gaf in WebKit
onterecht een leeg beeld door een scroll-timing-eigenaardigheid in de
testtooling zelf (niet in de app); opgelost door handmatig te scrollen
vóór een gewone paginascreenshot, waarna de render wél zichtbaar en
correct bleek. Dit is, in tegenstelling tot de eerdere icoon-saga, een
basale flexbox-eigenschap (`align-items`/`padding`) zonder enige
bekende cross-browser-eigenaardigheid, dus een fundamenteel lager
risico op herhaling van een WebKit-specifiek mankement. Volledige
`capture.js`-regressiereeks (11 stappen) op beide engines: geen fouten.

Cache-buster: `app.css?v=130`, `SHELL_CACHE='utca-shell-v101'`
(`app.js` ongewijzigd, blijft `v=138`).
