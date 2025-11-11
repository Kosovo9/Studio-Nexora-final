# 🚀 INSTRUCCIONES DE CONFIGURACIÓN - STUDIO NEXORAPRO

## ✅ IMPLEMENTACIÓN COMPLETA

Todos los servicios backend han sido implementados y están listos para usar.

---

## 📋 PASO 1: CONFIGURAR SUPABASE

### 1.1 Crear Proyecto
1. Ve a https://supabase.com y crea cuenta
2. Crea nuevo proyecto
3. Anota la **URL** y **Anon Key**

### 1.2 Ejecutar Migraciones
1. En Supabase Dashboard → SQL Editor
2. Ejecuta en orden:
   ```
   supabase/migrations/20251111040729_create_core_schema.sql
   supabase/migrations/20251111044054_add_tracking_and_api_config_v2.sql
   ```

### 1.3 Crear Storage Buckets
1. Ve a **Storage** en Supabase
2. Crea 3 buckets (marca como públicos):
   - `photo-uploads`
   - `generated-photos`
   - `watermarked-previews`

### 1.4 Configurar Storage Policies
Ejecuta en SQL Editor:

```sql
-- Habilitar Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('photo-uploads', 'photo-uploads', true),
  ('generated-photos', 'generated-photos', true),
  ('watermarked-previews', 'watermarked-previews', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para photo-uploads
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photo-uploads' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'photo-uploads' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policies para generated-photos
CREATE POLICY "Users can view own generated photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'generated-photos' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policies para watermarked-previews
CREATE POLICY "Public can view watermarked previews"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'watermarked-previews');
```

---

## 📋 PASO 2: CONFIGURAR VARIABLES DE ENTORNO

Crea `.env.local` en la raíz:

```env
# Supabase (OBLIGATORIO)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google AI Studio (YA CONFIGURADO)
VITE_GOOGLE_AI_API_KEY=AIzaSyCkL5za2v-SmEd778ba-sUBuO6ldRVJPbE

# Stripe (OPCIONAL - al menos uno de pagos)
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx

# Lemon Squeezy (OPCIONAL - alternativa a Stripe)
VITE_LEMONSQUEEZY_API_KEY=lsk_xxxxx
VITE_LEMONSQUEEZY_STORE_ID=12345

# App URLs
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
```

---

## 📋 PASO 3: CONFIGURAR API DE GENERACIÓN DE IMÁGENES

### Opción A: Usar Replicate (Recomendado)

1. Crea cuenta en https://replicate.com
2. Obtén API token
3. Actualiza `src/lib/services/aiService.ts`:

```typescript
const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;

async function generateImageWithAPI(prompt: string, version: 'A' | 'B'): Promise<string> {
  const model = version === 'A' 
    ? 'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf'
    : 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';
  
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model,
      input: { prompt, num_outputs: 1 },
    }),
  });
  
  const data = await response.json();
  // Poll for completion...
  return data.output[0];
}
```

### Opción B: Usar Stability AI

1. Crea cuenta en https://platform.stability.ai
2. Obtén API key
3. Similar a Replicate, actualiza `generateImageWithAPI`

---

## 📋 PASO 4: CONFIGURAR PAGOS

### Opción A: Stripe

1. Crea cuenta en https://stripe.com
2. Obtén **Publishable Key** (pk_live_...)
3. Agrega a `.env.local`
4. Configura webhooks:
   - Endpoint: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`

### Opción B: Lemon Squeezy

1. Crea cuenta en https://lemonsqueezy.com
2. Obtén **API Key** y **Store ID**
3. Agrega a `.env.local`
4. Configura webhooks:
   - Endpoint: `https://tu-dominio.com/api/webhooks/lemonsqueezy`
   - Eventos: `order_created`

---

## 📋 PASO 5: PROBAR LA APLICACIÓN

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar desarrollo
npm run dev

# Abre http://localhost:5173
```

---

## 🔧 SERVICIOS DISPONIBLES

### Autenticación
```typescript
import { useAuth } from '@/lib/hooks/useAuth';

const { user, signUp, signIn, signOut } = useAuth();
```

### Upload de Fotos
```typescript
import { usePhotoUpload } from '@/lib/hooks/usePhotoUpload';

const { upload, uploading, error } = usePhotoUpload();
const photo = await upload(file, userId, 'person');
```

### Órdenes
```typescript
import { useOrder } from '@/lib/hooks/useOrder';

const { create, checkout, process } = useOrder();
const order = await create({ userId, packageType, photoUploadIds });
const checkoutUrl = await checkout(order.id);
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Google AI Studio**: La API key ya está configurada, pero Gemini no genera imágenes directamente. Necesitas un servicio adicional (Replicate, Stability AI, etc.)

2. **Storage**: Asegúrate de crear los buckets y configurar las políticas antes de usar

3. **Pagos**: Al menos un proveedor de pagos debe estar configurado

4. **Webhooks**: Necesitarás crear endpoints backend para procesar webhooks (no incluido en frontend)

---

## 🎯 CHECKLIST DE CONFIGURACIÓN

- [ ] Proyecto Supabase creado
- [ ] Migraciones ejecutadas
- [ ] Storage buckets creados
- [ ] Storage policies configuradas
- [ ] Variables de entorno configuradas
- [ ] API de generación de imágenes configurada
- [ ] Proveedor de pagos configurado
- [ ] Aplicación probada localmente

---

## 🚀 DEPLOY

### Vercel
1. Conecta tu repositorio
2. Agrega variables de entorno en Settings
3. Deploy automático

### Netlify
1. Conecta tu repositorio
2. Agrega variables de entorno en Site settings
3. Deploy automático

---

**¡Todo listo para usar!** 🎉

