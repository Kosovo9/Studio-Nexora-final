@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   STUDIO NEXORA - Iniciando Servidor
echo ========================================
echo.
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
echo.
echo Verificando dependencias...
if not exist "node_modules" (
    echo [INFO] Instalando dependencias por primera vez...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Error instalando dependencias
        pause
        exit /b 1
    )
)

echo [OK] Dependencias listas
echo.
echo ========================================
echo   Iniciando servidor de desarrollo...
echo ========================================
echo.
echo El proyecto estará disponible en:
echo   http://localhost:5173
echo.
echo (Si el puerto 5173 está ocupado, Vite usará otro puerto)
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
echo ========================================
echo.

cd /d "%~dp0"
npm run dev

