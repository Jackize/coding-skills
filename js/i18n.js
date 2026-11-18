const STORAGE_KEY = 'coding-skills-lang';
const DEFAULT_LANG = 'en';

let buttonsWired = false;

export function getLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'vn') return stored;
  } catch {
    /* private mode */
  }
  return DEFAULT_LANG;
}

export function setLang(lang) {
  if (lang !== 'en' && lang !== 'vn') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode */
  }
  document.documentElement.lang = lang;
  refreshLangButtons();
  refreshDataI18n();
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function t(dict) {
  if (!dict || typeof dict !== 'object') return '';
  const lang = getLang();
  return dict[lang] ?? dict.en ?? dict.vn ?? '';
}

function refreshLangButtons() {
  const lang = getLang();
  document.querySelectorAll('#site-header button[data-lang]').forEach((btn) => {
    const on = btn.dataset.lang === lang;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function refreshDataI18n() {
  document.querySelectorAll('[data-i18n-en]').forEach((el) => {
    const en = el.getAttribute('data-i18n-en') ?? '';
    const vn = el.getAttribute('data-i18n-vn') ?? en;
    el.textContent = t({ en, vn });
  });
}

export function applyStaticI18n() {
  document.documentElement.lang = getLang();
  refreshLangButtons();
  if (!buttonsWired) {
    buttonsWired = true;
    document.querySelectorAll('#site-header button[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  }
  refreshDataI18n();
}