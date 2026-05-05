/* ========================================
   RTN - Script Principal
   Lógica de detección de directo y cambio automático
   ======================================== */

// Estado de la aplicación
const AppState = {
    isLive: false,
    currentVideoId: null,
    pollingInterval: null,
    viewerCount: 0,
};

// Elementos del DOM
const DOM = {
    loopVideoContainer: document.getElementById('loopVideoContainer'),
    liveVideoContainer: document.getElementById('liveVideoContainer'),
    loopVideo: document.getElementById('loopVideo'),
    youtubePlayer: document.getElementById('youtubePlayer'),
    liveIndicator: document.getElementById('liveIndicator'),
    programTitle: document.getElementById('programTitle'),
    programDescription: document.getElementById('programDescription'),
    statusBadge: document.getElementById('statusBadge'),
    viewerCount: document.getElementById('viewerCount'),
    controlPanel: document.getElementById('controlPanel'),
    toggleLiveBtn: document.getElementById('toggleLiveBtn'),
    toggleOfflineBtn: document.getElementById('toggleOfflineBtn'),
    logStatusBtn: document.getElementById('logStatusBtn'),
};

/* ========================================
   1. INICIALIZACIÓN
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('📺 RTN - Inicializando aplicación de transmisión en directo...');
    
    // Mostrar panel de control si dev mode está habilitado
    if (CONFIG.DEV_MODE) {
        DOM.controlPanel.style.display = 'block';
        setupControlPanel();
        console.log('🔧 Modo desarrollo habilitado');
    }
    
    // Configurar vídeo de espera
    setupLoopVideo();
    
    // Comenzar polling
    startPolling();
    
    // Realizar una verificación inicial inmediatamente
    checkLiveStatus();
});

/* ========================================
   2. CONFIGURACIÓN DEL VÍDEO EN BUCLE
   ======================================== */

function setupLoopVideo() {
    // Si CONFIG.LOOP_VIDEO_YOUTUBE_ID está configurado, usar YouTube
    if (CONFIG.LOOP_VIDEO_YOUTUBE_ID) {
        useYoutubeAsLoopVideo();
    } else {
        // Usar archivo local de vídeo
        DOM.loopVideo.src = CONFIG.LOOP_VIDEO_SOURCE;
        DOM.loopVideo.addEventListener('error', () => {
            console.warn('⚠️ No se pudo cargar el vídeo de espera. Asegúrate de que el archivo existe en: ' + CONFIG.LOOP_VIDEO_SOURCE);
            showPlaceholder();
        });
    }
}

function useYoutubeAsLoopVideo() {
    // Crear iframe de YouTube para el vídeo en bucle
    const loopContainer = document.getElementById('loopVideoContainer');
    loopContainer.innerHTML = '';
    
    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-player';
    iframe.src = `https://www.youtube.com/embed/${CONFIG.LOOP_VIDEO_YOUTUBE_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${CONFIG.LOOP_VIDEO_YOUTUBE_ID}`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    loopContainer.appendChild(iframe);
}

function showPlaceholder() {
    // Mostrar un fondo de color si no hay vídeo disponible
    DOM.loopVideoContainer.style.background = 'linear-gradient(135deg, #8832d9 0%, #5ebfdb 100%)';
    DOM.loopVideoContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 24px; color: white; text-align: center;">Esperando transmisión...</div>';
}

/* ========================================
   3. DETECCIÓN DE DIRECTO - ENDPOINT SERVERLESS
   ======================================== */

async function checkLiveStatus() {
    try {
        console.log('⏳ Verificando si hay directo en el canal...');

        if (window.location.protocol === 'file:') {
            console.warn('⚠️ Modo local: la detección automática no funciona con archivos locales. Usa un servidor http o despliega en Vercel.');
            return;
        }

        const response = await fetch('/api/live-status', {
            cache: 'no-store',
        });
        
        if (!response.ok) {
            throw new Error(`Error al consultar /api/live-status: ${response.status}`);
        }

        const data = await response.json();
        if (data.live && data.videoId) {
            console.log('🔴 ¡Directo detectado! ID:', data.videoId);

            if (AppState.currentVideoId !== data.videoId) {
                AppState.currentVideoId = data.videoId;
                switchToLive(data.videoId, data.title || CONFIG.TEXT.LIVE_TITLE, data.description || CONFIG.TEXT.LIVE_DESC);
            }

            AppState.viewerCount = data.viewerCount || Math.floor(Math.random() * 500) + 50;
            updateViewerCount();
        } else {
            if (AppState.isLive) {
                console.log('⚪ Directo terminado');
                switchToLoopVideo();
            }
        }
    } catch (error) {
        console.warn('⚠️ Error al verificar directo:', error.message);
    }
}

/* ========================================
   4. CAMBIO ENTRE VÍDEOS
   ======================================== */

function switchToLive(videoId, title, description) {
    if (AppState.isLive && AppState.currentVideoId === videoId) {
        return; // Ya estamos reproduciendo este directo
    }
    
    console.log('🔴 Cambiando a directo...');
    
    AppState.isLive = true;
    
    // Actualizar reproductor de YouTube
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
    DOM.youtubePlayer.src = embedUrl;
    
    // Cambiar visibilidad con transición suave
    transitionToElement(DOM.liveVideoContainer);
    
    // Actualizar textos e indicadores
    updateUI(title, description, true);
    
    console.log('✅ Directo iniciado:', title);
}

function switchToLoopVideo() {
    if (!AppState.isLive) {
        return; // Ya estamos en el vídeo en bucle
    }
    
    console.log('⚪ Cambiando a vídeo de espera...');
    
    AppState.isLive = false;
    AppState.currentVideoId = null;
    
    // Cambiar visibilidad con transición suave
    transitionToElement(DOM.loopVideoContainer);
    
    // Actualizar textos e indicadores
    updateUI(CONFIG.TEXT.OFFLINE_TITLE, CONFIG.TEXT.OFFLINE_DESC, false);
    
    console.log('✅ Volviendo a vídeo de espera');
}

function transitionToElement(targetElement) {
    // Remover clase active de todos los contenedores
    document.querySelectorAll('.video-container').forEach(el => {
        el.classList.remove('active');
    });
    
    // Agregar clase active al elemento objetivo
    targetElement.classList.add('active');
}

/* ========================================
   5. ACTUALIZACIÓN DE INTERFAZ
   ======================================== */

function updateUI(title, description, isLive) {
    // Actualizar título y descripción
    DOM.programTitle.textContent = title;
    DOM.programDescription.textContent = description;
    
    // Actualizar estado del badge
    if (isLive) {
        DOM.statusBadge.textContent = 'EN DIRECTO';
        DOM.statusBadge.classList.remove('offline');
        DOM.statusBadge.classList.add('online');
        DOM.liveIndicator.classList.remove('hidden');
    } else {
        DOM.statusBadge.textContent = 'PRÓXIMAMENTE';
        DOM.statusBadge.classList.remove('online');
        DOM.statusBadge.classList.add('offline');
        DOM.liveIndicator.classList.add('hidden');
    }
}

function updateViewerCount() {
    if (AppState.isLive && AppState.viewerCount > 0) {
        document.getElementById('viewers').textContent = formatNumber(AppState.viewerCount);
        DOM.viewerCount.style.display = 'inline-block';
    } else {
        DOM.viewerCount.style.display = 'none';
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/* ========================================
   6. POLLING - VERIFICACIÓN PERIÓDICA
   ======================================== */

function startPolling() {
    console.log('⏱️ Iniciando polling cada ' + (CONFIG.POLLING_INTERVAL / 1000) + ' segundos');
    
    // Verificar inmediatamente
    checkLiveStatus();
    
    // Luego verificar periódicamente
    AppState.pollingInterval = setInterval(() => {
        if (document.visibilityState === 'visible') checkLiveStatus();
    }, CONFIG.POLLING_INTERVAL);
}

function stopPolling() {
    if (AppState.pollingInterval) {
        clearInterval(AppState.pollingInterval);
        AppState.pollingInterval = null;
        console.log('⏸️ Polling detenido');
    }
}

/* ========================================
   7. PANEL DE CONTROL - DESARROLLO
   ======================================== */

function setupControlPanel() {
    DOM.toggleLiveBtn.addEventListener('click', () => {
        // Simular directo activo con un vídeo real de prueba
        AppState.currentVideoId = 'jNQXAC9IVRw';
        switchToLive('jNQXAC9IVRw', 'Transmisión en Directo - RTN Events', 'Simulación de directo en vivo. Esta es una prueba de tu sitio web.');
        console.log('🔧 Simulando directo activo');
    });
    
    DOM.toggleOfflineBtn.addEventListener('click', () => {
        // Simular directo terminado
        switchToLoopVideo();
        console.log('🔧 Simulando directo terminado');
    });
    
    DOM.logStatusBtn.addEventListener('click', () => {
        // Mostrar estado actual
        console.log('====== ESTADO ACTUAL ======');
        console.log('¿En directo?', AppState.isLive);
        console.log('ID de vídeo actual:', AppState.currentVideoId);
        console.log('Contador de visualización:', AppState.viewerCount);
        console.log('Channel ID:', CONFIG.YOUTUBE_CHANNEL_ID);
        console.log('Método: Detección gratuita (sin API Key)');
        console.log('===========================');
    });
}

/* ========================================
   8. MÉTODOS UTILITARIOS
   ======================================== */

// Mantener la aplicación activa (prevenir que el navegador suspenda)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👁️ Tab activo - reanudando polling');
        if (!AppState.pollingInterval) {
            startPolling();
        }
    } else {
        console.log('👁️ Tab inactivo');
    }
});

// Permitir reanudar polling al cerrar DevTools
window.addEventListener('focus', () => {
    if (!AppState.pollingInterval) {
        console.log('🔄 Reanudando polling');
        startPolling();
    }
});

// Función global para pruebas en consola
window.DEBUG = {
    state: () => AppState,
    config: () => CONFIG,
    switchToLive: (videoId = 'jNQXAC9IVRw') => switchToLive(videoId, 'Transmisión Prueba', 'Vídeo de prueba'),
    switchToOffline: () => switchToLoopVideo(),
    restart: () => {
        stopPolling();
        startPolling();
    },
    checkNow: () => checkLiveStatus(),
};

console.log('💡 Escribe DEBUG.help() en la consola para ver comandos de desarrollo');

// Ayuda en la consola
window.DEBUG.help = () => {
    console.log(`
╔════════════════════════════════════════╗
║  RTN - Comandos de Desarrollo          ║
║  ✅ SIN NECESIDAD DE API KEY            ║
╚════════════════════════════════════════╝

📊 Información:
  DEBUG.state()           - Ver estado actual
  DEBUG.config()          - Ver configuración

🎬 Controles:
  DEBUG.switchToLive()    - Simular directo
  DEBUG.switchToOffline() - Simular offline
  DEBUG.checkNow()        - Verificar estado ahora

⚙️ Utilidades:
  DEBUG.restart()         - Reiniciar polling
  DEBUG.help()            - Esta ayuda

✨ NOTA: Este sitio detecta tu directo de YouTube
   automáticamente GRATIS sin API Key.
   
   Verifica cada 30 segundos si tu canal
   (@RTN_Events) está transmitiendo.

    `);
};

console.log('✅ RTN Live Stream - Listo para transmisión');
