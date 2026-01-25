export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return sendCors(res).status(200).end();
  }

  try {
    const groupId = req.query.groupId || "33719761";

    const gamesUrl = `https://games.roproxy.com/v2/groups/${groupId}/games?accessFilter=2&sortOrder=Asc&limit=50`;
    const gamesResponse = await fetch(gamesUrl);

    if (!gamesResponse.ok) throw new Error(`HTTP ${gamesResponse.status}`);

    const gamesData = await gamesResponse.json();
    const games = gamesData.data || [];

    if (games.length === 0) {
      return sendCors(res).status(200).json(gamesData);
    }

    // ----- USE GAME ID AS universeId -----
    const ids = games.map(g => g.id).join(",");

    const thumbUrl = `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${ids}&size=512x512&format=Png&isCircular=false`;
    const thumbRes = await fetch(thumbUrl);

    const thumbs = {};
    if (thumbRes.ok) {
      const thumbData = await thumbRes.json();
      (thumbData.data || []).forEach(t => {
        thumbs[t.targetId] = t.imageUrl;
      });
    }

    // attach icons to each game
    gamesData.data = games.map(g => ({
      ...g,
      icon: thumbs[g.id] || null
    }));

    return sendCors(res).status(200).json(gamesData);
  } catch (error) {
    console.error("Games API error:", error);
    return res.status(500).json({
      error: "Failed to fetch data",
      message: error.message
    });
  }
}

function sendCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
