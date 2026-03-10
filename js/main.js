import { initTheme }            from './theme.js';
import { initNav }              from './nav.js';
import { fetchLeetCode }        from './leetcode.js';
import { initExperience }       from './experience.js';
import { fetchProjects }        from './projects.js';
import { initContact }          from './contact.js';
import { initScrollAnimations } from './scroll.js';
import { getSettings }          from './settings.js';

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initNav();
  initExperience();
  initContact();
  initScrollAnimations();

  // Apply admin-managed overrides (profile pic, resume) before other fetches
  const settings = await getSettings();

  if (settings.profilePicUrl) {
    const img = document.querySelector('.about-photo');
    if (img) img.src = settings.profilePicUrl;
  }

  if (settings.resumeUrl) {
    const btn = document.getElementById('resumeBtn');
    if (btn) btn.href = settings.resumeUrl;
  }

  fetchLeetCode('ameyrane98');
  fetchProjects(); // uses settings internally for hidden repos

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
