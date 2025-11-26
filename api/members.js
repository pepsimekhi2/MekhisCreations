export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const groupId = req.query.groupId || "33719761";
    
    const apiUrl = `https://groups.roblox.com/v1/groups/${groupId}/users?sortOrder=Asc&limit=100`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error("Members API error:", error);
    res.status(500).json({ 
      error: "Failed to fetch members data",
      message: error.message 
    });
  }
}
