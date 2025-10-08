export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('Set-Cookie', 'discord_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    
    return res.status(200).json({ success: true });
}
