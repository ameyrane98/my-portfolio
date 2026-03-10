// Vercel serverless function — proxies LeetCode GraphQL to avoid CORS
// Route: /api/leetcode/:username

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = {
    query: `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `,
    variables: { username },
  };

  try {
    const leetRes = await fetch('https://leetcode.com/graphql', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(query),
    });

    const data = await leetRes.json();

    if (!data?.data?.matchedUser?.submitStats) {
      return res.status(404).json({ error: 'User not found or LeetCode API changed.' });
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // cache 1h on edge
    res.json(data.data.matchedUser.submitStats.acSubmissionNum);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from LeetCode' });
  }
}
