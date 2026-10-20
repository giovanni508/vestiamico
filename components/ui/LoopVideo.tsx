'use client';
// Video muto in loop: si carica solo quando entra nello schermo, si ferma quando esce,
// ha un pulsante di pausa e non parte da solo con prefers-reduced-motion o risparmio dati.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { VideoAsset } from '@/lib/content';

type Props = { video: VideoAsset; label: string; className?: string; sizes?: string; priority?: boolean };

// il poster è un'immagine ottimizzata sotto al video: a bassa priorità, tranne quando apre la pagina

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
    let loaded = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            loaded = true;
            v.preload = 'auto';
            v.load();
          }
          if (!pausedRef.current) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) v.pause();
    else {
      if (v.readyState === 0) v.load();
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
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>
      <button type="button" className="loop-video-btn" onClick={toggle} aria-pressed={paused}>
        <span className="hero-pause-icon" aria-hidden="true" data-paused={paused} />
        <span className="sr-only">{paused ? 'Riproduci il video' : 'Metti in pausa il video'}</span>
      </button>
    </div>
  );
}
