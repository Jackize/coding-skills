function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineCode(text) {
  return text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
}

function blockToHtml(block, fences) {
  const trimmed = block.trim();
  if (!trimmed) return '';

  const fenceOnly = trimmed.replace(/\x00FENCE(\d+)\x00/g, (_, i) => fences[+i] ?? '');
  if (fenceOnly !== trimmed && !trimmed.match(/^#{1,3}\s/m) && !trimmed.startsWith('- ')) {
    return fenceOnly;
  }

  const lines = trimmed.split('\n');
  if (lines.length === 1) {
    const h = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (h) {
      const level = h[1].length;
      return `<h${level}>${inlineCode(h[2])}</h${level}>`;
    }
  }

  const listLines = lines.filter((l) => l.trim());
  if (listLines.length && listLines.every((l) => /^-\s/.test(l))) {
    const items = listLines
      .map((l) => `<li>${inlineCode(l.replace(/^-\s+/, ''))}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  }

  const withBreaks = inlineCode(trimmed.replace(/\n/g, '<br>\n'));
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