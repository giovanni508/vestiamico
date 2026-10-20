'use client';
// Coordina la fine del preloader con le animazioni d'ingresso.
// Lo script inline in <head> aggiunge la classe `intro-done` su <html>
// subito (visita già vista / reduced motion) oppure dopo ~1,65 s.

export const INTRO_EVENT = 'vestiamico:intro-done';

export function isIntroDone() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('intro-done');
}

export function finishIntro() {
  const html = document.documentElement;
  if (html.classList.contains('intro-done')) return;
  const w = window as unknown as { __introTimer?: number };
  if (w.__introTimer) window.clearTimeout(w.__introTimer);
  html.classList.add('intro-done');
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** Esegue `cb` quando l'intro è finita (subito se lo è già). Ritorna la funzione di pulizia. */
export function onIntroDone(cb: () => void): () => void {
  if (isIntroDone()) {
    cb();
    return () => {};
  }
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cb();
  };
  const observer = new MutationObserver(() => {
    if (isIntroDone()) run();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener(INTRO_EVENT, run);
  const fallback = window.setTimeout(run, 3000);
  return () => {
    observer.disconnect();
    window.removeEventListener(INTRO_EVENT, run);
    window.clearTimeout(fallback);
  };
}

/** Script inline per <head>: deve girare prima del primo paint. */
export const INTRO_SCRIPT = `(function(){var F=function(){document.documentElement.classList.add('fonts-late')};var L=function(){setTimeout(F,1200)};if(document.readyState==='complete')L();else addEventListener('load',L);['pointerdown','keydown','wheel','touchstart'].forEach(function(e){addEventListener(e,F,{once:true,passive:true})});var d=document.documentElement;d.classList.add('js');var r=false;try{r=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}var s=null;try{s=sessionStorage.getItem('vestiamico-intro')}catch(e){}if(r||s){d.setAttribute('data-intro','seen');d.classList.add('intro-done')}else{d.setAttribute('data-intro','play');try{sessionStorage.setItem('vestiamico-intro','1')}catch(e){}window.__introTimer=setTimeout(function(){d.classList.add('intro-done');window.dispatchEvent(new Event('vestiamico:intro-done'))},1650)}})();`;
