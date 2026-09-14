export default async function handler(req, res) {
    const API_KEY = process.env.LASTFM_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({
            error: "LASTFM_API_KEY is not configured in Vercel."
        });
    }

    try {
        const username = "robloxusername";

        const params = new URLSearchParams({
            method: "user.getrecenttracks",
            user: username,
            api_key: API_KEY,
            format: "json",
            limit: "1"
        });

        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(502).json({
                error: `Last.fm returned HTTP ${response.status}`
            });
        }

        if (data.error) {
            return res.status(502).json({
                error: data.message || "Last.fm API error",
                code: data.error
            });
        }

        const track = data?.recenttracks?.track?.[0];

        if (!track) {
            return res.status(404).json({
                error: "No recently played track found."
            });
        }

        const images = track.image || [];

        const albumImage =
            images.find(img => img.size === "mega")?.["#text"] ||
            images.find(img => img.size === "extralarge")?.["#text"] ||
            images.find(img => img.size === "large")?.["#text"] ||
            images.find(img => img.size === "medium")?.["#text"] ||
            null;

        return res.status(200).json({
            track: {
                name: track.name || "",
                artist: track.artist?.["#text"] || "",
                album: track.album?.["#text"] || "",
                image: albumImage,
                nowPlaying:
                    track["@attr"]?.nowplaying === "true"
            }
        });

    } catch (error) {
        console.error("Last.fm API error:", error);

        return res.status(500).json({
            error: error.message || "Unknown Last.fm error"
        });
    }
}
