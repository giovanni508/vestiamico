import { readMarkdown, renderMarkdown } from '@/lib/markdown';
import { site } from '@/lib/content';

/** Testi legali: misura di lettura comoda, indice laterale su desktop. */
export function LegalPage({ file, title }: { file: string; title: string }) {
  const { meta, body } = readMarkdown(file);
  const { nodes, toc } = renderMarkdown(body);
  return (
    <>
      <section className="page-hero page-hero--legal theme-notte grain">
        <div className="wrap">
          <h1 className="page-hero-title font-display t-display">
            <span className="mask-rise">
              <span>{title}</span>
            </span>
          </h1>
          <p className="t-small muted legal-meta">
            {meta.updated}. Titolare: {site.legalName}, P.IVA {site.vat}.
          </p>
        </div>
      </section>
      <section className="legal theme-avorio">
        <div className="wrap legal-grid">
          {toc.length > 2 && (
            <nav className="legal-toc" aria-label="Indice">
              <p className="legal-toc-title font-display">Indice</p>
              <ol>
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <article className="legal-body">{nodes}</article>
        </div>
      </section>
    </>
  );
}
