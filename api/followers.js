// api/followers.js
export default async function handler(req, res) {
  // Habilita CORS para qualquer origem
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responde rápido para requisições OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Nome do perfil do Instagram
  const user = req.query.user || "redeassociadas";
  const url = `https://www.instagram.com/${user}/`;

  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 follower-widget" } });
    const text = await r.text();

    // Tenta pegar "edge_followed_by":{"count":12345} no JSON dentro da página
    let followers = null;
    try {
      const jsonText = text.match(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/);
      if (jsonText && jsonText[1]) {
        const data = JSON.parse(jsonText[1]);
        followers = data.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
      }
    } catch (e) {
      followers = null;
    }

    if (followers !== null) {
      return res.status(200).json({ username: user, followers });
    } else {
      return res.status(500).json({ error: "Não foi possível extrair seguidores. Estrutura da página mudou." });
    }
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
