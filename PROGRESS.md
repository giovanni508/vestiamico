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

## Ultime misure (20 ottobre 2026, build di produzione, Lighthouse 13 mobile)

Throttling simulato (il valore di riferimento di Lighthouse): Home 94 · Collezioni 94 · Cerimonia 94 · Punto vendita 94 · Brand 96 · Contatti 94 · Privacy 96. Accessibilità, Best Practices, SEO: 100 ovunque. CLS 0. LCP simulato 2,7–3,0 s.

Throttling reale DevTools (rete e CPU limitate davvero): Home 85 · Collezioni 86 · Contatti 92, LCP 2,0–2,1 s. LCP osservato senza limitazioni: ~170 ms.

Il criterio "LCP < 2,5 s" è rispettato con il throttling reale, non con la stima simulata: vedi DECISIONS.md, "Limite residuo dell'LCP simulato".

Altre verifiche dell'ultimo giro: tsc, eslint e build puliti; 0 overflow, 0 errori di console, 0 richieste fallite a 390/768/1440/1920 px (l'unico 404 è quello voluto della pagina inesistente); controlli di accessibilità e motion tutti superati.

## Aperto

- Dati da confermare col cliente: content/TODO-cliente.md.
- Prima del dominio di produzione: provare i redirect 301 sul vecchio sito (elenco in README) e configurare l'invio email del modulo (variabili in .env.example).
