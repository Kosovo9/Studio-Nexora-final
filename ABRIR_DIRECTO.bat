@echo off
echo Abriendo proyecto directamente desde el build...
echo.
cd /d "%~dp0"
start dist\index.html
echo.
echo ✅ El proyecto se abrio en tu navegador
echo.
echo ⚠️  NOTA: Esta es la version de produccion (build)
echo    Para ver cambios en tiempo real, usa: npm run dev
echo.
pause

