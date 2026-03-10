import { initTheme }            from './theme.js';
import { initNav }              from './nav.js';
import { fetchLeetCode }        from './leetcode.js';
import { initExperience }       from './experience.js';
import { fetchProjects }        from './projects.js';
import { initContact }          from './contact.js';
import { initScrollAnimations } from './scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initExperience();
  initContact();
  initScrollAnimations();

  fetchLeetCode('ameyrane98');
  fetchProjects();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
