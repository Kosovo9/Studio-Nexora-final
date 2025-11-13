@echo off
echo ========================================
echo VERIFICACION DE CAMBIOS SEGUROS
echo ========================================
echo.

echo [1] Verificando archivos modificados...
git status --short
echo.

echo [2] Verificando si se modificaron componentes UI...
git diff --name-only HEAD | findstr /i "src\\components"
if %errorlevel% == 0 (
    echo.
    echo ⚠️  ADVERTENCIA: Se modificaron componentes UI!
    echo ⚠️  Esto puede romper el diseño. Revisa los cambios.
    echo.
) else (
    echo ✅ No se modificaron componentes UI
    echo.
)

echo [3] Verificando si se modificaron estilos...
git diff --name-only HEAD | findstr /i "index.css tailwind.config"
if %errorlevel% == 0 (
    echo.
    echo ⚠️  ADVERTENCIA: Se modificaron archivos de estilos!
    echo ⚠️  Esto puede cambiar el diseño. Revisa los cambios.
    echo.
) else (
    echo ✅ No se modificaron archivos de estilos
    echo.
)

echo [4] Verificando que el proyecto compila...
call npm run build
if %errorlevel% == 0 (
    echo.
    echo ✅ Build exitoso
    echo.
) else (
    echo.
    echo ❌ ERROR: El build falló!
    echo Revisa los errores antes de continuar.
    echo.
    pause
    exit /b 1
)

echo ========================================
echo VERIFICACION COMPLETA
echo ========================================
echo.
echo Si todo está bien, puedes hacer commit y push.
echo.
pause

