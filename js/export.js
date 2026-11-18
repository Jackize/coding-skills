import { renderMarkdown } from './markdown.js';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pick(dict, lang) {
  if (!dict || typeof dict !== 'object') return '';
  return dict[lang] ?? dict.en ?? dict.vn ?? '';
}

function listLines(items, lang) {
  const arr = items?.[lang] ?? items?.en ?? [];
  return arr.map((item) => `- ${item}`).join('\n');
}

function triggerDownload(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function buildMarkdown(section, lang) {
  const title = pick(section.title, lang);
  const body = pick(section.body, lang);
  const baselineLabel = lang === 'vn' ? 'Kiến thức nền' : 'Baseline';
  const skillsLabel = lang === 'vn' ? 'Kỹ năng đạt được' : 'Skills';
  const baseline = listLines(section.baseline, lang);
  const skills = listLines(section.skills, lang);
  return `# ${title}\n\n${body}\n\n## ${baselineLabel}\n\n${baseline}\n\n## ${skillsLabel}\n\n${skills}\n`;
}

export function downloadMarkdown(section, lang) {
  const md = buildMarkdown(section, lang);
  const slug = section.id || 'section';
  triggerDownload(`${slug}-${lang}.md`, new Blob([md], { type: 'text/markdown;charset=utf-8' }));
}

async function loadDiagramMarkup(diagramId) {
  if (!diagramId) return '';
  try {
    const res = await fetch(`assets/diagrams/${encodeURIComponent(diagramId)}.svg`);
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

export async function downloadHtml(section, lang) {
  const title = pick(section.title, lang);
  const bodyMd = pick(section.body, lang);
  const bodyHtml = renderMarkdown(bodyMd);
  const baselineItems = section.baseline?.[lang] ?? section.baseline?.en ?? [];
  const skillsItems = section.skills?.[lang] ?? section.skills?.en ?? [];
  const baselineLabel = lang === 'vn' ? 'Kiến thức nền' : 'Baseline';
  const skillsLabel = lang === 'vn' ? 'Kỹ năng đạt được' : 'Skills';
  const docsLabel = lang === 'vn' ? 'Tài liệu' : 'Documents';
  const demoLabel = lang === 'vn' ? 'Hình minh họa' : 'Demo graphic';
  const diagram = await loadDiagramMarkup(section.diagram);
  const baselineHtml = baselineItems.map((i) => `<li>${escapeHtml(i)}</li>`).join('');
  const skillsHtml = skillsItems.map((i) => `<li>${escapeHtml(i)}</li>`).join('');

  const html = `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:1.125rem;line-height:1.6;color:#1a1a1a;background:#f7f7f5;padding:2rem 1.25rem;max-width:42rem;margin-inline:auto}
  h1,h2{line-height:1.25} h2{margin-top:2rem}
  pre{overflow:auto;padding:1rem;background:#fff;border:1px solid #d4d4d0}
  code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:0.95em}
  .diagram{margin:1.25rem 0;max-width:100%} .diagram svg{max-width:100%;height:auto;display:block}
  ul{padding-left:1.25rem}
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<h2>${escapeHtml(docsLabel)}</h2>
<div class="docs">${bodyHtml}</div>
<h2>${escapeHtml(demoLabel)}</h2>
<div class="diagram">${diagram}</div>
<h2>${escapeHtml(baselineLabel)}</h2>
<ul>${baselineHtml}</ul>
<h2>${escapeHtml(skillsLabel)}</h2>
<ul>${skillsHtml}</ul>
</body>
</html>`;

  const slug = section.id || 'section';
  triggerDownload(`${slug}-${lang}.html`, new Blob([html], { type: 'text/html;charset=utf-8' }));
}
