export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const CLIENT_ID = '1270141507021705408';
    const CLIENT_SECRET = 'vspl8ELgdJr2OGsX6-2cWxWjeg_O4wNi';
    const REDIRECT_URI = 'https://www.mekhiscreations.org/auth';

    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Token exchange error:', errorData);
            return res.status(400).json({ error: 'Failed to exchange code for token' });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userResponse.ok) {
            return res.status(400).json({ error: 'Failed to fetch user data' });
        }

        const userData = await userResponse.json();

        const sessionToken = Buffer.from(JSON.stringify({
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            timestamp: Date.now(),
            signature: createSignature(userData.id, Date.now())
        })).toString('base64');

        res.setHeader('Set-Cookie', `discord_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);

        return res.status(200).json({
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
        });

    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function createSignature(userId, timestamp) {
    const crypto = require('crypto');
    const secret = 'vspl8ELgdJr2OGsX6-2cWxWjeg_O4wNi';
    return crypto.createHmac('sha256', secret).update(`${userId}-${timestamp}`).digest('hex');
}
