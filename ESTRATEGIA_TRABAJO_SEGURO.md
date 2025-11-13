# 🛡️ ESTRATEGIA DE TRABAJO SEGURO - SIN ROMPER UI

## 🎯 OBJETIVO
Trabajar en el proyecto de forma segura sin romper el UI existente y sin perder créditos en Bolt.new.

---

## ✅ REGLAS DE ORO

### 1. **NUNCA TOCAR COMPONENTES UI EXISTENTES**
- ❌ NO modificar `src/components/Hero.tsx`
- ❌ NO modificar `src/components/Footer.tsx`
- ❌ NO modificar `src/components/Pricing.tsx`
- ❌ NO modificar `src/components/Header.tsx`
- ❌ NO modificar ningún componente visual existente

### 2. **SOLO AGREGAR NUEVAS FUNCIONES**
- ✅ Crear nuevos archivos en `src/lib/services/`
- ✅ Crear nuevos componentes si es necesario
- ✅ Agregar nuevas funciones sin tocar las existentes
- ✅ Modificar solo lógica backend, no frontend visual

### 3. **USAR BRANCHES SEPARADOS**
- Crear branch para cada nueva funcionalidad
- Trabajar en branch separado
- Merge solo cuando esté probado
- Mantener `main` siempre estable

---

## 🔄 FLUJO DE TRABAJO SEGURO

### Paso 1: Crear Branch de Trabajo
```bash
# Crear branch para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# O para backend
git checkout -b backend/integracion-api
```

### Paso 2: Trabajar SOLO en Archivos Permitidos

#### ✅ ARCHIVOS SEGUROS PARA MODIFICAR:
- `src/lib/services/*.ts` - Servicios backend
- `src/lib/config/*.ts` - Configuración
- `src/lib/auth/*.ts` - Autenticación
- `src/lib/webhooks/*.ts` - Webhooks
- `src/lib/notifications/*.ts` - Notificaciones
- `supabase/migrations/*.sql` - Migraciones de BD
- `.env.example` - Variables de entorno
- `package.json` - Dependencias (con cuidado)

#### ❌ ARCHIVOS PROHIBIDOS (NO TOCAR):
- `src/components/Hero.tsx`
- `src/components/Footer.tsx`
- `src/components/Pricing.tsx`
- `src/components/Header.tsx`
- `src/components/PhotoUpload.tsx`
- `src/components/PreviewComparison.tsx`
- `src/components/SampleGallery.tsx`
- `src/components/HowItWorks.tsx`
- `src/index.css` - Estilos globales
- `tailwind.config.js` - Configuración Tailwind
- Cualquier archivo de componentes visuales

### Paso 3: Probar ANTES de Merge
```bash
# Verificar que compila
npm run build

# Verificar tipos
npm run typecheck

# Probar localmente
npm run dev
```

### Paso 4: Merge Seguro
```bash
# Volver a main
git checkout main

# Merge del branch
git merge feature/nueva-funcionalidad

# Verificar que todo sigue funcionando
npm run build
```

---

## 🎯 ESTRATEGIA PARA BOLT.NEW

### Opción 1: Trabajo Incremental (RECOMENDADO)

**Ventajas:**
- ✅ No rompe nada existente
- ✅ Fácil de revertir si algo falla
- ✅ Usa menos créditos
- ✅ Más control

**Cómo hacerlo:**
1. **Paso 1:** Pedir a Bolt.new que cree SOLO `src/lib/config/env.ts`
   - No tocar nada más
   - Solo crear el archivo nuevo
   - Verificar que funciona

2. **Paso 2:** Pedir que actualice SOLO los servicios para usar `env.ts`
   - Un archivo a la vez
   - Verificar después de cada cambio
   - No tocar componentes UI

3. **Paso 3:** Continuar paso a paso
   - Una funcionalidad a la vez
   - Probar después de cada cambio
   - Merge solo cuando funcione

### Opción 2: Especificaciones MUY Claras

**Cuando uses Bolt.new, di exactamente:**

```
"Necesito que:
1. SOLO modifiques archivos en src/lib/services/
2. NO toques ningún componente en src/components/
3. NO cambies ningún estilo o UI
4. Solo agregues funcionalidad backend
5. Mantén toda la UI existente intacta"
```

### Opción 3: Trabajo Manual (Más Seguro)

**Si prefieres no usar Bolt.new:**
- Trabajar manualmente en archivos backend
- Usar Bolt.new solo para documentación
- O para crear archivos nuevos (no modificar existentes)

---

## 📋 CHECKLIST ANTES DE CADA CAMBIO

Antes de hacer cualquier cambio, verifica:

- [ ] ¿Estoy modificando un archivo permitido?
- [ ] ¿Estoy en un branch separado?
- [ ] ¿He hecho backup del estado actual?
- [ ] ¿He probado que el proyecto compila?
- [ ] ¿He verificado que la UI no cambió?

---

## 🛡️ SISTEMA DE BACKUP AUTOMÁTICO

### Crear Backup Antes de Trabajar
```bash
# Crear branch de backup
git checkout main
git branch backup-antes-trabajo-$(date +%Y%m%d)

# Ahora puedes trabajar sin miedo
git checkout -b feature/nueva-funcionalidad
```

### Si Algo Sale Mal
```bash
# Volver al backup
git checkout main
git reset --hard backup-antes-trabajo-YYYYMMDD
```

---

## 🎯 PRIORIDADES DE TRABAJO SEGURO

### Fase 1: Organización (Sin Tocar UI)
1. ✅ Crear `src/lib/config/env.ts` - NUEVO archivo
2. ✅ Actualizar servicios para usar `env.ts` - Solo lógica
3. ✅ Crear `.env.example` - NUEVO archivo

### Fase 2: Integraciones Backend (Sin Tocar UI)
1. ✅ Conectar API de IA - Solo en `aiService.ts`
2. ✅ Integrar pagos - Solo en `paymentService.ts`
3. ✅ Conectar Supabase Storage - Solo en `supabase.ts`

### Fase 3: Nuevas Funcionalidades (Sin Tocar UI)
1. ✅ Agregar nuevos servicios - Archivos nuevos
2. ✅ Nuevos webhooks - Archivos nuevos
3. ✅ Nuevas funciones - Sin modificar existentes

---

## ⚠️ SEÑALES DE ALERTA

**Si ves estos cambios, REVIERTE INMEDIATAMENTE:**
- Cambios en `src/components/*.tsx`
- Cambios en `src/index.css`
- Cambios en `tailwind.config.js`
- Cambios en estilos o clases CSS
- Cambios en estructura HTML de componentes

---

## 🔧 COMANDOS ÚTILES

### Ver Qué Archivos Cambiaron
```bash
git status
git diff
```

### Ver Solo Cambios en Componentes (Para Detectar Problemas)
```bash
git diff --name-only | grep "src/components"
```

### Revertir Cambios en un Archivo Específico
```bash
git checkout HEAD -- src/components/Hero.tsx
```

### Ver Historial de un Archivo
```bash
git log --oneline -- src/components/Hero.tsx
```

---

## 📝 TEMPLATE PARA BOLT.NEW

Cuando uses Bolt.new, usa este template:

```
"Necesito [DESCRIPCIÓN DE LA FUNCIONALIDAD].

IMPORTANTE - RESTRICCIONES:
1. SOLO modificar archivos en: src/lib/services/ o crear archivos nuevos
2. NO modificar NINGÚN archivo en: src/components/
3. NO cambiar estilos, CSS, o Tailwind
4. NO modificar estructura HTML de componentes
5. Mantener toda la UI existente 100% intacta
6. Solo agregar funcionalidad backend/lógica

Archivos permitidos:
- src/lib/services/*.ts
- src/lib/config/*.ts
- src/lib/webhooks/*.ts
- Nuevos archivos

Archivos PROHIBIDOS:
- src/components/*.tsx
- src/index.css
- tailwind.config.js
- Cualquier archivo de UI

Si necesitas mostrar algo en la UI, usa console.log o retorna datos, pero NO modifiques componentes visuales."
```

---

## ✅ VERIFICACIÓN FINAL

Después de cada cambio:

1. **Build debe funcionar:**
   ```bash
   npm run build
   ```

2. **UI debe verse igual:**
   - Abrir `npm run dev`
   - Verificar que Hero, Footer, Pricing se ven igual
   - No debe haber cambios visuales

3. **Funcionalidad nueva debe trabajar:**
   - Probar la nueva funcionalidad
   - Verificar que no rompe nada existente

---

## 🎯 RESUMEN

**Regla #1:** Si no estás 100% seguro, NO lo hagas.

**Regla #2:** Siempre en branch separado.

**Regla #3:** Probar antes de merge.

**Regla #4:** Si algo se rompe, revertir inmediatamente.

**Regla #5:** UI es sagrada - NO TOCAR.

---

**Con esta estrategia, puedes trabajar sin miedo a romper nada.** 🛡️

