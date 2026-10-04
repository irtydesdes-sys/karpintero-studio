@echo off
REM ==============================================================================
REM  Karpintero Studio - Script Automatizado de Compilacion Windows
REM  Arquitectura: Electron / Node.js / electron-builder
REM ==============================================================================

chcp 65001 >nul
title Karpintero Studio - Compilador Windows Desktop
color 0B

echo ================================================================
echo   KARPINTERO STUDIO - COMPILADOR AUTOMATIZADO WINDOWS (.EXE)
echo ================================================================
echo.

echo [1/4] Verificando entorno (Node.js / NPM)...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js no esta instalado. Descargalo de https://nodejs.org/
    pause
    exit /b 1
)
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] NPM no esta disponible en el PATH.
    pause
    exit /b 1
)
echo   OK: Node.js y NPM detectados.

echo.
echo [2/4] Instalando dependencias...
call npm install

echo.
echo [3/4] Compilando instalador ejecutable (.exe)...
call npm run build:win
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] La compilacion con electron-builder fallo.
    pause
    exit /b 1
)

echo.
echo [4/4] Listo.
color 0A
echo ================================================================
echo   COMPILACION COMPLETADA - Revisa la carpeta dist-win\
echo ================================================================
pause
exit /b 0
