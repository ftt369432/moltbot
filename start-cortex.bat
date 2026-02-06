@echo off
title GenieFlow Cortex Launcher
color 0B

echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║          GENIEFLOW CORTEX - Agent Brain                   ║
echo  ║          Starting Services...                             ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.

cd /d C:\.APPS\moltbot

echo [1/2] Starting Gateway on port 18789...
start "Cortex Gateway" cmd /k "set DEBUG=* && node run-with-env.mjs gateway"

echo Waiting for gateway to initialize (this may take a moment)...
timeout /t 8 /nobreak > nul

echo [2/2] Starting UI on port 5173...
start "Cortex UI" cmd /k "pnpm ui:dev"

echo.
echo  ╔═══════════════════════════════════════════════════════════╗
echo  ║  GenieFlow Cortex is starting!                            ║
echo  ║                                                           ║
echo  ║  Gateway:  ws://127.0.0.1:18789                          ║
echo  ║  UI:       http://localhost:5173                         ║
echo  ║                                                           ║
echo  ║  Press any key to open the UI in your browser...         ║
echo  ╚═══════════════════════════════════════════════════════════╝
echo.

pause > nul
start http://localhost:5173

echo.
echo To stop services, close the Gateway and UI terminal windows.
echo.
