// GET  /api/admin/settings  — public, returns current settings
// POST /api/admin/settings  — protected, updates settings
// Uses @vercel/kv via dynamic import so the function still boots
// if KV env vars haven't been wired up yet.

const KV_KEY = 'portfolio-settings';

function authorized(req) {
  const auth = req.headers['authorization'] || '';
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export default async function handler(req, res) {
  // ── GET ──────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { kv } = await import('@vercel/kv');
      const settings = (await kv.get(KV_KEY)) || { hiddenRepos: [] };
      return res.json(settings);
    } catch {
      // KV not configured yet — return empty defaults so the portfolio still loads
      return res.json({ hiddenRepos: [] });
    }
  }

  // ── POST ─────────────────────────────────────────────────────────────────
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
      const { kv } = await import('@vercel/kv');
      await kv.set(KV_KEY, body);
      return res.json({ ok: true });
    } catch {
      return res.status(503).json({ error: 'KV storage not configured. Add a KV store in your Vercel project.' });
    }
  }

  res.status(405).end();
}
