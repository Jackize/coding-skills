import { getCatalog } from './catalog.js';
import { applyStaticI18n, t } from './i18n.js';

const INTRO = {
  en: 'Sample lessons on design patterns, system design, and Docker—switch EN or VN above.',
  vn: 'Bài mẫu về design patterns, thiết kế hệ thống và Docker—chọn EN hoặc VN ở trên.',
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  const { courses } = getCatalog();
  const items = courses
    .map(
      (course) => `
    <li>
      <a href="course.html?id=${encodeURIComponent(course.id)}">${escapeHtml(t(course.title))}<br>${escapeHtml(t(course.summary))}</a>
    </li>`,
    )
    .join('');

  document.getElementById('app').innerHTML = `
    <h1>Coding Skills</h1>
    <p>${escapeHtml(t(INTRO))}</p>
    <ul>
      ${items}
    </ul>`;
}

applyStaticI18n();
render();
document.addEventListener('langchange', render);