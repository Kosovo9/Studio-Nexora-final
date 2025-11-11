@echo off
echo ========================================
echo   STUDIO NEXORA - Iniciando Servidor
echo ========================================
echo.
echo Iniciando servidor de desarrollo...
echo.
echo El proyecto estara disponible en:
echo   http://localhost:5173
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
echo ========================================
echo.

cd /d "%~dp0"
npm run dev

pause

