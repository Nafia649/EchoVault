export default async function handler(req, res) {
  const { artist, limit = 10 } = req.query;
  if (!artist) return res.status(400).json({ error: 'Artist is required' });

  const API_KEY = process.env.LASTFM_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
        artist
      )}&api_key=${API_KEY}&format=json&limit=${limit}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Last.fm API error' });
    }

    const data = await response.json();
    const albums = data.topalbums?.album || [];
    const formatted = Array.isArray(albums) ? albums : [albums];
    
    return res.status(200).json({ data: formatted });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch artist top albums' });
  }
}
