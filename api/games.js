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
    if (games.length === 0) return sendCors(res).status(200).json(gamesData);

    // convert placeId -> universeId for each game (preserve per-game mapping)
    await Promise.all(games.map(async g => {
      g.universeId = await getUniverseId(g.rootPlaceId);
      return g;
    }));

    // build unique universeId list (strings)
    const uniqUniverseIds = Array.from(new Set(games.map(g => String(g.universeId)).filter(Boolean)));

    // batch fetch thumbnails (API supports comma-separated list). chunk to avoid huge URLs.
    const chunkSize = 50;
    const thumbnails = {}; // map: universeId (string) -> imageUrl
    for (let i = 0; i < uniqUniverseIds.length; i += chunkSize) {
      const chunk = uniqUniverseIds.slice(i, i + chunkSize);
      const ids = chunk.join(",");
      const thumbUrl = `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${encodeURIComponent(ids)}&size=512x512&format=Png&isCircular=false`;
      try {
        const thumbRes = await fetch(thumbUrl);
        if (!thumbRes.ok) throw new Error(`Thumb HTTP ${thumbRes.status}`);
        const thumbData = await thumbRes.json();
        (thumbData.data || []).forEach(t => {
          // ensure key is string to match game.universeId string form
          thumbnails[String(t.targetId)] = t.imageUrl || null;
        });
      } catch (e) {
        // ignore this batch error and continue; we'll try per-id fallback below
        console.error("Thumb batch error:", e);
      }
    }

    // fallback: for any universeId still missing, fetch individually
    const missing = uniqUniverseIds.filter(id => !(id in thumbnails));
    if (missing.length > 0) {
      await Promise.all(missing.map(async id => {
        try {
          const url = `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${encodeURIComponent(id)}&size=512x512&format=Png&isCircular=false`;
          const r = await fetch(url);
          if (!r.ok) return;
          const d = await r.json();
          (d.data || []).forEach(t => {
            thumbnails[String(t.targetId)] = t.imageUrl || null;
          });
        } catch (e) {
          console.error("Thumb fallback error for", id, e);
          thumbnails[id] = null;
        }
      }));
    }

    // attach icon per-game (keeps original order and per-game association)
    gamesData.data = games.map(g => ({
      ...g,
      icon: g.universeId ? thumbnails[String(g.universeId)] ?? null : null
    }));

    return sendCors(res).status(200).json(gamesData);
  } catch (error) {
    console.error("Games API error:", error);
    return res.status(500).json({ error: "Failed to fetch data", message: error.message });
  }
}

// helper: placeId -> universeId via roproxy
async function getUniverseId(placeId) {
  if (!placeId) return null;
  try {
    const url = `https://apis.roproxy.com/universes/v1/places/${placeId}/universe`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.universeId ? String(data.universeId) : null;
  } catch (e) {
    return null;
  }
}

// CORS
function sendCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
