export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return sendCors(res).status(200).end();
  }

  try {
    const userId = req.query.userId;
    if (!userId) {
      return sendCors(res).status(400).json({ error: "Missing userId" });
    }

    // User info
    const userUrl = `https://users.roproxy.com/v1/users/${userId}`;
    const userRes = await fetch(userUrl);
    if (!userRes.ok) throw new Error(`User HTTP ${userRes.status}`);
    const userData = await userRes.json();

    // Avatar thumbnail
    const avatarUrl = `https://thumbnails.roproxy.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
    const avatarRes = await fetch(avatarUrl);
    const avatarData = avatarRes.ok ? await avatarRes.json() : null;
    const avatarThumb =
      avatarData?.data?.length > 0 ? avatarData.data[0].imageUrl : null;

    // Headshot thumbnail
    const headUrl = `https://thumbnails.roproxy.com/v1/users/headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;
    const headRes = await fetch(headUrl);
    const headData = headRes.ok ? await headRes.json() : null;
    const headThumb =
      headData?.data?.length > 0 ? headData.data[0].imageUrl : null;

    const final = {
      id: userData.id,
      name: userData.name,
      displayName: userData.displayName,
      description: userData.description,
      created: userData.created,
      isBanned: userData.isBanned,
      profileLink: `https://www.roblox.com/users/${userId}/profile`,
      avatar: avatarThumb,
      headshot: headThumb,
    };

    return sendCors(res).status(200).json(final);
  } catch (err) {
    console.error("User API error:", err);
    return res.status(500).json({
      error: "Failed to fetch user",
      message: err.message,
    });
  }
}

function sendCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
