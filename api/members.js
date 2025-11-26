export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  try {
    const groupId = req.query.groupId || "33719761";
    
    // Fetch group members
    const apiUrl = `https://groups.roblox.com/v1/groups/${groupId}/users?sortOrder=Asc&limit=100`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // If no members, return early
    if (!data.data || data.data.length === 0) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(200).json(data);
    }
    
    // Randomly select up to 12 members for floating avatars
    const selectedMembers = data.data
      .sort(() => 0.5 - Math.random())
      .slice(0, 12);
    
    // Extract user IDs
    const userIds = selectedMembers
      .map(member => member.user?.userId || member.userId)
      .filter(id => id)
      .join(',');
    
    // Fetch thumbnails for selected members
    const thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds}&size=150x150&format=Png&isCircular=false`;
    const thumbResponse = await fetch(thumbUrl);
    
    let thumbnails = {};
    if (thumbResponse.ok) {
      const thumbData = await thumbResponse.json();
      if (thumbData.data) {
        thumbData.data.forEach(thumb => {
          thumbnails[thumb.targetId] = thumb.imageUrl;
        });
      }
    }
    
    // Attach thumbnail URLs to selected members
    const membersWithThumbnails = selectedMembers.map(member => {
      const userId = member.user?.userId || member.userId;
      return {
        ...member,
        thumbnailUrl: thumbnails[userId] || null
      };
    }).filter(member => member.thumbnailUrl); // Only return members with valid thumbnails
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    res.status(200).json({
      data: membersWithThumbnails
    });
    
  } catch (error) {
    console.error("Members API error:", error);
    res.status(500).json({ 
      error: "Failed to fetch members data",
      message: error.message 
    });
  }
}
