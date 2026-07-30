import { getSpotifyToken } from "./token.js";

export default async function handler(req, res) {
  try {
    const query = req.query?.q || req.query?.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Missing required search query parameter 'q'" });
    }

    const token = await getSpotifyToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query.trim())}&type=album&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Spotify API error (${response.status}): ${errorText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to search Spotify albums" });
  }
}
