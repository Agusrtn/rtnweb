export default async function handler(req, res) {
    const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCto7W4AT09ZcOOcONZu7wRA';
    const liveUrl = `https://www.youtube.com/channel/${channelId}/live`;

    try {
        const response = await fetch(liveUrl, {
            redirect: 'follow',
        });

        const finalUrl = response.url || '';
        const result = {
            live: false,
            videoId: null,
            title: null,
            description: null,
            url: finalUrl,
        };

        if (finalUrl.includes('/watch?v=')) {
            const videoIdMatch = finalUrl.match(/[?&]v=([^&]+)/);
            if (videoIdMatch) {
                result.live = true;
                result.videoId = videoIdMatch[1];
                result.title = 'RTN - Directo en Vivo';
                result.description = 'Sintoniza nuestra transmisión en directo ahora mismo.';
            }
        } else {
            const html = await response.text();
            const videoIdMatch = html.match(/"videoId":"([^"]+)"/);
            if (videoIdMatch) {
                result.live = true;
                result.videoId = videoIdMatch[1];
                result.title = 'RTN - Directo en Vivo';
                result.description = 'Sintoniza nuestra transmisión en directo ahora mismo.';
            }
        }

        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json(result);
    } catch (error) {
        console.error('API /api/live-status error:', error.message);
        return res.status(500).json({ error: 'No se pudo verificar el estado del directo' });
    }
}
