# Da chiedere al cliente

Elenco di tutto ciò che manca o va confermato. Il sito funziona già senza questi dati: dove un'informazione non c'era, l'abbiamo omessa invece di inventarla.

## Dati da confermare (priorità alta)

- [ ] **Email corretta**: sul vecchio sito compaiono sia `info@vestiamico.it` (pagina Contatti) sia `info@vestiamico.com` (footer). Nel nuovo sito usiamo **info@vestiamico.it** (stesso dominio del sito). Confermare quale casella riceve davvero la posta.
- [ ] **CAP**: la pagina Contatti dice 90124, il link Google Maps del vecchio sito 90125. OpenStreetMap indica **90124** per Via dell'Orsa Minore: lo usiamo, da confermare.
- [ ] **Posizione esatta del civico 69** sulla mappa (oggi il pin è sulla via, non sul civico) e coordinate per Google Business Profile.
- [ ] **Orari della prima domenica del mese**: il vecchio sito dice solo "aperti tutte le prime domeniche del mese", senza orari. L'indicatore "Aperto ora" in quelle domeniche dice "Oggi siamo aperti" senza fascia oraria.
- [ ] **Domeniche di dicembre**: confermare che anche nel 2026 siete aperti tutte le domeniche 10:00–13:00 / 16:00–20:00 (l'avviso compare dal 25 novembre, file `content/announcements.json`).
- [ ] **Chiusure e ferie 2026/2027**: comunicarle per aggiornare `site.json > hours.closures` e gli avvisi.
- [ ] **Indirizzo email del modulo contatti**: a quale casella devono arrivare i messaggi del form (variabile `CONTACT_TO_EMAIL`) e quale servizio di invio usare (vedi README).

## Storia di famiglia (per la timeline "Dal 1960")

Oggi la timeline usa solo fatti presenti sul vecchio sito (1960, tre generazioni, due piani in Via dell'Orsa Minore, spedizioni in Europa). Ci servono:
- [ ] Nome del fondatore/fondatrice e dove si trovava il primo negozio.
- [ ] Anni in cui sono entrate la seconda e la terza generazione (e i loro nomi, se volete citarli).
- [ ] Anno di apertura del negozio di Via dell'Orsa Minore 69 e di eventuali altri punti vendita (il vecchio sito parla di "punti vendita" al plurale).
- [ ] Anno di inizio delle spedizioni in Europa.
- [ ] Foto d'archivio (anni '60–'90) del negozio o della famiglia: sarebbero il cuore emotivo della sezione.

## Foto e video

- [ ] **Shooting reale in alta risoluzione**: molte immagini di collezione del vecchio sito hanno una resa da stock/generata e risoluzione bassa (circa 900×1150 px). Servono foto vere dei capi in negozio e indossati, almeno 2000 px sul lato lungo.
- [ ] **Video orizzontali o 4K**: tutti i video attuali sono verticali e a bassa risoluzione (max 720×1280). Per la hero desktop servirebbe un video orizzontale di 15–20 secondi (sfilata, negozio, dettagli sartoriali).
- [ ] Il video notturno della facciata (`Boutique-Vestiamico.mp4`) ha il watermark TikTok: serve l'originale senza watermark.
- [ ] Ritratti della famiglia / dello staff (con liberatoria) per la pagina Punto vendita.

## Brand

- [ ] Elenco ufficiale e aggiornato dei brand presenti (oggi: Barbarella, Laura Biagiotti, Romeo Gigli, Navigare, Il Granchio, Effebi, Malagrida) e conferma che si possano mostrare i loghi.
- [ ] Loghi in formato vettoriale (SVG/PDF) di ogni brand: quelli attuali sono JPG su sfondo pieno.
- [ ] Una riga di descrizione approvata per ogni brand (oggi mostriamo solo ciò che è scritto sui loghi).
- [ ] Le "nuove proposte emergenti" citate nella pagina Brand: quali sono?

## Social

- [ ] **TikTok e YouTube**: sul vecchio sito le icone non puntavano da nessuna parte. Se gli account esistono, inviare gli indirizzi (il video della facciata mostra un watermark TikTok). Per ora sono stati rimossi.
- [ ] Confermare Instagram `@vestiamico` e la pagina Facebook `VESTIAMICO`.

## Recensioni

- [ ] Link alla scheda Google Business Profile per mostrare valutazione e numero di recensioni reali (oggi pubblichiamo solo le 3 presenti sul vecchio sito).

## Legale

- [ ] Far validare a chi segue la privacy aziendale la **Cookie Policy** aggiornata: la sezione 6 ora descrive le tecnologie del nuovo sito (nessun cookie statistico o di marketing attivo).
- [ ] Privacy Policy: aggiungere un paragrafo specifico sul modulo contatti (dati raccolti: nome, email, telefono facoltativo, messaggio) se il consulente lo ritiene necessario.

## Futuro e messa online

- [ ] **E-commerce**: c'è l'intenzione di vendere online? Il sito è pronto per crescere (contenuti separati dal codice), ma un catalogo con prezzi e carrello va progettato a parte.
- [ ] **WordPress come pannello contenuti**: se volete aggiornare testi e foto da WordPress, i file in `content/` hanno già la struttura per essere letti dalla REST API.
- [ ] Accesso a **DNS/hosting** del dominio vestiamico.it e a **Google Search Console** per pubblicare con i redirect 301 senza perdere posizionamento.
- [ ] Accesso a **Google Business Profile** per allineare orari, foto e link al nuovo sito.
