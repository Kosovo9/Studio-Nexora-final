@echo off
echo Abriendo navegador en http://localhost:5175...
start http://localhost:5175
timeout /t 2 >nul
echo.
echo Si el navegador no se abrio, copia y pega esta URL:
echo http://localhost:5175
echo.
pause

