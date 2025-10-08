const crypto = require('crypto');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const sessionCookie = cookies.split('; ').find(c => c.startsWith('discord_session='));
    if (!sessionCookie) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const sessionToken = sessionCookie.split('=')[1];
        const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());

        if (Date.now() - sessionData.timestamp > 86400000) {
            return res.status(401).json({ error: 'Session expired' });
        }

        const expectedSignature = createSignature(sessionData.id, sessionData.timestamp);
        if (sessionData.signature !== expectedSignature) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        return res.status(200).json({
            id: sessionData.id,
            username: sessionData.username,
            discriminator: sessionData.discriminator,
            avatar: sessionData.avatar,
        });

    } catch (error) {
        console.error('Session verification error:', error);
        return res.status(401).json({ error: 'Invalid session' });
    }
}

function createSignature(userId, timestamp) {
    const secret = 'vspl8ELgdJr2OGsX6-2cWxWjeg_O4wNi';
    return crypto.createHmac('sha256', secret).update(`${userId}-${timestamp}`).digest('hex');
}
