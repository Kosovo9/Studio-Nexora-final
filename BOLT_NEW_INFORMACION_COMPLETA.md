# 📋 INFORMACIÓN COMPLETA PARA BOLT.NEW - STUDIO NEXORA

## 🔗 URL DEL REPOSITORIO DE GITHUB

**Repositorio Principal:**
```
https://github.com/Kosovo9/studio-nexorapro
```

**Repositorio Alternativo (también actualizado):**
```
https://github.com/Kosovo9/Studio-Nexora-final
```

**Branch Principal:** `main`

---

## 📱 DESCRIPCIÓN BREVE DE LA APLICACIÓN

**Studio Nexora** es una plataforma web SaaS que transforma selfies en fotografías profesionales hiper-realistas usando Inteligencia Artificial. Los usuarios pueden:

1. **Subir sus fotos** (selfies o fotos casuales)
2. **Elegir un estilo profesional** (estudios, locaciones, escenarios)
3. **Recibir fotos profesionales** generadas por IA en 5 minutos
4. **Pagar** por paquetes de 1, 2 o 3 fotos (o paquetes especiales para mascotas/familia)

### Características Principales:
- ✅ Sistema de subida múltiple de fotos
- ✅ 10 categorías diferentes (mujer, hombre, pareja, niños, mascotas, familia, etc.)
- ✅ 100+ prompts predefinidos para diferentes estilos
- ✅ Sistema de afiliados y referidos
- ✅ Pagos integrados (Stripe/Mercado Pago)
- ✅ Autenticación (Clerk/Supabase)
- ✅ Dashboard de referidos
- ✅ Bilingüe (Español/Inglés)
- ✅ Responsive design completo

### Stack Tecnológico:
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Storage)
- **Autenticación:** Clerk (opcional) + Supabase Auth
- **Pagos:** Stripe / Mercado Pago / Lemon Squeezy
- **Deployment:** Vercel
- **IA:** Google AI API (para generación de imágenes)

---

## 🎨 ELEMENTOS DE UI/UX ESPECÍFICOS A MEJORAR

### 1. **Hero Section** (Prioridad Alta)
**Estado Actual:**
- Tiene 5 fotos animadas en carrusel lateral
- Fondo del planeta Tierra
- Texto animado con fadeInUp
- Botón CTA "Comenzar Ahora"

**Mejoras Necesarias:**
- [ ] **Diseño más moderno y atractivo** - Actualizar con gradientes más vibrantes
- [ ] **Mejor jerarquía visual** - Hacer el CTA más prominente
- [ ] **Animaciones más fluidas** - Mejorar transiciones del carrusel
- [ ] **Video de fondo opcional** - Agregar opción de video hero
- [ ] **Estadísticas más visibles** - Destacar números (50k+ clientes, 5 min entrega)
- [ ] **Testimonios flotantes** - Agregar testimonios animados

### 2. **Pricing Cards** (Prioridad Alta)
**Estado Actual:**
- 5 paquetes: 1 foto, 2 fotos, 3 fotos, Mascota, Familia
- Precios mostrados
- Botón "Seleccionar"

**Mejoras Necesarias:**
- [ ] **Diseño más premium** - Cards con glassmorphism o neumorphism
- [ ] **Badge "Más Popular"** - Destacar el paquete recomendado
- [ ] **Comparación visual** - Tabla comparativa de características
- [ ] **Animaciones hover** - Efectos 3D o elevación
- [ ] **Precio por foto destacado** - Mostrar ahorro en paquetes
- [ ] **Garantía visible** - Badge de "Satisfacción garantizada"

### 3. **Photo Upload Section** (Prioridad Media)
**Estado Actual:**
- Drag & drop funcional
- Preview de imágenes
- Validación de archivos

**Mejoras Necesarias:**
- [ ] **UI más intuitiva** - Mejor feedback visual al arrastrar
- [ ] **Progress bar** - Mostrar progreso de subida
- [ ] **Preview mejorado** - Grid más elegante
- [ ] **Edición básica** - Rotar, recortar antes de subir
- [ ] **Guía visual** - Mostrar ejemplos de buenas fotos

### 4. **Preview Comparison** (Prioridad Media)
**Estado Actual:**
- Comparación lado a lado (Versión A vs B)
- Botones para seleccionar versión

**Mejoras Necesarias:**
- [ ] **Slider interactivo** - Comparar deslizando (before/after slider)
- [ ] **Zoom en hover** - Ver detalles al pasar el mouse
- [ ] **Descarga individual** - Botón de descarga por foto
- [ ] **Compartir en redes** - Botones de compartir
- [ ] **Fullscreen mode** - Ver en pantalla completa

### 5. **Footer** (Prioridad Baja)
**Estado Actual:**
- Links de navegación
- Estadísticas
- Métodos de pago
- Redes sociales

**Mejoras Necesarias:**
- [ ] **Newsletter signup** - Formulario de suscripción
- [ ] **Mapa del sitio** - Mejor organización
- [ ] **Certificaciones** - Badges de seguridad/garantía
- [ ] **Chat widget mejorado** - Integración más visible

### 6. **General UI/UX** (Prioridad Alta)
- [ ] **Loading states** - Skeletons más elegantes
- [ ] **Error handling** - Mensajes de error más amigables
- [ ] **Micro-interacciones** - Feedback en cada acción
- [ ] **Dark mode** - Tema oscuro opcional
- [ ] **Animaciones de página** - Transiciones suaves entre secciones
- [ ] **Optimización mobile** - Mejorar experiencia en móvil

---

## 🚀 NUEVAS FUNCIONALIDADES O SECCIONES NECESARIAS

### 1. **Sección de Testimonios** (Nueva - Prioridad Alta)
**Descripción:**
- Grid de testimonios con fotos de clientes
- Ratings con estrellas
- Carrusel automático
- Filtros por categoría (mujer, hombre, mascota, etc.)

**Ubicación:** Entre "How It Works" y "Sample Gallery"

### 2. **Blog/Recursos** (Nueva - Prioridad Media)
**Descripción:**
- Sección de blog con artículos sobre fotografía profesional
- Tips y guías
- Casos de éxito
- SEO optimizado

**Ubicación:** Nueva página `/blog`

### 3. **Galería Pública** (Nueva - Prioridad Media)
**Descripción:**
- Galería de fotos generadas (con permiso de clientes)
- Filtros por categoría, estilo, ocasión
- Búsqueda
- Compartir en redes sociales

**Ubicación:** Nueva página `/gallery` o sección en landing

### 4. **Calculadora de Precios** (Nueva - Prioridad Baja)
**Descripción:**
- Widget interactivo
- Seleccionar cantidad de fotos
- Ver precio total
- Aplicar códigos de descuento
- Mostrar ahorro

**Ubicación:** En Pricing Section

### 5. **Sistema de Favoritos** (Nueva - Prioridad Baja)
**Descripción:**
- Guardar estilos favoritos
- Comparar diferentes estilos
- Crear colecciones personalizadas

**Ubicación:** En Preview/Selection

### 6. **Dashboard de Usuario Mejorado** (Mejora - Prioridad Alta)
**Descripción:**
- Historial de pedidos
- Fotos generadas (biblioteca)
- Estadísticas de uso
- Configuración de perfil
- Gestión de suscripciones (si aplica)

**Ubicación:** `/dashboard` (requiere autenticación)

### 7. **Sistema de Notificaciones** (Nueva - Prioridad Media)
**Descripción:**
- Notificaciones en tiempo real
- Email cuando las fotos están listas
- Recordatorios de pedidos pendientes
- Ofertas y promociones

### 8. **Programa de Lealtad** (Nueva - Prioridad Baja)
**Descripción:**
- Puntos por cada compra
- Niveles (Bronce, Plata, Oro)
- Beneficios exclusivos
- Descuentos progresivos

---

## 📂 ESTRUCTURA ACTUAL DEL PROYECTO

```
studio-nexorapro/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Pricing.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── PreviewComparison.tsx
│   │   ├── Footer.tsx
│   │   └── ... (más componentes)
│   ├── lib/
│   │   ├── services/       # Servicios (pagos, fotos, etc.)
│   │   ├── auth/           # Autenticación
│   │   ├── prompts/        # Prompts de IA
│   │   └── supabase.ts     # Cliente Supabase
│   ├── data/
│   │   └── prompts/         # Datos de prompts (JSON)
│   └── App.tsx             # Componente principal
├── public/                 # Assets estáticos
├── supabase/
│   └── migrations/         # Migraciones de BD
├── vercel.json            # Configuración Vercel
└── package.json
```

---

## 🎯 OBJETIVOS DE MEJORA PRINCIPALES

### Prioridad 1 (Crítico):
1. **Mejorar Hero Section** - Más atractivo y moderno
2. **Rediseñar Pricing Cards** - Más premium y convincente
3. **Agregar Sección de Testimonios** - Construir confianza
4. **Mejorar Dashboard de Usuario** - Mejor experiencia post-compra

### Prioridad 2 (Importante):
5. **Optimizar Mobile Experience** - Mejorar responsive
6. **Agregar Galería Pública** - Mostrar resultados
7. **Mejorar Preview Comparison** - Interacción más fluida
8. **Sistema de Notificaciones** - Mejor comunicación

### Prioridad 3 (Deseable):
9. **Blog/Recursos** - SEO y contenido
10. **Programa de Lealtad** - Retención
11. **Calculadora de Precios** - Interactividad
12. **Dark Mode** - Preferencia de usuario

---

## 🔧 CONFIGURACIÓN TÉCNICA ACTUAL

### Variables de Entorno Necesarias:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_CLERK_PUBLISHABLE_KEY=... (opcional)
VITE_STRIPE_PUBLIC_KEY=...
VITE_GOOGLE_AI_API_KEY=...
VITE_APP_URL=...
```

### Dependencias Principales:
- `react`, `react-dom` - Framework
- `@supabase/supabase-js` - Backend
- `@clerk/clerk-react` - Auth (opcional)
- `@stripe/stripe-js` - Pagos
- `lucide-react` - Iconos
- `tailwindcss` - Estilos

### Scripts Disponibles:
- `npm run dev` - Desarrollo
- `npm run build` - Build producción
- `npm run preview` - Preview build

---

## 📝 NOTAS ADICIONALES PARA BOLT.NEW

1. **Mantener Compatibilidad:**
   - No romper funcionalidades existentes
   - Mantener sistema de traducciones (ES/EN)
   - Preservar integraciones (Supabase, Stripe, Clerk)

2. **Mejores Prácticas:**
   - Componentes reutilizables
   - Código limpio y comentado
   - TypeScript estricto
   - Responsive-first design
   - Performance optimizado

3. **Estilo de Diseño:**
   - Moderno y premium
   - Colores: Azul cian (#0891b2) como primario
   - Tipografía: Sans-serif moderna
   - Espaciado generoso
   - Animaciones sutiles pero efectivas

4. **Accesibilidad:**
   - ARIA labels
   - Navegación por teclado
   - Contraste adecuado
   - Textos alternativos

---

## 🎨 REFERENCIAS DE DISEÑO

**Inspiración:**
- Midjourney (para estilo premium)
- Canva (para simplicidad)
- Adobe Express (para profesionalismo)
- Stripe (para diseño limpio)

**Paleta de Colores Actual:**
- Primario: `#0891b2` (Cyan)
- Secundario: `#0e7490` (Cyan oscuro)
- Fondo: `#ffffff` (Blanco)
- Texto: `#1e293b` (Slate oscuro)
- Acento: `#f59e0b` (Amber)

---

## ✅ CHECKLIST PARA BOLT.NEW

- [ ] Revisar estructura actual del código
- [ ] Analizar componentes existentes
- [ ] Identificar áreas de mejora
- [ ] Proponer nuevo diseño UI/UX
- [ ] Implementar mejoras priorizadas
- [ ] Mantener funcionalidades existentes
- [ ] Optimizar performance
- [ ] Asegurar responsive design
- [ ] Agregar nuevas funcionalidades
- [ ] Documentar cambios

---

**¡Listo para que Bolt.new analice y mejore el proyecto!** 🚀

**Contacto/Notas:**
- El proyecto está en producción en Vercel
- Hay documentación extensa en el repositorio
- Se aceptan sugerencias de arquitectura
- Priorizar experiencia de usuario y conversión

