// GET  /api/admin/settings  — public, returns current settings
// POST /api/admin/settings  — protected, saves settings as a JSON blob

const SETTINGS_FILE = 'portfolio-settings.json';

function authorized(req) {
  const auth = req.headers['authorization'] || '';
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

async function readSettings() {
  const { list } = await import('@vercel/blob');
  const { blobs } = await list({ prefix: 'portfolio-settings' });
  if (blobs.length === 0) return { hiddenRepos: [] };
  const res = await fetch(blobs[0].url);
  return res.json();
}

async function writeSettings(data) {
  const { put } = await import('@vercel/blob');
  await put(SETTINGS_FILE, JSON.stringify(data), {
    access:           'public',
    contentType:      'application/json',
    addRandomSuffix:  false,
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const settings = await readSettings();
      return res.json(settings);
    } catch {
      return res.json({ hiddenRepos: [] });
    }
  }

  if (req.method === 'POST') {
    if (!authorized(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    try {
      await writeSettings(body);
      return res.json({ ok: true });
    } catch {
      return res.status(503).json({ error: 'Blob storage not configured.' });
    }
  }

  res.status(405).end();
}
