// api/followers.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const user = req.query.user || "redeassociadas";

  try {
    const url = `https://www.instagram.com/${user}/`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 follower-widget" }
    });
    const text = await r.text();

    // Tenta encontrar "edge_followed_by":{"count":XXXXX}
    const match = text.match(/"edge_followed_by"\s*:\s*\{"count":\s*([0-9]+)/);

    if (match && match[1]) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({
        username: user,
        followers: Number(match[1])
      });
    }

    return res.status(500).json({ error: "Não foi possível extrair seguidores" });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
