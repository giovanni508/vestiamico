import Image from 'next/image';
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { home, img, whatsappHref } from '@/lib/content';
import { TagButton } from '@/components/ui/TagButton';
import { StitchLink } from '@/components/ui/StitchLink';
import { CeremonyFx } from './CeremonyFx';

// misure e posizioni volutamente diverse: una passerella, non una griglia
const LAYOUT = ['c-tall c-top', 'c-small c-bottom', 'c-mid c-center', 'c-small c-top', 'c-tall c-bottom', 'c-mid c-top', 'c-small c-center'];

/** Scena 5. Il giorno più importante: galleria orizzontale pinnata con parallasse interna. */
export function Ceremony() {
  const { cerimonia } = home;
  return (
    <section id="cerimonia" className="ceremony theme-notte grain" aria-labelledby="ceremony-title">
      <CeremonyFx>
        <div className="ceremony-track" data-cer-track>
          <div className="ceremony-intro">
            <h2 id="ceremony-title" className="ceremony-title font-display t-h2">
              {cerimonia.title}
            </h2>
            <p className="t-lead muted ceremony-body">{cerimonia.body}</p>
            <TagButton
              href={whatsappHref(cerimonia.cta.message)}
              external
              cursor="Scrivici"
              icon={<WhatsappLogoIcon size={20} aria-hidden="true" />}
              srSuffix="su WhatsApp (si apre in una nuova scheda)"
            >
              {cerimonia.cta.label}
            </TagButton>
          </div>
          <ul className="ceremony-gallery" aria-label="Abiti da cerimonia in negozio">
            {cerimonia.images.map((it, i) => {
              const image = img(it.key);
              return (
                <li key={it.key} className={`ceremony-item ${LAYOUT[i % LAYOUT.length]}`} data-cer-item data-cursor="Guarda">
                  <div className="ceremony-frame">
                    <div className="ceremony-inner" data-cer-inner>
                      <Image
                        src={image.src}
                        alt={it.alt}
                        fill
                        sizes="(min-width: 48rem) 30vw, 72vw"
                        placeholder="blur"
                        blurDataURL={image.blur}
                        quality={75}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="ceremony-outro">
            <p className="font-display t-h3">Matrimoni, battesimi, comunioni, cresime.</p>
            <StitchLink href="/abiti-da-cerimonia" cursor="Scopri">
              Tutto sugli abiti da cerimonia
            </StitchLink>
          </div>
        </div>
      </CeremonyFx>
    </section>
  );
}
