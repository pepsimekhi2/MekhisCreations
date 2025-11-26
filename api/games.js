export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const groupId = req.query.groupId || "33719761";

    // Fetch games from Roblox API
    const gamesUrl = `https://games.roblox.com/v2/groups/${groupId}/games?accessFilter=2&sortOrder=Asc&limit=50`;
    const gamesResponse = await fetch(gamesUrl);

    if (!gamesResponse.ok) {
      throw new Error(`HTTP ${gamesResponse.status}`);
    }

    const gamesData = await gamesResponse.json();

    // If no games, return early
    if (!gamesData.data || gamesData.data.length === 0) {
      enableCors(res);
      return res.status(200).json(gamesData);
    }

    // Extract universe IDs
    const universeIds = gamesData.data.map(g => g.universeId).join(',');

    // Fetch valid thumbnails
    const thumbUrl = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds}&size=512x512&format=Png&isCircular=false`;
    const thumbResponse = await fetch(thumbUrl);

    let thumbnails = {};

    if (thumbResponse.ok) {
      const thumbData = await thumbResponse.json();

      if (thumbData.data) {
        // Roblox returns targetId, NOT universeId
        thumbData.data.forEach(thumb => {
          thumbnails[thumb.targetId] = thumb.imageUrl;
        });
      }
    }

    // Attach the thumbnails to each game
    gamesData.data = gamesData.data.map(game => ({
      ...game,
      icon: thumbnails[game.universeId] || null
    }));

    enableCors(res);
    return res.status(200).json(gamesData);

  } catch (error) {
    console.error("Games API error:", error);
    return res.status(500).json({
      error: "Failed to fetch games data",
      message: error.message
    });
  }
}

// CORS helper
function enableCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
