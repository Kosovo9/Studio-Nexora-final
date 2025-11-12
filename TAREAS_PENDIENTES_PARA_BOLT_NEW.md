# 📋 TAREAS PENDIENTES COMPLETAS - STUDIO NEXORA

## 🎯 OBJETIVO
Completar todas las tareas pendientes del proyecto Studio Nexora para llevarlo al 100% funcional.

**Repositorio:** https://github.com/Kosovo9/studio-nexorapro  
**Branch:** `main`

---

## 📊 RESUMEN EJECUTIVO

### Estado Actual:
- ✅ **UI/UX:** 100% completo
- ✅ **Base de Datos:** 100% completo (migraciones SQL listas)
- ✅ **Frontend Logic:** 90% completo
- ⚠️ **Backend/APIs:** 0% - CRÍTICO
- ⚠️ **Integraciones:** 30% - UI listo, falta backend
- ❌ **Deploy:** 0% - Pendiente

**Progreso General: 60%** → **Objetivo: 100%**

---

## 🔴 PRIORIDAD 1: CRÍTICO (Hacer Primero)

### 1.1 ORGANIZAR VARIABLES DE ENTORNO ⚠️ URGENTE

**Problema:**
- Variables esparcidas en múltiples archivos
- Sin validación centralizada
- Difícil de mantener

**Tarea:**
1. Crear `src/lib/config/env.ts` centralizado
2. Agrupar todas las variables por categoría:
   - Supabase (url, anonKey)
   - Pagos (Stripe, Lemon Squeezy, Mercado Pago)
   - IA (Google AI, Replicate)
   - Email (Resend, SendGrid)
   - App (url, availableCash)
   - Auth (Clerk)
3. Validar variables críticas con warnings
4. Actualizar TODOS los archivos para usar `env.*` en lugar de `import.meta.env.VITE_*`
5. Crear `.env.example` documentado

**Archivos a actualizar:**
- `src/lib/supabase.ts`
- `src/lib/services/paymentService.ts`
- `src/lib/services/aiService.ts`
- `src/lib/auth/clerk.ts`
- `src/lib/notifications/email-templates.ts`
- `src/lib/webhooks/purchase-webhook.ts`
- Y todos los demás que usen variables

**Resultado esperado:**
- Un solo lugar para todas las variables
- Mejor autocompletado TypeScript
- Validación centralizada
- Fácil mantenimiento

---

### 1.2 CONECTAR INTEGRACIÓN DE IA PARA GENERACIÓN DE IMÁGENES

**Estado Actual:**
- `src/lib/services/aiService.ts` tiene estructura pero no genera imágenes reales
- Usa imágenes demo de Pexels
- Hay TODO: "Replace with actual image generation API"

**Tarea:**
1. **Elegir proveedor de IA:**
   - Google AI Studio (ya tiene key: `AIzaSyCkL5za2v-SmEd778ba-sUBuO6ldRVJPbE`)
   - O Replicate/OpenAI/Stability AI
   
2. **Implementar generación real:**
   - Función `generateImageWithAPI()` que llame a la API real
   - Generar versión A (100% fidelidad al original)
   - Generar versión B (mejoras realistas)
   - Manejo de errores y retry logic
   - Progreso de generación

3. **Watermarking:**
   - Aplicar watermark a previews (versión con marca de agua)
   - Remover watermark después de pago
   - Usar biblioteca como `sharp` o servicio externo

4. **Almacenamiento:**
   - Subir imágenes generadas a Supabase Storage
   - Guardar metadata en tabla `generated_photos`
   - URLs públicas para preview
   - URLs privadas para descarga

**Archivos a modificar:**
- `src/lib/services/aiService.ts` - Implementar generación real
- `src/lib/services/photoService.ts` - Conectar con Supabase Storage
- Crear `src/lib/services/watermarkService.ts` - Nuevo servicio

**Resultado esperado:**
- Fotos generadas por IA funcionando
- 2 versiones por foto (A y B)
- Watermark en previews
- Almacenamiento en Supabase

---

### 1.3 INTEGRAR SISTEMA DE PAGOS REAL

**Estado Actual:**
- `src/lib/services/paymentService.ts` tiene estructura pero no procesa pagos reales
- Componentes UI listos (Stripe, Lemon Squeezy, Mercado Pago)
- Webhooks configurados pero no conectados

**Tarea:**

#### Stripe Integration:
1. Implementar `createStripeCheckout()` real
   - Crear sesión de checkout en Stripe
   - Redirigir a Stripe Checkout
   - Manejar retorno (success/cancel)

2. Webhooks de Stripe:
   - Endpoint para recibir webhooks
   - Actualizar estado de orden cuando pago se complete
   - Procesar códigos AFF-XXXXX y REF-XXXXX
   - Calcular comisiones y descuentos

3. Verificación de pagos:
   - Verificar estado de pago antes de permitir descarga
   - Bloquear descarga si pago no está completo

#### Lemon Squeezy (Alternativa):
1. Similar a Stripe pero con API de Lemon Squeezy
2. Checkout y webhooks correspondientes

#### Mercado Pago:
1. Ya tiene componente `MercadoPagoPayment.tsx`
2. Conectar con API de Mercado Pago
3. Procesar transferencias bancarias

**Archivos a modificar:**
- `src/lib/services/paymentService.ts` - Implementar pagos reales
- `src/lib/webhooks/purchase-webhook.ts` - Procesar webhooks reales
- `src/components/MercadoPagoPayment.tsx` - Conectar con API

**Resultado esperado:**
- Pagos funcionando con Stripe/Lemon Squeezy/Mercado Pago
- Webhooks actualizando órdenes automáticamente
- Descarga solo después de pago confirmado

---

### 1.4 CONFIGURAR SUPABASE STORAGE

**Estado Actual:**
- Cliente Supabase configurado pero sin conexión real
- Variables de entorno faltantes
- Storage buckets no creados

**Tarea:**
1. **Crear Storage Buckets:**
   - `photo-uploads` - Fotos subidas por usuarios
   - `generated-photos` - Fotos generadas por IA
   - `watermarked-previews` - Previews con marca de agua

2. **Configurar Storage Policies:**
   - Política para upload (usuarios autenticados)
   - Política para lectura pública (previews)
   - Política para lectura privada (descargas después de pago)

3. **Implementar funciones de Storage:**
   - `uploadToStorage()` - Ya existe, verificar que funcione
   - `getPublicUrl()` - Ya existe, verificar que funcione
   - `downloadFromStorage()` - Ya existe, verificar que funcione
   - `deleteFromStorage()` - Ya existe, verificar que funcione

4. **Conectar con servicios:**
   - `photoService.ts` - Subir fotos reales
   - `aiService.ts` - Guardar fotos generadas
   - `watermarkService.ts` - Guardar previews con watermark

**Archivos a modificar:**
- `src/lib/supabase.ts` - Verificar funciones de Storage
- Crear script de setup para buckets (opcional)

**Resultado esperado:**
- Storage funcionando
- Fotos subidas y almacenadas correctamente
- URLs públicas/privadas funcionando

---

## 🟡 PRIORIDAD 2: IMPORTANTE (Hacer Después)

### 2.1 COMPLETAR SISTEMA DE AFILIADOS

**Estado Actual:**
- UI completo (`AffiliateSection.tsx`, `AffiliateTracking.tsx`)
- Servicios creados pero no completamente funcionales
- Códigos AFF-XXXXX generados pero no trackeados

**Tarea:**
1. **Generación automática de códigos:**
   - Cuando usuario se registra como afiliado
   - Código único AFF-XXXXX
   - Guardar en tabla `affiliates`

2. **Tracking real de clicks:**
   - Registrar cada click en `affiliate_clicks`
   - Asociar compra con código usado
   - Calcular comisión automáticamente

3. **Dashboard con datos reales:**
   - Estadísticas desde base de datos
   - Ganancias pendientes
   - Historial de transacciones
   - Métodos de pago

4. **Pagos a afiliados:**
   - Calcular comisiones automáticamente
   - Sistema de pagos quincenales
   - Notificaciones cuando se procesa pago

**Archivos a modificar:**
- `src/lib/affiliates/affiliate-service.ts` - Completar funcionalidades
- `src/lib/services/paymentProcessingService.ts` - Procesar pagos
- `src/components/AffiliateTracking.tsx` - Conectar con datos reales
- `src/components/AffiliatePaymentsDashboard.tsx` - Mostrar datos reales

**Resultado esperado:**
- Sistema de afiliados 100% funcional
- Tracking de clicks y conversiones
- Cálculo automático de comisiones
- Dashboard con datos reales

---

### 2.2 COMPLETAR SISTEMA DE REFERIDOS

**Estado Actual:**
- UI completo (`ReferralSection.tsx`, `ReferralDashboard.tsx`)
- Servicios creados pero no completamente funcionales
- Códigos REF-XXXXX generados pero no aplicados

**Tarea:**
1. **Generación automática de códigos:**
   - Cuando usuario se registra
   - Código único REF-XXXXX
   - Guardar en tabla `referral_discounts`

2. **Aplicación de descuento:**
   - Detectar código REF-XXXXX en checkout
   - Aplicar 15% de descuento automáticamente
   - Registrar en base de datos

3. **Tracking de conversiones:**
   - Registrar cuando referido compra
   - Notificar al referidor
   - Actualizar estadísticas

4. **Dashboard con datos reales:**
   - Referidos pendientes/completados
   - Descuentos aplicados
   - Estadísticas reales

**Archivos a modificar:**
- `src/lib/referrals/referral-service.ts` - Completar funcionalidades
- `src/lib/webhooks/purchase-webhook.ts` - Procesar códigos REF-XXXXX
- `src/components/ReferralDashboard.tsx` - Conectar con datos reales

**Resultado esperado:**
- Sistema de referidos 100% funcional
- Descuentos aplicados automáticamente
- Tracking de conversiones
- Dashboard con datos reales

---

### 2.3 COMPLETAR PANEL DE ADMINISTRACIÓN

**Estado Actual:**
- UI completo (`AdminPanel.tsx`, `APISettings.tsx`)
- Componentes visuales pero sin datos reales
- Sin autenticación de admin

**Tarea:**
1. **Autenticación de admin:**
   - Verificar rol de admin en Supabase
   - Proteger rutas de admin
   - Middleware de autenticación

2. **Dashboard con estadísticas reales:**
   - Total de usuarios
   - Total de órdenes
   - Ingresos totales
   - Fotos generadas
   - Datos desde base de datos

3. **Gestión de usuarios:**
   - Lista de usuarios
   - Ver perfil de usuario
   - Bloquear/desbloquear usuarios

4. **Gestión de órdenes:**
   - Lista de órdenes
   - Ver detalles de orden
   - Cambiar estado de orden
   - Reembolsos

5. **Configuración de APIs:**
   - Guardar configuraciones en `api_configurations`
   - Probar conexiones
   - Actualizar keys

**Archivos a modificar:**
- `src/components/AdminPanel.tsx` - Conectar con datos reales
- `src/components/APISettings.tsx` - Guardar en base de datos
- Crear `src/lib/auth/adminAuth.ts` - Autenticación de admin

**Resultado esperado:**
- Panel admin 100% funcional
- Estadísticas reales
- Gestión de usuarios y órdenes
- Configuración de APIs funcional

---

### 2.4 IMPLEMENTAR NOTIFICACIONES REALES

**Estado Actual:**
- `src/lib/notifications/notification-service.ts` tiene estructura
- `src/lib/notifications/email-templates.ts` tiene templates
- Hay TODOs: "Integrar con servicio de email real"

**Tarea:**
1. **Integrar servicio de email:**
   - Resend o SendGrid
   - Enviar emails reales
   - Templates HTML funcionando

2. **Notificaciones automáticas:**
   - Cuando foto está lista (generación completa)
   - Cuando pago se completa
   - Cuando referido compra
   - Cuando afiliado gana comisión
   - Recordatorios de pedidos pendientes

3. **Notificaciones en tiempo real:**
   - Usar Supabase Realtime
   - O WebSockets
   - Notificaciones en la UI

**Archivos a modificar:**
- `src/lib/notifications/notification-service.ts` - Integrar email real
- `src/lib/notifications/email-templates.ts` - Verificar templates
- `src/components/HelpDeskChat.tsx` - Notificaciones en UI

**Resultado esperado:**
- Emails funcionando
- Notificaciones automáticas
- Notificaciones en tiempo real en UI

---

## 🟢 PRIORIDAD 3: MEJORAS (Nice to Have)

### 3.1 MEJORAR UI/UX

**Tareas:**
1. **Hero Section:**
   - Diseño más moderno
   - Mejor jerarquía visual
   - Animaciones más fluidas
   - Testimonios flotantes

2. **Pricing Cards:**
   - Diseño premium (glassmorphism)
   - Badge "Más Popular"
   - Comparación visual
   - Animaciones hover 3D

3. **Photo Upload:**
   - UI más intuitiva
   - Progress bar de subida
   - Preview mejorado
   - Edición básica (rotar, recortar)

4. **Preview Comparison:**
   - Slider interactivo before/after
   - Zoom en hover
   - Descarga individual
   - Fullscreen mode

5. **General:**
   - Loading states más elegantes (skeletons)
   - Error handling más amigable
   - Micro-interacciones
   - Dark mode opcional
   - Optimización mobile

**Ver:** `BOLT_NEW_INFORMACION_COMPLETA.md` para detalles completos

---

### 3.2 AGREGAR NUEVAS FUNCIONALIDADES

**Tareas:**
1. **Sección de Testimonios:**
   - Grid con fotos de clientes
   - Ratings con estrellas
   - Carrusel automático
   - Filtros por categoría

2. **Galería Pública:**
   - Galería de fotos generadas (con permiso)
   - Filtros por categoría, estilo, ocasión
   - Búsqueda
   - Compartir en redes sociales

3. **Dashboard de Usuario Mejorado:**
   - Historial de pedidos
   - Biblioteca de fotos generadas
   - Estadísticas de uso
   - Configuración de perfil

4. **Sistema de Notificaciones:**
   - Notificaciones en tiempo real
   - Email cuando fotos están listas
   - Recordatorios y ofertas

5. **Blog/Recursos:**
   - Artículos sobre fotografía profesional
   - Tips y guías
   - Casos de éxito
   - SEO optimizado

**Ver:** `BOLT_NEW_INFORMACION_COMPLETA.md` para detalles completos

---

## 📋 CHECKLIST COMPLETO

### Backend/APIs
- [ ] Organizar variables de entorno en `src/lib/config/env.ts`
- [ ] Conectar API de IA para generación real de imágenes
- [ ] Implementar watermarking de imágenes
- [ ] Conectar Supabase Storage (buckets y policies)
- [ ] Integrar Stripe/Lemon Squeezy/Mercado Pago real
- [ ] Implementar webhooks de pago
- [ ] Verificación de pagos antes de descarga

### Funcionalidades Core
- [ ] Upload real de imágenes a Supabase Storage
- [ ] Generación de imágenes con IA (versión A y B)
- [ ] Watermarking de previews
- [ ] Remoción de watermark después de pago
- [ ] Procesamiento de pagos real
- [ ] Descarga de imágenes sin watermark
- [ ] Notificaciones funcionando (email + UI)

### Sistemas Adicionales
- [ ] Sistema de afiliados 100% funcional
- [ ] Sistema de referidos 100% funcional
- [ ] Panel admin con datos reales
- [ ] Dashboard de estadísticas
- [ ] Autenticación de admin

### Mejoras UI/UX
- [ ] Mejorar Hero Section
- [ ] Rediseñar Pricing Cards
- [ ] Mejorar Photo Upload
- [ ] Mejorar Preview Comparison
- [ ] Loading states elegantes
- [ ] Error handling mejorado
- [ ] Dark mode opcional
- [ ] Optimización mobile

### Nuevas Funcionalidades
- [ ] Sección de Testimonios
- [ ] Galería Pública
- [ ] Dashboard de Usuario mejorado
- [ ] Blog/Recursos
- [ ] Sistema de notificaciones completo

### Deploy
- [ ] Build sin errores
- [ ] Variables de entorno en Vercel
- [ ] Deploy en Vercel
- [ ] Dominio configurado
- [ ] SSL activo
- [ ] Testing end-to-end

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Día 1: Configuración Base**
   - Organizar variables de entorno
   - Configurar Supabase Storage
   - Crear `.env.example`

2. **Día 2: Integración de IA**
   - Conectar API de IA
   - Implementar generación real
   - Watermarking

3. **Día 3: Sistema de Pagos**
   - Integrar Stripe/Lemon Squeezy
   - Webhooks
   - Verificación de pagos

4. **Día 4: Sistemas Adicionales**
   - Completar afiliados
   - Completar referidos
   - Panel admin

5. **Día 5: Mejoras y Deploy**
   - Mejoras UI/UX
   - Testing
   - Deploy

---

## 📝 NOTAS IMPORTANTES

1. **Mantener Compatibilidad:**
   - No romper funcionalidades existentes
   - Mantener sistema de traducciones (ES/EN)
   - Preservar integraciones actuales

2. **Mejores Prácticas:**
   - Componentes reutilizables
   - Código limpio y comentado
   - TypeScript estricto
   - Responsive-first design
   - Performance optimizado

3. **Testing:**
   - Probar cada funcionalidad después de implementarla
   - Verificar que no se rompió nada existente
   - Testing responsive
   - Testing de performance

4. **Documentación:**
   - Comentar código complejo
   - Actualizar README si es necesario
   - Documentar nuevas APIs

---

## 🚀 RESULTADO FINAL ESPERADO

Después de completar todas las tareas:

✅ **Proyecto 100% funcional**
- Generación de fotos con IA funcionando
- Pagos reales funcionando
- Afiliados y referidos funcionando
- Panel admin completo
- Notificaciones funcionando
- Deploy en producción

✅ **Código organizado y mantenible**
- Variables centralizadas
- Código limpio
- Bien documentado

✅ **UI/UX mejorado**
- Diseño moderno y premium
- Mejor experiencia de usuario
- Responsive optimizado

---

**¡Listo para que Bolt.new complete todas las tareas pendientes!** 🚀

**Repositorio:** https://github.com/Kosovo9/studio-nexorapro  
**Documento de referencia:** `BOLT_NEW_INFORMACION_COMPLETA.md`

