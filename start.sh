#!/usr/bin/env bash
# ============================================================
#  École 221 — Script de démarrage (2 serveurs en parallèle)
#  - Backend API Express  → http://localhost:3001
#  - Frontend Vite (HMR)  → http://localhost:5173
#  Libère automatiquement les ports avant démarrage
# ============================================================

set -e

API_PORT=3001
VITE_PORT=5173
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║     🎓  École 221 — Portail Étudiant         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ─── Étape 0 : Charger nvm + forcer Node 20 ──────────────────────
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh" --no-use
  nvm use 20 --silent 2>/dev/null || nvm install 20
fi
echo "✅ Node $(node --version) actif"

# ─── Étape 1 : Libérer les ports 3001 et 5173 ────────────────────
echo "🔍 Libération des ports $API_PORT (API) et $VITE_PORT (Vite)..."

for PORT in $API_PORT $VITE_PORT; do
  PIDS=$(lsof -ti tcp:$PORT 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    echo "   ⚠️  Port $PORT occupé (PID: $PIDS) — libération..."
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
  fi
done

sleep 0.5
echo "✅ Ports libérés."

# ─── Étape 2 : Vérifier node_modules ─────────────────────────────
cd "$PROJECT_DIR"
if [ ! -d "node_modules" ]; then
  echo ""
  echo "📦 Installation des dépendances..."
  npm install --legacy-peer-deps
fi

# ─── Étape 3 : Lancer les 2 serveurs en parallèle ────────────────
echo ""
echo "🚀 Démarrage des serveurs..."
echo "   🔴 API  Backend → http://localhost:$API_PORT"
echo "   🔵 App  Frontend → http://localhost:$VITE_PORT"
echo ""
echo "   Appuyez sur Ctrl+C pour tout arrêter."
echo ""

NODE_ENV=development npx concurrently \
  -k \
  -p "[{name}]" \
  -n "API ,VITE" \
  -c "bgRed.bold,bgBlue.bold" \
  "npx tsx server-api.ts" \
  "npx vite"
