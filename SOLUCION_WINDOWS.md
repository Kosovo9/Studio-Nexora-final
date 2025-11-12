# 🔧 SOLUCIÓN PARA WINDOWS - NO PUEDO VER EL SERVIDOR

## 🚨 PROBLEMA COMÚN EN WINDOWS

Windows puede bloquear el acceso a localhost por varias razones:
1. Firewall bloqueando Node.js
2. Proxy configurado
3. Antivirus bloqueando conexiones locales
4. Puerto bloqueado por otra aplicación

---

## ✅ SOLUCIÓN 1: USAR LA IP DE RED (MÁS CONFIABLE)

En la terminal donde corre `npm run dev`, verás algo como:
```
➜  Network: http://192.168.1.4:5175/
```

**Usa esa URL en tu navegador:**
```
http://192.168.1.4:5175
```

---

## ✅ SOLUCIÓN 2: VERIFICAR FIREWALL

1. **Abre el Firewall de Windows**:
   - Presiona `Win + R`
   - Escribe: `firewall.cpl`
   - Presiona Enter

2. **Permitir Node.js**:
   - Click en "Permitir una aplicación o característica a través del Firewall"
   - Busca "Node.js" o "npm"
   - Si no está, click en "Permitir otra aplicación"
   - Busca: `C:\Program Files\nodejs\node.exe`
   - Marca "Privada" y "Pública"
   - Click en "Aceptar"

---

## ✅ SOLUCIÓN 3: USAR PREVIEW (ALTERNATIVA)

Si el servidor de desarrollo no funciona, usa el preview:

### Paso 1: Hacer build
```bash
npm run build
```

### Paso 2: Iniciar preview
```bash
npm run preview
```

### Paso 3: Abrir navegador
```
http://localhost:4173
```

**Nota**: Con preview, los cambios NO se reflejan automáticamente. Necesitas hacer `npm run build` cada vez que cambies algo.

---

## ✅ SOLUCIÓN 4: PROBAR DIFERENTES NAVEGADORES

1. **Chrome**: `http://localhost:5175`
2. **Edge**: `http://localhost:5175`
3. **Firefox**: `http://localhost:5175`

A veces un navegador tiene problemas pero otro funciona.

---

## ✅ SOLUCIÓN 5: DESACTIVAR PROXY TEMPORALMENTE

1. **Abre Configuración de Windows**:
   - Presiona `Win + I`
   - Ve a "Red e Internet" → "Proxy"

2. **Desactiva Proxy**:
   - En "Configuración manual de proxy", desactiva "Usar un servidor proxy"
   - Guarda cambios

3. **Intenta de nuevo**: `http://localhost:5175`

---

## ✅ SOLUCIÓN 6: VERIFICAR QUE EL SERVIDOR ESTÁ CORRIENDO

En la terminal donde ejecutaste `npm run dev`, deberías ver:
```
VITE v5.4.8  ready in 140 ms

➜  Local:   http://localhost:5175/
```

**Si NO ves esto**, el servidor no está corriendo. Ejecuta:
```bash
npm run dev
```

---

## 🆘 SOLUCIÓN DE EMERGENCIA: VER EL BUILD

Si nada funciona, podemos hacer un build y verlo:

1. **Hacer build**:
   ```bash
   npm run build
   ```

2. **Abrir la carpeta dist**:
   - Ve a: `C:\studio-nexorapro\dist`
   - Abre `index.html` con tu navegador (doble clic)

**Nota**: Esto muestra la versión de producción, no el desarrollo en tiempo real.

---

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] El servidor está corriendo (`npm run dev` en terminal)
- [ ] Veo el mensaje "VITE v5.4.8 ready"
- [ ] Veo la URL "Local: http://localhost:5175/"
- [ ] Probé la URL en el navegador
- [ ] Probé la IP de red (192.168.x.x:5175)
- [ ] Probé diferentes navegadores
- [ ] Verifiqué el firewall

---

## 💡 RECOMENDACIÓN

**Prueba primero la IP de red** que aparece en la terminal:
```
http://192.168.1.4:5175
```

Esta suele funcionar mejor que localhost en Windows.

---

¿Qué ves exactamente cuando intentas abrir la URL? ¿Aparece algún error específico?

