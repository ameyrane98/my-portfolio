const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

app.use(cors());

// Health route (optional)
app.get("/", (req, res) => res.send("LeetCode Proxy API Running!"));

app.get("/leetcode/:username", async (req, res) => {
  const username = req.params.username;
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
    const leetRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    const data = await leetRes.json();

    if (
      !data.data ||
      !data.data.matchedUser ||
      !data.data.matchedUser.submitStats
    ) {
      return res
        .status(404)
        .json({ error: "User not found or LeetCode API changed." });
    }

    const stats = data.data.matchedUser.submitStats.acSubmissionNum;
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from LeetCode" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
