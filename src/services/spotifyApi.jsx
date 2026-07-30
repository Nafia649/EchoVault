/**
 * Spotify API Service Adapter
 * 
 * Translates serverless proxy responses (/api/spotify/*) into EchoVault's
 * unified data models for Search and Album Details.
 */

/* ─── Private Helper Utilities ─────────────────────────────────────────── */

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

/**
 * Generates a deterministic gradient class from string hash
 */
function getDeterministicGradient(idStr = '') {
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
}

/**
 * Converts milliseconds to formatted track duration string ("m:ss")
 */
export function formatMsToDuration(ms) {
  if (typeof ms !== "number" || Number.isNaN(ms)) {
  return "0:00";
}
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/**
 * Converts array of Spotify track items into total album duration ("X hr Y min" / "X min Y sec")
 */
export function formatAlbumDuration(tracks = []) {
  const totalMs = tracks.reduce((sum, t) => sum + (t.duration_ms || 0), 0);
  if (!totalMs) return 'N/A';
  const totalSec = Math.floor(totalMs / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return mins >= 60
    ? `${Math.floor(mins / 60)} hr ${mins % 60} min`
    : `${mins} min ${secs} sec`;
}

/**
 * Extracts primary artist name string from Spotify artist array
 */
function extractArtistName(artists = []) {
  if (Array.isArray(artists) && artists.length > 0) {
    return artists.map((a) => a.name).join(', ');
  }
  return 'Unknown Artist';
}

/**
 * Extracts primary cover image URL from Spotify image array
 */
function extractImageUrl(images = []) {
  if (Array.isArray(images) && images.length > 0) {
    return images[0].url || '';
  }
  return '';
}

/**
 * Parses 4-digit release year from Spotify release date string (YYYY-MM-DD or YYYY)
 */
function parseReleaseYear(releaseDate = '') {
  if (!releaseDate) return new Date().getFullYear();
  const parsed = parseInt(releaseDate.substring(0, 4), 10);
  return isNaN(parsed) ? new Date().getFullYear() : parsed;
}

/* ─── Track Mapper ──────────────────────────────────────────────────────── */

/**
 * Maps a Spotify Track object into EchoVault's Track model.
 * Preserves raw durationMs alongside formatted duration string.
 */
export function mapSpotifyTrack(track, fallbackArtist = 'Unknown Artist') {
  if (!track) return null;

  const artist = extractArtistName(track.artists) || fallbackArtist;
  const durationMs = track.duration_ms || 0;

  return {
    id: track.id || `track-${track.track_number}`,
    trackNumber: track.track_number || 1,
    title: track.name || 'Untitled Track',
    artist,
    durationMs,
    duration: formatMsToDuration(durationMs),
  };
}

/* ─── Separate Album Mappers ────────────────────────────────────────────── */

/**
 * 1. mapSpotifySearchAlbum(item)
 * Maps lightweight Spotify Search API album objects into EchoVault model.
 * Note: Search API responses do NOT contain track listings.
 */
export function mapSpotifySearchAlbum(item) {
  if (!item) return null;

  return {
    id: item.id,
    title: item.name || 'Untitled Album',
    artist: extractArtistName(item.artists),
    image: extractImageUrl(item.images),
    color: getDeterministicGradient(item.id),
    year: parseReleaseYear(item.release_date),
    songs: item.total_tracks || 0,
    spotifyUrl: item.external_urls?.spotify || '',
    duration: 'N/A',
    tracks: [],

    // Raw fields
    releaseDate: item.release_date || '',
    totalTracks: item.total_tracks || 0,
  };
}

/**
 * 2. mapSpotifyAlbumDetails(album)
 * Maps complete Spotify Album Details API responses into EchoVault model.
 * Includes tracks array, calculated total duration, images, and external URLs.
 */
export function mapSpotifyAlbumDetails(album) {
  if (!album) return null;

  const rawTracks = album.tracks?.items || [];
  const artistName = extractArtistName(album.artists);
  const mappedTracks = rawTracks
    .map((t) => mapSpotifyTrack(t, artistName))
    .filter(Boolean);

  return {
    id: album.id,
    title: album.name || 'Untitled Album',
    artist: artistName,
    image: extractImageUrl(album.images),
    color: getDeterministicGradient(album.id),
    year: parseReleaseYear(album.release_date),
    songs: album.total_tracks || mappedTracks.length || 0,
    spotifyUrl: album.external_urls?.spotify || '',
    duration: formatAlbumDuration(rawTracks),
    tracks: mappedTracks,

    // Raw fields
    releaseDate: album.release_date || '',
    totalTracks: album.total_tracks || 0,
  };
}

/* ─── API Service Fetchers ──────────────────────────────────────────────── */

/**
 * Fetches matching album list from Spotify search endpoint.
 *
 * @param {string}      query  - Search term
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel the request
 */
export async function searchSpotifyAlbums(query, signal) {
  if (!query || !query.trim()) return [];

  const response = await fetch(
    `/api/spotify/search?q=${encodeURIComponent(query.trim())}`,
    { signal },
  );
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Spotify search failed with status ${response.status}`);
  }

  const data = await response.json();
  const searchItems = data.albums?.items || [];
  
  return searchItems.map(mapSpotifySearchAlbum).filter(Boolean);
}

/**
 * Fetches full album details and track list from Spotify album endpoint
 */
export async function getSpotifyAlbumDetails(albumId) {
  if (!albumId || !albumId.trim()) {
    throw new Error('Album ID parameter is required');
  }

  const response = await fetch(`/api/spotify/album/${encodeURIComponent(albumId.trim())}`);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Spotify album fetch failed with status ${response.status}`);
  }

  const rawAlbumData = await response.json();
  return mapSpotifyAlbumDetails(rawAlbumData);
}
