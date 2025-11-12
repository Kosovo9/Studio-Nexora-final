@echo off
chcp 65001 >nul
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     STUDIO NEXORAPRO - SERVIDOR DE DESARROLLO            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 📍 El servidor se iniciará en: http://localhost:5173
echo 🌐 El navegador se abrirá automáticamente
echo.
echo ⚠️  IMPORTANTE: No cierres esta ventana mientras uses el servidor
echo.
echo ⏳ Iniciando servidor...
echo.

cd /d "%~dp0"

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ❌ Error: node_modules no encontrado
    echo.
    echo Ejecuta primero: npm install
    pause
    exit /b 1
)

REM Iniciar servidor
npm run dev

pause

