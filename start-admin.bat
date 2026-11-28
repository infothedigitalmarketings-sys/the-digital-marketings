@echo off
title The Digital Marketings - Direct Admin Server
cd /d "%~dp0"
echo Starting The Digital Marketings Direct Server (No GitHub Token Needed)...
start "" http://localhost:3000/admin.html
node server.js
pause
