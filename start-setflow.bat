@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo SetFlow needs Node.js 18 or newer. You can still open index.html for local-only mode.
  pause
  exit /b 1
)
echo Starting SetFlow at http://localhost:4173
node server.mjs
pause
