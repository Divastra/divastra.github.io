/* ── Divastra Theme System ── */
(function () {

  /* Dark-mode variable overrides applied as inline styles on <html>
     so they beat every stylesheet regardless of specificity or source order */
  var DARK_VARS = {
    '--bg':           '#0f172a',
    '--bg-subtle':    '#1e293b',
    '--bg-muted':     '#334155',
    '--text':         '#f1f5f9',
    '--text-muted':   '#94a3b8',
    '--text-light':   '#64748b',
    '--accent-light': 'rgba(8,145,178,.12)',
    '--accent-border':'rgba(8,145,178,.28)',
    '--border':       'rgba(255,255,255,.08)',
    '--border-hover': 'rgba(255,255,255,.14)',
    '--shadow-xs':    '0 1px 2px rgba(0,0,0,.3)',
    '--shadow-sm':    '0 1px 3px rgba(0,0,0,.35)',
    '--shadow':       '0 4px 16px rgba(0,0,0,.4)',
    '--shadow-lg':    '0 8px 32px rgba(0,0,0,.5)',
    '--shadow-xl':    '0 20px 56px rgba(0,0,0,.6)'
  };

  function applyThemeVars(theme) {
    var root = document.documentElement;
    var body = document.body;

    if (theme === 'dark') {
      /* Override CSS variables on <html> — highest cascade priority */
      for (var k in DARK_VARS) {
        root.style.setProperty(k, DARK_VARS[k]);
      }
      /* Body base styles */
      if (body) {
        body.style.setProperty('background', '#0f172a', 'important');
        body.style.setProperty('color',      '#f1f5f9', 'important');
      }
    } else {
      /* Remove overrides — fall back to light stylesheet values */
      for (var k in DARK_VARS) {
        root.style.removeProperty(k);
      }
      if (body) {
        body.style.removeProperty('background');
        body.style.removeProperty('color');
      }
    }
  }

  function updateIcon() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }

  /* Apply saved theme instantly — prevents flash of wrong theme */
  var saved = localStorage.getItem('divastra-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  applyThemeVars(saved);   /* set vars before paint */

  window.toggleTheme = function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('divastra-theme', next);
    applyThemeVars(next);
    updateIcon();
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateIcon();
    /* Re-apply now that body exists (the IIFE above may run before body parses) */
    applyThemeVars(localStorage.getItem('divastra-theme') || 'light');
  });

})();
