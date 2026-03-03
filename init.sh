#!/usr/bin/env bash
# Run once after cloning the template to configure a new project.
set -euo pipefail

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${BLUE}"
echo "┌──────────────────────────────────────────┐"
echo "│     React + Node Template – Init         │"
echo "└──────────────────────────────────────────┘"
echo -e "${NC}"

# ── Helpers ───────────────────────────────────────────────────────────────────
prompt() {
  local label="$1" default="$2" var
  if [[ -n "$default" ]]; then
    read -rp "$(echo -e "${YELLOW}${label}${NC} [${default}]: ")" var
    echo "${var:-$default}"
  else
    read -rp "$(echo -e "${YELLOW}${label}${NC}: ")" var
    echo "$var"
  fi
}

prompt_secret() {
  local label="$1" var
  read -rsp "$(echo -e "${YELLOW}${label}${NC}: ")" var
  echo "" >/dev/tty   # newline after hidden input (to terminal, not captured by $())
  echo "$var"
}

die() { echo -e "${RED}Error: $1${NC}" >&2; exit 1; }

# ── Project details ───────────────────────────────────────────────────────────
echo "Project details"
echo "───────────────"
APP_NAME=$(prompt "App / project name (slug, e.g. my-app)" "my-app")
APP_TITLE=$(prompt "Display title shown in the UI" "$APP_NAME")

echo ""
echo "MySQL credentials"
echo "─────────────────"
# Derive safe defaults from the app name (replace hyphens with underscores)
DB_SLUG="${APP_NAME//-/_}"
MYSQL_ROOT_PASSWORD=$(prompt_secret "MySQL root password")
[[ -z "$MYSQL_ROOT_PASSWORD" ]] && die "Root password cannot be empty."

MYSQL_DATABASE=$(prompt "Database name" "${DB_SLUG}")
MYSQL_USER=$(prompt "Database user" "${DB_SLUG}_user")
MYSQL_PASSWORD=$(prompt_secret "Database password")
[[ -z "$MYSQL_PASSWORD" ]] && die "Database password cannot be empty."

# ── Generate .env ─────────────────────────────────────────────────────────────
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@localhost:3307/${MYSQL_DATABASE}"

cat > .env <<EOF
# ── MySQL ────────────────────────────────────────────────────────────────────
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE=${MYSQL_DATABASE}
MYSQL_USER=${MYSQL_USER}
MYSQL_PASSWORD=${MYSQL_PASSWORD}

# ── Backend ──────────────────────────────────────────────────────────────────
DB_HOST=mysql
DB_PORT=3306
DB_NAME=${MYSQL_DATABASE}
DB_USER=${MYSQL_USER}
DB_PASSWORD=${MYSQL_PASSWORD}
DATABASE_URL="${DATABASE_URL}"
BACKEND_PORT=3000

# ── Frontend (Vite build-time) ────────────────────────────────────────────────
VITE_APP_TITLE=${APP_TITLE}
EOF

echo -e "${GREEN}✓ .env created${NC}"

# ── Update package.json names ─────────────────────────────────────────────────
if command -v node &>/dev/null; then
  node -e "
    const fs = require('fs');
    ['frontend/package.json', 'backend/package.json'].forEach(p => {
      const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
      const suffix = p.split('/')[0];
      pkg.name = '${APP_NAME}-' + suffix;
      fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
    });
  "
  echo -e "${GREEN}✓ package.json names updated${NC}"
fi

# ── Install dependencies ──────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
(cd frontend && npm install)
echo -e "${GREEN}✓ Frontend ready${NC}"

echo ""
echo -e "${YELLOW}Installing backend dependencies...${NC}"
(cd backend && npm install)
echo -e "${GREEN}✓ Backend ready${NC}"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}"
echo "┌──────────────────────────────────────────┐"
echo "│   Setup complete! Start your project:    │"
echo "│                                          │"
echo "│   docker compose up --build              │"
echo "│                                          │"
echo "│   Frontend  →  http://localhost:81       │"
echo "│   API       →  http://localhost:81/api   │"
echo "└──────────────────────────────────────────┘"
echo -e "${NC}"
