'use client';
// Video muto in loop: si carica solo quando entra nello schermo, si ferma quando esce,
// ha un pulsante di pausa e non parte da solo con prefers-reduced-motion o risparmio dati.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { VideoAsset } from '@/lib/content';

type Props = { video: VideoAsset; label: string; className?: string; sizes?: string; priority?: boolean };

// il poster è un'immagine ottimizzata sotto al video: a bassa priorità, tranne quando apre la pagina

// Le sorgenti si aggiungono solo quando il video deve partire (come nella hero): un <video> con <source>
// già nel markup può trattenere l'evento load della pagina (WebKit lo trattiene anche con preload="none").
function attachSources(v: HTMLVideoElement, video: VideoAsset) {
  if (v.querySelector('source')) return;
  const webm = document.createElement('source');
  webm.src = video.webm;
  webm.type = 'video/webm';
  const mp4 = document.createElement('source');
  mp4.src = video.mp4;
  mp4.type = 'video/mp4';
  v.append(webm, mp4);
}

export function LoopVideo({ video, label, className = '', sizes = '(min-width: 64rem) 34vw, 90vw', priority = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      pausedRef.current = true;
      const id = window.setTimeout(() => setPaused(true), 0);
      return () => window.clearTimeout(id);
    }
    // il primo caricamento parte solo a pagina caricata, per non rubare banda né ritardare il motion layer
    let loaded = false;
    let visible = false;
    let pageLoaded = document.readyState === 'complete';
    const start = () => {
      if (loaded || !visible || !pageLoaded) return;
      loaded = true;
      attachSources(v, video);
      v.preload = 'auto';
      v.load();
      if (!pausedRef.current) v.play().catch(() => {});
    };
    const onLoad = () => {
      pageLoaded = true;
      start();
    };
    if (!pageLoaded) window.addEventListener('load', onLoad, { once: true });
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) v.pause();
        else if (!loaded) start();
        else if (!pausedRef.current) v.play().catch(() => {});
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      window.removeEventListener('load', onLoad);
    };
  }, [video]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) v.pause();
    else {
      if (v.readyState === 0) {
        attachSources(v, video);
        v.load();
      }
      v.play().catch(() => {});
    }
  };

  return (
    <div className={`loop-video ${className}`}>
      <Image src={video.poster} alt="" fill sizes={sizes} quality={60} priority={priority} fetchPriority={priority ? 'high' : 'low'} className="loop-video-poster" />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className="loop-video-el"
        onPlaying={(e) => e.currentTarget.classList.add('is-playing')}
      />
      <button type="button" className="loop-video-btn" onClick={toggle} aria-pressed={paused}>
        <span className="hero-pause-icon" aria-hidden="true" data-paused={paused} />
        <span className="sr-only">{paused ? 'Riproduci il video' : 'Metti in pausa il video'}</span>
      </button>
    </div>
  );
}
