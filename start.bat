@echo off
title Selera Catering - Local Server
cd /d "%~dp0"
echo ============================================
echo   Selera Catering - starting local server
echo ============================================
echo.
echo Opening: http://localhost:8000/index.html
echo (Tip: press Ctrl+0 once in the browser to set zoom to 100%%)
echo.
echo Keep this window open while using the site.
echo Close it to stop the server.
echo.
start "" "http://localhost:8000/index.html"
python -m http.server 8000
