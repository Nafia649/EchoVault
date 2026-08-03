export default async function handler(req, res) {
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing LASTFM_API_KEY environment variable' });
    }

    const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&limit=12`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Last.fm API returned ${response.status}`);
    }

    const data = await response.json();
    const artists = data.artists?.artist || [];
    const artistList = Array.isArray(artists) ? artists : [artists];
    
    // Fetch images from Deezer API concurrently
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
        } catch (e) {
          console.error(`Failed to fetch image for ${a.name} from Deezer`, e);
        }

        return {
          id: a.mbid || a.name,
          name: a.name,
          image: imageUrl,
          role: 'Artist'
        };
      })
    );

    return res.status(200).json({ data: formatted });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch trending artists' });
  }
}
