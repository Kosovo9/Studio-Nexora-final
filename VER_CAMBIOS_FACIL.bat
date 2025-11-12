@echo off
chcp 65001 >nul
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     VER CAMBIOS - STUDIO NEXORAPRO                        ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Este script hara lo siguiente:
echo 1. Crear el build de produccion
echo 2. Iniciar el servidor de preview
echo 3. Abrir el navegador automaticamente
echo.
echo ⚠️  IMPORTANTE: Este proceso puede tardar 1-2 minutos
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

cd /d "%~dp0"

echo.
echo [1/3] Creando build de produccion...
echo.
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error al crear el build
    pause
    exit /b 1
)

echo.
echo [2/3] Iniciando servidor de preview...
echo.
echo ✅ El servidor se iniciara en: http://localhost:4173
echo ✅ El navegador se abrira automaticamente
echo.
echo ⚠️  No cierres esta ventana mientras uses el servidor
echo.

timeout /t 3 /nobreak >nul
start http://localhost:4173

call npm run preview

pause

