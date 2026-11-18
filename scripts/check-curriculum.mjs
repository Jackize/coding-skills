#!/usr/bin/env node
import { getCatalog } from '../js/catalog.js';
import { renderMarkdown } from '../js/markdown.js';
import fs from 'fs';
import path from 'path';

const MIN_EN = 400;
const MAX_EN = 1400;
const HEADINGS_EN = [
  '## Analysis',
  '## Requirements',
  '## Features',
  '## Tech choices',
  '## Design',
  '## Code',
  '## Deploy',
  '## Trade-offs',
  '## Failure modes',
  '## Practice',
];

let failed = false;
const { courses } = getCatalog();

for (const course of courses) {
  const n = course.sections.length;
  console.log(`\n${course.id}: ${n} sections`);
  if (n < 8) {
    console.error(`  FAIL: expected ≥8 sections, got ${n}`);
    failed = true;
  }
  for (const s of course.sections) {
    const words = s.body.en.trim().split(/\s+/).filter(Boolean).length;
    const vnWords = s.body.vn.trim().split(/\s+/).filter(Boolean).length;
    const missing = HEADINGS_EN.filter((h) => !s.body.en.includes(h));
    const hasBold = /\*\*[^*]+\*\*/.test(s.body.en);
    const diagram = path.join('assets/diagrams', `${s.diagram}.svg`);
    const hasSvg = fs.existsSync(diagram);
    const html = renderMarkdown(s.body.en);
    const boldRenders = html.includes('<strong>');
    const ok =
      words >= MIN_EN &&
      words <= MAX_EN &&
      missing.length === 0 &&
      hasSvg &&
      vnWords >= 300 &&
      hasBold &&
      boldRenders;
    console.log(
      `  ${ok ? 'OK' : 'FAIL'} ${s.id} en=${words} vn=${vnWords} svg=${hasSvg} headsMissing=${missing.length} bold=${hasBold && boldRenders}`,
    );
    if (!ok) failed = true;
  }
}

// Smoke inline markdown
const sample = renderMarkdown('Use **base62** encoding, *not* hashing.');
if (!sample.includes('<strong>base62</strong>') || !sample.includes('<em>not</em>')) {
  console.error('FAIL markdown bold/italic smoke');
  failed = true;
} else {
  console.log('\nmarkdown bold/italic smoke OK');
}

process.exit(failed ? 1 : 0);
