import { getArtistTopAlbums, getSimilarArtists, getTrendingArtists, getCache, setCache } from './lastfmApi';

// Shuffle an array using Fisher-Yates
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns a mixed array of recommended albums prioritizing Favorites (70%) -> History (30%).
 */
export async function getRecommendedForYou(favorites = [], history = [], signal) {
  const cacheKey = 'lastfm:recommended';
  const cachedData = getCache(cacheKey);
  if (cachedData && cachedData.length > 0) return cachedData;

  const favArtists = Array.from(new Set(favorites.map(a => a.artist)));
  const histArtists = Array.from(new Set(history.map(a => a.artist)));
  
  if (favArtists.length === 0 && histArtists.length === 0) return [];

  // Pick up to 2 fav artists (70% weight roughly) and 1 history artist (30%)
  const selectedFavs = shuffle(favArtists).slice(0, 2);
  const selectedHist = shuffle(histArtists.filter(a => !selectedFavs.includes(a))).slice(0, 1);
  
  const selectedSeeds = [...selectedFavs, ...selectedHist];
  if (selectedSeeds.length === 0) return [];
  
  const albumsPromises = selectedSeeds.map(artist => getArtistTopAlbums(artist, signal));
  const results = await Promise.all(albumsPromises);
  
  let pool = results.flat();
  const seen = new Set();
  pool = pool.filter(album => {
    if (seen.has(album.id)) return false;
    seen.add(album.id);
    return true;
  });

  const finalPool = shuffle(pool).slice(0, 20);
  if (finalPool.length > 0) setCache(cacheKey, finalPool);
  return finalPool;
}

/**
 * Returns similar artists based on top favorite artists or history
 */
export async function getArtistsYouMayLike(favorites = [], history = [], signal) {
  const cacheKey = 'lastfm:artists_you_may_like';
  const cachedData = getCache(cacheKey);
  if (cachedData && cachedData.length > 0) return cachedData;

  const favArtists = Array.from(new Set(favorites.map(a => a.artist)));
  const histArtists = Array.from(new Set(history.map(a => a.artist)));
  
  if (favArtists.length === 0 && histArtists.length === 0) return [];

  const selectedFavs = shuffle(favArtists).slice(0, 2);
  const selectedHist = shuffle(histArtists.filter(a => !selectedFavs.includes(a))).slice(0, 1);
  
  const selectedSeeds = [...selectedFavs, ...selectedHist];
  if (selectedSeeds.length === 0) return [];
  
  const similarPromises = selectedSeeds.map(artist => getSimilarArtists(artist, 10, signal));
  const results = await Promise.all(similarPromises);
  
  let pool = results.flat();
  const seen = new Set();
  pool = pool.filter(artist => {
    if (seen.has(artist.name)) return false;
    seen.add(artist.name);
    return true;
  });

  const finalPool = shuffle(pool).slice(0, 10);
  if (finalPool.length > 0) setCache(cacheKey, finalPool);
  return finalPool;
}

/**
 * Grabs random albums from a predefined list of great, slightly less mainstream albums.
 */
export async function getHiddenGems(signal) {
  const cacheKey = 'lastfm:hidden_gems';
  const cachedData = getCache(cacheKey);
  if (cachedData && cachedData.length > 0) return cachedData;

  const hiddenGemSeeds = [
    'Godspeed You! Black Emperor',
    'MF DOOM',
    'Neutral Milk Hotel',
    'Cocteau Twins',
    'Aphex Twin',
    'My Bloody Valentine',
    'Madlib',
    'Fiona Apple'
  ];
  
  const selectedSeeds = shuffle(hiddenGemSeeds).slice(0, 2);
  const albumsPromises = selectedSeeds.map(artist => getArtistTopAlbums(artist, signal));
  const results = await Promise.all(albumsPromises);
  
  const pool = results.flat();
  const finalPool = shuffle(pool).slice(0, 10);
  if (finalPool.length > 0) setCache(cacheKey, finalPool);
  return finalPool;
}
