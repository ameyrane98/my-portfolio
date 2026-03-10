// POST /api/admin/auth
// No external dependencies — always works regardless of blob setup.
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD env var not set on Vercel' });
  }

  if (body?.password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Wrong password' });
}
