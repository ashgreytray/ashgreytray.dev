export default async function handler(req, res) {

    const CLIENT_ID =
        process.env.SPOTIFY_CLIENT_ID;

    const CLIENT_SECRET =
        process.env.SPOTIFY_CLIENT_SECRET;


    if (
        !CLIENT_ID ||
        !CLIENT_SECRET
    ) {

        return res.status(500).json({

            error:
                "Spotify credentials are not configured in Vercel."

        });

    }


    const track =
        req.query?.track;

    const artist =
        req.query?.artist;


    if (
        !track ||
        !artist
    ) {

        return res.status(400).json({

            error:
                "Missing track or artist."

        });

    }


    try {

        /* =========================
           GET SPOTIFY ACCESS TOKEN
           ========================= */

        const credentials =
            Buffer
                .from(
                    `${CLIENT_ID}:${CLIENT_SECRET}`
                )
                .toString("base64");


        const tokenResponse =
            await fetch(
                "https://accounts.spotify.com/api/token",
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Basic ${credentials}`,

                        "Content-Type":
                            "application/x-www-form-urlencoded"

                    },

                    body:
                        "grant_type=client_credentials"

                }
            );


        const tokenData =
            await tokenResponse.json();


        if (!tokenResponse.ok) {

            console.error(
                "Spotify token error:",
                tokenData
            );


            return res.status(502).json({

                error:
                    "Spotify authentication failed."

            });

        }


        const accessToken =
            tokenData.access_token;


        if (!accessToken) {

            return res.status(502).json({

                error:
                    "Spotify did not return an access token."

            });

        }


        /* =========================
           SEARCH SPOTIFY
           ========================= */

        const searchQuery =
            `track:${track} artist:${artist}`;


        const searchParams =
            new URLSearchParams();


        searchParams.set(
            "q",
            searchQuery
        );


        searchParams.set(
            "type",
            "track"
        );


        searchParams.set(
            "limit",
            "10"
        );


        searchParams.set(
            "market",
            "AU"
        );


        const searchResponse =
            await fetch(
                "https://api.spotify.com/v1/search?" +
                searchParams.toString(),
                {

                    headers: {

                        "Authorization":
                            `Bearer ${accessToken}`

                    }

                }
            );


        const searchData =
            await searchResponse.json();


        if (!searchResponse.ok) {

            console.error(
                "Spotify search error:",
                searchData
            );


            return res.status(502).json({

                error:
                    "Spotify search failed."

            });

        }


        const items =
            searchData?.tracks?.items || [];


        if (items.length === 0) {

            return res.status(404).json({

                error:
                    "Song not found on Spotify."

            });

        }


        /* =========================
           FIND BEST MATCH
           ========================= */

        const normalizedArtist =
            artist
                .toLowerCase()
                .trim();


        const normalizedTrack =
            track
                .toLowerCase()
                .trim();


        let selected =
            items.find(item => {

                const spotifyTrack =
                    item.name
                        ?.toLowerCase()
                        .trim();


                const spotifyArtists =
                    item.artists
                        ?.map(
                            a =>
                                a.name
                                    ?.toLowerCase()
                                    .trim()
                        )
                        || [];


                const trackMatches =
                    spotifyTrack ===
                    normalizedTrack;


                const artistMatches =
                    spotifyArtists.some(
                        name =>
                            name ===
                            normalizedArtist
                    );


                return (
                    trackMatches &&
                    artistMatches
                );

            });


        /*
         * If there wasn't an exact match,
         * use Spotify's first result.
         */

        if (!selected) {

            selected =
                items[0];

        }


        const spotifyId =
            selected?.id;


        if (!spotifyId) {

            return res.status(404).json({

                error:
                    "Spotify track has no ID."

            });

        }


        /* =========================
           SPOTIFY ALBUM ART
           ========================= */

        const spotifyImages =
            selected?.album?.images || [];


        const spotifyAlbumImage =
            spotifyImages[0]?.url ||
            spotifyImages[1]?.url ||
            spotifyImages[2]?.url ||
            null;


        /* =========================
           EMBED
           ========================= */

        const embedUrl =
            `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator`;


        return res.status(200).json({

            track:
                selected.name,

            artist:
                selected.artists
                    ?.map(
                        a =>
                            a.name
                    )
                    .join(", "),

            album:
                selected.album?.name ||
                "",

            spotifyUrl:
                selected.external_urls?.spotify ||
                `https://open.spotify.com/track/${spotifyId}`,

            embedUrl,

            albumImage:
                spotifyAlbumImage

        });


    } catch (error) {

        console.error(
            "Spotify API error:",
            error
        );


        return res.status(500).json({

            error:
                error.message ||
                "Unknown server error"

        });

    }

}
