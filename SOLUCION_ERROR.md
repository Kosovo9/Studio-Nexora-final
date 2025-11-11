# 🔧 SOLUCIÓN: ERR_CONNECTION_REFUSED

## ❌ Problema
Estás viendo: `ERR_CONNECTION_REFUSED` en `localhost:5177`

**Esto significa:** El servidor de desarrollo NO está corriendo.

---

## ✅ SOLUCIÓN RÁPIDA

### Paso 1: Abre una Terminal Nueva

**Opción A: PowerShell**
- Presiona `Windows + X`
- Selecciona "Windows PowerShell" o "Terminal"

**Opción B: CMD**
- Presiona `Windows + R`
- Escribe: `cmd`
- Presiona Enter

---

### Paso 2: Navega a la Carpeta del Proyecto

```bash
cd C:\studio-nexorapro
```

---

### Paso 3: Inicia el Servidor

```bash
npm run dev
```

---

### Paso 4: Espera el Mensaje

Deberías ver algo como:

```
  VITE v5.4.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**⚠️ IMPORTANTE:** El puerto puede ser diferente (5173, 5174, 5175, etc.)

---

### Paso 5: Abre el Navegador

**Copia la URL exacta** que aparece en la terminal (ej: `http://localhost:5173`)

**NO uses** `localhost:5177` - usa el puerto que muestra la terminal.

---

## 🎯 ALTERNATIVA: Usar el Script

1. Ve a: `C:\studio-nexorapro`
2. **Doble clic** en: `INICIAR_PROYECTO.bat`
3. Espera a que aparezca la URL
4. Abre esa URL en el navegador

---

## ❓ ¿POR QUÉ ESTÁ PASANDO?

- El servidor no se inició automáticamente
- Se cerró la terminal donde estaba corriendo
- El puerto cambió (Vite usa el siguiente disponible)

---

## ✅ VERIFICACIÓN

Después de iniciar el servidor, deberías ver:

1. ✅ Terminal mostrando: "Local: http://localhost:XXXX"
2. ✅ Navegador mostrando el proyecto (no error)
3. ✅ La página carga correctamente

---

## 🚨 SI SIGUE SIN FUNCIONAR

### Verifica Node.js:
```bash
node --version
```
Debe mostrar: `v18.x.x` o superior

### Instala dependencias:
```bash
cd C:\studio-nexorapro
npm install
```

### Intenta de nuevo:
```bash
npm run dev
```

---

**¡El servidor debería estar iniciándose ahora!** 🚀

**Espera 10-15 segundos** y luego **refresca** tu navegador con la URL correcta que muestra la terminal.

