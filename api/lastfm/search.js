/**
 * Serverless proxy: Last.fm unified album search
 * Route: GET /api/lastfm/search?q=<query>
 *
 * Proxies requests to Last.fm API. Since album.search only searches album titles,
 * we also fetch artist.gettopalbums in parallel. This guarantees reliable results
 * whether the user types an artist name (like "Taylor Swift") or an album title.
 */

function score(item, query) {
  const q = query.trim().toLowerCase();

  const artist =
    typeof item.artist === "string"
      ? item.artist.toLowerCase()
      : (item.artist?.name || "").toLowerCase();

  const album = (item.name || "").toLowerCase();

  let s = 0;

  if (album === q) s += 100;
  if (artist === q) s += 80;
  if (album.startsWith(q)) s += 60;
  if (artist.startsWith(q)) s += 50;
  if (album.includes(q)) s += 40;
  if (artist.includes(q)) s += 30;

  return s;
}

export default async function handler(req, res) {
  try {
    const query = req.query?.q || req.query?.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Missing required search query parameter 'q'" });
    }
  

const apiKey = process.env.LASTFM_API_KEY;
    // const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing LASTFM_API_KEY environment variable' });
    }

    const safeQuery = encodeURIComponent(query.trim());
    const albumUrl = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${safeQuery}&api_key=${apiKey}&format=json&limit=15`;
    const artistUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${safeQuery}&api_key=${apiKey}&format=json&limit=15`;
    
    // Fetch both simultaneously
    const [albumRes, artistRes] = await Promise.all([
      fetch(albumUrl).catch(() => ({ ok: false })),
      fetch(artistUrl).catch(() => ({ ok: false }))
    ]);

    const [albumData, artistData] = await Promise.all([
      albumRes.ok ? albumRes.json() : {},
      artistRes.ok ? artistRes.json() : {}
    ]);

    const albumMatches = albumData.results?.albummatches?.album || [];
    const artistMatches = artistData.topalbums?.album || [];

    // Last.fm can return a single object or an array. Ensure they are arrays.
    const albumsList = Array.isArray(albumMatches) ? albumMatches : [albumMatches];
    const artistList = Array.isArray(artistMatches) ? artistMatches : [artistMatches];

    const rawCombined = [...artistList, ...albumsList].filter(Boolean);

    // Deduplicate albums by artist and album name
    const seen = new Set();
    const deduplicated = [];

    for (const item of rawCombined) {
      const artist = typeof item.artist === "string" ? item.artist : item.artist?.name;
      const album = item.name;
      if (!artist || !album) continue;

      const key = `${artist.toLowerCase()}:::${album.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(item);
      }
    }

    // Score and sort results based on the search query
    deduplicated.sort((a, b) => score(b, query) - score(a, query));

    
    return res.status(200).json({ data: deduplicated });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to search Last.fm albums' });
  }
}
