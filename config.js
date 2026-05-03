/* ========================================
   RTN - Configuración
   ======================================== */

const CONFIG = {
    // YOUTUBE - Configuración de detección de directo
    // La verificación desde el navegador usa YouTube Data API v3.
    // Si no quieres usar API Key, deberás implementar un servidor/proxy.
    
    // Tu Channel ID (ya configurado)
    // Formato: UCxxxxxxxxxxxxxxxxxxxxxx
    YOUTUBE_CHANNEL_ID: 'UCto7W4AT09ZcOOcONZu7wRA',

    // Tu canal de YouTube como handle (para referencia visual)
    // Ejemplo: 'RTN_Events'
    YOUTUBE_CHANNEL_HANDLE: 'RTN_Events',

    // Si deseas, también puedes usar variables de entorno con Vercel.
    // El servicio usa un endpoint serverless que evita CORS y permite
    // la detección gratuita sin exponer una clave de API en el navegador.

    // ID del vídeo en bucle (pantalla de espera)
    // Este será el vídeo que se reproducirá cuando no haya directo
    LOOP_VIDEO_SOURCE: 'assets/videos/waiting-screen.mp4',
    
    // O usar un vídeo de YouTube como pantalla de espera
    // LOOP_VIDEO_YOUTUBE_ID: 'VIDEOID', 
    
    // Intervalo de polling (en milisegundos)
    // Cada cuánto tiempo verificar si hay un directo activo
    POLLING_INTERVAL: 30000, // 30 segundos (ideal para método gratuito)
    
    // Textos para los estados
    TEXT: {
        OFFLINE_TITLE: 'RTN - En Espera',
        OFFLINE_DESC: 'La transmisión comenzará próximamente',
        LIVE_TITLE: 'RTN - En Directo',
        LIVE_DESC: 'Sintoniza nuestro canal en directo ahora',
    },
    
    // Habilitar panel de control para desarrollo
    DEV_MODE: true, // true para ver botones de prueba
};
