# UTCA // FÜR DIE MÄNNER

Mobiele webapp voor de vriendendag in Utrecht op **zaterdag 26 september 2026**.

De app is bedoeld als gezamenlijk draaiboek voor de dag: iedereen kan zelf zien wat de volgende stop is, navigeren, inchecken, zien waar de rest is en na iedere stop de **Naar de klote-meter** invullen.

**Live:** https://utca26.pages.dev

---

## Wat de app doet

- Volledig dagprogramma met tijden, locaties en loopstukken
- **Zon / Regen**-variant met eigen route en volledige accent-theme
  - Zon = lime
  - Regen = blauw
- Sticky **Huidige stop / Volgende** navigatie
- Google Maps-navigatie per locatie
- **Open hele ronde in Google Maps** voor het volledige route-overzicht
- Alternatieve kroegen, terrassen en lunchplekken op loopafstand
- **Info**-knop voor locatie-informatie
- **Boek** bij vooraf gereserveerde locaties
- **Ik ben hier**-check-in per stop
- Per locatie zichtbaar wie daar aanwezig is
- Onderaan bij **Waar is iedereen?** staat de actuele locatie van iedere deelnemer
- Tik op een ingecheckte deelnemer om direct naar zijn locatie in het programma te springen
- **Naar de klote-meter** van 1 t/m 5 per stop
- Tussentijdse dagstand en scores van de groep
- Inklapbare **HOE WERKT DEZE APP +** uitleg
- Mobile-first ontwerp voor telefoons zoals iPhone 13/14 en vergelijkbare formaten
- Lokale fallback wanneer de gedeelde backend niet beschikbaar is

---

## Techniek

De app gebruikt bewust een kleine, eenvoudige stack:

- **HTML**
- **CSS**
- **Vanilla JavaScript**
- **Cloudflare Pages**
- **Cloudflare Pages Functions / `_worker.js`**
- **Cloudflare D1** voor gedeelde groepsstatus

Er is geen framework, bundler of build-step nodig.

### Bestanden

```text
/
├── index.html
├── _worker.js
└── README.md
```

`index.html` bevat op dit moment de volledige interface, styling, programma-data en client-side logica.

`_worker.js` verzorgt `/api/state`, serveert de statische assets en gebruikt een D1-binding met de naam `DB`.

---

## Gedeelde groepsstatus

De backend bewaart per deelnemer:

- naam
- huidige stop
- meterstanden per stop
- gemiddelde intox-score
- tijdstip van de laatste update

De D1-tabel wordt automatisch aangemaakt wanneer deze nog niet bestaat.

De app haalt alleen deelnemers op die in de afgelopen **48 uur** zijn bijgewerkt.

### API

```text
GET    /api/state
POST   /api/state
DELETE /api/state?name=<naam>
```

Voorbeeld van een POST:

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

## Cloudflare Pages instellen

### 1. Repository koppelen

Koppel de GitHub-repository aan Cloudflare Pages.

Er is geen build-commando nodig. De repository kan direct worden gepubliceerd.

### 2. D1-database aanmaken

Maak in Cloudflare een D1-database aan voor de deelnemersstatus.

### 3. D1-binding toevoegen

Voeg bij de Pages-configuratie een D1-binding toe met exact deze naam:

```text
DB
```

`_worker.js` verwacht de database als:

```js
env.DB
```

### 4. Deployen

Na een push naar de gekoppelde branch wordt de nieuwste versie automatisch gepubliceerd.

---

## Zon- en Regenmodus

De routekeuze is niet alleen functioneel maar ook visueel.

### Zon

De standaard accentkleur is lime. Deze kleur wordt gebruikt voor onder andere:

- navigatie-accenten
- actieve stops
- iconen
- links
- actieve **Ik ben hier**
- timeline
- deelnemersmarkeringen

### Regen

Bij het selecteren van **Regen** wordt dezelfde accentlaag app-breed blauw.

De **Naar de klote-meter** blijft bewust groen → geel → oranje → rood, omdat deze kleuren een eigen betekenis hebben en losstaan van het weer-theme.

---

## Check-ins

Iedere deelnemer kiest een naam en kan bij een locatie op **Ik ben hier** drukken.

Daarna:

1. verschijnt de deelnemer bij die locatie;
2. ziet de rest onder **Waar is iedereen?** waar hij is;
3. kan iemand op zijn naam tikken om direct naar die locatie te scrollen;
4. blijft de status gedeeld via D1 zolang de backend beschikbaar is.

De eigen deelnemer wordt visueel gemarkeerd met een klein theme-kleurig bolletje. Bovenin de app staat bij de eigen naam een wit bolletje.

---

## Naar de klote-meter

Bij relevante stops kan iedere deelnemer een score van **1 t/m 5** invullen.

De schaal loopt bewust van:

**groen → geelgroen → geel → oranje → rood**

Scores kunnen opnieuw worden gekozen of weer worden gewist door dezelfde score nogmaals aan te tikken.

De app gebruikt de scores ook voor de tussentijdse dagstand.

---

## Ontwerpprincipes

De huidige interface is bewust:

- mobile-first
- donker en rustig
- glass / liquid-geïnspireerd
- sterk hiërarchisch
- beperkt in het aantal primaire acties
- consistent tussen Zon en Regen
- ontworpen om ook tijdens een lange dag en na een paar drankjes snel te begrijpen te zijn

De belangrijkste interactie per stop blijft:

```text
Info / Boek → Ik ben hier → Naar de klote-meter
```

De bedoeling is dat niemand continu achter de organisator aan hoeft te lopen om te vragen wat de volgende stop is.

---

## Huidige status

Dit project is een **vrienden-try-out / MVP** en geen productieplatform.

Daarom is de gedeelde groepsstatus bewust eenvoudig gehouden. Er is bijvoorbeeld geen account-systeem of sterke authenticatie. Namen functioneren als lichte identificatie binnen deze specifieke groep.

Voor deze use-case is eenvoud belangrijker dan een uitgebreide gebruikers- of rechtenstructuur.

---

## Verder ontwikkelen

Bij verdere uitbreiding ligt het voor de hand om de huidige single-file frontend uiteindelijk op te splitsen in bijvoorbeeld:

```text
index.html
styles.css
app.js
data.js
```

Voor de huidige omvang en deze ene dag is de single-file aanpak echter nog prima werkbaar.

---

## Datum

**UTCA // FÜR DIE MÄNNER**  
**Zaterdag 26 september 2026**
