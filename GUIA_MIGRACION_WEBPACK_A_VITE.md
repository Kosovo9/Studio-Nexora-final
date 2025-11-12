# 🚀 GUÍA DE MIGRACIÓN: WEBPACK → VITE

## ✅ VENTAJAS DE VITE

- ⚡ **HMR ultra-rápido** (Hot Module Replacement instantáneo)
- 🏗️ **Builds más rápidos** (usa esbuild y Rollup)
- 📦 **Menos configuración** (zero-config por defecto)
- 🔥 **Mejor DX** (Developer Experience)
- 🎯 **Optimizaciones automáticas** (code splitting, tree shaking)

---

## 📋 CHECKLIST DE MIGRACIÓN

### PASO 1: Preparar el Proyecto

- [ ] Hacer backup del proyecto
- [ ] Crear branch: `git checkout -b migrate-to-vite`
- [ ] Verificar que el proyecto funcione con webpack actual

### PASO 2: Actualizar package.json

#### 2.1 Eliminar dependencias de webpack:
```bash
npm uninstall webpack webpack-cli webpack-dev-server
npm uninstall html-webpack-plugin
npm uninstall @babel/core @babel/preset-env @babel/preset-react
npm uninstall babel-loader css-loader style-loader file-loader url-loader
```

#### 2.2 Instalar Vite y plugins:
```bash
npm install -D vite @vitejs/plugin-react
```

#### 2.3 Actualizar scripts en package.json:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

### PASO 3: Crear vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Resolver alias (si usabas alias en webpack)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Agrega más alias según tu webpack.config
    },
  },
  
  // Optimizaciones de build
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          // Agrega más chunks según necesites
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000, // o el puerto que usabas
    open: true,
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    exclude: ['lucide-react'], // Si usas librerías con problemas
  },
});
```

### PASO 4: Actualizar index.html

#### 4.1 Mover index.html a la raíz del proyecto (si no está)

#### 4.2 Actualizar el script de entrada:
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tu App</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- Vite usa type="module" automáticamente -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### PASO 5: Actualizar imports y paths

#### 5.1 Imports de assets:
```typescript
// ❌ Webpack (ya no funciona)
import logo from './logo.png';

// ✅ Vite (funciona igual, pero más rápido)
import logo from './logo.png';
// O con ?url para obtener la URL
import logoUrl from './logo.png?url';
```

#### 5.2 Variables de entorno:
```typescript
// ❌ Webpack
process.env.REACT_APP_API_URL

// ✅ Vite
import.meta.env.VITE_API_URL
```

**IMPORTANTE:** Todas las variables deben empezar con `VITE_`

### PASO 6: Actualizar TypeScript (si usas TS)

#### 6.1 Crear/actualizar vite-env.d.ts:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  // Agrega tus variables aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

#### 6.2 Actualizar tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### PASO 7: Migrar configuración específica

#### 7.1 Si usabas CopyWebpackPlugin:
```typescript
// En vite.config.ts
import { copyFileSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  // Vite copia automáticamente archivos de /public
  // Solo mueve archivos estáticos a /public
  publicDir: 'public',
});
```

#### 7.2 Si usabas DefinePlugin:
```typescript
// En vite.config.ts
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // Agrega más definiciones si las necesitas
  },
});
```

#### 7.3 Si usabas ProvidePlugin:
```typescript
// En vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      // En lugar de ProvidePlugin, usa alias
      'react': 'react',
    },
  },
});
```

### PASO 8: Actualizar PostCSS/Tailwind (si usas)

Si ya tienes `postcss.config.js` y `tailwind.config.js`, Vite los detecta automáticamente. Solo asegúrate de que estén en la raíz.

### PASO 9: Eliminar archivos de webpack

- [ ] Eliminar `webpack.config.js` o `webpack.config.ts`
- [ ] Eliminar `.babelrc` o `babel.config.js` (si no lo usas para otras cosas)
- [ ] Actualizar `.gitignore` si es necesario

### PASO 10: Probar y verificar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 🔧 CONVERSIÓN DE CONFIGURACIONES COMUNES

### Webpack → Vite

| Webpack | Vite |
|---------|------|
| `entry: './src/index.js'` | `index.html` con `<script src="/src/main.tsx">` |
| `output.path` | `build.outDir` (default: `dist`) |
| `output.publicPath` | `base` en vite.config |
| `devServer.port` | `server.port` |
| `devServer.proxy` | `server.proxy` (misma sintaxis) |
| `resolve.alias` | `resolve.alias` (misma sintaxis) |
| `module.rules` | Plugins de Vite (ej: `@vitejs/plugin-react`) |
| `plugins: [new HtmlWebpackPlugin()]` | `index.html` en raíz |
| `process.env.*` | `import.meta.env.VITE_*` |

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### 1. Error: "process is not defined"
```typescript
// ❌ No funciona
process.env.API_URL

// ✅ Usa import.meta.env
import.meta.env.VITE_API_URL
```

### 2. Error: "require is not defined"
```typescript
// ❌ No funciona
const module = require('./module');

// ✅ Usa import
import module from './module';
```

### 3. Assets no se cargan
- Asegúrate de que los assets estáticos estén en `/public`
- Para assets en `/src`, usa imports normales

### 4. Variables de entorno no funcionan
- Deben empezar con `VITE_`
- Reinicia el servidor después de cambiar `.env`

### 5. Polyfills faltantes
```typescript
// En vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Si necesitas polyfills específicos
    },
  },
});
```

---

## 📦 TEMPLATE COMPLETO DE vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

---

## ✅ VERIFICACIÓN FINAL

Después de migrar, verifica:

- [ ] `npm run dev` inicia sin errores
- [ ] Hot Module Replacement funciona
- [ ] `npm run build` genera `dist/` correctamente
- [ ] `npm run preview` muestra la app correctamente
- [ ] Todas las rutas funcionan
- [ ] Los assets se cargan correctamente
- [ ] Las variables de entorno funcionan
- [ ] No hay errores en la consola del navegador

---

## 🎯 SIGUIENTE PASO

Una vez migrado, puedes:
1. Eliminar `node_modules` y `package-lock.json`
2. Ejecutar `npm install` para limpiar dependencias
3. Hacer commit: `git commit -m "Migrate from webpack to Vite"`
4. Probar en producción

---

## 📚 RECURSOS

- [Documentación oficial de Vite](https://vitejs.dev/)
- [Guía de migración de Vite](https://vitejs.dev/guide/migration.html)
- [Plugin React para Vite](https://github.com/vitejs/vite-plugin-react)

