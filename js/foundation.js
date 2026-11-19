/* ==========================================================================
   foundation.js — theme toggle wiring
   Skill package: "foundation" (visual foundation)

   The initial theme is applied by a tiny inline script in each page <head>
   (to avoid a flash of the wrong theme). This file only wires the toggle
   button and persists the choice. It is a plain script (no imports) so it
   works on every page, including 404.html.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'coding-skills-theme';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function toggle() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* private mode — theme still toggles for this session */
    }
    setTheme(next);
  }

  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', toggle);
    btn.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false');
  }
})();
