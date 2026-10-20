// Renderer Markdown minimale per i testi legali (titoli, paragrafi, elenchi, grassetto, link).
import fs from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';

export function readMarkdown(file: string) {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content', file), 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const meta: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const [k, ...v] = line.split(':');
      meta[k.trim()] = v.join(':').trim();
    }
  }
  return { meta, body: match ? raw.slice(match[0].length) : raw };
}

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|(https?:\/\/[^\s)]+[^\s).,])|([\w.+-]+@[\w-]+\.[\w.]+[a-z])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={`${key}-b${i}`}>{m[1]}</strong>);
    else if (m[2]) out.push(<a key={`${key}-a${i}`} href={m[2]}>{m[2].replace(/^https?:\/\//, '')}</a>);
    else if (m[3]) out.push(<a key={`${key}-e${i}`} href={`mailto:${m[3]}`}>{m[3]}</a>);
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export type TocItem = { id: string; title: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function renderMarkdown(body: string): { nodes: ReactNode[]; toc: TocItem[] } {
  const blocks = body.trim().split(/\n{2,}/);
  const nodes: ReactNode[] = [];
  const toc: TocItem[] = [];
  blocks.forEach((block, i) => {
    const key = `b${i}`;
    if (block.startsWith('### ')) {
      nodes.push(<h3 key={key}>{inline(block.slice(4), key)}</h3>);
    } else if (block.startsWith('## ')) {
      const title = block.slice(3);
      const id = slugify(title);
      toc.push({ id, title });
      nodes.push(
        <h2 key={key} id={id}>
          {inline(title, key)}
        </h2>,
      );
    } else if (block.split('\n').every((l) => l.startsWith('- '))) {
      nodes.push(
        <ul key={key}>
          {block.split('\n').map((l, j) => (
            <li key={`${key}-${j}`}>{inline(l.slice(2), `${key}-${j}`)}</li>
          ))}
        </ul>,
      );
    } else {
      nodes.push(<p key={key}>{inline(block.replace(/\n/g, ' '), key)}</p>);
    }
  });
  return { nodes, toc };
}
