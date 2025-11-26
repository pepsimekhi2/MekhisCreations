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

    // Convert placeId → universeId
    const universeIds = [];
    for (const g of games) {
      const universeId = await getUniverseId(g.rootPlaceId);
      g.universeId = universeId;
      if (universeId) universeIds.push(universeId);
    }

    // Fetch thumbnails
    let thumbnails = {};
    if (universeIds.length > 0) {
      const ids = universeIds.join(",");
      const thumbUrl = `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${ids}&size=512x512&format=Png&isCircular=false`;

      const thumbRes = await fetch(thumbUrl);
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        thumbData.data?.forEach(t => {
          thumbnails[t.targetId] = t.imageUrl;
        });
      }
    }

    gamesData.data = games.map(g => ({
      ...g,
      icon: g.universeId ? thumbnails[g.universeId] || null : null
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

// placeId → universeId via proxy
async function getUniverseId(placeId) {
  const url = `https://apis.roproxy.com/universes/v1/places/${placeId}/universe`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.universeId || null;
}

// CORS
function sendCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
