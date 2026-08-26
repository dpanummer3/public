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
- Vijfdelige onboarding bij iedere nieuwe login
- Mobile-first, donkere glass/liquid-interface
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
├── robots.txt
└── README.md
```

`index.html` bevat de interface, styling, programma-data en client-side logica.

`_worker.js` verzorgt `/api/state`, de D1-koppeling, asset-responses en de `X-Robots-Tag`.

`robots.txt` is een geldige crawler-file. De pagina zelf gebruikt `noindex,nofollow,noarchive`.

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
