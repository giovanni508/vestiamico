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
