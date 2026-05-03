# Guía de Configuración Rápida - RTN Live

## 📋 Pasos para Empezar en 5 Minutos

### 1️⃣ Obtener API Key de YouTube (3 min)

**Opción Rápida - Usando Google Cloud Console:**

1. Abre: https://console.cloud.google.com/apis/dashboard
2. Haz clic en **"Crear Proyecto"**
3. Nombre: `RTN-Live` → **Crear**
4. Espera a que se active el proyecto
5. Busca **"YouTube Data API v3"** en la barra de búsqueda
6. Haz clic en ella → **Habilitar**
7. Ve a **Credenciales** (lado izquierdo)
8. Haz clic en **"Crear Credencial"** → **Clave API**
9. ¡Copia tu clave API! (comienza con `AIzaSy...`)

**Guardar tu clave temporal (cópiala en un lugar seguro):**
```
Tu API Key: ___________________________________
```

### 2️⃣ Obtener Channel ID de YouTube (1 min)

**Opción 1 - Si tienes un canal:**
1. Ve a tu canal: youtube.com/@TuCanal
2. Abre la pestaña **"Acerca de"**
3. Busca el **ID del canal** (está en los detalles)
4. Cópialo

**Opción 2 - URL para encontrarlo:**
```
https://www.youtube.com/@TUNOMBRE/about
↓
El Channel ID está en el código de la página
```

**Guardar tu Channel ID:**
```
Tu Channel ID: ___________________________________
```

### 3️⃣ Configurar el Proyecto (1 min)

1. Abre el archivo `config.js`
2. Busca estas líneas:
```javascript
YOUTUBE_API_KEY: 'TU_CLAVE_API_AQUI',
YOUTUBE_CHANNEL_ID: 'TUCANALESAQUI',
```

3. Reemplaza con tus valores:
```javascript
YOUTUBE_API_KEY: 'AIzaSyD_xxxxxxxxxxxxx',
YOUTUBE_CHANNEL_ID: 'UCxxxxxxxxxxxxx',
```

4. **Guarda el archivo** (Ctrl+S)

### 4️⃣ Probar el Proyecto

1. **Abre `index.html` en tu navegador** (doble clic)
2. Deberías ver:
   - Un fondo con colores de RTN
   - Un vídeo de espera (o fondo de color)
   - La navegación en la parte superior

3. **Modo prueba:**
   - Presiona F12 para abrir la consola
   - Escribe: `DEBUG.help()`
   - Intenta: `DEBUG.switchToLive()` para simular directo

---

## 🎬 Cambiar el Vídeo de Espera

### Opción A: Usar un vídeo local

1. Crea las carpetas:
   ```
   RTN-WEB/
   └── assets/
       └── videos/
   ```

2. Coloca tu vídeo MP4 ahí:
   ```
   assets/videos/waiting-screen.mp4
   ```

3. El archivo debería verse así en `config.js`:
   ```javascript
   LOOP_VIDEO_SOURCE: 'assets/videos/waiting-screen.mp4',
   ```

### Opción B: Usar un vídeo de YouTube

1. Ve a YouTube y busca tu vídeo
2. Copia el ID de la URL: `youtube.com/watch?v=VIDEOID`
3. En `config.js`, descomenta esta línea:
   ```javascript
   LOOP_VIDEO_YOUTUBE_ID: 'TU_VIDEO_ID_AQUI',
   ```
4. Reemplaza `TU_VIDEO_ID_AQUI` con tu ID
5. Comenta la otra línea:
   ```javascript
   // LOOP_VIDEO_SOURCE: 'assets/videos/waiting-screen.mp4',
   ```

---

## ✅ Verificación de Funcionamiento

### Checklist Final:

- [ ] API Key configurada en `config.js`
- [ ] Channel ID configurado en `config.js`
- [ ] Abrí `index.html` en el navegador
- [ ] La página muestra contenido
- [ ] Consola abierta sin errores rojos

### Prueba de Detección Automática:

1. Inicia una transmisión en directo en YouTube
2. Espera máximo 10 segundos
3. La página debería cambiar automáticamente al directo
4. Deberías ver el badge "EN DIRECTO" en rojo

---

## 🔧 Cambios Comunes

### Cambiar el intervalo de verificación

En `config.js`:
```javascript
POLLING_INTERVAL: 10000, // Cambiar a 5000 para verificar cada 5 segundos
```

### Cambiar textos de la interfaz

En `config.js`:
```javascript
TEXT: {
    OFFLINE_TITLE: 'Mi Texto de Espera',
    OFFLINE_DESC: 'Descripción personalizada',
    LIVE_TITLE: 'Mi Título de Directo',
    LIVE_DESC: 'Mi descripción de directo',
}
```

### Cambiar colores de marca

En `styles.css`, busca:
```css
:root {
    --primary-magenta: #d878e3;  /* Cambiar este color */
    --primary-purple: #8832d9;
    /* ... etc */
}
```

---

## ⚠️ Errores Comunes

### ❌ "No detecta el directo"
- Verifica que la API Key es correcta
- Verifica que el Channel ID es correcto
- En Google Cloud, asegúrate que "YouTube Data API v3" está **Habilitada**
- Intenta: `DEBUG.checkNow()` en la consola

### ❌ "El vídeo de espera no aparece"
- Verifica que el archivo existe en `assets/videos/waiting-screen.mp4`
- Prueba con un vídeo de YouTube en su lugar
- Abre F12 → Consola para ver errores

### ❌ "Dice 'API Key no configurada'"
- Abriste `config.js` y reemplazaste los valores?
- Recargaste la página después de cambiar `config.js`?
- Copiaste la API Key completa (sin espacios)?

---

## 🌐 Desplegar en Internet

### Opción 1: Vercel (Gratis, recomendado)

1. Sube tu proyecto a GitHub
2. Ve a vercel.com
3. Importa tu repositorio
4. ¡Listo! Tu sitio estará en directo en segundos

### Opción 2: Netlify (Gratis)

1. Sube a GitHub
2. Ve a netlify.com
3. Arrastra tu carpeta RTN-WEB
4. Obtén tu URL en segundos

### Opción 3: Tu propio servidor

1. Copia todos los archivos a tu servidor web
2. Asegúrate de que HTTPS esté habilitado (requerido para YouTube)
3. En Google Cloud, agrega tu dominio a las restricciones

**Importante para seguridad:**
- Ve a Google Cloud → Tu API Key → Restricciones HTTP referer
- Agrega: `https://tudominio.com/*`

---

## 📞 Soporte Rápido

**Si algo no funciona:**

1. Abre la consola: F12
2. Escribe: `DEBUG.help()`
3. Prueba: `DEBUG.checkNow()`
4. Mira los mensajes de error

**Mensaje de error común:**

```
"Configuración de YouTube API no completada. Usando modo simulado."
```

**Solución:** Asegúrate de reemplazar `TU_CLAVE_API_AQUI` y `TUCANALESAQUI` en `config.js`

---

## 🚀 ¡Listo!

Ya tienes tu canal de TV en directo funcionando.

**Próximos pasos:**
- Personaliza los colores en `styles.css`
- Crea tu vídeo de espera personalizado
- Prueba el directo en vivo
- ¡Comparte con tu comunidad!

---

Preguntas? Abre la consola y escribe: `DEBUG.help()`
