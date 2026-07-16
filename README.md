# Östersjöns Fiskar

En guide till de 14 vanligaste fiskarterna i Östersjön – deras liv, livsmiljöer,
lekperioder och hur man fiskar dem ansvarsfullt.

Byggd med **Next.js 16 (App Router)**, **React 19**, **TypeScript** och
**Tailwind CSS v4**. Alla sidor förrenderas statiskt vid build.

---

## Kom igång

```bash
npm install
npm run dev          # utvecklingsserver på http://localhost:3000
```

| Kommando | Gör |
| --- | --- |
| `npm run dev` | Utvecklingsserver (Turbopack) |
| `npm run build` | Produktionsbygge – förrenderar alla artsidor |
| `npm start` | Kör produktionsbygget |
| `npm run lint` | ESLint |
| `npm run images:optimize` | Beskär, skalar och komprimerar bilder till `public/` |

Bygget skriver en statisk sajt till `out/` – inga serveranrop, ingen Node i drift.

---

## Lägg till en ny fiskart

Det här är projektets viktigaste arbetsflöde, och det kräver **noll kodändringar**:

1. Skapa `src/data/fish/<slug>.json`. Kopiera en befintlig fil som mall –
   `abborre.json` är ett bra utgångsläge.
2. Se till att `slug` i filen är identisk med filnamnet. Filnamnet blir URL:en:
   `gadda.json` → `/fiskar/gadda`.
3. Lägg artens bild som `public/images/fisk/<slug>.webp` och peka ut den i
   `image.src`.
4. Sätt `popularity` – lägre tal = vanligare art, och styr ordningen på startsidan.

Arten dyker sedan upp automatiskt på startsidan, i sökningen, på `/fiskar`, i
sitemap och som en egen förrenderad sida.

Datat valideras vid inläsning (`src/lib/fish-repository.ts`). Saknas ett fält
eller har kalendern fel antal månader avbryts bygget med ett felmeddelande som
pekar ut filen – i stället för att sidan går sönder tyst i webbläsaren.

---

## Projektstruktur

```
src/
├── app/                     # App Router: sidor, sitemap, robots, ikon
│   ├── page.tsx             # Startsida: hero, sök, vanliga arter
│   ├── fiskar/page.tsx      # Alla arter
│   ├── fiskar/[slug]/       # Detaljsida per art (förrenderas)
│   └── om/                  # Om guiden och källorna
├── components/
│   ├── layout/              # Header, Footer, tema
│   ├── home/                # Hero, sök, filter, kort
│   ├── fish/                # Detaljsidans kort: fakta, kalender, metoder …
│   └── ui/                  # Card, Badge, Logo
├── data/fish/*.json         # En fil per art – appens innehåll
├── lib/                     # Dataåtkomst, sök, etiketter, konstanter
└── types/fish.ts            # Datamodellen

assets/generated/            # Originalbilder från bildgenereringen (masterfiler)
public/images/               # Optimerade bilder som webben använder
scripts/                     # Bildpipeline
```

---

## Design- och teknikval

### Datalagret är byggt för att bytas ut

All åtkomst till fiskdata går via `src/lib/fish-repository.ts`. Komponenter
pratar aldrig med JSON-filerna direkt, och alla funktioner är redan
`async`. Den dagen datat ska komma från ett riktigt API – t.ex. Havs- och
vattenmyndigheten – byts `loadFishFromDisk()` mot ett `fetch()` medan anropande
kod står orörd.

Filerna hittas med `readdir` i stället för via en handskriven lista. Det är
själva anledningen till att en ny art inte kräver någon kodändring: det finns
ingen lista att glömma att uppdatera.

### Ingen flikkarusell på detaljsidan

Mockupen visar innehållet i flikar (Översikt, Fiskeinfo, Utbredning, Regler).
Här ligger allt i en enda scrollbar sida med tydliga rubriker i stället. Skälet
är tredelat: sökmotorer indexerar allt innehåll och inte bara första fliken,
mobilanvändare slipper leta bland flikar efter det de söker, och sidopanelen kan
hålla fiskereglerna synliga hela vägen ner.

### Färg är aldrig ensam informationsbärare

Fiskekalenderns månader skiljer sig i **både färg och stapelhöjd**, och varje
månad har en dold klartext för skärmläsare (”augusti: bäst, lekperiod”).
Kalendern går därför att läsa även med nedsatt färgseende.

### Serverkomponenter som standard

Startsidans hero är en serverkomponent trots att sökfältet inuti den är
interaktivt. Sökfältet och träfflistan delar tillstånd via `FishFilterProvider`,
och hero skickas in som `children` – ett mönster som gör att bilden och texten
kan renderas på servern medan bara sökfältet blir klient-JS. Listorna får
dessutom bara en lätt delmängd av datat (`FishSummary`), så bundlen växer inte
när fler arter läggs till.

### Tema utan blink

Ljust/mörkt tema styrs av klassen `.dark` på `<html>`, satt av ett litet
inline-script (`ThemeScript`) som körs före första målningen. Utan det hinner
webbläsaren visa en vit blixt innan React hydrerar – särskilt påtagligt nattetid.
Standard är systemets inställning tills användaren väljer själv.

Fiskbilderna ligger på en **ljus platta även i mörkt tema**. Illustrationerna är
ljusa motiv med genomskinlig bakgrund, och plattan ger dem kontrast – precis som
plancherna i en tryckt fiskguide.

### Fredade arter visar inga fångsttips

Arter med `fishing: null` (i dag ålen, som är fredad i Sverige sedan 2007) får en
varningsruta i stället för fiskemetoder och fisketider. Att beskriva hur man
fångar en akut hotad art som inte får fiskas vore direkt olämpligt – därför är
det inbyggt i datamodellen och inte något som kan glömmas bort i en komponent.

### Funktioner som medvetet utelämnats

Mockupen visar karta, väderprognos, fångstdagbok och platsberoende tips. De
kräver externa tjänster och finns inte i den här versionen. I stället för att
lägga in kort och menyval som leder till tomma sidor innehåller navigationen bara
rutter som faktiskt finns, och startsidans kortsektion ersattes med fakta om
Östersjön – kontext som gör resten av guiden begriplig.

---

## Publicera på GitHub Pages

Sajten är byggd för att publiceras statiskt. Workflowet
`.github/workflows/deploy.yml` bygger och publicerar vid varje push till
`main`/`master`.

**Engångsinställning:** Settings → Pages → Source: **GitHub Actions**. Repot bör
heta något ASCII-vänligt (t.ex. `ostersjons-fiskar`) – ett namn med å, ä eller ö
ger en procentkodad URL.

Sajten hamnar på `https://<användare>.github.io/<repo-namn>/`, alltså i en
**underkatalog**. Det är hela knuten, och fyra saker i projektet finns bara för
att lösa den:

| Sak | Varför |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Sätts av workflowet från Pages-konfigurationen. Både `next.config.ts` och `src/lib/site.ts` läser den. |
| `src/lib/image-loader.ts` | **`next/image` lägger inte på `basePath` på bildsökvägar.** Utan laddaren 404:ar varenda bild – sidan ser hel ut men är helt bildlös. |
| `absoluteUrl()` i `site.ts` | En naken sökväg som `/om` tolkas mot domänroten och tappar underkatalogen. Alla canonical-länkar, OG-bilder och sitemap-URL:er går därför via hjälpfunktionen. |
| `public/.nojekyll` | GitHub Pages kör Jekyll, som ignorerar mappar med inledande understreck. Utan filen serveras sajten utan `_next/` – alltså utan CSS och JavaScript. |

Vill du i stället köra på eget domännamn eller en användarsida (roten): lämna
`NEXT_PUBLIC_BASE_PATH` tom. Allt ovan fungerar då likadant, bara utan prefix.

### Testa exporten lokalt

```bash
npm run build
npx serve out
```

Vill du reproducera underkatalogen som på Pages: lägg `out/` i en mapp som heter
som repot och servera mappen ovanför.

### Två egenheter värda att känna till

**`postbuild` plattar ut förhämtningsfiler.** Next 16 skriver sina
RSC-segmentnyttolaster som kataloger (`__next.fiskar/$d$slug.txt`) men routern
begär dem punktseparerade (`__next.fiskar.$d$slug.txt`). På en filserver utan
omskrivningsregler ger det 18 st 404:or per sidladdning och förhämtningen slutar
fungera. `scripts/flatten-rsc-payloads.mjs` kopierar filerna till de namn routern
faktiskt ber om. Skulle Next börja skriva dem platt blir skriptet en tom operation.

**Två typsnittsvarningar i konsolen är väntade.** Google delar Inter i flera
filer per unicode-intervall; next/font förladdar ett par som sidan inte råkar
använda. Bortkastat: några kilobyte. Texten renderar korrekt.

---

## Bilder

Varje art har **exakt en bild**, som återanvänds överallt i appen. Bilderna är
AI-genererade i en och samma stil: fotorealistisk sidoprofil mot genomskinlig
bakgrund, utan text, redskap eller dekor.

Pipelinen är två steg:

```
assets/generated/   →  npm run images:optimize  →  public/images/  +  src/data/image-manifest.json
(masterfiler)                                      (det webben laddar)
```

`scripts/optimize-fish-images.mjs` beskär bort den genomskinliga ramen (så att
fisken fyller sin ruta i stället för att sväva i ett tomrum), skalar och
komprimerar.

Eftersom sajten publiceras statiskt finns ingen server som kan skala bilder på
begäran – **det som inte genereras här finns inte i produktion**. Skriptet skriver
därför en trappa av bredder per bild (`gadda-256.webp`, `gadda-384.webp` …) och ett
manifest över vilka bredder som faktiskt finns. `src/lib/image-loader.ts` läser
manifestet och låter webbläsaren välja rätt storlek via srcset.

Utan trappan skulle originalet (~200 kB per fisk) skickas till alla: **startsidan
laddar nu 334 kB bilder i stället för ~2,4 MB.**

> Bredderna i `WIDTH_LADDER` (skriptet) måste stämma överens med `imageSizes` +
> `deviceSizes` i `next.config.ts`. Går de isär efterfrågar Next storlekar som
> aldrig genererats.

**Originalen i `assets/generated/` versionshanteras med flit.** De gör att
bilderna kan bearbetas om – ny beskärning, andra format – utan att kosta nya
API-anrop. Kontrollera alltid om en användbar bild redan finns innan en ny
genereras.

Flundran är det enda avsteget från mallen: som plattfisk visas den från sin
ögonsida, vilket är hur plattfisk avbildas i fiskguider. En strikt "sidoprofil"
hade visat en kant.

---

## Om innehållet

Artbeskrivningar, mått och fisketider är **realistisk exempeldata**. De speglar
hur arterna faktiskt lever i Östersjön, men är inte hämtade ur någon officiell
databas.

**Fiskereglerna är särskilt viktiga att dubbelkolla.** Minimimått,
fångstbegränsningar och fredningstider skiljer sig mellan län och områden och
ändras löpande. Uppgifterna i appen är vägledande exempel och visas alltid med en
brasklapp och en länk till Havs- och vattenmyndigheten. Datamodellen har fält för
`source` och `updated` just för att en framtida integration ska kunna leverera
spårbara uppgifter.

Bilderna är AI-genererade illustrationer, inte fotografier, och ska inte användas
för artbestämning i tveksamma fall.
