// GET  /api/admin/settings  — public, read current settings
// POST /api/admin/settings  — protected, update settings
import { kv } from '@vercel/kv';

const KV_KEY = 'portfolio-settings';

function authorized(req) {
  const auth = req.headers['authorization'] || '';
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const settings = (await kv.get(KV_KEY)) || { hiddenRepos: [] };
    return res.json(settings);
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

    await kv.set(KV_KEY, body);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
