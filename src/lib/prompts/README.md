# 📝 SISTEMA DE PROMPTS COMPLETOS

## 🎯 OBJETIVO

Este sistema permite que el cliente vea opciones simples en el UI (ej: "En estudio de lujo con traje negro"), pero internamente el sistema usa prompts completos y profesionales de 200+ palabras.

## 📁 ESTRUCTURA

```
src/lib/prompts/
├── categories/
│   ├── men.ts          # Prompts para hombres
│   ├── women.ts        # Prompts para mujeres
│   ├── children.ts     # Prompts para niños y niñas
│   ├── pets.ts         # Prompts para perros y gatos
│   ├── families.ts     # Prompts para familias (navidad, chimenea, etc.)
│   ├── couples.ts      # Prompts para parejas
│   ├── teams.ts        # Prompts para equipos
│   └── index.ts        # Exporta todo
├── promptMapping.ts    # Mapeo UI → Prompts completos
└── README.md          # Esta documentación
```

## 🔄 CÓMO FUNCIONA

### 1. Cliente ve opciones simples en el UI:
- "En estudio de lujo con traje negro"
- "En NYC, Times Square de noche"
- "En una cafetería en el amanecer"
- "Cena de Navidad en familia"
- "En la chimenea acogedora"
- etc.

### 2. Sistema usa prompts completos internamente:
Cuando el cliente selecciona "En estudio de lujo con traje negro", el sistema busca el prompt completo correspondiente que incluye:
- Descripción detallada del sujeto
- Descripción del ambiente
- Configuración de iluminación
- Estilo de fotografía
- Color grading
- Resolución y calidad
- Y mucho más...

## 📊 ESTADO ACTUAL

- ✅ Estructura creada
- ✅ Archivos base con ejemplos
- ⏳ **FALTA**: Agregar los 400+ prompts completos

## ➕ CÓMO AGREGAR MÁS PROMPTS

### Ejemplo: Agregar prompt para hombre

En `src/lib/prompts/categories/men.ts`:

```typescript
{
  id: 'men_nuevo_prompt',
  uiLabel: 'Lo que el cliente ve en el UI',
  completePrompt: `Prompt completo y detallado de 200+ palabras con todas las especificaciones técnicas, iluminación, composición, color grading, etc.`,
  tags: ['tag1', 'tag2', 'tag3'],
  style: 'professional' // o 'casual', 'luxury', 'urban', 'nature'
}
```

### Ejemplo: Agregar prompt para familia navideña

En `src/lib/prompts/categories/families.ts`:

```typescript
{
  id: 'family_christmas_new',
  uiLabel: 'Nueva escena navideña',
  completePrompt: `Descripción completa y detallada...`,
  tags: ['christmas', 'holiday', 'family'],
  style: 'casual'
}
```

## 🎨 CATEGORÍAS DISPONIBLES

1. **Hombres** (`men`) - Prompts para retratos masculinos
2. **Mujeres** (`women`) - Prompts para retratos femeninos
3. **Niños** (`boy`, `girl`) - Prompts para niños y niñas
4. **Mascotas** (`dog`, `cat`) - Prompts para perros y gatos
5. **Familias** (`family`) - Incluye navidad, chimenea, arbolito, etc.
6. **Parejas** (`couple`) - Prompts románticos
7. **Equipos** (`team`) - Prompts para grupos profesionales

## 🔧 USO EN EL CÓDIGO

```typescript
import { getCompletePrompt, getAvailableUIOptions } from '@/lib/prompts/promptMapping';

// Obtener opciones que el cliente verá
const options = getAvailableUIOptions('men');
// ['En estudio de lujo con traje negro', 'En NYC, Times Square de noche', ...]

// Cuando el cliente selecciona una opción, obtener el prompt completo
const completePrompt = getCompletePrompt('men', 'En estudio de lujo con traje negro');
// Retorna el prompt completo de 200+ palabras
```

## 📝 NOTAS IMPORTANTES

1. **Los prompts deben ser completos y detallados** - 200+ palabras
2. **Incluir especificaciones técnicas** - iluminación, lentes, color grading
3. **Mantener consistencia** - mismo formato en todos los prompts
4. **Tags útiles** - para búsqueda y agrupación
5. **UI Labels claros** - lo que el cliente ve debe ser simple y entendible

## 🚀 PRÓXIMOS PASOS

1. Agregar los 400+ prompts completos a cada categoría
2. Integrar con el sistema de generación de imágenes
3. Crear UI para que el cliente seleccione opciones
4. Conectar selección del cliente → prompt completo → generación

---

**Total de prompts objetivo: 400+**
**Estado actual: Estructura lista, esperando prompts completos**

