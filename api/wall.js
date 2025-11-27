export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return sendCors(res).status(200).end();
  }

  const FIREBASE_URL = 'https://mekhis-creations-default-rtdb.firebaseio.com';

  try {
    const { method, userId, action } = req.query;

    // GET - Fetch all wall members or check if user exists
    if (method === 'GET') {
      if (userId) {
        // Check if specific user exists
        const response = await fetch(`${FIREBASE_URL}/wall/${userId}.json`);
        const data = await response.json();
        return sendCors(res).status(200).json(data);
      } else {
        // Get all wall members
        const response = await fetch(`${FIREBASE_URL}/wall.json`);
        const data = await response.json();
        return sendCors(res).status(200).json(data || {});
      }
    }

    // POST - Add user to wall
    if (method === 'POST') {
      const wallData = req.body;
      
      if (!wallData || !wallData.userId) {
        return sendCors(res).status(400).json({ error: 'Missing user data' });
      }

      // Check if user already exists
      const checkResponse = await fetch(`${FIREBASE_URL}/wall/${wallData.userId}.json`);
      const exists = await checkResponse.json();
      
      if (exists) {
        return sendCors(res).status(409).json({ error: 'User already on wall' });
      }

      // Add user to wall
      const response = await fetch(`${FIREBASE_URL}/wall/${wallData.userId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wallData)
      });

      if (!response.ok) {
        throw new Error('Firebase write failed');
      }

      const result = await response.json();
      return sendCors(res).status(200).json(result);
    }

    return sendCors(res).status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error("Wall API error:", err);
    return sendCors(res).status(500).json({
      error: "Failed to process wall request",
      message: err.message,
    });
  }
}

function sendCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
