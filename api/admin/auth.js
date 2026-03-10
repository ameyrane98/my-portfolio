// POST /api/admin/auth
// Verifies the admin password against the ADMIN_PASSWORD env var.
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD env var not set' });
  }

  if (body?.password === process.env.ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }

  res.status(401).json({ error: 'Invalid password' });
}
