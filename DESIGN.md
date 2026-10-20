---
name: Vestiamico
description: Boutique di famiglia a Palermo dal 1960. Il sito è l'interno di una giacca, cucito da un filo d'oro.
colors:
  notte: "#0d1730"
  notte-2: "#15223f"
  notte-3: "#23345a"
  avorio: "#f2eee5"
  avorio-2: "#e7e1d4"
  oro: "#d9b66a"
  oro-chiaro: "#ecd6a0"
  oro-scuro: "#7a5713"
  ardesia: "#4a5468"
  nebbia: "#aeb6c8"
  errore: "#a3261e"
  errore-chiaro: "#f2a099"
  linea-avorio: "#cfc6b3"
typography:
  mega:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(3.3rem, 12.2vw, 14rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 44"
  display:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(2.7rem, 7.4vw, 8rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 44"
  headline:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(2.15rem, 4.8vw, 5rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 44"
  title:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 44"
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.35vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.55
  micro:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    letterSpacing: "0.005em"
  misura:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    letterSpacing: "0.015em"
    fontFeature: "'tnum' 1, 'lnum' 1"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  section: "clamp(6rem, 13vw, 12.5rem)"
  grid-gap: "clamp(0.75rem, 2vw, 1.75rem)"
components:
  tag-button-notte:
    backgroundColor: "{colors.avorio}"
    textColor: "{colors.notte}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.35rem 0.85rem 2.15rem"
    height: "3.25rem"
  tag-button-avorio:
    backgroundColor: "{colors.notte}"
    textColor: "{colors.avorio}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.35rem 0.85rem 2.15rem"
    height: "3.25rem"
  header-whatsapp:
    backgroundColor: "{colors.oro}"
    textColor: "{colors.notte}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.95rem"
  header-whatsapp-hover:
    backgroundColor: "{colors.oro-chiaro}"
  whatsapp-sticky:
    backgroundColor: "{colors.oro}"
    textColor: "{colors.notte}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.1rem 0.7rem 1.6rem"
    height: "48px"
  whatsapp-sticky-hover:
    backgroundColor: "{colors.oro-chiaro}"
  woven-label:
    backgroundColor: "{colors.notte-2}"
    textColor: "{colors.oro}"
    rounded: "{rounded.none}"
    padding: "0.6rem 1.5rem"
  cookie-button:
    backgroundColor: "{colors.notte}"
    textColor: "{colors.avorio}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1rem"
    height: "46px"
  cookie-button-hover:
    backgroundColor: "{colors.notte-3}"
---

# Design System: Vestiamico

Ricavato dal codice costruito (`app/globals.css`, `app/components.css`, `app/sections.css`, `app/pages.css`, `components/**`, `lib/motion*.ts`). Pagina viva del sistema: `/styleguide`. Se questo file e il codice divergono, vince il codice: aggiornare qui.

## Overview

**Creative North Star: "La giacca vista da dentro"**

Il sito è l'interno di una giacca Vestiamico: la fodera blu notte copre i campi dominanti, la camiceria avorio fa da pausa, un filo d'oro tratteggiato attraversa le scene e le cuce. Ogni dettaglio dell'interfaccia viene dal laboratorio di sartoria: le azioni sono cartellini appesi a un filo, i bordi sono impunture, i numeri sono quelli del metro da sarta, la firma è un'etichetta tessuta.

La densità è editoriale: titoli Bodoni enormi, molta aria, scene a tutto schermo alternate per tessuto. L'asimmetria è controllata e sempre motivata (righe del titolo rientrate, griglie a misure diverse, foto che si sovrappongono alla mappa). Rifiutati in modo esplicito dal contratto di direzione: la boutique-template bianca con caroselli e card prodotto, il cliché nero e oro da gioielleria.

**Key Characteristics:**
- Due tessuti di sezione, notte e avorio, dichiarati da ogni sezione.
- Oro solo come filo e accento, mai come campo esteso tranne le azioni WhatsApp.
- Angoli vivi ovunque; impunture tratteggiate al posto di cornici e bordi.
- Bodoni Moda con asse ottico per i titoli, Archivo per testo, misure e azioni.
- Motion sartoriale, caricato in differita, mai necessario per leggere.

## Colors

Palette "committed": il blu notte domina, l'avorio respira, l'oro cuce.

### Primary
- **Blu notte fodera** (`--color-notte`): campi dominanti, header, footer, scene agganciate, menu, preloader, sipari. È anche il colore del testo sui tessuti avorio e il `themeColor` del browser.
- **Fodera rialzata** (`--color-notte-2`): fondo di cornici foto, mappa, etichetta tessuta.
- **Impuntura su notte** (`--color-notte-3`): linee, impunture e divisori su fondo notte; hover dei pulsanti notte.

### Secondary
- **Filo d'oro** (`--color-oro`): il filo, i nodi, il focus su notte, la selezione del testo, la scrollbar, il pin e la via sulla mappa, le azioni WhatsApp (header, menu, sticky) e la barra avvisi. Su notte 9.18:1.
- **Oro chiaro** (`--color-oro-chiaro`): hover delle azioni oro, voce di menu attiva, numeri del metro attivi, colore di partenza del titolo hero.
- **Oro scuro** (`--color-oro-scuro`): l'accento e il focus sui tessuti avorio; testo AA su avorio (5.67:1).

### Neutral
- **Avorio camiceria** (`--color-avorio`): fondo dei tessuti chiari e testo sui tessuti notte (15.34:1).
- **Avorio in ombra** (`--color-avorio-2`): fondo della scena recensioni (ridefinisce `--bg`) e dei riquadri foto delle collezioni prima del caricamento.
- **Ardesia** (`--color-ardesia`): testo secondario su avorio (6.57:1).
- **Nebbia** (`--color-nebbia`): testo secondario su notte (8.73:1), crediti, didascalie.
- **Linea avorio** (`linea-avorio`, valore letterale in `.theme-avorio --line`): linee e impunture sui tessuti avorio.
- **Errore** (`--color-errore`) / **Errore chiaro** (`--color-errore-chiaro`): messaggi e campi non validi, rispettivamente su avorio e su notte.

### I due tessuti
Ogni sezione dichiara il proprio tessuto con `.theme-notte` o `.theme-avorio`. Il tessuto imposta sei variabili semantiche, che i componenti usano al posto dei colori diretti:

| Variabile | `.theme-notte` | `.theme-avorio` |
|---|---|---|
| `--bg` | notte | avorio |
| `--fg` | avorio | notte |
| `--fg-muted` | nebbia | ardesia |
| `--accent` | oro | oro-scuro |
| `--line` | notte-3 | linea avorio |
| `--focus` | oro | oro-scuro |

`:root` ha i valori del tessuto notte. Utility collegate: `.muted` (`--fg-muted`), `.accent` (`--accent`).

### Named Rules
**The Two Fabrics Rule.** Una sezione nuova sceglie un tessuto con `.theme-notte` o `.theme-avorio` e colora i figli solo con `--bg --fg --fg-muted --accent --line --focus`. Un colore diretto è ammesso solo per gli elementi che restano uguali su entrambi i tessuti (header, azioni WhatsApp, menu).

**The Gold Thread Rule.** L'oro è filo, nodo, accento, focus. Come superficie piena compare solo sulle azioni WhatsApp e sulla barra avvisi. Mai fondi oro di sezione, mai gradienti oro.

**The Right Gold Rule.** Su avorio l'accento è sempre `--color-oro-scuro`: l'oro pieno su avorio non regge il testo.

## Typography

**Display Font:** Bodoni Moda, peso 500, asse ottico (`--font-bodoni`, con Bodoni 72, Didot, Georgia)
**Display Italic:** Bodoni Moda Italic, famiglia separata (`--font-bodoni-italic`), non precaricata
**Body Font:** Archivo, pesi 400–700 (`--font-archivo`, con ui-sans-serif, system-ui)

**Character:** un Didone ad alto contrasto, della stessa famiglia del wordmark del logo, usato molto grande e stretto; accanto, un grottesco robusto e piano per tutto ciò che si legge o si tocca.

Font self-hosted con `next/font/local`, ridotti ai caratteri del sito (`app/fonts/`, `npm run fonts`, licenza SIL OFL), `display: swap` con fallback metricamente regolati.

### Asse ottico
- `.font-display`: `opsz 44` (default; contrasto alto ma filetti visibili su schermi 1x), peso 500, `letter-spacing -0.025em`, `line-height 0.92`.
- `opsz 60`: titolo hero e contatore "1960" (le taglie più grandi).
- `opsz 24`: numeri del metro da sarta (filetti robusti, leggibili in movimento).

### Hierarchy
Scala fluida in `@theme`, applicata con le classi `t-*`. La famiglia si sceglie a parte (`font-display` o testo di default).
- **Mega** (`--text-mega`, `.t-mega`): titoli scena di massima scala.
- **Display** (`--text-display`, `.t-display`): titoli pagina e scena.
- **H2** (`--text-h2`, `.t-h2`, lh 0.98): titoli di sezione, numeri grandi (gamma taglie).
- **H3** (`--text-h3`, `.t-h3`, lh 1.08): sottotitoli, spesso in corsivo Bodoni.
- **Lead** (`--text-lead`, `.t-lead`, lh 1.5): paragrafi d'apertura.
- **Body** (`--text-body`, lh 1.6): testo corrente; misura `.measure` 62ch.
- **Small** (`--text-small`, `.t-small`, lh 1.55) e **Micro** (`--text-micro`, `.t-micro`, lh 1.4): didascalie, crediti, note.
- **Misura** (`.font-misura`): Archivo con numeri tabellari e allineati (`tnum`, `lnum`), per orari, taglie, numerazioni.

Alcune scene hanno una taglia propria fuori scala, legata alla composizione: titolo hero `clamp(2.9rem, 11.3vw, 12rem)`, contatore `clamp(6.4rem, 31vw, 29rem)`, titoli Donna/Uomo `clamp(4.6rem, 18vw, 12.5rem)`, voci del menu mobile `clamp(2.5rem, 11vw, 4.4rem)`. Restano locali alla scena.

### Named Rules
**The Late Italic Rule.** Il corsivo Bodoni è una famiglia separata che si attiva solo con `html.fonts-late` (dopo il load), per non rubare banda all'LCP; prima il browser inclina il tondo. Un nuovo elemento in corsivo va aggiunto alla lista di selettori in `globals.css`, oppure usa `.italic-display`.

**The Balanced Heading Rule.** `h1–h3` hanno `text-wrap: balance`, i paragrafi `text-wrap: pretty`. Le righe dei titoli si spezzano a mano solo quando l'asimmetria è voluta.

## Layout

- **Contenitore** `.wrap`: larghezza piena fino a 1680px, padding laterale `--spacing-gutter`.
- **Griglia** `.grid-12`: 4 colonne su mobile, 12 da 48rem, gap `clamp(0.75rem, 2vw, 1.75rem)`.
- **Ritmo di sezione**: `--spacing-section`. Fra scene contigue dello stesso tessuto il ritmo si stringe (`clamp(2.5rem…4.5rem)`, `clamp(3.5rem…6rem)`): nessuna fascia vuota fra due scene che continuano lo stesso discorso.
- **Breakpoint** usati: 26rem (`xs`), 40rem, 48rem (griglia a 12), 64rem (navigazione desktop, griglie a più colonne). Mobile first.
- **Header** fisso alto `--header-h` 4.25rem; si nasconde scorrendo in giù, diventa solido (notte 88% + blur) dopo l'hero.
- **Scene a tutto schermo** con `100svh` (hero, Donna/Uomo, timeline agganciata).

### Named Rules
**The Measured Asymmetry Rule.** L'asimmetria è un rientro preciso, non un disordine: la seconda riga del titolo hero rientra di `clamp(1.25rem, 9vw, 11rem)`, le griglie collezioni e galleria alternano misure, la foto del negozio si sovrappone alla mappa (58%, margine −22%). Le pagine restano leggibili in colonna singola su mobile.

## Elevation & Depth

Il sistema è piatto. La profondità viene dai tessuti (notte contro avorio), dalla grana (`.grain`: rumore SVG inline, opacità 0.18, `overlay`) e dai veli blu notte sulle foto e sui video. Le cornici sono impunture, non ombre.

### Shadow Vocabulary
Ombre morbide, tinte di notte, solo sugli elementi che galleggiano sopra il contenuto:
- **Galleggiante** (`0 18px 40px -18px rgb(13 23 48 / 0.6)`): cartellino WhatsApp sticky. Variante `-22px` per i loghi brand a colori in hover.
- **Pannello** (`0 30px 70px -28px rgb(13 23 48 / 0.65)`): banner cookie.
- **Foto sovrapposta** (`0 30px 60px -30px rgb(0 0 0 / 0.7)`): foto del negozio sopra la mappa.

### Named Rules
**The Flat Fabric Rule.** Sezioni, riquadri e foto in pagina non hanno ombra. Un'ombra è ammessa solo per ciò che si stacca davvero dal tessuto (sticky, pannello, sovrapposizione), sempre morbida e con offset negativo.

## Shapes

Angoli vivi ovunque (`border-radius: 0`, anche sui campi del form). Il cerchio esiste solo come foro: foro del cartellino, nodo, pin della mappa, punto "aperto ora", ago del metro.

Le forme ricorrenti vengono dalla sartoria:
- **Cartellino**: `clip-path` a punta sul lato sinistro (`polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 50%)`; 12px sul cartellino sticky, 9px sui cartellini foto) con foro rotondo.
- **Etichetta tessuta**: `clip-path` con le due estremità rientrate di 9px, come un'etichetta ripiegata.
- **Impuntura**: linea tratteggiata `currentColor 55%`, passo 7–9px (`.stitch-x`, `.stitch-y`), oppure `border: 1px dashed` su uno pseudo-elemento rientrato di 6–10px dentro foto, mappa, cookie e cartellini.

### Named Rules
**The Stitch Not Border Rule.** Una cornice si disegna come impuntura tratteggiata rientrata dentro l'oggetto, non come bordo pieno esterno. Le linee piene sottili restano per funzioni precise: divisore del footer, campi del form, metro da sarta, bordi dell'etichetta tessuta.

## Components

### Cartellino (`TagButton`), azione principale
- **Forma:** etichetta appesa, punta a sinistra, foro rotondo con anello in `--accent`, un filo tratteggiato d'oro di 30px che lo precede, impuntura interna tratteggiata al 32%.
- **Colori:** invertiti rispetto al tessuto (`--tag-bg: var(--fg)`, `--tag-fg: var(--bg)`): avorio su notte, notte su avorio.
- **Misure:** altezza minima 3.25rem, Archivo 600 1rem.
- **Stati:** hover ruota di −2.5° attorno al foro; active −1° e scala 0.98; focus con `outline-offset 6px`. Magnetico (forza 0.28) solo con mouse e senza reduced motion.
- **Varianti:** cartellino WhatsApp sticky (oro, in basso a destra, solo icona sotto 40rem, si nasconde con menu e cookie aperti); cartellini sulle foto della galleria cerimonia (avorio, piccoli, ruotati di −4°).

### Link cucito (`StitchLink`), azione secondaria
A riposo una cucitura tratteggiata (passo 8px, opacità 0.55) sotto il testo; in hover e focus un filo pieno di 1.5px in `--accent` la ricopre da sinistra (`scaleX`, `--duration-media`, `sartoria`). Peso 500. Esterno: annuncia "si apre in una nuova scheda" agli screen reader.

### Filo d'oro
- **`HomeThread`**: un unico filo nel margine sinistro della home, da "Dal 1960" a "Vieni a trovarci", ondulato con un'ansa ogni ~420px, tratteggio 8/6, 1.5px. Si cuce con lo scroll (punta a metà schermo, `scrub 0.6`); a ogni scena si annoda una X. Passa sotto le scene agganciate, che hanno fondo pieno.
- **`Thread`**: filo locale riutilizzabile, tratteggio 7/6, rivelato da una maschera con `stroke-dashoffset` legato allo scroll (`scrub 0.8`).
- **Filo della timeline**: tratteggio 8/6 in oro; orizzontale quando la timeline è agganciata, verticale su mobile; le tappe si annodano al passaggio.

### Etichetta tessuta (`WovenLabel`)
La firma del sito (footer, storia, 404). Fondo notte-2 con trama orizzontale, bordi in oro al 45%, impunture verticali ai lati, estremità ripiegate. Nome in Bodoni maiuscolo spaziato 0.16em, come il wordmark ricamato; riga sotto in Archivo 0.72rem nebbia. Decorativa (`aria-hidden`).

### Metro da sarta (taglie)
Segmenti con tacche a gradiente e numeri Bodoni `opsz 24`, taglie 38–60. Il segmento attivo diventa notte con numero oro chiaro; l'ago è notte con testa in oro scuro. Lo scorrimento è legato alla velocità di scroll.

### Mappa OSM (`StoreMap`)
SVG statico da dati OpenStreetMap (nessun servizio esterno, nessun cookie): strade nei toni della fodera, Via dell'Orsa Minore cucita in oro, pin oro col monogramma VA e un impulso lento (2.6s). Impuntura interna in oro al 45%, credito OSM obbligatorio in basso a destra.

### Cornici impunturate sulle foto
Foto in riquadro 4:5 con impuntura tratteggiata rientrata (6–8px): oro al 55% sugli hero delle pagine interne, avorio al 55% sulle collezioni (piena in hover, con zoom dell'immagine a 1.045), avorio al 60% sulla galleria cerimonia. Sugli hero delle pagine interne un sipario notte si ritira verso l'alto all'apertura.

### Navigazione
- **Desktop (da 64rem):** link Archivo 0.95rem; un filo oro pieno sotto si stende in hover e sulla pagina corrente, che diventa oro chiaro. Azione WhatsApp oro a destra.
- **Mobile:** pulsante "Menu" a due linee; pannello a tutto schermo notte con voci in Bodoni `clamp(2.5rem, 11vw, 4.4rem)` numerate in oro, WhatsApp oro, telefono, social in quadrati di 44px con impuntura notte-3. Scroll bloccato, focus intrappolato, Esc chiude e riporta il focus al pulsante.

### Campi del form
Fondo `#fbf9f5`, bordo pieno 1px `#b8ad97`, angoli vivi, altezza minima 52px. Focus: bordo notte e alone 3px oro scuro al 35%. Errore: bordo `--color-errore` e banda interna di 3px a sinistra, messaggio in errore 0.9rem 500.

### Cursore custom
Punto oro che diventa anello sui link e disco con etichetta sugli elementi con `data-cursor`. Solo con `hover: hover`, puntatore fine e senza reduced motion; altrimenti cursore di sistema.

## Motion

Token in `@theme` e `lib/motion.ts` (`DUR`, `STAGGER`), easing registrati in `lib/motion-core.ts`.

- **Easing:** `sartoria` = `cubic-bezier(0.22, 1, 0.36, 1)` (default GSAP: ingressi, hover, transizioni); `expo.out` / `--ease-expo` = `cubic-bezier(0.16, 1, 0.3, 1)` (sipari, aperture, clip-path); `uscita` = `cubic-bezier(0.7, 0, 0.84, 0)` (uscite brevi).
- **Durate:** rapida 0.4s (colori, opacità, stati), media 0.8s (default GSAP, filo dei link, cartellino), lenta 1.2s (zoom foto, ingressi grandi).
- **Stagger:** 0.06 elementi, 0.08 righe; totale sempre sotto 0.5s.
- **Caricamento differito:** GSAP (ScrollTrigger, SplitText, CustomEase) e Lenis non sono nel JS iniziale; `loadMotion()` li importa dopo il load (+450ms) o alla prima interazione. `useMotion` lavora dentro un `gsap.context` e si annulla allo smontaggio.
- **Cosa si anima:** solo `transform`, `opacity`, `clip-path`, `stroke-dashoffset` (e `flex-grow` nei pannelli Donna/Uomo). Ciò che è già nello schermo non viene nascosto (`inView`); senza JS il sito è completo.
- **Momenti:** preloader CSS filo e ago che cuce il monogramma VA (2.2s, una volta per sessione, saltabile), trittico hero che si stringe in cornice, contatore 1960→oggi, timeline orizzontale cucita, pannelli Donna/Uomo che si allargano (1 → 1.86), metro legato alla velocità, galleria cerimonia orizzontale, recensioni in sequenza, transizioni di pagina a sipario (View Transitions, fallback con pannelli notte).

**Reduced motion:** con `prefers-reduced-motion: reduce` nessun preloader, nessun Lenis (scroll nativo), nessuna View Transition, cursore e magnetismo spenti, nastri brand fermi e a capo, nodi già annodati, filo già cucito; ogni animazione e transizione CSS è ridotta a 0.01ms. Il contenuto è sempre visibile.

## Accessibilità

- **Focus:** `outline 2px solid var(--focus)`, offset 4px (6px sul cartellino), oro su notte e oro scuro su avorio. Sui pannelli Donna/Uomo il focus del link si mostra sull'intero pannello (offset −8px).
- **Contrasto:** testo AA in entrambi i tessuti (valori in Colors).
- **Skip link** "Vai al contenuto" oro su notte, fisso in alto a sinistra, visibile al focus; `main#contenuto` focalizzabile.
- **Menu mobile:** focus intrappolato, Esc, ritorno del focus, scroll bloccato.
- **Target** di almeno 44px (menu, social, toggle), 46–48px per cartellino sticky e pulsanti cookie.
- **Video** con pulsante di pausa; nessuna funzione solo in hover (i contenuti dei pannelli in hover sono visibili anche al focus e su touch).
- **Decorazioni** (fili, nodi, etichetta tessuta, grana) sempre `aria-hidden`.

## Do's and Don'ts

### Do:
- **Do** dichiarare il tessuto di ogni nuova sezione (`.theme-notte` o `.theme-avorio`) e colorare con le variabili semantiche.
- **Do** usare il cartellino (`TagButton`) per l'azione principale di una scena e il link cucito (`StitchLink`) per la secondaria; al massimo un cartellino per gruppo di azioni.
- **Do** incorniciare foto e riquadri con un'impuntura tratteggiata rientrata, non con un bordo esterno.
- **Do** usare Bodoni Moda 500 con `.font-display` per i titoli e Archivo per tutto il resto; `.font-misura` per orari, taglie e numeri.
- **Do** usare i token di motion (`sartoria`, `expo.out`, `uscita`; 0.4 / 0.8 / 1.2s) e passare da `useMotion` / `loadMotion`, con un ramo `prefers-reduced-motion: no-preference`.
- **Do** tenere angoli vivi; il cerchio solo per fori, nodi e pin.

### Don't:
- **Don't** usare l'oro pieno su avorio per testo o accento: lì l'accento è oro scuro.
- **Don't** introdurre card prodotto con ombra, caroselli o fondi bianchi da boutique-template; non usare il nero e oro da gioielleria.
- **Don't** arrotondare angoli o usare forme a pillola.
- **Don't** importare GSAP o Lenis in modo statico in un componente: allunga il JS iniziale.
- **Don't** nascondere con un'animazione un contenuto che il visitatore sta già leggendo, né rendere un contenuto visibile solo dopo un'animazione.
- **Don't** aggiungere sopratitoli in maiuscolo spaziato sopra i titoli: il maiuscolo spaziato appartiene solo all'etichetta tessuta.
