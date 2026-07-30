// In-memory token cache for serverless warm instances
let cachedToken = null;
let tokenExpiresAt = 0;

export async function getSpotifyToken() {
  const now = Date.now();
  
  // Return cached token if valid (with 60-second safety margin)
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || process.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || process.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables.");
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify auth error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return cachedToken;
}

export default async function handler(req, res) {
  try {
    const token = await getSpotifyToken();
    return res.status(200).json({ access_token: token, token_type: "Bearer" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to authenticate with Spotify API" });
  }
}
