export default async function handler(req, res) {
  // Habilita CORS para qualquer origem
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Responde rápido para pré-flight
    return res.status(200).end();
  }

  const user = req.query.user || "redeassociadas";

  try {
    const url = `https://www.instagram.com/${user}/`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 follower-widget" }
    });
    const text = await r.text();
    const match = text.match(/"edge_followed_by"\s*:\s*\{"count":(\d+)\}/);

    if (match && match[1]) {
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
