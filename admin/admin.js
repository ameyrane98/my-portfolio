const GITHUB_USER = 'ameyrane98';

// ─── Auth ────────────────────────────────────────────────────────────────────

function getPassword() {
  return sessionStorage.getItem('adminPassword');
}

function authHeaders() {
  return { Authorization: `Bearer ${getPassword()}` };
}

async function login(password) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch('/api/admin/auth', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
      signal:  controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Server error ${res.status}`);
    }
    sessionStorage.setItem('adminPassword', password);
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Request timed out — check Vercel deployment logs.');
    throw err;
  }
}

// ─── Login screen ────────────────────────────────────────────────────────────

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn      = document.getElementById('loginBtn');
  const errEl    = document.getElementById('loginError');
  const password = document.getElementById('passwordInput').value;

  btn.disabled    = true;
  btn.textContent = 'Signing in…';
  errEl.hidden    = true;

  try {
    await login(password);
    showDashboard();
  } catch (err) {
    errEl.textContent = err.message || 'Sign in failed.';
    errEl.hidden      = false;
    btn.disabled      = false;
    btn.textContent   = 'Sign In';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('adminPassword');
  document.getElementById('dashboard').hidden   = true;
  document.getElementById('loginScreen').hidden = false;
});

// ─── Navigation ──────────────────────────────────────────────────────────────

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(s => s.hidden = true);
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const section = document.getElementById(`page-${page}`);
  if (section) section.hidden = false;

  const btn = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (btn) btn.classList.add('active');
}

document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.page));
});

// ─── Dashboard ───────────────────────────────────────────────────────────────

async function showDashboard() {
  document.getElementById('loginScreen').hidden = true;
  document.getElementById('dashboard').hidden   = false;
  navigateTo('profile');
  await Promise.all([loadSettings(), loadRepos()]);
}

// ─── Settings ────────────────────────────────────────────────────────────────

let currentSettings = {};

async function loadSettings() {
  try {
    const res = await fetch('/api/admin/settings');
    currentSettings = await res.json();

    // Apply profile pic preview
    if (currentSettings.profilePicUrl) {
      document.getElementById('profilePreview').src = currentSettings.profilePicUrl;
    }

    // Apply resume link
    if (currentSettings.resumeUrl) {
      const link = document.getElementById('resumeLink');
      link.href        = currentSettings.resumeUrl;
      link.textContent = decodeURIComponent(currentSettings.resumeUrl.split('/').pop());
    }
  } catch {
    // silently fall through — defaults remain
  }
}

async function saveSettings() {
  const res = await fetch('/api/admin/settings', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body:    JSON.stringify(currentSettings),
  });
  if (!res.ok) throw new Error('Save failed');
}

// ─── File upload ─────────────────────────────────────────────────────────────

async function uploadFile(file, filename) {
  const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(filename)}`, {
    method:  'POST',
    headers: { 'Content-Type': file.type, ...authHeaders() },
    body:    file,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Upload failed (${res.status})`);
  }
  const data = await res.json();
  return data.url;
}

function setupUpload({ dropZoneId, fileInputId, pickBtnId, accept, onFile }) {
  const zone    = document.getElementById(dropZoneId);
  const input   = document.getElementById(fileInputId);
  const pickBtn = document.getElementById(pickBtnId);

  pickBtn.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    if (input.files[0]) onFile(input.files[0]);
  });

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  });
}

// Profile picture upload
setupUpload({
  dropZoneId: 'profileDropZone',
  fileInputId: 'profileFile',
  pickBtnId:   'profilePickBtn',
  accept:      'image/*',
  onFile: async file => {
    const status = document.getElementById('profileStatus');
    status.hidden    = false;
    status.className = 'status-msg';
    status.textContent = 'Uploading…';

    try {
      const ext = file.name.split('.').pop();
      const url = await uploadFile(file, `profile.${ext}`);

      document.getElementById('profilePreview').src = url;
      currentSettings.profilePicUrl = url;
      await saveSettings();

      status.className   = 'status-msg success';
      status.textContent = 'Profile picture updated!';
    } catch {
      status.className   = 'status-msg error';
      status.textContent = 'Upload failed. Please try again.';
    }
  },
});

// Resume upload
setupUpload({
  dropZoneId: 'resumeDropZone',
  fileInputId: 'resumeFile',
  pickBtnId:   'resumePickBtn',
  accept:      '.pdf',
  onFile: async file => {
    const status = document.getElementById('resumeStatus');
    status.hidden    = false;
    status.className = 'status-msg';
    status.textContent = 'Uploading…';

    try {
      const url = await uploadFile(file, 'resume.pdf');

      const link       = document.getElementById('resumeLink');
      link.href        = url;
      link.textContent = 'resume.pdf';
      currentSettings.resumeUrl = url;
      await saveSettings();

      status.className   = 'status-msg success';
      status.textContent = 'Resume updated!';
    } catch {
      status.className   = 'status-msg error';
      status.textContent = 'Upload failed. Please try again.';
    }
  },
});

// ─── Repos ───────────────────────────────────────────────────────────────────

async function loadRepos() {
  const loadingEl = document.getElementById('reposLoading');
  const listEl    = document.getElementById('reposList');

  try {
    const [reposRes, settingsRes] = await Promise.all([
      fetch('/api/admin/repos', { headers: authHeaders() }),
      fetch('/api/admin/settings'),
    ]);

    const repos    = await reposRes.json();
    const settings = await settingsRes.json();
    const hidden   = new Set(settings.hiddenRepos || []);

    loadingEl.hidden = true;
    listEl.hidden    = false;
    listEl.innerHTML = '';
    document.getElementById('saveRow').hidden = false;

    // Sort alphabetically for the admin list
    repos
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(repo => {
        const visible = !hidden.has(repo.name);
        const li = document.createElement('li');
        li.className = 'repo-item';

        const toggleId = `toggle-${repo.name}`;
        li.innerHTML = `
          <span class="repo-name">${repo.name}</span>
          <span class="repo-stars">★ ${repo.stargazers_count}</span>
          <label class="toggle" title="${visible ? 'Visible' : 'Hidden'}">
            <input type="checkbox" id="${toggleId}" ${visible ? 'checked' : ''} />
            <span class="toggle-track"></span>
            <span class="toggle-thumb"></span>
          </label>
        `;
        listEl.appendChild(li);
      });
  } catch {
    loadingEl.textContent = 'Failed to load repositories.';
  }
}

document.getElementById('saveProjectsBtn').addEventListener('click', async () => {
  const btn      = document.getElementById('saveProjectsBtn');
  const statusEl = document.getElementById('projectsStatus');

  btn.disabled    = true;
  btn.textContent = 'Saving…';
  statusEl.hidden = true;

  try {
    const checkboxes = document.querySelectorAll('#reposList input[type="checkbox"]');
    const hiddenRepos = [];
    checkboxes.forEach(cb => {
      if (!cb.checked) {
        // id is "toggle-reponame" → extract repo name
        hiddenRepos.push(cb.id.replace('toggle-', ''));
      }
    });

    currentSettings.hiddenRepos = hiddenRepos;
    await saveSettings();

    statusEl.hidden    = false;
    statusEl.className = 'status-inline success';
    statusEl.textContent = '✓ Saved';
    setTimeout(() => { statusEl.hidden = true; }, 3000);
  } catch {
    statusEl.hidden    = false;
    statusEl.className = 'status-inline error';
    statusEl.textContent = '✗ Save failed';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Save Changes';
  }
});

// ─── Init ────────────────────────────────────────────────────────────────────

if (getPassword()) {
  showDashboard();
}
