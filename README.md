# Vestiamico.it

Nuovo sito di **Vestiamico**, boutique di abbigliamento uomo e donna a Palermo dal 1960.
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + GSAP (ScrollTrigger, SplitText, Flip) + Lenis.

> Concept: "Dal 1960, il filo non si spezza". Il sito è l'interno di una giacca: fodera blu notte,
> camiceria avorio, un filo d'oro che cuce le scene. Vedi [DESIGN.md](DESIGN.md).

## Avvio

Requisiti: Node.js 20 o superiore.

```bash
npm install
npm run dev          # sviluppo su http://localhost:3000
npm run build        # build di produzione
npm start            # server di produzione (porta 3000, oppure: npm start -- -p 3210)
npm run check        # typecheck + lint + build
```

## Struttura

| Cartella | Cosa contiene |
|---|---|
| `app/` | Pagine (una cartella per URL), stili (`globals.css` token e base, `components.css`, `sections.css`, `pages.css`), font ridotti in `app/fonts/`, API del modulo in `app/api/contact/` |
| `components/home/` | Le 8 scene della home (`Hero`, `Since`, `Split`, `Sizes`, `Ceremony`, `Brands`, `Reviews`, `Visit`) e i rispettivi effetti `*Fx` |
| `components/motion/` | Utility di movimento riutilizzabili: `SplitReveal`, `FadeUp`, `ParallaxImage`, `Marquee`, `CountUp`, `WordLight`, `Thread`, `Magnetic`, `Cursor`, `SmoothScroll`, `PageTransition` |
| `components/layout/` | Preloader, header e menu, footer, banner cookie, WhatsApp sticky, avvisi, "Aperto ora" |
| `components/ui/` | Cartellino (CTA), link cucito, logo, mappa, video in loop, immagini pigre, intestazione di pagina |
| `content/` | **Tutti i testi e i dati** (JSON e Markdown). Il sito non contiene testi scritti nel codice, salvo poche etichette d'interfaccia |
| `lib/` | Accesso ai contenuti (`content.ts`, `site.ts`), orari (`hours.ts`), avvisi, motion layer (`motion.ts`), intro |
| `public/media/` | Immagini e video ottimizzati, mappa del quartiere |
| `scripts/` | Elaborazione media, font, mappa, verifiche (screenshot, Lighthouse, accessibilità) |

## Aggiornare i contenuti

Tutti i contenuti stanno in `content/`. Dopo una modifica basta ricostruire (`npm run build`) o, su Vercel, fare un nuovo deploy.

- **Contatti, indirizzo, orari, social, pagamenti**: `content/site.json`.
  - Orari settimanali in `hours.weekly`, prima domenica del mese in `hours.firstSundayOfMonth`, aperture stagionali (dicembre) in `hours.seasonal`.
  - **Chiusure e ferie**: aggiungere in `hours.closures` un oggetto `{ "from": "2027-08-16", "to": "2027-08-21", "label": "Chiusi per ferie" }`. L'indicatore "Aperto ora" lo rispetta.
- **Avvisi in cima al sito** (ferie, aperture straordinarie): `content/announcements.json`. Ogni avviso ha `start` e `end` e **sparisce da solo** alla scadenza (il sito si rigenera ogni ora).
- **Testi delle pagine**: `home.json`, `collezioni.json`, `cerimonia.json`, `punto-vendita.json`, `brand.json`, `contatti.json`.
- **Recensioni**: `reviews.json` (solo recensioni reali).
- **Privacy e cookie**: `content/legal/*.md` (Markdown semplice: `##` titoli, `-` elenchi, `**grassetto**`).
- **Immagini**: le foto si richiamano per chiave (es. `"image": "mg-1800"`). Le chiavi disponibili sono in `content/media.json`.
  - Per aggiungere foto nuove: metterle in `.media-src/` e lanciare `npm run media` (ridimensiona, ottimizza e aggiorna `content/media.json`), poi `node scripts/check-content.mjs` per verificare che ogni chiave esista.
- **Caratteri nuovi nei testi** (es. lettere straniere): i font sono ridotti ai soli caratteri usati. Dopo aver aggiunto testi con caratteri insoliti lanciare `npm run fonts`.

### WordPress come pannello contenuti (opzionale)

Tutte le pagine leggono i contenuti da un unico punto, `lib/content.ts`. Per gestire i testi da WordPress basta far leggere a quelle funzioni la REST API (`/wp-json/wp/v2/...`, per esempio con campi ACF che ricalcano la struttura dei JSON) invece dei file locali: le pagine non cambiano.

## Variabili d'ambiente

Copiare `.env.example` in `.env.local` (sviluppo) o impostarle su Vercel:

| Variabile | A cosa serve |
|---|---|
| `CONTACT_TO_EMAIL` | Casella che riceve i messaggi del modulo contatti |
| `CONTACT_FROM_EMAIL` | Mittente verificato presso il servizio di invio |
| `RESEND_API_KEY` | Chiave del servizio [Resend](https://resend.com) |

Senza queste variabili, in sviluppo il messaggio viene scritto nella console del server; in produzione il modulo risponde con un errore chiaro e propone WhatsApp. **Nessun indirizzo è scritto nel codice.**

## Deploy di anteprima su Vercel

1. Creare un progetto su [vercel.com](https://vercel.com) collegato a questo repository (oppure `npx vercel` dalla cartella).
2. Impostare le variabili d'ambiente (Settings > Environment Variables).
3. Ogni push genera un **URL di anteprima** (`*.vercel.app`): è quello da mostrare al cliente.
4. **Non collegare il dominio vestiamico.it** finché il cliente non ha approvato l'anteprima e non sono stati verificati i redirect (vedi sotto).

### Passaggio al dominio definitivo

- I vecchi indirizzi WordPress sono reindirizzati con **301** in `next.config.ts` (`/home`, `/cerimonia`, `?page_id=…`, `/feed`, ecc.). Gli URL principali restano identici (`/collezioni/`, `/abiti-da-cerimonia/`, `/punto-vendita/`, `/brand/`, `/contatti/`, `/privacy-policy/`, `/cookie-policy-ue/`); la barra finale viene tolta con un redirect permanente automatico di Next.js.
- Dopo il cambio DNS: inviare `https://vestiamico.it/sitemap.xml` in Google Search Console e controllare il report "Pagine" per eventuali 404.
- Aggiornare Google Business Profile (orari, link al sito).

## Verifiche

```bash
npm run build && npm start -- -p 3210                         # server di produzione
BASE_URL=http://localhost:3210 node scripts/screenshots.mjs    # screenshot a 390/768/1440/1920 in .shots/
node scripts/contact-sheet.mjs                                 # provini in .shots/sheets/
BASE_URL=http://localhost:3210 node scripts/a11y-motion-check.mjs   # reduced motion, tastiera, tasto indietro
CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" node scripts/lighthouse.mjs   # Lighthouse mobile
THROTTLING=devtools node scripts/lighthouse.mjs                # con limitazione reale della rete
```

## Crediti

- Mappa: dati © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL), stilizzati in `scripts/build-map.mjs`.
- Font: Bodoni Moda e Archivo, SIL Open Font License, ridotti ai caratteri del sito.
- Foto e video: archivio del cliente (vecchio sito vestiamico.it).
