export default async function handler(req, res) {
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
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(200).json(gamesData);
    }
    
    // Extract universe IDs to fetch thumbnails
    const universeIds = gamesData.data.map(game => game.universeId).join(',');
    
    // Fetch thumbnails for all games
    const thumbUrl = `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&size=768x432&format=Png&isCircular=false`;
    const thumbResponse = await fetch(thumbUrl);
    
    let thumbnails = {};
    if (thumbResponse.ok) {
      const thumbData = await thumbResponse.json();
      if (thumbData.data) {
        thumbData.data.forEach(thumb => {
          thumbnails[thumb.universeId] = thumb.imageUrl;
        });
      }
    }
    
    // Attach thumbnail URLs to games
    gamesData.data = gamesData.data.map(game => ({
      ...game,
      icon: thumbnails[game.universeId] || null
    }));
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    res.status(200).json(gamesData);
    
  } catch (error) {
    console.error("Games API error:", error);
    res.status(500).json({ 
      error: "Failed to fetch games data",
      message: error.message 
    });
  }
}
