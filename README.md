# React + Node Template

A full-stack project template with a React frontend, Express backend, MySQL database, and Docker Compose orchestration.

## Stack

| Layer     | Technology                                      |
|-----------|------------------------------------------------|
| Frontend  | React 18, Vite, TypeScript, Tailwind, shadcn/ui |
| Backend   | Node.js, Express, TypeScript                   |
| Database  | MySQL 8, Drizzle ORM                           |
| Infra     | Docker Compose, Nginx reverse proxy            |

## Using this template

### Option A — GitHub (recommended)

1. On the GitHub repo page click **Use this template → Create a new repository**.
2. Clone your new repo and run the setup script:

```bash
git clone https://github.com/you/your-new-repo.git
cd your-new-repo
bash init.sh
```

### Option B — degit (no GitHub UI needed)

```bash
npx degit your-github-user/react-node my-new-project
cd my-new-project
bash init.sh
```

### Option C — local copy

```bash
cp -r /path/to/react-node /path/to/my-new-project
cd /path/to/my-new-project
rm -rf mysql/* frontend/node_modules backend/node_modules
bash init.sh
```

---

`init.sh` will ask for your app name and database credentials, generate `.env`, and install all dependencies.

## Running the project

```bash
# Start everything (first run builds images and runs migrations)
docker compose up --build

# Frontend  →  http://localhost:81
# API       →  http://localhost:81/api
```

## Development (without Docker)

```bash
# Terminal 1 – database (still via Docker)
docker compose up mysql

# Terminal 2 – backend
cd backend && npm run dev

# Terminal 3 – frontend
cd frontend && npm run dev   # http://localhost:5173
```

## Project structure

```
.
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── Pages/     # Route-level page components
│   │   ├── components/# Shared UI components (shadcn/ui)
│   │   └── lib/       # Utilities
│   └── Dockerfile
├── backend/           # Express API
│   ├── src/
│   │   ├── db/        # Drizzle schema + connection
│   │   └── index.ts   # Express app entry point
│   └── Dockerfile
├── mysql/             # MySQL data volume (gitignored)
├── docker-compose.yml
├── .env.example       # Copy to .env and fill in secrets
└── init.sh            # One-time project setup script
```

## Environment variables

See `.env.example` for all required variables. Never commit `.env`.

## Database migrations

Drizzle migrations run automatically on `docker compose up`. To manage them manually:

```bash
cd backend
npm run db:generate   # generate a migration from schema changes
npm run db:migrate    # apply pending migrations
npm run db:studio     # open Drizzle Studio in the browser
```
