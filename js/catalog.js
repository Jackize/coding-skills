/** @typedef {{ en: string, vn: string }} LocaleText */
/** @typedef {{ en: string[], vn: string[] }} LocaleList */
/** @typedef {{ id: string, title: LocaleText, baseline: LocaleList, skills: LocaleList, diagram: string, body: LocaleText }} SectionMeta */
/** @typedef {{ id: string, title: LocaleText, summary: LocaleText, sections: SectionMeta[] }} Course */

import { designPatterns } from './content/design-patterns.js';
import { systemDesign } from './content/system-design.js';
import { docker } from './content/docker.js';

/** @type {Course[]} */
const courses = [designPatterns, systemDesign, docker];

export function getCatalog() {
  return { courses };
}
