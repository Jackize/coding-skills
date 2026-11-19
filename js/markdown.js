function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Inline: code, then bold, then italic. Operates on already-escaped text. */
function inlineFormat(text) {
  let out = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  // Bold before italic so **a** wins over *a*
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  return out;
}

function headingHtml(line) {
  const m = line.match(/^(#{1,3})\s+(.+)$/);
  if (!m) return null;
  const level = m[1].length;
  return `<h${level}>${inlineFormat(m[2])}</h${level}>`;
}

function isListLine(line) {
  return /^(\s*)([-*]|\d+\.)\s+/.test(line);
}

function listItemMatch(line) {
  const m = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
  if (!m) return null;
  return { indent: m[1].length, ordered: /^\d+\./.test(m[2]), text: m[3] };
}

/** Build nested ul/ol from consecutive list lines. */
function listToHtml(lines) {
  const root = { type: null, items: [], children: null };
  const stack = [{ indent: -1, node: root }];

  for (const line of lines) {
    const item = listItemMatch(line);
    if (!item) continue;
    while (stack.length > 1 && item.indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].node;
    if (!parent.type) parent.type = item.ordered ? 'ol' : 'ul';
    const entry = { text: item.text, type: null, items: [] };
    parent.items.push(entry);
    stack.push({ indent: item.indent, node: entry });
  }

  function render(node) {
    if (!node.items.length) return '';
    const tag = node.type || 'ul';
    const inner = node.items
      .map((it) => {
        const nested = render(it);
        return `<li>${inlineFormat(it.text)}${nested}</li>`;
      })
      .join('');
    return `<${tag}>${inner}</${tag}>`;
  }

  return render(root);
}

/* --------------------------------------------------------------------------
   Tables
   -------------------------------------------------------------------------- */

function isTableRow(line) {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isTableSep(line) {
  return /^\s*\|[\s:|-]+\|\s*$/.test(line);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => inlineFormat(cell.trim()));
}

function tableToHtml(lines) {
  const rows = lines.filter((l) => l.trim());
  const head = splitTableRow(rows[0]);
  const body = rows.slice(2).map(splitTableRow);
  const thead = `<thead><tr>${head.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${body
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;
  return `<div class="table-wrap"><table class="cmp-table">${thead}${tbody}</table></div>`;
}

/* --------------------------------------------------------------------------
   Containers: :::type [title] ... ::: (callouts, pros/cons cards)
   -------------------------------------------------------------------------- */

const CONTAINER_TYPES = new Set(['note', 'tip', 'warning', 'info', 'pros', 'cons']);

function svgIcon(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

const ICONS = {
  pros: svgIcon(
    '<path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path><path d="M7 10v12"></path>'
  ),
  cons: svgIcon(
    '<path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"></path><path d="M17 14V2"></path>'
  ),
  note: svgIcon(
    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path>'
  ),
  tip: svgIcon('<path d="M20 6 9 17l-5-5"></path>'),
  warning: svgIcon(
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>'
  ),
  info: svgIcon('<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'),
};

const DEFAULT_TITLE = { pros: 'Pros', cons: 'Cons' };

/**
 * Replace :::type ... ::: containers with \x00BOXn\x00 placeholders, each
 * isolated on its own line. Handles nesting via depth tracking.
 */
function extractContainers(text) {
  const boxes = [];
  let out = '';
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const open = lines[i].match(/^:::([a-z]+)(?:[ \t]+(.*))?[ \t]*$/);
    if (open && CONTAINER_TYPES.has(open[1])) {
      const type = open[1];
      const title = (open[2] || '').trim();
      const body = [];
      let depth = 1;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (/^:::[ \t]*$/.test(l)) {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        } else {
          const nested = l.match(/^:::([a-z]+)(?:[ \t]+(.*))?[ \t]*$/);
          if (nested && CONTAINER_TYPES.has(nested[1])) depth++;
        }
        body.push(l);
        i++;
      }
      const id = boxes.length;
      boxes.push({ type, title, inner: body.join('\n') });
      out += `\n\n\x00BOX${id}\x00\n\n`;
      continue;
    }
    out += lines[i] + '\n';
    i++;
  }
  return { text: out, boxes };
}

function prosConsCard(type, title, bodyHtml) {
  const heading = title || DEFAULT_TITLE[type];
  return (
    `<div class="pc-card pc-card--${type}">` +
    `<div class="pc-card__head"><span class="pc-card__icon">${ICONS[type]}</span>` +
    `<h3 class="pc-card__title">${inlineFormat(heading)}</h3></div>` +
    `<div class="pc-card__body">${bodyHtml}</div></div>`
  );
}

function renderProsCons(pros, cons, fences, boxes) {
  const prosHtml = renderBlocks(pros.inner, fences, boxes);
  const consHtml = renderBlocks(cons.inner, fences, boxes);
  return `<div class="pros-cons">${prosConsCard('pros', pros.title, prosHtml)}${prosConsCard('cons', cons.title, consHtml)}</div>`;
}

function renderCallout(box, fences, boxes) {
  const bodyHtml = renderBlocks(box.inner, fences, boxes);
  const icon = ICONS[box.type] || ICONS.info;
  const label = box.title ? `<h3 class="callout__title">${inlineFormat(box.title)}</h3>` : '';
  return (
    `<div class="callout callout--${box.type}">` +
    `<div class="callout__head"><span class="callout__icon">${icon}</span>${label}</div>` +
    `<div class="callout__body">${bodyHtml}</div></div>`
  );
}

/** Returns the box index if `block` is exactly a \x00BOXn\x00 placeholder. */
function boxIdOf(block) {
  const m = block.trim().match(/^\x00BOX(\d+)\x00$/);
  return m ? +m[1] : null;
}

/** Split already-escaped markdown into blocks and render them, pairing pros+cons. */
function renderBlocks(text, fences, boxes) {
  const blocks = text.split(/\n\n+/);
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const id = boxIdOf(blocks[i]);
    if (id != null) {
      const cur = boxes[id];
      const nextId = i + 1 < blocks.length ? boxIdOf(blocks[i + 1]) : null;
      const next = nextId != null ? boxes[nextId] : null;

      if (cur.type === 'pros' && next && next.type === 'cons') {
        out.push(renderProsCons(cur, next, fences, boxes));
        i++;
        continue;
      }
      if (cur.type === 'cons' && next && next.type === 'pros') {
        out.push(renderProsCons(next, cur, fences, boxes));
        i++;
        continue;
      }
      if (cur.type === 'pros' || cur.type === 'cons') {
        out.push(prosConsCard(cur.type, cur.title, renderBlocks(cur.inner, fences, boxes)));
      } else {
        out.push(renderCallout(cur, fences, boxes));
      }
      continue;
    }
    out.push(renderBlock(blocks[i], fences));
  }
  return out.filter(Boolean).join('\n');
}

function renderBlock(block, fences) {
  const trimmed = block.trim();
  if (!trimmed) return '';

  // Fence-only block
  if (/^\x00FENCE\d+\x00$/.test(trimmed)) {
    return trimmed.replace(/\x00FENCE(\d+)\x00/g, (_, i) => fences[+i] ?? '');
  }

  const lines = trimmed.split('\n');

  // Single-line heading or image
  if (lines.length === 1) {
    const h = headingHtml(lines[0]);
    if (h) return h;
    const img = lines[0].match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) {
      return `<img class="section-diagram inline-diagram" src="${img[2]}" alt="${img[1]}">`;
    }
  }

  // Table block (header + separator + rows)
  const nonEmpty = lines.filter((l) => l.trim());
  if (nonEmpty.length >= 2 && isTableSep(nonEmpty[1]) && nonEmpty.every(isTableRow)) {
    return tableToHtml(nonEmpty);
  }

  // Pure list block
  if (nonEmpty.length && nonEmpty.every(isListLine)) {
    return listToHtml(nonEmpty);
  }

  // Heading as first line, rest as following content in same block
  const firstHeading = headingHtml(lines[0]);
  if (firstHeading && lines.length > 1) {
    const rest = lines.slice(1).join('\n').trim();
    if (!rest) return firstHeading;
    if (rest.split('\n').filter((l) => l.trim()).every(isListLine)) {
      return firstHeading + '\n' + listToHtml(rest.split('\n').filter((l) => l.trim()));
    }
    return firstHeading + '\n' + `<p>${inlineFormat(rest.replace(/\n/g, '<br>\n'))}</p>`;
  }

  const withBreaks = inlineFormat(trimmed.replace(/\n/g, '<br>\n'));
  return `<p>${withBreaks.replace(/\x00FENCE(\d+)\x00/g, (_, i) => fences[+i] ?? '')}</p>`;
}

export function renderMarkdown(md) {
  if (md == null || md === '') return '';

  const fences = [];
  let escaped = escapeHtml(String(md).trim());

  // 1. Code fences (``` and ~~~) — before containers so ":::" inside code is safe.
  escaped = escaped.replace(/(```|~~~)[^\n]*\n([\s\S]*?)\1/g, (_match, _marker, code) => {
    const id = fences.length;
    fences.push(`<pre><code>${code.replace(/\s+$/, '')}</code></pre>`);
    return `\x00FENCE${id}\x00`;
  });

  // 2. Containers (: : :type ... : : :) — may span blank lines.
  const { text, boxes } = extractContainers(escaped);

  // 3. Render blocks, resolving boxes recursively.
  return renderBlocks(text, fences, boxes);
}
