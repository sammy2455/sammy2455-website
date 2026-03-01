#!/bin/bash
set -e

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()    { echo -e "${GREEN}[✔]${NC} $1"; }
warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
error()  { echo -e "${RED}[✘]${NC} $1"; exit 1; }

# ─── Validaciones ─────────────────────────────────────────────────────────────
command -v node  >/dev/null 2>&1 || error "Node.js no está instalado"
command -v npm   >/dev/null 2>&1 || error "npm no está instalado"
command -v pm2   >/dev/null 2>&1 || error "PM2 no está instalado. Instálalo con: npm install -g pm2"

# ─── Setup ────────────────────────────────────────────────────────────────────
mkdir -p logs

# ─── Build ────────────────────────────────────────────────────────────────────
log "Iniciando build de producción..."
npm run build || error "El build falló"
log "Build completado"

# ─── PM2 ──────────────────────────────────────────────────────────────────────
APP_NAME="sammy2455-website"

if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  warn "La app '$APP_NAME' ya está en PM2, haciendo reload..."
  pm2 reload ecosystem.config.js --update-env
else
  log "Iniciando app con PM2..."
  pm2 start ecosystem.config.js
fi

pm2 save
log "App corriendo en http://localhost:3000"
log "Logs: pm2 logs $APP_NAME"
