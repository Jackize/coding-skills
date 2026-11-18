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

function blockToHtml(block, fences) {
  const trimmed = block.trim();
  if (!trimmed) return '';

  // Fence-only block
  if (/^\x00FENCE\d+\x00$/.test(trimmed)) {
    return trimmed.replace(/\x00FENCE(\d+)\x00/g, (_, i) => fences[+i] ?? '');
  }

  const lines = trimmed.split('\n');

  // Single-line or multi-line heading-only first line then content handled below
  if (lines.length === 1) {
    const h = headingHtml(lines[0]);
    if (h) return h;
  }

  // Pure list block
  const nonEmpty = lines.filter((l) => l.trim());
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

  escaped = escaped.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) => {
    const id = fences.length;
    fences.push(`<pre><code>${code.replace(/\s+$/, '')}</code></pre>`);
    return `\x00FENCE${id}\x00`;
  });

  return escaped
    .split(/\n\n+/)
    .map((block) => blockToHtml(block, fences))
    .filter(Boolean)
    .join('\n');
}
