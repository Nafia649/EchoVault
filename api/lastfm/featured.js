/**
 * Serverless proxy: Last.fm featured albums
 * Route: GET /api/lastfm/featured
 *
 * Fetches top albums from several popular artists in parallel to simulate
 * a "Featured Albums" endpoint, since Last.fm doesn't have a native one.
 */

// Simple Fisher-Yates shuffle
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default async function handler(req, res) {
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing LASTFM_API_KEY environment variable' });
    }

    const FEATURED_ARTIST_GROUPS = [
      ["Taylor Swift", "Coldplay", "The Weeknd", "Adele"],
      ["Eminem", "Drake", "Kanye West", "Post Malone"],
      ["Linkin Park", "Metallica", "Nirvana", "Green Day"],
      ["Arctic Monkeys", "Imagine Dragons", "Oasis", "Muse"],
      ["Dua Lipa", "Olivia Rodrigo", "Billie Eilish", "Sabrina Carpenter"],
    ];

    let finalSelection = [];
    let usedGroups = new Set();
    const seen = new Set();

    while (finalSelection.length < 15 && usedGroups.size < FEATURED_ARTIST_GROUPS.length) {
      let groupIndex;
      do {
        groupIndex = Math.floor(Math.random() * FEATURED_ARTIST_GROUPS.length);
      } while (usedGroups.has(groupIndex));
      
      usedGroups.add(groupIndex);
      const artists = FEATURED_ARTIST_GROUPS[groupIndex];

      // Fetch sequentially to avoid triggering rate limits on Last.fm
      let allAlbums = [];
      for (const artist of artists) {
        const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json&limit=8`;
        try {
          const r = await fetch(url);
          if (!r.ok) {
            console.error(`Featured API fetch failed for ${artist} with status ${r.status}`);
            continue;
          }
          const data = await r.json();
          const artistMatches = data.topalbums?.album;
          if (artistMatches) {
            const list = Array.isArray(artistMatches) ? artistMatches : [artistMatches];
            allAlbums.push(...list);
          }
        } catch (e) {
          console.error(`Featured API network error for ${artist}:`, e);
        }
      }

      for (const item of allAlbums) {
        const artist = typeof item.artist === "string" ? item.artist : item.artist?.name;
        const album = item.name;
        if (!artist || !album) continue;

        const key = `${artist.toLowerCase()}:::${album.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          finalSelection.push(item);
        }
      }
    }

    // Shuffle so it's not grouped by artist
    const shuffled = shuffle(finalSelection);

    // Return roughly 25 albums
    const finalData = shuffled.slice(0, 25);

    if (finalData.length === 0) {
      throw new Error('Failed to retrieve featured albums from Last.fm');
    }

    return res.status(200).json({ data: finalData });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch featured albums' });
  }
}
