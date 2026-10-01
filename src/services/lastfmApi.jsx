/**
 * Last.fm API Service Adapter
 *
 * Translates serverless proxy responses (/api/lastfm/*) into EchoVault's
 * unified album and track models consumed by AlbumCard, AlbumDetails,
 * and the Favorites context.
 *
 * Last.fm specifics:
 *   - Album search returns shallow albums; full details need an extra fetch
 *   - Track lists may be an object instead of array if there's only 1 track
 *   - Release date is sometimes available in wiki.published
 *   - Images come in an array of sizes
 */

/* ─── Private Helpers ───────────────────────────────────────────────────── */

const CACHE_LIFETIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export function getCache(key) {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_LIFETIME) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Silently fail if sessionStorage is unavailable
  }
}



const GRADIENT_PALETTES = [
  'from-indigo-900 to-violet-700',
  'from-red-900 to-rose-600',
  'from-lime-400 to-green-700',
  'from-yellow-400 to-orange-500',
  'from-purple-400 to-fuchsia-600',
  'from-sky-500 to-blue-700',
  'from-pink-300 to-rose-500',
  'from-amber-400 to-yellow-600',
  'from-cyan-400 to-teal-600',
  'from-orange-400 to-red-600',
];

function getDeterministicGradient(idStr = '') {
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENT_PALETTES[Math.abs(hash) % GRADIENT_PALETTES.length];
}

/**
 * Encodes an artist and album into a safe, UTF-8 compatible Base64 string ID.
 * This ensures albums without an MBID can still be uniquely identified and routed.
 */
export function encodeAlbumId(artist, album) {
  if (!artist || !album) return '';
  const str = `${artist}:::${album}`;
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a UTF-8 compatible Base64 string ID back into [artist, album].
 */
export function decodeAlbumId(encodedId) {
  if (!encodedId) return ['', ''];
  try {
    const binary = atob(encodedId);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoded = new TextDecoder().decode(bytes);
    return decoded.split(':::');
  } catch {
    return ['', ''];
  }
}

export function formatSecondsToDuration(seconds) {
  const s = typeof seconds === 'number' && !Number.isNaN(seconds) ? Math.floor(seconds) : 0;
  const m = Math.floor(s / 60);
  const ss = (s % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
}

export function formatAlbumDuration(tracks = []) {
  const totalSec = tracks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0);
  if (!totalSec) return 'N/A';
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return mins >= 60
    ? `${Math.floor(mins / 60)} hr ${mins % 60} min`
    : `${mins} min ${secs} sec`;
}

function parseReleaseYear(wiki) {
  if (!wiki || !wiki.published) return null;
  // "06 Jun 2023, 00:31" -> 2023
  const match = wiki.published.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

function getBestImage(images = []) {
  if (!Array.isArray(images) || images.length === 0) return '';
  const sizes = ['extralarge', 'large', 'medium', 'small'];
  for (const size of sizes) {
    const img = images.find(i => i.size === size && i['#text']);
    if (img) return img['#text'];
  }
  const fallback = images.find(i => i['#text']);
  return fallback ? fallback['#text'] : '';
}

/* ─── Track Mapper ──────────────────────────────────────────────────────── */

export function mapLastFmTrack(track, index, fallbackArtist = 'Unknown Artist') {
  if (!track) return null;

  return {
    id: String(index + 1),
    trackNumber: track['@attr']?.rank || index + 1,
    title: track.name || 'Untitled Track',
    artist: track.artist?.name || fallbackArtist,
    duration: formatSecondsToDuration(Number(track.duration) || 0),
    link: track.url || null,
  };
}

/* ─── Album Mappers ─────────────────────────────────────────────────────── */

export function mapLastFmAlbum(item) {
  if (!item) return null;
  const artistName = typeof item.artist === 'string' ? item.artist : (item.artist?.name || 'Unknown Artist');
  const albumTitle = item.name || 'Untitled Album';
  
  if (!artistName || !albumTitle) return null;

  const id = encodeAlbumId(artistName, albumTitle);
  
  let year = null;
  if (item.year) year = parseInt(item.year, 10);
  else if (item.releaseDate || item.releasedate) {
    const raw = item.releaseDate || item.releasedate;
    const match = raw.match(/\d{4}/);
    if (match) year = parseInt(match[0], 10);
  } else if (item.wiki) {
    year = parseReleaseYear(item.wiki);
  }

  return {
    id,
    title: albumTitle,
    artist: artistName,
    image: getBestImage(item.image),
    color: getDeterministicGradient(id),
    year: year || null,
    songs: 0,
    duration: 'N/A',
    tracks: [],
    releaseDate: '',
    totalTracks: 0,
    link: item.url || '',
  };
}

export function mapLastFmAlbumDetails(album) {
  if (!album) return null;

  const artistName = typeof album.artist === 'string' ? album.artist : (album.artist?.name || 'Unknown Artist');
  const albumTitle = album.name || 'Untitled Album';
  const id = encodeAlbumId(artistName, albumTitle);

  let rawTracks = [];
  if (album.tracks && album.tracks.track) {
    rawTracks = Array.isArray(album.tracks.track) ? album.tracks.track : [album.tracks.track];
  }

  const mappedTracks = rawTracks.map((t, i) => mapLastFmTrack(t, i, artistName)).filter(Boolean);

  return {
    id,
    title: albumTitle,
    artist: artistName,
    image: getBestImage(album.image),
    color: getDeterministicGradient(id),
    year: parseReleaseYear(album.wiki),
    songs: mappedTracks.length || 0,
    duration: formatAlbumDuration(rawTracks),
    tracks: mappedTracks,
    releaseDate: album.wiki?.published || '',
    totalTracks: mappedTracks.length || 0,
    link: album.url || '',
  };
}

/* ─── API Fetchers ──────────────────────────────────────────────────────── */

export async function searchAlbums(query, signal) {
  if (!query || !query.trim()) return [];

  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `lastfm:search:${normalizedQuery}`;
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }

  const response = await fetch(
    `/api/lastfm/search?q=${encodeURIComponent(query.trim())}`,
    { signal }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Last.fm search failed with status ${response.status}`);
  }

  const data = await response.json();


  const items = data.data || [];
  
  const mappedAlbums = items
    .filter(item => item.name && item.name !== '(null)')
    .map(mapLastFmAlbum)
    .filter(Boolean);
  if (mappedAlbums.length > 0) {
    setCache(cacheKey, mappedAlbums);
  }
  return mappedAlbums;
}


export async function getFeaturedAlbums(signal) {
  const cacheKey = 'lastfm:featured';
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }

  const response = await fetch('/api/lastfm/featured', { signal });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Last.fm featured fetch failed with status ${response.status}`);
  }

  const data = await response.json();
  const items = data.data || [];

  const mappedAlbums = items
    .filter(item => item.name && item.name !== '(null)')
    .map(mapLastFmAlbum)
    .filter(Boolean);

  if (mappedAlbums.length > 0) {
    setCache(cacheKey, mappedAlbums);
  }
  return mappedAlbums;
}

export async function getAlbum(albumId, signal) {
  if (!albumId) throw new Error('Album ID is required');

  const cacheKey = `lastfm:album:${albumId}`;
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }

  const response = await fetch(
    `/api/lastfm/album?id=${encodeURIComponent(String(albumId))}`,
    { signal }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Last.fm album fetch failed with status ${response.status}`);
  }

  const data = await response.json();
  const mappedAlbum = mapLastFmAlbumDetails(data.album);

  setCache(cacheKey, mappedAlbum);
  return mappedAlbum;
}

export async function getArtistSuggestions(query, signal) {
  if (!query || !query.trim()) return [];

  const cacheKey = `lastfm:suggest:${query.trim().toLowerCase()}`;
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }

  const response = await fetch(
    `/api/lastfm/suggest?q=${encodeURIComponent(query.trim())}`,
    { signal }
  );

  if (!response.ok) {
    return []; // Fail silently for autocomplete
  }

  const data = await response.json();
  const suggestions = data.data || [];
  
  if (suggestions.length > 0) {
    setCache(cacheKey, suggestions);
  }
  return suggestions;
}

export async function getTrendingArtists(signal) {
  const cacheKey = 'lastfm:trending_artists:v2';
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }

  const response = await fetch('/api/lastfm/trending', { signal });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to fetch trending artists`);
  }

  const data = await response.json();
  const artists = data.data || [];

  if (artists.length > 0) {
    setCache(cacheKey, artists);
  }
  return artists;
}

export async function getArtistTopAlbums(artistName, signal) {
  if (!artistName) return [];
  const cacheKey = `lastfm:artist_top:${artistName}`;
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) return cachedData;

  const response = await fetch(`/api/lastfm/artistTopAlbums?artist=${encodeURIComponent(artistName)}`, { signal });
  if (!response.ok) return [];

  const data = await response.json();
  const items = data.data || [];
  const mappedAlbums = items.map(mapLastFmAlbum).filter(Boolean);

  if (mappedAlbums.length > 0) setCache(cacheKey, mappedAlbums);
  return mappedAlbums;
}

export async function getSimilarArtists(artistName, limit = 10, signal) {
  if (!artistName) return [];
  const cacheKey = `lastfm:similar:${artistName}`;
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) return cachedData;

  const response = await fetch(`/api/lastfm/similar?artist=${encodeURIComponent(artistName)}&limit=${limit}`, { signal });
  if (!response.ok) return [];

  const data = await response.json();
  const artists = data.data || [];

  if (artists.length > 0) setCache(cacheKey, artists);
  return artists;
}
