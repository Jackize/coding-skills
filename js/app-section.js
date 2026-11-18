import { getCatalog } from './catalog.js';
import { applyStaticI18n, getLang, t } from './i18n.js';
import { renderMarkdown } from './markdown.js';
import { downloadHtml, downloadMarkdown } from './export.js';

const LABELS = {
  documents: { en: 'Documents', vn: 'Tài liệu' },
  demo: { en: 'Demo graphic', vn: 'Hình minh họa' },
  baseline: { en: 'Baseline', vn: 'Kiến thức nền' },
  skills: { en: 'Skills gained', vn: 'Kỹ năng đạt được' },
  downloadMd: { en: 'Download Markdown', vn: 'Tải Markdown' },
  downloadHtml: { en: 'Download HTML', vn: 'Tải HTML' },
  sections: { en: 'In this course', vn: 'Trong khóa học' },
  notFound: { en: 'Section not found.', vn: 'Không tìm thấy phần học.' },
  back: { en: 'Back to course', vn: 'Về khóa học' },
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function findSection(courseId, sectionId) {
  const course = getCatalog().courses.find((c) => c.id === courseId);
  if (!course) return { course: undefined, section: undefined };
  const section = course.sections.find((s) => s.id === sectionId);
  return { course, section };
}

function listItems(arr) {
  return (arr || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderNav(course, sectionId) {
  const aside = document.querySelector('.section-sidebar');
  if (!aside || !course) {
    if (aside) aside.innerHTML = '';
    return;
  }
  const items = course.sections
    .map((s) => {
      const current = s.id === sectionId;
      const href = `section.html?course=${encodeURIComponent(course.id)}&section=${encodeURIComponent(s.id)}`;
      return `<li><a href="${href}"${current ? ' aria-current="page"' : ''}>${escapeHtml(t(s.title))}</a></li>`;
    })
    .join('');
  aside.innerHTML = `
    <p class="section-nav-label">${escapeHtml(t(LABELS.sections))}</p>
    <ul class="section-nav">${items}</ul>
    <p class="section-nav-back"><a href="course.html?id=${encodeURIComponent(course.id)}">${escapeHtml(t(LABELS.back))}</a></p>`;
}

function render() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course');
  const sectionId = params.get('section');
  const { course, section } = findSection(courseId, sectionId);
  const main = document.querySelector('.section-main');
  const actions = document.getElementById('section-actions');

  if (!course || !section) {
    document.title = 'Section — Coding Skills';
    renderNav(null, null);
    if (actions) actions.hidden = true;
    main.innerHTML = `<p role="status">${escapeHtml(t(LABELS.notFound))}</p>`;
    return;
  }

  document.title = `${t(section.title)} — Coding Skills`;
  renderNav(course, section.id);
  if (actions) actions.hidden = false;

  const lang = getLang();
  const baseline = section.baseline?.[lang] ?? section.baseline?.en ?? [];
  const skills = section.skills?.[lang] ?? section.skills?.en ?? [];
  const diagramSrc = section.diagram
    ? `assets/diagrams/${encodeURIComponent(section.diagram)}.svg`
    : '';

  main.innerHTML = `
    <h1>${escapeHtml(t(section.title))}</h1>
    <section class="section-block" aria-labelledby="docs-heading">
      <h2 id="docs-heading">${escapeHtml(t(LABELS.documents))}</h2>
      <div class="section-docs">${renderMarkdown(t(section.body))}</div>
    </section>
    <section class="section-block" aria-labelledby="demo-heading">
      <h2 id="demo-heading">${escapeHtml(t(LABELS.demo))}</h2>
      ${
        diagramSrc
          ? `<img class="section-diagram" src="${diagramSrc}" alt="${escapeHtml(t(section.title))} diagram">`
          : ''
      }
    </section>
    <section class="section-block" aria-labelledby="baseline-heading">
      <h2 id="baseline-heading">${escapeHtml(t(LABELS.baseline))}</h2>
      <ul>${listItems(baseline)}</ul>
    </section>
    <section class="section-block" aria-labelledby="skills-heading">
      <h2 id="skills-heading">${escapeHtml(t(LABELS.skills))}</h2>
      <ul>${listItems(skills)}</ul>
    </section>`;
}

function wireExports() {
  const mdBtn = document.getElementById('download-md');
  const htmlBtn = document.getElementById('download-html');
  mdBtn?.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const { section } = findSection(params.get('course'), params.get('section'));
    if (section) downloadMarkdown(section, getLang());
  });
  htmlBtn?.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const { section } = findSection(params.get('course'), params.get('section'));
    if (section) downloadHtml(section, getLang());
  });
}

applyStaticI18n();
render();
wireExports();
document.addEventListener('langchange', render);
