export default async function handler(req, res) {
  try {
    const { artist, limit = 10 } = req.query;
    if (!artist) return res.status(400).json({ error: 'Artist is required' });

    const API_KEY = process.env.LASTFM_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(
        artist
      )}&api_key=${API_KEY}&format=json&limit=${limit}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Last.fm API error' });
    }

    const data = await response.json();
    const similar = data.similarartists?.artist || [];
    const artistList = Array.isArray(similar) ? similar : [similar];

    // Fetch images from Deezer API concurrently just like trending.js
    const formatted = await Promise.all(
      artistList.map(async (a) => {
        let imageUrl = null;
        try {
          const dzRes = await fetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(a.name)}`);
          if (dzRes.ok) {
            const dzData = await dzRes.json();
            if (dzData.data && dzData.data.length > 0) {
              imageUrl = dzData.data[0].picture_xl || dzData.data[0].picture_medium;
            }
          }
        } catch {
          // Ignore
        }

        return {
          id: a.mbid || a.name,
          name: a.name,
          image: imageUrl,
          role: 'Artist',
          match: a.match || '0',
        };
      })
    );

    return res.status(200).json({ data: formatted });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch similar artists' });
  }
}
