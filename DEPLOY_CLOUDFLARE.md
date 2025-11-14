# 🚀 DEPLOY EN CLOUDFLARE PAGES - GUÍA COMPLETA

## ✅ PREPARACIÓN

### 1. Build Local
```bash
npm run build
```

### 2. Verificar que dist/ se creó correctamente

---

## 📋 OPCIÓN A: Cloudflare Dashboard (Recomendado)

### Paso 1: Conectar Repositorio
1. Ve a: https://dash.cloudflare.com
2. Selecciona tu cuenta
3. Ve a: **Pages** → **Create a project**
4. Conecta tu repositorio de GitHub: `Kosovo9/Studio-Nexora-final`
5. Selecciona branch: `main`

### Paso 2: Configuración del Build
- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (raíz)

### Paso 3: Variables de Entorno
Agrega estas variables en Cloudflare Dashboard:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_GOOGLE_AI_API_KEY=AIzaSyCkL5za2v-SmEd778ba-sUBuO6ldRVJPbE
VITE_REPLICATE_API_TOKEN=r8_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
VITE_APP_URL=https://studio-nexora.pages.dev
```

**Cómo agregar:**
1. En el proyecto de Pages
2. Ve a: **Settings** → **Environment variables**
3. Agrega cada variable
4. Selecciona: **Production**, **Preview**, **Branch previews**

### Paso 4: Deploy
1. Click en **Save and Deploy**
2. Espera 2-3 minutos
3. ✅ Tu proyecto estará en: `https://studio-nexora.pages.dev`

---

## 📋 OPCIÓN B: Cloudflare CLI (Wrangler)

### Paso 1: Instalar Wrangler
```bash
npm install -g wrangler
```

### Paso 2: Login
```bash
wrangler login
```

### Paso 3: Configurar Variables
```bash
wrangler pages secret put VITE_SUPABASE_URL
wrangler pages secret put VITE_SUPABASE_ANON_KEY
wrangler pages secret put VITE_CLERK_PUBLISHABLE_KEY
# ... repite para cada variable
```

### Paso 4: Deploy
```bash
npm run build
wrangler pages deploy dist
```

---

## 🔧 CONFIGURACIÓN ADICIONAL

### Custom Domain
1. En Cloudflare Pages → **Custom domains**
2. Agrega tu dominio: `studio-nexora.com`
3. Cloudflare configurará DNS automáticamente

### Headers de Seguridad
Cloudflare Pages ya incluye:
- HTTPS automático
- CDN global
- DDoS protection
- Cache optimizado

### Performance
- **Edge Network**: 300+ ubicaciones globales
- **Cache**: Automático en edge
- **Compression**: Automático (Brotli/Gzip)

---

## ✅ VERIFICACIÓN POST-DEPLOY

1. ✅ Verifica que la app carga correctamente
2. ✅ Prueba autenticación (Clerk)
3. ✅ Prueba subida de fotos (Supabase)
4. ✅ Verifica que las variables de entorno están configuradas
5. ✅ Prueba en diferentes dispositivos

---

## 🐛 TROUBLESHOOTING

### Error: Variables no encontradas
- Verifica que todas las variables estén en Cloudflare Dashboard
- Asegúrate de que empiecen con `VITE_`

### Error: Build falla
- Verifica `npm run build` localmente primero
- Revisa logs en Cloudflare Dashboard

### Error: CORS
- Cloudflare Pages maneja CORS automáticamente
- Si persiste, verifica configuración de Supabase

---

**Estado**: Listo para producción en Cloudflare Pages 🚀

