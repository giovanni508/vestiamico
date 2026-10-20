# Avanzamento

Per riprendere: leggere questo file e DECISIONS.md.

| Fase | Stato |
|------|-------|
| 1. Audit ed estrazione contenuti | ✅ |
| 2. Direzione creativa e design system | ✅ (DESIGN.md, /styleguide) |
| 3. Motion layer globale | ✅ |
| 4. Home (8 scene) | ✅ |
| 5. Pagine interne | ✅ |
| 6. SEO locale e tecnica | ✅ |
| 7. Ciclo di verifica | ✅ 3 cicli + revisione indipendente in 3 giri (CRITIQUE.md) |
| 8. Consegna | ✅ README, PRESENTAZIONE, TODO-cliente |

## Ultime misure (build di produzione, Lighthouse mobile, throttling simulato)

Home 95 · Collezioni 95 · Cerimonia 96 · Punto vendita 95 · Brand 96 · Contatti 96 · Privacy 97. Accessibilità, Best Practices, SEO: 100 ovunque. CLS 0. LCP simulato 2,5–2,9 s; con throttling reale DevTools 1,9–2,0 s.

## Aperto

- Revisione indipendente: ultimo rilievo (nodo del filo tagliato a 390 px) corretto nel CSS dopo l'ultima cattura; da riverificare con `node scripts/screenshots.mjs 390`.
- Dati da confermare col cliente: content/TODO-cliente.md.
