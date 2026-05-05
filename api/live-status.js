export default async function handler(req, res) {
    const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCto7W4AT09ZcOOcONZu7wRA';
    const liveUrl = `https://www.youtube.com/channel/${channelId}/live`;

    try {
        const response = await fetch(liveUrl, {
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
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
            // Buscamos el ID del video en el contenido HTML o en los metadatos
            const videoIdMatch = html.match(/"videoId":"([^"]+)"/) || html.match(/vi\/([^/]+)\//) || html.match(/watch\?v=([^"'&<>\s]+)/);
            
            if (videoIdMatch && (html.includes('style="LIVE"') || html.includes('isLive":true'))) {
                result.live = true;
                result.videoId = videoIdMatch[1];
                result.title = 'RTN - EN DIRECTO';
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
