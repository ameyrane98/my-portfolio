// GET /api/admin/repos — proxies GitHub API with a token to avoid rate limiting
// Protected — requires Authorization: Bearer <password> header.

function authorized(req) {
  const auth = req.headers['authorization'] || '';
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' });

  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const ghRes = await fetch(
      'https://api.github.com/users/ameyrane98/repos?per_page=100&sort=updated',
      { headers }
    );
    const repos = await ghRes.json();
    res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 min on edge
    res.json(repos);
  } catch {
    res.status(502).json({ error: 'Failed to fetch repos from GitHub' });
  }
}
