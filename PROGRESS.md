# Avanzamento

Per riprendere il lavoro dopo un'interruzione: leggere questo file e DECISIONS.md, poi continuare dalla fase "in corso".

| Fase | Stato | Note |
|------|-------|------|
| 1. Audit ed estrazione contenuti | ✅ completata | AUDIT.md, content/*.json, content/legal/*.md, media ottimizzati in public/media, mappa OSM |
| 2. Direzione creativa e design system | ⏳ in corso | |
| 3. Motion layer globale | ⬜ da fare | |
| 4. Home (8 scene) | ⬜ da fare | |
| 5. Pagine interne | ⬜ da fare | |
| 6. SEO locale e tecnica | ⬜ da fare | |
| 7. Ciclo di verifica | ⬜ da fare | |
| 8. Consegna | ⬜ da fare | |

## Fase 1 — dettaglio

- Pagine estratte: home, collezioni, abiti-da-cerimonia, punto-vendita, brand, contatti, privacy-policy, cookie-policy-ue.
- Media: 141 immagini → `public/media/img/` (max 1600 px, JPEG progressivo) con dimensioni e blur in `content/media.json`; 7 video → `public/media/video/` (MP4 + WebM + poster).
- Script: `scripts/process-media.mjs` (media), `scripts/build-map.mjs` (mappa), `scripts/check-content.mjs` (verifica riferimenti).
