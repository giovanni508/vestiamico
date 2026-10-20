# Critica e cicli di verifica

Ogni ciclo: screenshot reali (Playwright, build di produzione) → critica → correzioni → nuova verifica.
Larghezze: 390, 768, 1440, 1920 px. Le schermate stanno in `.shots/` (non versionate, si rigenerano con `scripts/screenshots.mjs`).

## Ciclo 1 — prima build completa

| Problema | Dove | Correzione |
|---|---|---|
| Il titolo della hero usciva in Archivo invece che in Bodoni | tutto il sito | next/font scriveva il fallback `Bodoni 72` senza virgolette: il numero invalidava l'intero `font-family`. Tolto dal fallback |
| Il filo d'oro scattava invece di cucirsi | timeline, mappa, filo dei passi | GSAP arrotonda `stroke-dashoffset` a interi: con `pathLength=1` passava da 1 a 0 di colpo. Portato a `pathLength=1000` |
| La punta del filo restava fuori dallo schermo a sinistra all'aggancio della timeline | Dal 1960 | Il filo parte già disegnato fino al 56% dello schermo e avanza con lo scorrimento |
| Timeline agganciata con molto vuoto, etichette troppo piccole | Dal 1960, desktop | Etichette delle tappe in Bodoni oro grande sopra il filo, nodi a croce sul filo |
| Cornici della galleria cerimonia deformate (altezze in % dentro flex) | Cerimonia, desktop | Misure in `vh` con proporzione fissa 4:5 per tre taglie (alta, media, piccola) |
| Durante il cambio, due citazioni si sovrapponevano | Recensioni, desktop | Sequenza: esce la precedente, entra la successiva con rivelazione dal basso |
| Loghi chiari (Il Granchio, Barbarella) quasi invisibili in monocromia | Brand | Maschere con contrasto aumentato, poi loghi già colorati in PNG a palette |
| Titolo della pagina nascosto all'idratazione ("lampo") | pagine interne | Animazione d'ingresso in CSS, sospesa solo finché il preloader è in corso |
| "Chiedi su WhatsApp" sotto ogni capo affollava la griglia su telefono | Collezioni, 390 | Su schermi piccoli resta solo la categoria |

## Ciclo 2 — performance (Lighthouse mobile)

Partenza: Performance 76-81, LCP simulato ~5 s su tutte le pagine, anche quelle di solo testo.

| Causa trovata | Correzione | Effetto |
|---|---|---|
| 324 KB di font ad alta priorità (latin + latin-ext, assi variabili completi) | Font self-hosted ridotti ai 135 caratteri del sito, Bodoni a peso 500 con asse ottico, Archivo 400-700, corsivo caricato dopo il load | 324 KB → 40 KB iniziali |
| Il monogramma raster del preloader era l'elemento LCP | Monogramma vettoriale con gradiente oro, nessuna immagine | −29 KB, LCP non più legato al preloader |
| Titoli nascosti da maschere finché finiva l'intro | Titoli dipinti al primo frame, l'animazione li "assesta" (spostamento e colore) | LCP reale 80-380 ms |
| Il primo fotogramma dei video diventava un nuovo LCP a 2 s | Poster come immagine sotto il video e sipario sovrapposto (non più clip-path) | LCP fissato al poster |
| GSAP e Lenis nel JS iniziale | Motion layer caricato dopo il load o alla prima interazione | −75 KB prima del primo disegno |
| Prefetch automatico delle pagine linkate | Prefetch all'intenzione (hover, focus, tocco) | −40 KB al caricamento |
| Poster dei video interni a priorità media | Poster ottimizzati a bassa priorità, tranne quello che apre la pagina | −116 KB |
| Foto sotto la piega scaricate subito (lazy nativo con soglia ~1250 px) | `LazyImage` con IntersectionObserver | Collezioni: −12 foto al caricamento |
| Strade della mappa (17 KB di tracciati) duplicate in HTML e payload | SVG statico caricato in lazy, inline solo via e pin | HTML più leggero su 3 pagine |
| Texture "grana" esterna diventata elemento LCP | Texture inline (data URI) | LCP non dipende da una richiesta |
| CSS inline sperimentale duplicava gli stili nel payload | Opzione rimossa | documento −48 KB |

Arrivo: **Performance 95-97, Accessibilità 100, Best Practices 100, SEO 100, CLS 0** su 7 pagine (ultima misura dopo la revisione finale: 94-96, vedi PROGRESS.md).

## Ciclo 3 — quattro larghezze, accessibilità e motion

| Problema | Dove | Correzione |
|---|---|---|
| Overflow orizzontale di 46 px (390) e 19 px (768) | Brand | I segnaposto dei loghi a colori non erano vincolati: nascosti finché non serve il logo |
| "Donna" tagliato a 768 px | Home, pannelli | Corpo del titolo proporzionato alla larghezza del pannello in fascia tablet |
| Il "4" del Bodoni quasi invisibile sul metro (filetto troppo sottile) | Taglie | Dimensionamento ottico più basso per i numeri del metro |
| `aria-label` su `<p>` e parole spente con contrasto 1,38:1 | frase "Dal 1960 vestiamo la Sicilia", obiettivo punto vendita | Niente aria-label, parole leggibili dagli screen reader, stato iniziale al 50% (≥ 3:1) |
| Tasto "indietro" riportava sempre in cima | tutte le pagine | La posizione di scroll del browser viene rispettata |
| Con "riduci movimento" il nastro dei brand non andava a capo; i loghi duplicati erano raggiungibili da tastiera | Brand (home) | Nastro fermo su più righe, duplicati nascosti e fuori dall'ordine di tabulazione |
| Tappe della timeline e cornici della galleria si nascondevano di nuovo tornando su | Home | Restano visibili una volta apparse |

Verifiche automatiche superate (`scripts/a11y-motion-check.mjs`): preloader assente e nessun contenuto nascosto con "riduci movimento", scroll nativo, skip link al primo Tab, focus sempre visibile, menu mobile con focus intrappolato ed Esc che lo chiude, posizione ripristinata con "indietro". Nessun overflow orizzontale, nessun errore di console, nessuna richiesta fallita a 390/768/1440/1920 px.

## Ciclo 4 — revisione indipendente (agente di revisione con contesto pulito)

Primo giudizio: **fix**, con 8 correzioni materiali. Dopo tre giri:

| Rilievo | Esito | Cosa abbiamo fatto |
|---|---|---|
| Il filo d'oro, firma del concept, non attraversava le scene | Risolto (2° giro) | Un unico filo nel margine sinistro della home, cucito dallo scroll, con un nodo a ogni scena; passa sotto le scene agganciate |
| Spazi tra le lettere nei titoli ("V ia", "T re") | Risolto | Verificato che il font ridotto è identico all'originale (stesse larghezze); erano i filetti del Bodoni al massimo dimensionamento ottico, quasi invisibili a 1x. Ottica a 44 (titoli) e 60 (hero, contatore) |
| Sottotitolo sopra al titolo come "occhiello" (Collezioni) | Risolto | Ora è la riga sotto al titolo |
| WhatsApp sticky sopra testi e campi su telefono | Risolto | Cartellino compatto (solo icona) sotto i 640 px; si ritira su footer, modulo e metro delle taglie |
| Dati incerti presentati come certi | Risolto | Email e CAP sono scelte motivate (il brief chiedeva di sceglierle e annotare il dubbio), orari della prima domenica non pubblicati; tutto in TODO-cliente |
| Provenienza delle immagini | Risolto | Origine registrata in ognuno degli 84 raster (tutti dal vecchio sito del cliente, nessuno generato qui) |
| Galleria cerimonia "nuda" | Risolto | Cornici impunturate e cartellini con categoria reale (Donna, Uomo, "Uomo, in negozio") |
| Fasce vuote tra scene | Risolto (2° giro) | Klarna chiude la scena Donna/Uomo e apre le taglie; recensioni agganciate al centro, alte quanto il contenuto |
| Regressioni del 1° giro (loghi troppo piccoli, WhatsApp sul metro) | Risolte | Loghi bilanciati per area visiva a dimensione doppia; sticky nascosto sul metro |
| Nodo del filo tagliato dal bordo a 390 px | Risolto | Filo rientrato e nodo più piccolo su telefono, verificato con nuova cattura |

Note "da tenere" del revisore: il duotono blu notte e avorio, il Bodoni enorme sui tre video, metro e timeline come momenti d'autore.

## Cosa resterebbe da migliorare (dipende dal cliente)

- Le foto di collezione hanno spesso una resa da stock/generata e risoluzione bassa: un servizio fotografico vero alzerebbe l'intero sito più di qualsiasi ritocco grafico.
- Tutti i video sono verticali: per la hero desktop abbiamo costruito un trittico (tre video affiancati, nitidi alla loro risoluzione). Un video orizzontale girato apposta permetterebbe una hero a tutto schermo con un solo racconto.
- La timeline ha solo le tappe certe: con le date reali della famiglia e qualche foto d'archivio diventerebbe il cuore emotivo del sito.
