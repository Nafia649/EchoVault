export default async function handler(req, res) {
  try {
    const query = req.query?.q || req.query?.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Missing required search query parameter 'q'" });
    }

    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing LASTFM_API_KEY environment variable' });
    }

    const safeQuery = encodeURIComponent(query.trim());
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${safeQuery}&api_key=${apiKey}&format=json&limit=5`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Last.fm API returned ${response.status}`);
    }

    const data = await response.json();
    const artistMatches = data.results?.artistmatches?.artist || [];
    const artistList = Array.isArray(artistMatches) ? artistMatches : [artistMatches];
    
    const names = artistList.map(a => a.name).filter(Boolean);
    const uniqueNames = Array.from(new Set(names));

    return res.status(200).json({ data: uniqueNames });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch artist suggestions' });
  }
}
