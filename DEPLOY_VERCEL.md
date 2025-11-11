# 🚀 DEPLOY A VERCEL - GUÍA COMPLETA

## ✅ PREPARACIÓN COMPLETA

### 1. Verificar Build Local
```bash
cd C:\studio-nexorapro
npm run build
```

**Debe completar sin errores** ✅

---

## 📋 PASOS PARA DEPLOY EN VERCEL

### OPCIÓN A: Desde GitHub (Recomendado)

#### Paso 1: Conectar Repositorio
1. Ve a: https://vercel.com
2. Inicia sesión con GitHub
3. Click en "Add New Project"
4. Selecciona: `Kosovo9/Studio-Nexora-final`
5. Selecciona branch: `feature/referral-program` (o `main` si haces merge)

#### Paso 2: Configuración del Proyecto
Vercel detectará automáticamente:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**✅ NO necesitas cambiar nada** - Vercel lo detecta automáticamente

#### Paso 3: Variables de Entorno
Agrega estas variables en Vercel:

```
VITE_SUPABASE_URL=tu-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_APP_URL=https://tu-dominio.vercel.app
VITE_GOOGLE_AI_API_KEY=AIzaSyCkL5za2v-SmEd778ba-sUBuO6ldRVJPbE
VITE_EMAIL_PROVIDER=resend
VITE_RESEND_API_KEY=re_tu_key_aqui
VITE_EMAIL_FROM=Studio Nexora <noreply@studionexora.com>
VITE_ADMIN_EMAIL=tu@email.com
```

**Cómo agregar:**
1. En la configuración del proyecto
2. Ve a "Environment Variables"
3. Agrega cada variable
4. Selecciona: Production, Preview, Development

#### Paso 4: Deploy
1. Click en "Deploy"
2. Espera 2-3 minutos
3. ✅ Tu proyecto estará en: `https://tu-proyecto.vercel.app`

---

### OPCIÓN B: Desde CLI (Alternativa)

#### Paso 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

#### Paso 2: Login
```bash
vercel login
```

#### Paso 3: Deploy
```bash
cd C:\studio-nexorapro
vercel
```

Sigue las instrucciones:
- Link to existing project? **No** (primera vez)
- Project name: `studio-nexora`
- Directory: `./` (enter)
- Override settings? **No**

#### Paso 4: Deploy a Producción
```bash
vercel --prod
```

---

## 🔧 CONFIGURACIÓN ADICIONAL

### Dominio Personalizado (Opcional)
1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio: `studionexora.com`
3. Sigue las instrucciones de DNS

### Variables de Entorno por Ambiente
- **Production:** Variables para producción
- **Preview:** Variables para PRs
- **Development:** Variables para desarrollo local

---

## ✅ VERIFICACIÓN POST-DEPLOY

### Checklist:
- [ ] Build completó sin errores
- [ ] URL de producción funciona
- [ ] Variables de entorno configuradas
- [ ] Supabase conectado correctamente
- [ ] Formularios funcionan
- [ ] Imágenes cargan correctamente
- [ ] Responsive funciona en móvil
- [ ] No hay errores en consola del navegador

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Build Failed"
**Solución:**
1. Revisa los logs en Vercel
2. Verifica que `npm run build` funcione localmente
3. Revisa variables de entorno

### Error: "Module not found"
**Solución:**
1. Verifica que todas las dependencias estén en `package.json`
2. Ejecuta `npm install` localmente
3. Verifica que no haya imports incorrectos

### Error: "Environment variable not found"
**Solución:**
1. Verifica que todas las variables estén en Vercel
2. Revisa que los nombres sean correctos (VITE_*)
3. Re-deploy después de agregar variables

### Error: "404 on routes"
**Solución:**
- El archivo `vercel.json` ya está configurado con rewrites
- Si persiste, verifica la configuración de rutas

---

## 📊 MONITOREO

### Vercel Analytics (Opcional)
1. Ve a: Settings → Analytics
2. Habilita Vercel Analytics
3. Monitorea performance y errores

### Logs en Tiempo Real
1. Ve a: Deployments → [Tu deployment]
2. Click en "Functions" para ver logs
3. Monitorea errores en producción

---

## 🚀 DEPLOY AUTOMÁTICO

Vercel hace deploy automático cuando:
- ✅ Haces push a `main` (producción)
- ✅ Haces push a otras branches (preview)
- ✅ Haces merge de PR (preview)

**No necesitas hacer nada manual** después del setup inicial.

---

## ✅ CHECKLIST FINAL

Antes de considerar el deploy completo:

- [ ] Build local funciona (`npm run build`)
- [ ] Repositorio en GitHub actualizado
- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] URL de producción funciona
- [ ] Todas las funcionalidades probadas
- [ ] No hay errores en consola

---

## 🎯 RESULTADO FINAL

Después del deploy, tendrás:

✅ **URL de Producción:** `https://tu-proyecto.vercel.app`
✅ **Deploy Automático:** Cada push a GitHub
✅ **Preview URLs:** Para cada PR
✅ **SSL Automático:** HTTPS habilitado
✅ **CDN Global:** Performance optimizado

---

**¡Tu proyecto estará 100% funcional en producción!** 🚀

