# Decisioni

Registro delle scelte importanti, in ordine cronologico, con il perché.

## Fase 1 — Audit ed estrazione

- **Estrazione via REST API di WordPress** (`/wp-json/wp/v2/pages` e `/media`) oltre all'HTML renderizzato: dà l'elenco completo e pulito dei media (181 file, 164 utili) senza dover fare scraping del markup Elementor.
- **Esclusi dalla migrazione** i file del template Elementor (`Home_Interior_Design-*`, `placeholder-*`, `OurDesigners`) e 4 duplicati identici.
- **Media sorgenti fuori da git** (`.media-src/`, 77 MB): si riscaricano dagli URL elencati in `.media-src/manifest.json` (generato) o dagli URL `source` in `content/media.json`. Nel repository vanno solo gli asset ottimizzati.
- **Python non disponibile** sulla macchina: tutti gli script di estrazione ed elaborazione sono in Node (sharp + ffmpeg).
- **Email**: scelta `info@vestiamico.it` (stesso dominio del sito, citata nella pagina Contatti) invece di `.com` (solo nel footer, dove anche gli altri link erano rotti). Dubbio annotato in TODO-cliente.
- **CAP 90124**: la pagina Contatti e OpenStreetMap concordano su 90124; il brief e il vecchio link Google Maps dicevano 90125. Scelto 90124, annotato.
- **Coordinate**: dal tratto di via su OpenStreetMap (il civico non è mappato). Il pin della mappa è agganciato al punto della via più vicino; da confermare.
- **Orari**: presi dalla pagina Contatti (lun–sab 8:30–13 / 15:30–20, prima domenica del mese, domeniche di dicembre 10–13 / 16–20). La fascia oraria della prima domenica non esiste sul sito: non viene inventata.
- **Recensioni**: le 3 reali, testo integrale. Unici interventi: tolte le emoji "💯💯" e corretto il refuso "Ls" → "La" (annotato nel file).
- **Brand**: descrizioni limitate a ciò che è scritto sui loghi (es. "Est. 1961" di Navigare, "1970" di Effebi, "Milano, made in Italy" di Barbarella). Niente storie dei marchi scritte da noi.
- **Klarna**: dal banner originale, "Paga in 3 rate con Klarna, senza interessi né commissioni". Usato una volta sola come nota testuale, senza l'immagine rosa.
- **TikTok e YouTube rimossi**: nel vecchio sito avevano `href="#"`. Esiste un indizio di account TikTok (watermark su un video) ma nessun URL verificabile.
- **Cookie policy**: sezioni generali conservate e corrette; la sezione 6 riscritta per descrivere le tecnologie del nuovo sito (solo memoria locale tecnica). Il vecchio elenco (WordPress, Elementor, reCAPTCHA, YouTube…) sarebbe stato falso. Da validare col consulente privacy.
- **Mappa stilizzata da OpenStreetMap** (Overpass API, licenza ODbL, attribuzione in pagina) invece di un iframe Google: zero cookie di terze parti, colori del brand, ~17 KB.
- **Video**: tutti verticali e a bassa risoluzione. Ricompressi in loop brevi (5–12 s, 24 fps, senza audio) in MP4 H.264 + WebM VP9 con poster: da 20 MB a 0,4–1,5 MB ciascuno.
- **Foto di collezione**: molte hanno resa da stock/generata. Le usiamo perché sono le immagini che il cliente ha scelto per il proprio sito, ma il TODO chiede uno shooting reale. Nelle sezioni "racconto" (storia, punto vendita, mappa) privilegiamo le foto vere del negozio.

## Processo

- La skill impeccable prevede un'intervista iniziale: il brief vieta domande e conferme, quindi le risposte sono state inferite dal brief e dal sito, e marcate in PRODUCT.md.
- Nessun generatore di immagini disponibile in questa sessione: percorso "code-led" (nessun mockup dipinto; l'ambizione è scritta nel contratto di direzione e verificata sul risultato).

## Fase 2 — Direzione creativa

- **Concept visivo "la giacca vista da dentro"**: fodera blu notte `#0d1730` per i campi dominanti, camiceria avorio `#f2eee5` per le pause, filo d'oro `#d9b66a` solo come accento (cuciture, nodi, cartellini). Il brief fissava "scuro profondo + avorio + accento ricco": l'oro viene dal logo, il blu dalle foto di cerimonia (abiti e smoking blu) e dalle fodere sartoriali. Evitato il nero+oro da gioielleria e il terracotta dei template.
- **Bodoni Moda** per i titoli: il wordmark VESTIAMICO del logo è un Didone, quindi la scelta non è un cliché "serif = lusso" ma continuità di marchio. **Archivo** per il testo. Entrambi SIL OFL, self-hosted.
- **Componenti del mondo sartoriale invece dei soliti bottoni**: il "cartellino" (CTA principale con foro e filo, come le etichette appese ai capi), il "link cucito" (sottolineatura tratteggiata che si ricopre di filo pieno), impunture tratteggiate al posto di bordi e ombre, angoli vivi ovunque.
- **Niente tema scuro automatico**: il sito alterna per scelta tessuti scuri e chiari (fodera e camicia); invertirli col tema del sistema romperebbe il racconto. Contrasti AA in entrambi i "tessuti".
- **Percorso "code-led"**: nessun generatore d'immagini disponibile, nessun mockup dipinto; l'ambizione è scritta nel contratto di direzione (`.impeccable/surfaces/app-page-tsx.md`).
- **Conflitti tra skill e brief risolti a favore del brief**: cursore personalizzato (la skill "taste" lo sconsiglia), due nastri brand (max uno per pagina secondo la skill), numerazione 01-06 nel menu mobile. Il cursore è attivo solo con mouse, mai con "riduci movimento" o contrasto forzato.
- **Hero desktop a trittico**: tutti i video del cliente sono verticali e a bassa risoluzione (max 720×1280). Uno solo allargato a 1440 px sarebbe sgranato; tre video da passerella affiancati restano nitidi e diventano una "sfilata". Su telefono un solo video a tutto schermo.
- **Effetto shader "tessuto" non realizzato**: era opzionale e solo "se non peggiora performance e accessibilità". La grana SVG statica dà la materia senza costi di GPU; uno shader WebGL avrebbe aggiunto peso al primo caricamento su un sito che arriva soprattutto da telefono.

## Fase 3-4 — Motion e home

- **Preloader interamente in CSS** (2,2 s, saltabile con tocco o tasto, una volta per sessione via script inline in `<head>`): parte al primo disegno senza aspettare React e non ritarda l'LCP. Con "riduci movimento" non compare.
- **Motion token**: easing firma `sartoria` = `cubic-bezier(0.22, 1, 0.36, 1)`, `expo.out` per sipari e aperture, `uscita` per ciò che se ne va; durate 0.4 / 0.8 / 1.2 s; stagger 0.06-0.08 s (totale < 0.5 s). Si animano solo transform, opacity, clip-path e stroke-dashoffset.
- **Transizioni di pagina**: View Transitions API con apertura "a sipario" dal centro; fallback GSAP a due pannelli dove l'API manca; nessuna transizione con "riduci movimento".
- **Lenis + ScrollTrigger su un unico ticker GSAP**, disattivato con "riduci movimento".
- **Timeline verticale su telefono**: lo scorrimento orizzontale agganciato funziona anche col pollice, ma su uno schermo stretto la lettura verticale è più naturale; il filo diventa verticale.
- **Galleria cerimonia su telefono a scorrimento nativo** (scroll-snap) invece del pin orizzontale.
- **Le parole che si "accendono" partono dal 50% di opacità** (non dal 16%): così anche lo stato iniziale rispetta il contrasto minimo dei testi grandi.

## Fase 5 — Pagine interne

- **Ogni capo delle collezioni apre WhatsApp** con un messaggio che lo descrive ("Ho visto sul sito questo capo… È disponibile nella mia taglia?"): senza e-commerce è l'azione più utile. Nessun prezzo.
- **Filtri delle collezioni con categorie reali** del negozio (quotidiano, elegante, cerimonia, accessori; camicie e maglie, abiti e giacche, cerimonia, capispalla), animati con GSAP Flip.
- **Modulo contatti**: destinatario solo da variabile d'ambiente, invio tramite Resend se configurato; in sviluppo il messaggio va in console; in produzione senza configurazione risponde con errore e propone WhatsApp. Honeypot + scarto degli invii in meno di 1,5 s + limite di 5 messaggi ogni 10 minuti per IP.
- **"Come funziona la consulenza" in 3 passi**: testo scritto da noi su base reale (WhatsApp/telefono → appuntamento → prova con accessori). Da far confermare al cliente.

## Fase 6-7 — SEO, performance, accessibilità

- **Redirect 301** (non 308) per tutti gli alias WordPress, come chiesto dal brief. La sola rimozione della barra finale (`/collezioni/` → `/collezioni`) è il redirect permanente automatico di Next.js (308, equivalente per Google).
- **JSON-LD ClothingStore** con indirizzo, telefoni, orari certi (non la prima domenica, senza orario), P.IVA, social. Nessuna valutazione aggregata: abbiamo solo 3 recensioni dal vecchio sito.
- **Font ridotti ai caratteri del sito** (`scripts/subset-fonts.mjs`): da 324 KB a 40 KB al primo caricamento. Da rilanciare se si aggiungono testi con caratteri nuovi.
- **Motion layer in differita**: GSAP e Lenis arrivano dopo il load o alla prima interazione. Tutto ciò che è già sullo schermo quando arrivano resta visibile (nessun "lampo").
- **Titoli e poster dipinti al primo frame**: le animazioni d'ingresso non nascondono più l'elemento principale (si "assesta" invece di uscire da una maschera); i sipari sono pannelli sovrapposti, non ritagli.
- **Misure Lighthouse**: sono state fatte in locale con il throttling simulato standard (Lantern). In locale ogni risorsa termina quasi istantaneamente, quindi il modello conta come "prima dell'LCP" anche JS e font che su una rete vera arriverebbero dopo: l'LCP simulato (2,5-2,8 s) è più pessimista dell'LCP misurato con limitazione reale della rete (1,9-2,0 s). Riportati entrambi.
- **Porta 3100 occupata** da un'altra applicazione locale dell'utente: le verifiche usano la porta 3210 (non è stato toccato nulla dell'altra applicazione).
