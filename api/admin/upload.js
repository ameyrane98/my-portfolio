// POST /api/admin/upload?filename=<name>
// Uploads the raw request body to Vercel Blob and returns the public URL.
// Protected — requires Authorization: Bearer <password> header.

function authorized(req) {
  const auth = req.headers['authorization'] || '';
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!authorized(req))      return res.status(401).json({ error: 'Unauthorized' });

  const filename = req.query?.filename;
  if (!filename) return res.status(400).json({ error: 'filename query param required' });

  try {
    const { put } = await import('@vercel/blob');
    const blob = await put(filename, req.body || req, {
      access:      'public',
      contentType: req.headers['content-type'] || 'application/octet-stream',
    });
    res.json({ url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(503).json({ error: 'Blob storage not configured. Add a Blob store in your Vercel project.' });
  }
}
