// GET  /api/admin/settings  — public
// POST /api/admin/settings  — protected
import { list, put } from '@vercel/blob';

const FILE = 'portfolio-settings.json';

function authorized(req) {
  return req.headers['authorization'] === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

async function readSettings() {
  const { blobs } = await list({ prefix: 'portfolio-settings' });
  if (!blobs.length) return { hiddenRepos: [] };
  const res = await fetch(blobs[0].url);
  return res.json();
}

async function writeSettings(data) {
  await put(FILE, JSON.stringify(data), {
    access:          'public',
    contentType:     'application/json',
    addRandomSuffix: false,
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      return res.status(200).json(await readSettings());
    } catch {
      return res.status(200).json({ hiddenRepos: [] });
    }
  }

  if (req.method === 'POST') {
    if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    try {
      await writeSettings(body);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(503).json({ error: e.message });
    }
  }

  res.status(405).end();
}
