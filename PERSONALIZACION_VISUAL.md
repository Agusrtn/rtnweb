# Personalización Visual para RTN

## 🎨 Colores de Marca RTN

Basado en las imágenes de identidad visual:

```css
/* Colores RTN oficiales */
--primary-magenta: #d878e3;    /* Magenta vibrante */
--primary-purple: #8832d9;     /* Púrpura oscuro */
--primary-cyan: #5ebfdb;       /* Celeste/Cyan */
--primary-lavender: #b789d6;   /* Lavanda pastel */
```

### Paleta Alternativa (más contrastada)

Si quieres una versión más llamativa:

```css
--primary-magenta: #ff00ff;    /* Magenta puro */
--primary-purple: #9c27b0;     /* Púrpura más claro */
--primary-cyan: #00d4ff;       /* Cyan más brillante */
--primary-lavender: #c084ff;   /* Lavanda más vibrante */
```

---

## 🖼️ Cambiar el Logo

### Opción 1: Reemplazar el SVG actual

Abre `index.html` y busca:

```html
<svg class="rtn-logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Logo RTN simplificado -->
    <circle cx="100" cy="100" r="95" fill="none" stroke="#fff" stroke-width="2" opacity="0.8"/>
    <text x="100" y="120" font-size="60" font-weight="bold" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">
        rtn.
    </text>
</svg>
```

Reemplaza esto con tu logo SVG.

### Opción 2: Usar imagen PNG/SVG

```html
<div class="logo-container">
    <img src="assets/images/rtn-logo.png" alt="RTN Logo" class="rtn-logo">
</div>
```

Luego ajusta en `styles.css`:

```css
.rtn-logo {
    width: 100%;
    height: 100%;
    animation: float-logo 3s ease-in-out infinite;
}
```

### Opción 3: Logo dinámico (múltiples variantes)

```html
<div class="logo-container">
    <img id="dynamicLogo" src="assets/images/rtn-logo-normal.png" alt="RTN Logo" class="rtn-logo">
</div>
```

En `script.js` añade:

```javascript
// Cambiar logo cuando haya directo
function switchToLive(videoId, title, description) {
    // ... código existente ...
    document.getElementById('dynamicLogo').src = 'assets/images/rtn-logo-live.png';
}

function switchToLoopVideo() {
    // ... código existente ...
    document.getElementById('dynamicLogo').src = 'assets/images/rtn-logo-normal.png';
}
```

---

## 🎬 Badges y Elementos Visuales

### Badge "EN DIRECTO" Personalizado

En `styles.css`:

```css
.live-badge {
    background: rgba(255, 0, 0, 0.9);  /* Rojo */
    /* O usa gradiente */
    background: linear-gradient(135deg, #ff4444 0%, #dd0000 100%);
}
```

### Texto del Badge

En `index.html`:

```html
<div id="liveIndicator" class="live-indicator hidden">
    <div class="live-badge">
        <span class="live-dot"></span>
        <span class="live-text">EN VIVO</span> <!-- Cambiar texto -->
    </div>
</div>
```

---

## 🌈 Temas Alternativos

### Tema Oscuro Premium

```css
:root {
    --dark-bg: #000000;
    --darker-bg: #0a0a0a;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --border-color: rgba(200, 100, 255, 0.1);
    --glow-color: rgba(200, 100, 255, 0.5);
}
```

### Tema Minimalista

```css
:root {
    --primary-magenta: #333333;
    --primary-purple: #555555;
    --primary-cyan: #777777;
    --primary-lavender: #999999;
    --dark-bg: #f5f5f5;
    --darker-bg: #ffffff;
    --text-primary: #000000;
    --text-secondary: #666666;
}
```

---

## 📝 Cambiar Tipografía

En `styles.css`:

```css
body {
    /* Cambiar a tu fuente preferida */
    font-family: 'Poppins', 'Segoe UI', sans-serif;
}

.nav-logo {
    font-family: 'Bebas Neue', sans-serif; /* Fuente elegante */
    letter-spacing: 3px;
}

.info-panel h1 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
}
```

### Google Fonts (Añadir al `<head>` de index.html)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Bebas+Neue&display=swap" rel="stylesheet">
```

---

## 📱 Cambiar la Navegación

### Agregar más opciones

En `index.html`:

```html
<ul class="nav-menu">
    <li><a href="#" class="nav-link">Inicio</a></li>
    <li><a href="#" class="nav-link">Programas</a></li>
    <li><a href="#" class="nav-link">Transmisión</a></li>
    <li><a href="#" class="nav-link">Contacto</a></li>
    <li><a href="#" class="nav-link">Redes Sociales</a></li>
</ul>
```

### Iconos en la navegación

```html
<li><a href="#" class="nav-link">
    <span>🎬</span> Programas
</a></li>
```

---

## 🎥 Personalización del Panel de Información

### Agregar más detalles

En `index.html`:

```html
<div class="info-panel">
    <div class="info-content">
        <h1 id="programTitle">Pantalla de Espera</h1>
        <p id="programDescription">La transmisión comenzará próximamente</p>
        
        <!-- Agregar más elementos -->
        <div class="extra-info">
            <p id="programSchedule" style="color: #888; font-size: 14px;"></p>
            <p id="nextProgram" style="color: #888; font-size: 14px;"></p>
        </div>
        
        <div class="status-info">
            <span id="statusBadge" class="status-badge offline">PRÓXIMAMENTE</span>
            <span id="viewerCount" class="viewer-count" style="display: none;">👁️ <span id="viewers">0</span> viendo</span>
        </div>
    </div>
</div>
```

### Actualizar en JavaScript

```javascript
function updateUI(title, description, isLive, schedule = '', nextProgram = '') {
    DOM.programTitle.textContent = title;
    DOM.programDescription.textContent = description;
    
    if (schedule) {
        document.getElementById('programSchedule').textContent = '📅 ' + schedule;
    }
    if (nextProgram) {
        document.getElementById('nextProgram').textContent = 'Siguiente: ' + nextProgram;
    }
    
    // ... resto del código ...
}
```

---

## ✨ Efectos Avanzados

### Agregar efecto de "glitch" al cambiar

En `styles.css`:

```css
@keyframes glitch {
    0%, 100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
    20% { clip-path: polygon(0 20%, 100% 0, 100% 80%, 0 100%); }
    40% { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 0); }
    60% { clip-path: polygon(0 0, 100% 20%, 100% 100%, 0 80%); }
    80% { clip-path: polygon(0 10%, 100% 0, 100% 90%, 0 100%); }
}

.video-container.transition {
    animation: glitch 0.3s ease-in-out;
}
```

En `script.js`:

```javascript
function transitionToElement(targetElement) {
    targetElement.classList.add('transition');
    document.querySelectorAll('.video-container').forEach(el => {
        el.classList.remove('active');
    });
    targetElement.classList.add('active');
    
    // Remover clase después de la animación
    setTimeout(() => targetElement.classList.remove('transition'), 300);
}
```

### Animación de fondo

```css
@keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

body {
    background: linear-gradient(135deg, #8832d9 0%, #5ebfdb 50%, #d878e3 100%);
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
}
```

---

## 🎙️ Agregar Chat o Comentarios en Vivo

Integración simple con comentarios:

```html
<!-- En index.html, después del reproductor -->
<div class="chat-widget">
    <iframe 
        id="chat"
        src="https://www.youtube.com/live_chat?v=VIDEO_ID&embed_domain=tudominio.com"
        width="300"
        height="400">
    </iframe>
</div>
```

CSS:

```css
.chat-widget {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 320px;
    height: 400px;
    background: rgba(0,0,0,0.8);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    z-index: 150;
}
```

---

## 📊 Agregar Estadísticas en Vivo

```html
<div class="live-stats">
    <div class="stat-item">
        <span class="stat-label">Viendo Ahora</span>
        <span class="stat-value" id="currentViewers">0</span>
    </div>
    <div class="stat-item">
        <span class="stat-label">Duración</span>
        <span class="stat-value" id="streamDuration">00:00</span>
    </div>
</div>
```

---

## 🔔 Notificaciones Personalizadas

Cuando inicia/termina el directo:

```javascript
function notifyUserLiveStarted() {
    if (Notification.permission === 'granted') {
        new Notification('RTN', {
            title: '¡En Directo!',
            body: 'Tu programa favorito ha comenzado',
            icon: 'assets/images/icon.png'
        });
    }
}

// Solicitar permiso
Notification.requestPermission();
```

---

## 💾 Guardar Preferencias del Usuario

```javascript
// Guardar estado actual en localStorage
localStorage.setItem('rtn-last-video', AppState.currentVideoId);
localStorage.setItem('rtn-was-live', AppState.isLive);

// Recuperar al recargar
function loadPreferences() {
    const lastVideo = localStorage.getItem('rtn-last-video');
    const wasLive = localStorage.getItem('rtn-was-live') === 'true';
    
    if (wasLive && lastVideo) {
        switchToLive(lastVideo, 'Restaurando directo...', '');
    }
}

loadPreferences(); // Llamar al inicio
```

---

¡Personaliza tu canal de RTN para que sea único y refleje tu marca! 🚀
