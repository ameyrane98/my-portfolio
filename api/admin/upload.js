// POST /api/admin/upload?filename=<name>
import { put } from '@vercel/blob';

// MUST disable body parser — Vercel would otherwise buffer/corrupt binary files
// before they reach @vercel/blob's put(), causing 503 errors.
export const config = { api: { bodyParser: false } };

function authorized(req) {
  return req.headers['authorization'] === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' });

  const { filename } = req.query;
  if (!filename) return res.status(400).json({ error: 'filename required' });

  try {
    const blob = await put(filename, req, {
      access:      'public',
      contentType: req.headers['content-type'] || 'application/octet-stream',
    });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    return res.status(503).json({ error: e.message });
  }
}
