# RTN Live Channel - Explicación Técnica

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────┐
│                    NAVEGADOR DEL USUARIO             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         HTML (index.html)                    │  │
│  │  - Estructura de la página                   │  │
│  │  - Dos contenedores de vídeo (local/YT)      │  │
│  │  - Navbar, logo, indicadores                 │  │
│  └──────────────────────────────────────────────┘  │
│                        ▼                            │
│  ┌──────────────────────────────────────────────┐  │
│  │      CSS (styles.css)                        │  │
│  │  - Estilos de identidad RTN                  │  │
│  │  - Animaciones y transiciones                │  │
│  │  - Responsive design                         │  │
│  └──────────────────────────────────────────────┘  │
│                        ▼                            │
│  ┌──────────────────────────────────────────────┐  │
│  │   JavaScript (script.js + config.js)         │  │
│  │  - Lógica de polling                         │  │
│  │  - Detección de directo                      │  │
│  │  - Cambio automático de vídeos               │  │
│  │  - Gestión de estado                         │  │
│  └──────────────────────────────────────────────┘  │
│                        ▼                            │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
    ┌──────────────┐          ┌──────────────┐
    │ YouTube API  │          │ YouTube Embed│
    │ (Búsqueda    │          │ (Reproducción│
    │  de directo) │          │  de vídeos)  │
    └──────────────┘          └──────────────┘
```

---

## 🔄 Flujo de Funcionamiento

### 1. Inicialización

```
Página cargada
    ↓
config.js cargado (API Key, Channel ID)
    ↓
script.js ejecutado
    ↓
setupLoopVideo() → Cargar vídeo de espera
    ↓
startPolling() → Iniciar verificación cada 10s
    ↓
checkLiveStatus() → Verificar si hay directo AHORA
```

### 2. Polling - Verificación Periódica

```
Cada 10 segundos (POLLING_INTERVAL):

checkLiveStatus()
    ↓
¿YouTube API Key configurada?
    ├─ NO → Mostrar warning, salir
    │
    └─ SÍ → Hacer llamada a YouTube API
         ↓
    Buscar vídeos en DIRECTO del canal
         ↓
    ¿Se encontró un directo activo?
         ├─ SÍ → switchToLive(videoId)
         │       - Cambiar a reproductor de YouTube
         │       - Mostrar badge "EN DIRECTO"
         │       - Actualizar contador de viewers
         │
         └─ NO → ¿Estábamos reproduciendo directo?
                 ├─ SÍ → switchToLoopVideo()
                 │       - Volver al vídeo de espera
                 │       - Ocultar badge "EN DIRECTO"
                 │
                 └─ NO → (No hacer nada, seguir con espera)
```

### 3. Cambio de Vídeos (Transición)

```
transitionToElement(targetElement)
    ↓
Remover clase "active" de todos los contenedores
    ↓
Agregar clase "active" al nuevo contenedor
    ↓
CSS: opacity: 0 → 1 (transición suave 0.5s)
    ↓
Reproductor activo cambia automáticamente
```

---

## 📡 Llamadas a la API de YouTube

### Búsqueda de Directo

```javascript
// URL de búsqueda
GET https://www.googleapis.com/youtube/v3/search?
    part=snippet
    &channelId=UCxxxxxx...
    &type=video
    &eventType=live
    &key=AIzaSy...

// Respuesta (si hay directo activo)
{
  "items": [{
    "id": { "videoId": "VIDEOID123" },
    "snippet": {
      "title": "Programa RTN - Episodio 5",
      "description": "En directo desde el estudio..."
    }
  }]
}

// Respuesta (si NO hay directo)
{
  "items": []
}
```

### Obtener Estadísticas

```javascript
// URL de estadísticas
GET https://www.googleapis.com/youtube/v3/videos?
    part=liveStreamingDetails,statistics
    &id=VIDEOID123
    &key=AIzaSy...

// Respuesta
{
  "items": [{
    "liveStreamingDetails": {
      "concurrentViewers": "1250"
    }
  }]
}
```

### Cuota de API

- **Por búsqueda (search)**: 100 unidades
- **Por estadísticas (statistics)**: 1 unidad
- **Cuota diaria**: 10,000 unidades
- **Máximo de verificaciones/día**: ~98 (si haces búsqueda + estadísticas cada vez)

Con polling cada 10 segundos:
- 6 verificaciones/minuto × 60 minutos = 360 verificaciones/hora
- **¡No es sostenible!**

**Solución**: Reducir frecuencia en producción:
```javascript
POLLING_INTERVAL: 60000, // 60 segundos = 1440 verificaciones/día
```

---

## 🎯 Estados de la Aplicación

```javascript
AppState = {
    isLive: false,           // ¿Hay directo activo?
    currentVideoId: null,    // ID del vídeo actual
    pollingInterval: null,   // ID del intervalo
    viewerCount: 0          // Número de espectadores
}
```

---

## 🔐 Seguridad y Buenas Prácticas

### Proteger la API Key

⚠️ **Problema**: Tu API Key es visible en el navegador

```javascript
// INSEGURO (así está ahora en config.js)
const YOUTUBE_API_KEY = 'AIzaSyD_xxxxx...'; // ¡Visible para todos!
```

### Soluciones

**Opción 1: Usar restricciones de origen (RECOMENDADO)**
1. Ve a Google Cloud Console
2. Credenciales → Tu clave API
3. Restricciones de API → HTTP referer
4. Agrega: `https://tudominio.com/*`
5. Ahora solo tu dominio puede usar la clave

**Opción 2: Servidor proxy (para mayor seguridad)**
```javascript
// Cliente (navegador)
fetch('/api/check-live')
    ↓
// Servidor (Node.js)
app.get('/api/check-live', async (req, res) => {
    const response = await fetch(
        'https://www.googleapis.com/youtube/v3/search...'
        + process.env.YOUTUBE_API_KEY  // ¡API Key oculta!
    );
    res.json(response.json());
});
```

**Opción 3: Variables de entorno (.env)**
```
YOUTUBE_API_KEY=AIzaSyD_xxxxx...
YOUTUBE_CHANNEL_ID=UCxxxxxx...
```

---

## 🚀 Optimizaciones

### 1. Caché de Resultados

```javascript
let lastLiveCheck = null;
let lastLiveCheckTime = 0;

async function checkLiveStatus() {
    const now = Date.now();
    
    // Si verificamos hace menos de 5 minutos, usar caché
    if (lastLiveCheckTime && (now - lastLiveCheckTime) < 300000) {
        return lastLiveCheck;
    }
    
    // Hacer llamada a API
    const result = await performApiCall();
    lastLiveCheck = result;
    lastLiveCheckTime = now;
    
    return result;
}
```

### 2. Debouncing de Cambios

```javascript
let changeTimeout = null;

function switchToLive(videoId, title, description) {
    // Cancelar cambios anteriores si están pendientes
    if (changeTimeout) clearTimeout(changeTimeout);
    
    // Realizar cambio con pequeño delay
    changeTimeout = setTimeout(() => {
        // Cambio real aquí
    }, 300);
}
```

### 3. Lazy Loading

```javascript
// Solo cargar YouTube API cuando sea necesario
async function switchToLive(videoId) {
    // Insertar iframe solo cuando sea necesario
    if (!DOM.youtubePlayer.src) {
        DOM.youtubePlayer.src = `https://www.youtube.com/embed/${videoId}...`;
    }
}
```

---

## 🐛 Debugging y Logs

### Sistema de Debug Integrado

```javascript
// En la consola del navegador:
DEBUG.state()              // Ver estado actual
DEBUG.config()             // Ver configuración
DEBUG.switchToLive()       // Simular directo
DEBUG.switchToOffline()    // Simular offline
DEBUG.checkNow()           // Verificar directo ahora
DEBUG.help()               // Ayuda completa
```

### Logs en la Consola

```javascript
console.log('📺 RTN - Inicializando...');        // Información
console.warn('⚠️ Configuración incompleta');      // Advertencia
console.error('❌ Error al verificar directo');   // Error
```

---

## 📊 Métricas y Monitoreo

### Agregar Google Analytics

```html
<!-- En index.html, antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G_MEASUREMENT_ID');
</script>
```

### Eventos a trackear

```javascript
function switchToLive(videoId, title, description) {
    // ... código existing ...
    
    // Trackear evento
    if (window.gtag) {
        gtag('event', 'live_started', {
            'video_id': videoId,
            'video_title': title
        });
    }
}
```

---

## 🔄 Ciclo de Vida de la Aplicación

```
1. CARGA INICIAL
   - HTML parseado
   - CSS aplicado
   - JavaScript ejecutado
   - ✅ Estado: LISTO

2. MODO ESPERA
   - Vídeo en bucle reproduciendo
   - Polling activo cada 10s
   - ✅ Estado: ESPERANDO_DIRECTO

3. DIRECTO DETECTADO
   - API retorna video en vivo
   - currentVideoId actualizado
   - Cambio suave a iframe de YouTube
   - Badge "EN DIRECTO" mostrado
   - ✅ Estado: EN_DIRECTO

4. DIRECTO EN PROGRESO
   - YouTube iframe reproduciendo
   - Polling continúa verificando
   - Mostrar contador de viewers (cada 30s)
   - ✅ Estado: TRANSMITIENDO

5. DIRECTO TERMINA
   - API no retorna más videos en vivo
   - isLive vuelve a false
   - Cambio suave a vídeo de espera
   - Badge "EN DIRECTO" ocultado
   - ✅ Estado: DIRECTO_TERMINADO → ESPERANDO_DIRECTO

6. CIERRE DE NAVEGADOR
   - clearInterval(pollingInterval)
   - Recursos liberados
   - ✅ Estado: CERRADO
```

---

## 🎯 Casos de Uso Avanzados

### Caso 1: Múltiples Canales

```javascript
const CHANNELS = {
    principal: 'UCxxxxx...',
    gaming: 'UCyyyyy...',
    musica: 'UCzzzzz...'
};

function switchChannel(channel) {
    CONFIG.YOUTUBE_CHANNEL_ID = CHANNELS[channel];
    checkLiveStatus();
}
```

### Caso 2: Directo con Sobreposición Local

```javascript
// Reproducir directo de YouTube pero con overlay local
function switchToLiveWithOverlay(videoId) {
    switchToLive(videoId);
    
    // Agregar overlay
    const overlay = document.createElement('div');
    overlay.className = 'live-overlay';
    overlay.innerHTML = '<p>TRANSMITIENDO EN VIVO</p>';
    document.querySelector('.video-player-wrapper').appendChild(overlay);
}
```

### Caso 3: Notificaciones en Tiempo Real

```javascript
// Cuando inicia un directo
function switchToLive(videoId, title, description) {
    // ... código existing ...
    
    // Enviar notificación
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('¡RTN En Directo!', {
                body: title,
                icon: '/assets/images/icon.png'
            });
        });
    }
}
```

---

## ✅ Checklist de Implementación

- [ ] Obtener API Key de YouTube
- [ ] Obtener Channel ID de YouTube
- [ ] Configurar en config.js
- [ ] Probar con DEBUG.checkNow()
- [ ] Crear vídeo de espera (o usar YouTube)
- [ ] Personalizar colores en styles.css
- [ ] Cambiar logo en index.html
- [ ] Ajustar textos en config.js
- [ ] Probar en móvil (responsive)
- [ ] Deplegar en servidor
- [ ] Agregar restricción de origen en Google Cloud
- [ ] Configurar HTTPS
- [ ] Monitoreo y analytics (opcional)

---

¡Listo para transmitir con RTN! 🚀📺
