# RTN - Canal de Televisión en Directo

Una página web moderna y elegante que funciona como canal de televisión en directo, con detección automática de transmisiones en vivo desde YouTube y cambio fluido entre directo y pantalla de espera.

## 🎯 Características

✅ **Reproductor central siempre activo** - Vídeo reproduciendo continuamente
✅ **Pantalla de espera en bucle** - Cuando no hay directo activo
✅ **Detección automática de directo** - Cambia automáticamente cuando inicia una transmisión
✅ **Sin recarga de página** - Transiciones suaves usando JavaScript
✅ **Polling periódico** - Verifica cada 10 segundos si hay directo
✅ **Indicador "EN DIRECTO"** - Badge animado en tiempo real
✅ **Contador de visualizadores** - Muestra cuántas personas están viendo
✅ **Logo superpuesto** - Identidad visual de la marca
✅ **Diseño responsive** - Se adapta a cualquier pantalla
✅ **Modo desarrollo** - Panel de control para pruebas

## 🚀 Inicio Rápido

### 1. Obtener Credenciales de YouTube API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Busca "YouTube Data API v3" y actívala
4. Ve a Credenciales → Crear credencial → Clave API
5. Copia tu clave API (algo como: `AIzaSyD...`)

### 2. Encontrar tu Channel ID

1. Ve a tu canal de YouTube
2. Abre la URL en tu navegador (debería verse: `youtube.com/c/TuCanal`)
3. Haz clic en "Acerca de" en el canal
4. En la sección de detalles del canal, ve a "Compartir canal"
5. Copia tu Channel ID (formato: `UCxxxxxxxxxxxxxx`)

O usa este método alternativo:
1. Reemplaza `USERNAME` en: `https://www.youtube.com/@USERNAME/about`
2. Ve a la sección "Acerca de" y busca el Channel ID

### 3. Configurar el Proyecto

Abre `config.js` y reemplaza:

```javascript
// ANTES
YOUTUBE_API_KEY: 'TU_CLAVE_API_AQUI',
YOUTUBE_CHANNEL_ID: 'TUCANALESAQUI',

// DESPUÉS
YOUTUBE_API_KEY: 'AIzaSyD_abc123xyz...',
YOUTUBE_CHANNEL_ID: 'UCxxxxxxxxxxxxxx',
```

### 4. Configurar el Vídeo de Espera

**Opción A: Usar un archivo de vídeo local**
1. Crea una carpeta `assets/videos/` en el proyecto
2. Coloca tu vídeo MP4 en: `assets/videos/waiting-screen.mp4`
3. En `config.js` asegúrate de que:
```javascript
LOOP_VIDEO_SOURCE: 'assets/videos/waiting-screen.mp4',
```

**Opción B: Usar un vídeo de YouTube**
1. Ve a YouTube y busca el vídeo que quieres reproducir en bucle
2. Copia el ID del vídeo (está en la URL: `youtube.com/watch?v=VIDEOID`)
3. En `config.js` descomenta y configura:
```javascript
LOOP_VIDEO_YOUTUBE_ID: 'VIDEOID',
```

## 📁 Estructura del Proyecto

```
RTN-WEB/
├── index.html          # Página principal
├── styles.css          # Estilos (Identidad RTN)
├── script.js           # Lógica principal y polling
├── config.js           # Configuración de YouTube API
├── README.md           # Este archivo
└── assets/
    └── videos/
        └── waiting-screen.mp4  # Vídeo de espera (opcional)
```

## ⚙️ Configuración Detallada

### Opciones en `config.js`

```javascript
CONFIG = {
    // Tu clave API de YouTube
    YOUTUBE_API_KEY: 'AIzaSyD_...',
    
    // ID de tu canal de YouTube
    YOUTUBE_CHANNEL_ID: 'UCxxxxxx...',
    
    // Fuente del vídeo en bucle (local o YouTube)
    LOOP_VIDEO_SOURCE: 'assets/videos/waiting-screen.mp4',
    // LOOP_VIDEO_YOUTUBE_ID: 'VIDEOID', // Alternativa
    
    // Frecuencia de polling (milisegundos)
    // 10000 = 10 segundos
    POLLING_INTERVAL: 10000,
    
    // Textos personalizados
    TEXT: {
        OFFLINE_TITLE: 'RTN - En Espera',
        OFFLINE_DESC: 'La transmisión comenzará próximamente',
        LIVE_TITLE: 'RTN - En Directo',
        LIVE_DESC: 'Sintoniza nuestro canal en directo ahora',
    },
    
    // Modo desarrollo (muestra panel de control)
    DEV_MODE: false, // Cambiar a true para ver botones de prueba
}
```

## 🧪 Modo Desarrollo

Para probar la aplicación sin necesidad de configurar YouTube API:

1. En `config.js`, cambia:
```javascript
DEV_MODE: true,
```

2. Recarga la página y verás 3 botones en la esquina inferior derecha:
   - **Simular Directo** - Muestra un vídeo de prueba
   - **Simular Offline** - Vuelve a la pantalla de espera
   - **Ver Estado** - Muestra información en la consola

3. En la consola del navegador (F12), puedes usar:
```javascript
DEBUG.switchToLive()     // Simular directo
DEBUG.switchToOffline()  // Volver a offline
DEBUG.state()            // Ver estado actual
DEBUG.config()           // Ver configuración
DEBUG.checkNow()         // Verificar estado ahora
DEBUG.help()             // Ver más comandos
```

## 🎨 Personalización de Diseño

### Cambiar Colores

En `styles.css`, modifica estas variables de CSS:

```css
:root {
    --primary-magenta: #d878e3;  /* Color principal */
    --primary-purple: #8832d9;   /* Color secundario */
    --primary-cyan: #5ebfdb;     /* Color de acentos */
    --primary-lavender: #b789d6; /* Color terciario */
    --dark-bg: #0a0a0a;          /* Fondo oscuro */
}
```

### Cambiar Logo

El logo está en el HTML como SVG. Para cambiarlo:

1. **Opción A: Cambiar el SVG actual**
   - Abre `index.html`
   - Busca el elemento con clase `rtn-logo`
   - Reemplaza el SVG con tu logo

2. **Opción B: Usar una imagen PNG/SVG**
   ```html
   <div class="logo-container">
       <img src="assets/images/rtn-logo.png" alt="RTN Logo" class="rtn-logo">
   </div>
   ```

### Cambiar Tipografía

En `styles.css`:
```css
body {
    font-family: 'Tu Tipografía Preferida', sans-serif;
}
```

## 🔗 Integración con tu Sitio Web

Si quieres mostrar el reproductor en tu sitio existente:

**Opción 1: Iframe**
```html
<iframe 
    src="https://tudominio.com/rtn-web/index.html"
    width="100%"
    height="600"
    frameborder="0"
    allowfullscreen>
</iframe>
```

**Opción 2: Incorporar HTML directamente**
Copia los elementos HTML de `index.html` y ajusta las rutas de CSS y JS.

## 📱 Responsive Design

La página se adapta automáticamente a:
- 📺 Pantallas grandes (desktops)
- 💻 Tablets (1024px)
- 📱 Móviles (768px, 480px)

## ⚡ Performance

- **Sin frameworks** - HTML, CSS y JS puro (más rápido)
- **Transiciones suaves** - CSS3 para cambios sin lag
- **Polling eficiente** - Solo verifica cuando es necesario
- **Caché de datos** - Evita llamadas duplicadas a la API

## 🔒 Consideraciones de Seguridad

⚠️ **Importante**: Tu API Key es pública en el cliente
- La API Key de YouTube está limitada a lectura (solo búsqueda de vídeos)
- Se recomienda agregar restricciones de origen en Google Cloud Console
- Ve a: Credenciales → tu clave → Restricciones HTTP referer
- Agrega: `https://tudominio.com/*`

## 🐛 Solución de Problemas

### "El vídeo de espera no aparece"
- Verifica que `assets/videos/waiting-screen.mp4` existe
- Abre la consola (F12) y revisa los mensajes de error
- Intenta con un vídeo diferente

### "No detecta el directo"
- Asegúrate de que tu API Key y Channel ID son correctos
- En Google Cloud Console, verifica que YouTube Data API v3 está **activa**
- Intenta presionar F5 para hacer polling inmediatamente
- Abre la consola y escribe: `DEBUG.checkNow()`

### "El vídeo de YouTube no aparece"
- Verifica que el ID del vídeo es correcto
- Asegúrate de que el vídeo no está privado
- Prueba con: `DEBUG.switchToLive('dQw4w9WgXcQ')` (rickroll de prueba)

### "El cambio es lento o no automático"
- En `config.js`, reduce `POLLING_INTERVAL` (ej: 5000 ms = 5 segundos)
- Recuerda que YouTube tarda un poco en actualizar su estado de directo

## 📊 Estadísticas en Tiempo Real

La aplicación muestra automáticamente:
- ✅ Icono "EN DIRECTO" con animación
- 👁️ Número de espectadores actuales
- 🎬 Título y descripción del vídeo en directo

## 🎓 API YouTube - Límites

- **Cuota diaria**: 10,000 unidades
- **Cada búsqueda**: 100 unidades
- **Cada estadística**: 1 unidad

Con 10,000 unidades puedes hacer ~100 verificaciones al día (cada 15 minutos).

## 📝 Licencia

Libre para usar y modificar.

## 🤝 Soporte

Si tienes problemas:

1. Abre la consola del navegador (F12)
2. Escribe: `DEBUG.help()`
3. Ejecuta los comandos de debug
4. Revisa los mensajes de error

## 🎬 Ejemplo de Uso Real

```javascript
// En la consola, configura tu canal:
DEBUG.setApiKey('AIzaSyD_abc123...')
DEBUG.setChannelId('UCxxxxxx...')

// Verifica que funciona:
DEBUG.checkNow()

// Si todo está bien, recarga la página
```

---

Hecho con ❤️ para RTN - Tu canal de televisión en directo
#   r t n w e b  
 