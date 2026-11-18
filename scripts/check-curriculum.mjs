#!/usr/bin/env node
import { getCatalog } from '../js/catalog.js';
import fs from 'fs';
import path from 'path';

const MIN_EN = 1500;
const HEADINGS = [
  '## Why this matters',
  '## Mental model',
  '## Walkthrough',
  '## Pitfalls & trade-offs',
  '## Practice / exercises',
];

let failed = false;
const { courses } = getCatalog();

for (const course of courses) {
  const n = course.sections.length;
  console.log(`\n${course.id}: ${n} sections`);
  if (n < 8 || n > 10) {
    console.error(`  FAIL: expected 8–10 sections, got ${n}`);
    failed = true;
  }
  for (const s of course.sections) {
    const words = s.body.en.trim().split(/\s+/).filter(Boolean).length;
    const vnWords = s.body.vn.trim().split(/\s+/).filter(Boolean).length;
    const missing = HEADINGS.filter((h) => !s.body.en.includes(h) || !s.body.vn.includes(h));
    const diagram = path.join('assets/diagrams', `${s.diagram}.svg`);
    const hasSvg = fs.existsSync(diagram);
    const ok = words >= MIN_EN && missing.length === 0 && hasSvg && vnWords >= 800;
    console.log(
      `  ${ok ? 'OK' : 'FAIL'} ${s.id} en=${words} vn=${vnWords} svg=${hasSvg} missingHeads=${missing.length}`,
    );
    if (!ok) failed = true;
  }
}

process.exit(failed ? 1 : 0);
