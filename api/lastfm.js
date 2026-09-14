export default async function handler(req, res) {

    const API_KEY =
        process.env.LASTFM_API_KEY;


    if (!API_KEY) {

        return res.status(500).json({

            error:
                "LASTFM_API_KEY is not configured in Vercel."

        });

    }


    try {

        const username =
            "robloxusername";


        const params =
            new URLSearchParams();


        params.set(
            "method",
            "user.getrecenttracks"
        );


        params.set(
            "user",
            username
        );


        params.set(
            "api_key",
            API_KEY
        );


        params.set(
            "format",
            "json"
        );


        params.set(
            "limit",
            "1"
        );


        const response =
            await fetch(
                "https://ws.audioscrobbler.com/2.0/?" +
                params.toString()
            );


        const data =
            await response.json();


        if (!response.ok) {

            return res.status(502).json({

                error:
                    `Last.fm returned HTTP ${response.status}`

            });

        }


        if (data.error) {

            return res.status(502).json({

                error:
                    data.message ||
                    "Last.fm API error",

                code:
                    data.error

            });

        }


        return res.status(200).json(
            data
        );


    } catch (error) {

        console.error(
            "Last.fm API error:",
            error
        );


        return res.status(500).json({

            error:
                error.message ||
                "Unknown server error"

        });

    }

}
