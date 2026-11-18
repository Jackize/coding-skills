import { getCatalog } from './catalog.js';
import { applyStaticI18n, t } from './i18n.js';

const NOT_FOUND = {
  en: 'Course not found.',
  vn: 'Không tìm thấy khóa học.',
};

const SECTIONS_HEADING = {
  en: 'Sections',
  vn: 'Phần học',
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  const id = new URLSearchParams(window.location.search).get('id');
  const course = id ? getCatalog().courses.find((c) => c.id === id) : undefined;
  const app = document.getElementById('app');

  if (!course) {
    document.title = 'Course — Coding Skills';
    app.innerHTML = `<p role="status">${escapeHtml(t(NOT_FOUND))}</p>`;
    return;
  }

  document.title = `${t(course.title)} — Coding Skills`;
  const sectionItems = course.sections
    .map(
      (section) => `
    <li>
      <a href="section.html?course=${encodeURIComponent(course.id)}&section=${encodeURIComponent(section.id)}">${escapeHtml(t(section.title))}</a>
    </li>`,
    )
    .join('');

  app.innerHTML = `
    <h1>${escapeHtml(t(course.title))}</h1>
    <p>${escapeHtml(t(course.summary))}</p>
    <h2>${escapeHtml(t(SECTIONS_HEADING))}</h2>
    <ul>
      ${sectionItems}
    </ul>`;
}

applyStaticI18n();
render();
document.addEventListener('langchange', render);