/* Aashish Upadhyaya — blog interactions (no dependencies) */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const toc = $('#toc');
  const sections = $$('#article section[id]');
  const progress = $('#reading-progress');
  const topButton = $('#top-btn');
  const themeButton = $('#theme-toggle');
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Build the table of contents from the actual article headings.
  if (toc) {
    sections.forEach((section) => {
      const heading = section.querySelector('h2');
      if (!heading) return;
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.textContent = heading.textContent.trim();
      toc.appendChild(link);
    });
  }

  function updateReadingState() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    if (progress) progress.style.width = `${percentage}%`;
    if (topButton) topButton.classList.toggle('visible', window.scrollY > 420);
    let currentId = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 165) currentId = section.id;
      else break;
    }
    $$('#toc a').forEach((link) => {
      const active = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateReadingState, { passive: true });
  window.addEventListener('resize', updateReadingState);
  updateReadingState();
  if (topButton) topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Save a visitor's preferred appearance locally.
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('aashish-blog-theme') || 'light'; } catch (_) {}
  function setTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    if (themeButton) {
      themeButton.textContent = isDark ? '☀' : '☾';
      themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
    try { localStorage.setItem('aashish-blog-theme', isDark ? 'dark' : 'light'); } catch (_) {}
  }
  setTheme(savedTheme);
  if (themeButton) themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  const articleTitle = document.title;
  const shareButton = $('#share-btn');
  const copyButton = $('#copy-btn');
  function showTemporaryLabel(button, message) {
    if (!button) return;
    const original = button.textContent;
    button.textContent = message;
    window.setTimeout(() => { button.textContent = original; }, 2000);
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showTemporaryLabel(copyButton, 'Copied ✓');
    } catch (_) {
      window.prompt('Copy this article link:', window.location.href);
    }
  }
  if (copyButton) copyButton.addEventListener('click', copyLink);
  if (shareButton) shareButton.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: articleTitle, url: window.location.href }); }
      catch (error) { if (error.name !== 'AbortError') await copyLink(); }
    } else await copyLink();
  });
})();
