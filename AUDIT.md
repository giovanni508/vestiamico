# Audit del sito attuale — vestiamico.it

Analisi del 20 ottobre 2026 su https://vestiamico.it (WordPress + Elementor, tema con template "local services" e "home interior design").

## Problemi

### Errori visibili ai clienti

| # | Problema | Dove | Impatto |
|---|----------|------|---------|
| 1 | Banner "Chiusi per ferie dal 17 al 22 Agosto" ancora online a ottobre | Home, in testa | Il cliente pensa che il negozio sia chiuso o che il sito sia abbandonato |
| 2 | Link del footer "Contatti" che puntano a `library.elementor.com/local-services-wireframe-1-flexbox/services/#service_2/3/5` | Footer di tutte le pagine (indirizzo, telefono, email) | Toccare il telefono o l'email porta su un sito di template, non chiama e non scrive |
| 3 | Banner cookie con segnaposto non risolti: `Gestisci {vendor_count} fornitori`, tre `{title}` | Tutte le pagine | Aspetto rotto proprio nel primo elemento che si vede; dubbi sulla conformità GDPR |
| 4 | Copyright "©+2026+All+Rights+Reserved." con i "+" al posto degli spazi e in inglese | Footer | Sciatteria evidente |
| 5 | Icone TikTok e YouTube con `href="#"` | Footer | Link morti: il cliente tocca e non succede nulla |
| 6 | Email diversa tra footer (`info@vestiamico.com`) e pagina Contatti (`info@vestiamico.it`) | Footer / Contatti | Una delle due probabilmente non riceve posta |
| 7 | Stessa immagine Klarna ripetuta nelle sezioni Donna e Uomo della home | Home | Ripetizione che sembra un errore e toglie spazio alle foto |
| 8 | CAP diverso: 90124 (Contatti) e 90125 (link Google Maps) | Contatti / mappa | Incoerenza nei dati di base (OpenStreetMap indica 90124) |
| 9 | Emoji usate come icone (☎ ✉ 🕒) caricate da `s.w.org` | Contatti | Resa diversa su ogni dispositivo, richiesta esterna inutile |
| 10 | Refusi: "rappresentare l'essenza di della nostra boutique", "Ls qualità", "all''utilizzo" | Brand, recensioni, privacy | Cura percepita più bassa |
| 11 | Il modulo contatti è ripetuto nel footer di ogni pagina | Tutte le pagine | Footer pesante; il form compete con WhatsApp, il canale principale |

### Tecnica, SEO e accessibilità

- Pagine pesanti (93–122 KB di solo HTML, decine di CSS/JS Elementor), video `Lo-Store.mp4` da 20 MB caricato in home.
- Media library piena di file del template: `Home_Interior_Design-*`, `placeholder-*`, foto "OurDesigners" (12 file estranei al negozio).
- Immagini senza `alt` (tutte quelle di contenuto in home).
- Gerarchia titoli confusa: H4 vuoti, H5 vuoti, più H1 per pagina, titoli usati come decorazione.
- Cookie policy che elenca WordPress, Elementor, reCAPTCHA, YouTube, Google Maps "scopo in attesa di indagine": incoerente con ciò che il sito usa davvero.
- Nessun dato strutturato LocalBusiness/ClothingStore, nessuna informazione su orari nei metadati.
- Video con controlli nativi e senza poster: schermate nere su mobile finché non parte il caricamento.

### Design ed esperienza

- Sembra un template generico: sezioni tutte uguali (titolo + paragrafo + immagine), caroselli, card standard. Niente racconta i 66 anni di storia, la famiglia, Palermo.
- Il logo oro e il wordmark in stile Bodoni non dialogano con il resto: tipografia di sistema, colori casuali.
- La forza del negozio (dal capo economico al firmato, taglie 38–60 fino alla 7XL, cerimonia su due piani, consulenza) è sepolta nei paragrafi.
- WhatsApp, il canale principale, è un'icona piccola nell'header.
- Gli orari sono solo nella pagina Contatti, scritti con le emoji.

## Opportunità

1. **Raccontare la storia**: "Dal 1960" è un patrimonio che nessun concorrente può copiare. Un contatore 1960 → 2026 e una timeline di famiglia lo rendono tangibile.
2. **Il filo come segno grafico**: un filo d'oro (dal logo) che cuce le sezioni — dalla schermata di apertura al footer — dà unità e memoria al sito.
3. **Taglie come messaggio di inclusività**: un righello sartoriale 38 → 60 trasforma un dettaglio tecnico in un valore.
4. **Cerimonia come porta d'ingresso**: è il motivo principale per cui si cerca un negozio come questo; merita una sezione immersiva e una CTA di consulenza con messaggio WhatsApp già scritto.
5. **WhatsApp ovunque, con discrezione**: pulsante sticky dopo la hero e CTA con messaggi precompilati diversi per contesto.
6. **Orari intelligenti**: indicatore "Aperto ora / Chiuso" calcolato sull'ora di Roma, con le aperture della prima domenica e di dicembre, e avvisi che scadono da soli.
7. **Mappa propria**: mappa stilizzata generata da OpenStreetMap, nei colori del brand, senza cookie di Google; "Portami lì" apre la navigazione.
8. **SEO locale**: JSON-LD ClothingStore con indirizzo, telefoni e orari; titoli con "Palermo"; redirect 301 dagli URL attuali.
9. **Performance**: video brevi in loop (370 KB–1,5 MB invece di 20 MB), immagini responsive, font self-hosted.
10. **Contenuti pronti per WordPress headless**: testi in JSON/Markdown con struttura stabile, così in futuro possono arrivare dalla REST API.

## Cosa portiamo nel nuovo sito

Tutti i testi reali (riscritti solo nei microtesti), le 3 recensioni vere, i 7 brand con i loro loghi, le foto del negozio, i video (ricompressi), gli orari reali, i dati societari (Ingromoda s.r.l., P.IVA 03761640824), privacy e cookie policy riformattate.
