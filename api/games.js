export default async function handler(req, res) {
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    // Get group ID from query or use default
    const groupId = req.query.groupId || "33719761";
    
    // Fetch games from Roblox API
    const apiUrl = `https://games.roblox.com/v2/groups/${groupId}/games?accessFilter=2&sortOrder=Asc&limit=50`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error("Games API error:", error);
    res.status(500).json({ 
      error: "Failed to fetch games data",
      message: error.message 
    });
  }
}
