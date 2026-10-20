# DESIGN — Vestiamico

Sistema visivo ricavato dal sito costruito. Concept: **"Dal 1960, il filo non si spezza"** — il sito è l'interno di una giacca: fodera blu notte, camiceria avorio, un filo d'oro che cuce le scene. Pagina viva del sistema: `/styleguide`.

## Colore (token in `app/globals.css`, `@theme`)

| Token | Hex | Ruolo |
|---|---|---|
| `--color-notte` | `#0d1730` | Fodera: campi dominanti, header, footer, scene agganciate |
| `--color-notte-2` | `#15223f` | Fodera rialzata: cornici, mappa, etichetta tessuta |
| `--color-notte-3` | `#23345a` | Impunture e linee su notte |
| `--color-avorio` | `#f2eee5` | Camiceria: pause chiare, testo su notte |
| `--color-avorio-2` | `#e7e1d4` | Avorio in ombra (recensioni) |
| `--color-oro` | `#d9b66a` | Il filo: accento su notte (contrasto 9:1) |
| `--color-oro-chiaro` | `#ecd6a0` | Metro da sarta, hover |
| `--color-oro-scuro` | `#7a5713` | Accento su avorio (testo AA) |
| `#b8903f` | — | Filo continuo della home (leggibile su entrambi i tessuti) |
| `--color-ardesia` / `--color-nebbia` | `#4a5468` / `#aeb6c8` | Testo secondario su avorio / su notte |

Ogni sezione dichiara il proprio tessuto con `.theme-notte` o `.theme-avorio`, che impostano `--bg --fg --fg-muted --accent --line --focus`. Strategia "committed": il blu notte copre circa metà della pagina, l'oro è solo filo e accento.

## Tipografia

- **Bodoni Moda** (titoli; stessa famiglia Didone del wordmark del logo), peso 500, asse ottico: `opsz 44` di base, `60` per titolo hero e contatore, `24` per i numeri del metro. Corsivo come famiglia separata caricata dopo il load.
- **Archivo** (testo e interfaccia), pesi 400–700. `.font-misura` = numeri tabellari.
- Font self-hosted e ridotti ai caratteri del sito (`app/fonts/`, `npm run fonts`).
- Scala fluida: `--text-mega` clamp(3.3rem, 12.2vw, 14rem) · `--text-display` clamp(2.7rem, 7.4vw, 8rem) · `--text-h2` clamp(2.15rem, 4.8vw, 5rem) · `--text-h3` clamp(1.5rem, 2.5vw, 2.5rem) · `--text-lead` clamp(1.125rem, 1.35vw, 1.4rem) · corpo 1.0625rem/1.6.

## Layout

Griglia `.grid-12` (4 colonne su mobile, 12 da 48rem), contenitore `.wrap` (max 1680px, gutter `clamp(1rem, 4vw, 3.5rem)`), sezioni `--spacing-section` clamp(6rem, 13vw, 12.5rem). Asimmetria controllata (seconda riga del titolo hero rientrata, griglie collezioni e galleria a misure diverse). Angoli vivi ovunque; impunture tratteggiate al posto di bordi e ombre.

## Componenti firma

- **Cartellino** (`TagButton`): CTA principale a forma di etichetta appesa, con foro e filo; colori invertiti rispetto al tessuto; leggermente magnetico.
- **Link cucito** (`StitchLink`): sottolineatura tratteggiata che si ricopre di filo pieno.
- **Filo d'oro**: `HomeThread` (unico filo nel margine della home, nodi a ogni scena), `Thread` (fili locali), filo della timeline.
- **Etichetta tessuta** (`WovenLabel`): trama orizzontale, estremità ripiegate, impunture.
- **Metro da sarta** (taglie 38–60), **mappa OSM** cucita in oro, **cornici impunturate** e cartellini sulle foto.

## Motion

- Easing: `sartoria` = cubic-bezier(0.22, 1, 0.36, 1) (ingressi), `expo.out` (sipari, aperture), `uscita` = cubic-bezier(0.7, 0, 0.84, 0).
- Durate 0.4 / 0.8 / 1.2 s; stagger 0.06 (elementi) / 0.08 (righe), totale < 0.5 s.
- Si animano solo transform, opacity, clip-path, stroke-dashoffset. GSAP e Lenis caricati dopo il load o alla prima interazione; ciò che è già sullo schermo non viene nascosto.
- Momenti: preloader filo e ago (CSS, 2,2 s, una volta per sessione), hero che si stringe in cornice, contatore 1960→oggi, timeline orizzontale cucita, pannelli Donna/Uomo 65/35, metro legato alla velocità di scroll, galleria cerimonia orizzontale, recensioni in sequenza, transizioni di pagina a sipario.
- `prefers-reduced-motion`: niente preloader, niente Lenis, nessuna animazione, nastri fermi su più righe, contenuto sempre visibile.

## Accessibilità

Contrasti AA in entrambi i tessuti, focus visibile (`--focus`), skip link, menu mobile con focus intrappolato ed Esc, video con pausa, nessuna funzione solo in hover, cursore custom solo con mouse.
