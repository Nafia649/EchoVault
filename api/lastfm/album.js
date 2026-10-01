/**
 * Serverless proxy: Last.fm album details
 * Route: GET /api/lastfm/album?id=<encoded_id>
 *
 * Proxies requests to Last.fm album.getinfo endpoint.
 * The `id` query parameter should be a Base64 encoded string of `artist:::album`.
 */
export default async function handler(req, res) {
  try {
    const id = req.query?.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing required album ID parameter' });
    }

    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing LASTFM_API_KEY environment variable' });
    }

    // Decode composite ID (base64 -> UTF-8 string -> split by :::)
    let decodedString;
    try {
      decodedString = Buffer.from(id, 'base64').toString('utf8');
    } catch {
      return res.status(400).json({ error: 'Invalid album ID format' });
    }

    const parts = decodedString.split(':::');
    if (parts.length !== 2) {
      return res.status(400).json({ error: 'Invalid album ID parts' });
    }

    const [artist, album] = parts;

    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&api_key=${apiKey}&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Last.fm API error (${response.status}): ${errorText}`,
      });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ error: data.message || 'Album not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch Last.fm album details' });
  }
}
