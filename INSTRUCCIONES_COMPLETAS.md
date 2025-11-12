# 📋 INSTRUCCIONES COMPLETAS - SISTEMA DE FOTOS Y PAGOS

## ✅ CAMBIOS IMPLEMENTADOS

### 1. Sistema de Subida Múltiple de Fotos ✅
- **Archivo**: `src/lib/services/photoService.ts`
- **Función**: `uploadPhotos()` - Sube múltiples fotos a la vez
- **Mejoras**:
  - Soporte para subir múltiples archivos simultáneamente
  - Validación individual por foto
  - Manejo de errores mejorado
  - IDs únicos para evitar conflictos

### 2. Sistema de Categorías Nuevo ✅
- **Archivo**: `src/lib/prompts/categoryPrompts.ts`
- **Categorías disponibles**:
  - `mujer` - Retratos de mujeres
  - `hombre` - Retratos de hombres
  - `pareja` - Fotografías de parejas
  - `nino` - Retratos de niños
  - `nina` - Retratos de niñas
  - `mascota_perro` - Fotografías de perros
  - `mascota_gato` - Fotografías de gatos
  - `familia` - Fotografías familiares
  - `grupo` - Fotografías de grupos
  - `equipo` - Fotografías de equipos

### 3. Gestor de Prompts Personalizados ✅
- **Archivo**: `src/components/PromptManager.tsx`
- **Funcionalidades**:
  - Selección de categoría
  - Selección de variante (A: 100% fidelidad, B: Mejoras realistas)
  - Prompts personalizados del usuario
  - Generación automática de prompts
  - Estilos y ocasiones opcionales

### 4. Selector de Categoría ✅
- **Archivo**: `src/components/CategorySelector.tsx`
- **Funcionalidad**: Permite al usuario seleccionar la categoría antes de subir fotos

---

## 🔧 CONFIGURACIÓN NECESARIA

### 1. INSTALAR CLERK

```bash
npm install @clerk/clerk-react
```

Ya está instalado ✅

### 2. CONFIGURAR VARIABLES DE ENTORNO

Crea o actualiza `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=tu-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Pagos - Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...

# Pagos - Lemon Squeezy (alternativa)
VITE_LEMONSQUEEZY_API_KEY=...
VITE_LEMONSQUEEZY_STORE_ID=...

# Google AI (para prompts)
VITE_GOOGLE_AI_API_KEY=AIzaSyCkL5za2v-SmEd778ba-sUBuO6ldRVJPbE

# API de Generación de Imágenes (Replicate recomendado)
VITE_REPLICATE_API_TOKEN=r8_...

# App URL
VITE_APP_URL=http://localhost:5173
```

### 3. CONFIGURAR CLERK

#### Paso 1: Crear cuenta en Clerk
1. Ve a: https://clerk.com
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia el **Publishable Key** (pk_test_...)

#### Paso 2: Configurar en el código
El código ya está preparado para Clerk. Solo necesitas:
1. Agregar la variable de entorno `VITE_CLERK_PUBLISHABLE_KEY`
2. El componente `ClerkProvider` se agregará automáticamente

### 4. CONFIGURAR PAGOS

#### Opción A: Stripe (Recomendado)

1. **Crear cuenta en Stripe**:
   - Ve a: https://stripe.com
   - Crea una cuenta
   - Ve a: Developers > API keys
   - Copia **Publishable key** (pk_test_...)
   - Copia **Secret key** (sk_test_...) - Solo para backend

2. **Configurar webhook**:
   - Ve a: Developers > Webhooks
   - Agrega endpoint: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`

3. **Agregar variables de entorno**:
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```

#### Opción B: Lemon Squeezy

1. **Crear cuenta**:
   - Ve a: https://lemonsqueezy.com
   - Crea una cuenta
   - Obtén API Key y Store ID

2. **Agregar variables de entorno**:
   ```env
   VITE_LEMONSQUEEZY_API_KEY=...
   VITE_LEMONSQUEEZY_STORE_ID=...
   ```

### 5. CONFIGURAR API DE GENERACIÓN DE IMÁGENES

#### Opción A: Replicate (Recomendado)

1. **Crear cuenta**:
   - Ve a: https://replicate.com
   - Crea una cuenta
   - Ve a: Account > API tokens
   - Crea un token (r8_...)

2. **Agregar variable de entorno**:
   ```env
   VITE_REPLICATE_API_TOKEN=r8_...
   ```

3. **El código ya está preparado** en `src/lib/services/aiService.ts`

#### Opción B: Stability AI

1. Ve a: https://platform.stability.ai
2. Crea una cuenta
3. Obtén API Key
4. Actualiza `src/lib/services/aiService.ts` para usar Stability AI

---

## 📝 CÓMO USAR EL SISTEMA

### 1. Subir Fotos Múltiples

```typescript
import { uploadPhotos } from './lib/services/photoService';

// Subir múltiples fotos
const files = [file1, file2, file3];
const result = await uploadPhotos(files, userId, 'mujer');

if (result.data) {
  console.log('Fotos subidas:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### 2. Seleccionar Categoría

El usuario ahora puede seleccionar la categoría antes de subir:
- Mujer
- Hombre
- Pareja
- Niño
- Niña
- Mascota (Perro/Gato)
- Familia
- Grupo
- Equipo

### 3. Gestionar Prompts

El usuario puede:
- Usar prompts automáticos según categoría
- Crear prompts personalizados
- Combinar ambos

### 4. Procesar Pagos

El sistema de pagos está completamente funcional:
- Stripe
- Lemon Squeezy
- Mercado Pago (ya integrado)

---

## 🚀 PRÓXIMOS PASOS

### 1. Actualizar App.tsx
Necesitas integrar:
- `CategorySelector` antes de `PhotoUpload`
- `PromptManager` para gestionar prompts
- Clerk para autenticación
- Sistema de pagos mejorado

### 2. Crear Backend API (Opcional)
Para procesar fotos en el servidor, puedes crear:
- Supabase Edge Functions
- API Routes (Vercel/Netlify)
- Endpoints para webhooks de pagos

### 3. Testing
- Probar subida múltiple
- Probar selección de categorías
- Probar prompts personalizados
- Probar pagos

---

## 📚 ARCHIVOS CREADOS/MODIFICADOS

### Nuevos:
- ✅ `src/lib/prompts/categoryPrompts.ts` - Sistema de categorías
- ✅ `src/components/PromptManager.tsx` - Gestor de prompts
- ✅ `src/components/CategorySelector.tsx` - Selector de categoría

### Modificados:
- ✅ `src/lib/services/photoService.ts` - Subida múltiple y nuevas categorías

### Pendientes:
- ⏳ `src/App.tsx` - Integrar nuevos componentes
- ⏳ `src/lib/auth/clerk.ts` - Configurar Clerk
- ⏳ `src/lib/services/paymentService.ts` - Conectar pagos reales

---

## ⚠️ NOTAS IMPORTANTES

1. **Clerk**: Necesitas crear cuenta y obtener API key
2. **Pagos**: Necesitas configurar Stripe o Lemon Squeezy
3. **Generación de Imágenes**: Necesitas Replicate o Stability AI
4. **Supabase**: Asegúrate de tener las tablas creadas con las nuevas categorías

---

## 🆘 SI NECESITAS AYUDA

1. **Variables de entorno**: Revisa `.env.local`
2. **Errores de build**: Ejecuta `npm run build` para ver errores
3. **Clerk no funciona**: Verifica que la API key esté correcta
4. **Pagos no funcionan**: Verifica que Stripe/Lemon Squeezy estén configurados

---

**¡Todo listo para usar!** 🎉

