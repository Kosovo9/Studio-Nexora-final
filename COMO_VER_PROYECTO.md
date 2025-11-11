# 🚀 CÓMO VER EL PROYECTO

## ✅ OPCIÓN 1: Usar el Script Automático (Más Fácil)

1. **Doble clic en:** `INICIAR_PROYECTO.bat`
2. **Espera** a que aparezca el mensaje: "Local: http://localhost:5173"
3. **Abre tu navegador** y ve a: `http://localhost:5173`

---

## ✅ OPCIÓN 2: Terminal Manual

1. **Abre PowerShell o CMD**
2. **Navega a la carpeta:**
   ```bash
   cd C:\studio-nexorapro
   ```
3. **Inicia el servidor:**
   ```bash
   npm run dev
   ```
4. **Espera** a ver el mensaje: "Local: http://localhost:5173"
5. **Abre tu navegador** y ve a: `http://localhost:5173`

---

## 🔍 VERIFICAR QUE FUNCIONA

### Si ves esto en la terminal:
```
  VITE v5.4.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ El servidor está funcionando correctamente**

### Si NO ves nada o hay errores:

1. **Verifica que Node.js esté instalado:**
   ```bash
   node --version
   ```
   Debe mostrar: `v18.x.x` o superior

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Intenta de nuevo:**
   ```bash
   npm run dev
   ```

---

## 🌐 URL DEL PROYECTO

Una vez que el servidor esté corriendo:

**URL Local:** `http://localhost:5173`

**Si el puerto 5173 está ocupado**, Vite usará automáticamente otro puerto (5174, 5175, etc.). Revisa la terminal para ver la URL exacta.

---

## ❌ PROBLEMAS COMUNES

### Error: "Puerto 5173 ya está en uso"
**Solución:** Cierra otras aplicaciones que usen ese puerto o usa otro puerto:
```bash
npm run dev -- --port 3000
```

### Error: "Cannot find module"
**Solución:** Instala las dependencias:
```bash
npm install
```

### El navegador muestra página en blanco
**Solución:** 
1. Abre la consola del navegador (F12)
2. Revisa si hay errores en la consola
3. Verifica que el servidor esté corriendo

### No se ve el diseño correctamente
**Solución:**
1. Limpia la caché del navegador (Ctrl+Shift+Delete)
2. Recarga la página (Ctrl+F5)

---

## 📞 SI SIGUE SIN FUNCIONAR

1. **Revisa la terminal** donde está corriendo `npm run dev`
2. **Copia el error completo** y compártelo
3. **Verifica que estés en la carpeta correcta:** `C:\studio-nexorapro`

---

## ✅ VERIFICACIÓN RÁPIDA

Ejecuta estos comandos para verificar:

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar que estás en la carpeta correcta
cd C:\studio-nexorapro
dir

# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar servidor
npm run dev
```

---

**¡El proyecto debería estar funcionando ahora!** 🚀

