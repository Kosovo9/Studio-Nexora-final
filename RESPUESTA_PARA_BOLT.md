# Respuesta para BOLT - Implementación de Recomendaciones y Ubicaciones

Hola BOLT,

Gracias por tu consulta. Te proporciono los detalles necesarios para implementar las mejoras solicitadas:

## Contexto de la Aplicación

**Studio Nexora** es una aplicación de retoques fotográficos profesionales con IA que permite a los usuarios:
- Subir selfies/fotos personales
- Generar fotos profesionales en diferentes ubicaciones y escenarios
- Elegir entre múltiples estilos y fondos (ciudades, estudios, paisajes)

## Detalles de Implementación

### 1. Sección de Recomendaciones (15% de prominencia)

**Ubicación sugerida**: Entre la sección "How It Works" y "Sample Gallery" en la landing page.

**Contenido de la sección**:
- Mostrar las **5-6 ciudades más populares** basadas en datos de engagement mundial
- Cada recomendación debe incluir:
  - Imagen representativa de la ciudad
  - Nombre de la ciudad y país
  - Badge con "Más Popular" o "Trending"
  - Estadísticas de engagement (ej: "50K+ fotos generadas")
  - Botón "Probar esta ubicación"

**Ciudades recomendadas** (basadas en alto engagement mundial):
1. **Times Square, NYC** - Mayor engagement
2. **Torre Eiffel, París** - Alto engagement romántico
3. **Shibuya Crossing, Tokio** - Trending en Asia
4. **Big Ben, Londres** - Popular en Europa
5. **Burj Khalifa, Dubai** - Luxury engagement
6. **Coliseo Romano, Roma** - Cultural engagement

**Diseño**: Cards horizontales con scroll, ocupando aproximadamente 15% del viewport height en desktop.

### 2. Información de Ubicación en Formularios/Secciones Blancas

**Secciones donde agregar información de ubicación**:

#### A. Sección de Upload (PhotoUpload.tsx)
- Agregar un selector de ubicación antes del upload
- Mostrar preview de la ubicación seleccionada
- Badge con "Ciudad más popular" para las top 3

#### B. Sección de Pricing (Pricing.tsx)
- Agregar badges de ubicaciones disponibles en cada plan
- Mostrar "Incluye X ubicaciones premium" en cada card
- Tooltip con lista de ciudades incluidas

#### C. Sección de Preview (PreviewComparison.tsx)
- Mostrar nombre de la ubicación seleccionada
- Badge con estadísticas de engagement de esa ciudad
- Opción para cambiar de ubicación antes de generar

**Datos de ubicación a mostrar**:
- Nombre de la ciudad y landmark específico
- País y continente
- Estadísticas de engagement (ej: "12K fotos generadas este mes")
- Dificultad del escenario (Basic/Intermediate/Advanced)
- Tags relevantes (romantic, urban, luxury, cultural, etc.)

### 3. Hacer Cada Ubicación Diferente

**Diferenciación por**:
- **Estilo visual**: Cada ciudad tiene su propia paleta de colores y atmósfera
- **Datos únicos**: Estadísticas diferentes para cada ubicación
- **Badges únicos**: 
  - NYC: "🌆 Más Popular"
  - París: "💕 Más Romántica"
  - Tokio: "⚡ Más Moderna"
  - Londres: "👑 Más Elegante"
  - Dubai: "💎 Más Lujosa"
  - Roma: "🏛️ Más Cultural"

- **Iconos específicos**: Cada ciudad tiene su icono/emoji representativo
- **Descripciones únicas**: Cada ubicación tiene un copy diferente destacando sus características

## Datos Disponibles

Ya tenemos un archivo `cities.json` con 15 ubicaciones predefinidas que incluye:
- NYC (Times Square día/noche, Central Park, Brooklyn Bridge)
- París (Torre Eiffel, Louvre, Montmartre)
- Tokio (Shibuya, Senso-ji Temple)
- Londres (Big Ben, Tower Bridge)
- Dubai (Burj Khalifa, Dubai Marina)
- Roma (Coliseo, Venecia)

Cada entrada tiene:
- `name`: Nombre descriptivo
- `base_prompt` y `enhancement_prompt`: Para la generación de IA
- `tags`: Para categorización
- `difficulty`: Nivel de complejidad

## Implementación Técnica Sugerida

1. **Nuevo componente**: `RecommendationsSection.tsx`
   - Recibe `lang` como prop
   - Filtra ciudades por engagement (hardcoded o desde API)
   - Renderiza cards horizontales con scroll

2. **Modificar componentes existentes**:
   - `PhotoUpload.tsx`: Agregar `LocationSelector` component
   - `Pricing.tsx`: Agregar badges de ubicaciones
   - `PreviewComparison.tsx`: Mostrar ubicación seleccionada

3. **Nuevo hook**: `useLocationEngagement.ts`
   - Calcula estadísticas de engagement por ciudad
   - Retorna ciudades ordenadas por popularidad

## ¿Alguna pregunta adicional?

Si necesitas más detalles sobre:
- Diseño específico de los componentes
- Estructura de datos para engagement
- Integración con el sistema de prompts existente
- Animaciones o transiciones específicas

Por favor, házmelo saber y te proporciono más información.

---

**Nota**: Los datos de engagement pueden ser simulados inicialmente y luego conectarse a analytics reales cuando esté disponible.

