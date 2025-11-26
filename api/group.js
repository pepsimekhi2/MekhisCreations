export default async function handler(req, res) {
  try {
    // Get group ID from query or use default
    const groupId = req.query.groupId || "33719761";
    
    // Fetch the Roblox API server-side
    const apiUrl = `https://groups.roblox.com/v1/groups/${groupId}`;
    const response = await fetch(apiUrl);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    // Parse the JSON data
    const data = await response.json();
    
    // Set CORS headers to allow frontend access
    res.setHeader("Access-Control-Allow-Origin", "*"); // or restrict to your domain
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Return the data
    res.status(200).json(data);
    
  } catch (error) {
    // Handle errors
    console.error("Group API error:", error);
    res.status(500).json({ 
      error: "Failed to fetch group data",
      message: error.message 
    });
  }
}
