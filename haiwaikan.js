// Nuvio Provider - Haiwaikan Clean VOD API
const API_BASE = "https://haiwaikan.com/api.php/provide/vod/";

function getStreams(tmdbId, mediaType, season, episode) {
    return fetch(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}?language=zh-CN`)
        .then(res => res.json())
        .then(tmdbData => {
            const queryTitle = tmdbData.title || tmdbData.name || tmdbData.original_title || tmdbData.original_name;
            if (!queryTitle) return [];

            const searchUrl = `${API_BASE}?ac=detail&wd=${encodeURIComponent(queryTitle)}`;
            return fetch(searchUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "https://haiwaikan.com/"
                }
            });
        })
        .then(res => res ? res.json() : { list: [] })
        .then(data => {
            if (!data || !data.list || data.list.length === 0) return [];

            const streams = [];

            data.list.forEach(item => {
                if (!item.vod_play_url) return;

                const sources = item.vod_play_url.split('$$$');
                sources.forEach(source => {
                    const episodes = source.split('#');
                    episodes.forEach(ep => {
                        const parts = ep.split('$');
                        const epName = parts[0];
                        const epUrl = parts[1];

                        if (!epUrl || !epUrl.includes('.m3u8')) return;

                        if (mediaType === 'tv') {
                            const epMatch = epName.match(/\d+/);
                            const epNum = epMatch ? parseInt(epMatch[0], 10) : null;
                            if (epNum !== parseInt(episode, 10)) return;
                        }

                        streams.push({
                            name: "Haiwaikan",
                            title: `${item.vod_name} - ${epName || 'Play'}`,
                            url: epUrl.trim(),
                            quality: "1080p",
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                                "Referer": "https://haiwaikan.com/"
                            }
                        });
                    });
                });
            });

            return streams;
        })
        .catch(() => []);
}

module.exports = { getStreams };
