import { getSettings } from './settings.js';

const GITHUB_USER  = 'ameyrane98';
const DUMMY_IMAGE  = './static/projectDummy.png';
const MAX_PROJECTS = 12;

export async function fetchProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const [reposRes, settings] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
      getSettings(),
    ]);
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) throw new Error('Bad response');

    const hidden = new Set(settings.hiddenRepos || []);

    // Filter hidden, sort by stars, limit to MAX_PROJECTS
    const sorted = [...repos]
      .filter(r => !hidden.has(r.name))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, MAX_PROJECTS);

    grid.innerHTML = '';

    const cardPromises = sorted.map(repo => buildProjectCard(repo));
    const results = await Promise.allSettled(cardPromises);

    results.forEach(r => {
      if (r.status === 'fulfilled') grid.appendChild(r.value);
    });

    if (grid.children.length === 0) {
      grid.innerHTML = '<p class="projects-empty">No projects found.</p>';
    }
  } catch {
    grid.innerHTML = '<p class="projects-empty">Could not load projects.</p>';
  }
}

async function buildProjectCard(repo) {
  let imageUrl = DUMMY_IMAGE;

  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repo.name}/readme`,
      { headers: { Accept: 'application/vnd.github.v3.raw' } }
    );
    if (readmeRes.ok) {
      const text  = await readmeRes.text();
      const match = text.match(/!\[.*?\]\((.*?)\)/);
      if (match) {
        const src = match[1];
        imageUrl  = src.startsWith('http')
          ? src
          : `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${repo.default_branch}/${src}`;
      }
    }
  } catch { /* fall through to dummy */ }

  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View ${repo.name} on GitHub`);

  card.innerHTML = `
    <div class="project-img" style="background-image: url('${imageUrl}')"></div>
    <div class="project-overlay">
      <h3 class="project-name">${repo.name}</h3>
      <p class="project-desc">${repo.description || 'No description available.'}</p>
      <span class="project-link">View on GitHub →</span>
    </div>
  `;

  const openRepo = () => window.open(repo.html_url, '_blank', 'noopener noreferrer');
  card.addEventListener('click', openRepo);
  card.addEventListener('keydown', e => { if (e.key === 'Enter') openRepo(); });

  // 3D tilt on hover (desktop)
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)   / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  });

  return card;
}
