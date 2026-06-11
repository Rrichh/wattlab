# WattLab Server

Backend API per WattLab — **Hono + PostgreSQL + Drizzle ORM**, focus su sicurezza.

## Stack

- **Runtime**: Node.js 20+
- **Framework**: [Hono](https://hono.dev) (lightweight, secure, edge-ready)
- **DB**: **SQLite** (file locale) via [Drizzle ORM](https://orm.drizzle.team) — pronto a migrare a Postgres con un cambio di dialect
- **Auth**: JWT (access + refresh) + Argon2id password hashing
- **Validation**: Zod
- **Sicurezza**: Helmet headers, CORS, CSRF, rate limiting

## TL;DR — Quick start

Tutto è documentato in [QUICKSTART.md](./QUICKSTART.md). In pratica:

```powershell
copy .env.example .env
npm install
npm run db:push   # crea wattlab.db
npm run dev       # avvia server su localhost:3000
```

Nessun Docker, nessun Postgres da installare. Il DB è un file `wattlab.db` nella cartella.

## Setup locale

```bash
cd wattlab-server
cp .env.example .env
# Edita .env con la tua DATABASE_URL e i secret JWT
npm install

# Crea le tabelle nel DB
npm run db:push

# Avvia in dev (auto-reload)
npm run dev
```

Server in ascolto su `http://localhost:3000`.

## Comandi

- `npm run dev` — dev server con hot reload (tsx)
- `npm run build` — compila TypeScript in `dist/`
- `npm start` — avvia da `dist/`
- `npm run db:push` — applica schema al DB (dev)
- `npm run db:generate` — genera migration files (prod)
- `npm run db:migrate` — applica migration files
- `npm run db:studio` — Drizzle Studio (GUI DB)

## Endpoints disponibili

### Auth
- `POST /auth/register` — { email, password } → set cookies httpOnly + return user
- `POST /auth/login` — { email, password } → set cookies + user
- `POST /auth/refresh` — token rotation (refresh)
- `POST /auth/logout` — revoca refresh + clear cookies
- `GET /auth/me` — light token check

### User (richiede auth)
- `GET /user/me` — profilo completo
- `PUT /user/password` — { currentPassword, newPassword }
- `DELETE /user/me` — soft delete account

### Sync (cloud backup, richiede auth)
- `POST /sync/snapshot` — salva snapshot del localStorage utente (mantiene ultimi 10)
- `GET /sync/latest` — ultimo snapshot per restore
- `GET /sync/list` — lista snapshot
- `GET /sync/snapshot/:id` — snapshot specifico

### Admin (solo email in `ADMIN_EMAIL`)
- `GET /admin/stats` — KPI dashboard (utenti, premium, attività, MRR, sistema)
- `GET /admin/users?limit=50` — lista utenti recenti
- `GET /admin/users/search?q=email` — ricerca utenti
- `POST /admin/users/:id/grant-premium?days=30` — concede premium
- `POST /admin/users/:id/revoke-premium` — revoca premium
- `DELETE /admin/users/:id` — soft delete utente
- `GET /admin/audit` — audit log azioni admin
- `GET /admin/system/db` — DB size + tabelle

## Sicurezza

- **Password**: Argon2id (OWASP recommended) con cost parameters bilanciati
- **JWT access token**: 15min, signed con `JWT_ACCESS_SECRET`
- **Refresh token**: 30g, opaque random (non JWT), hashed in DB, **rotation ad ogni refresh**
- **Cookie**: httpOnly, SameSite Lax, Secure in prod
- **CSRF**: bloccato cross-origin per metodi mutating
- **Rate limit**: 60 req/min per IP (in-memory; per prod usa Redis)
- **CSP**: Content-Security-Policy abilitata
- **HSTS**: forced in production

## Deploy consigliato

### Railway (raccomandato)
1. Push del repo su GitHub
2. Su [Railway](https://railway.app): "New Project" → "Deploy from GitHub"
3. Aggiungi "PostgreSQL" come service nello stesso project
4. Railway popola automaticamente `DATABASE_URL`
5. Aggiungi le altre env vars dal `.env.example`
6. Deploy automatico ad ogni push

Costo: free tier per testing, ~$5/mese a regime.

### Alternative
- **Fly.io**: free tier ok, edge deploy globale
- **Render**: simile a Railway
- **VPS** (Hetzner/DigitalOcean): max controllo, ~5€/mese, ma gestisci tu OS/DB/SSL

## Struttura

```
src/
├── index.ts              # entry point, middleware globali
├── db/
│   ├── client.ts         # pool postgres + drizzle
│   └── schema.ts         # tabelle: users, refresh_tokens, activities, ...
├── lib/
│   └── auth.ts           # argon2, JWT helpers
├── middleware/
│   └── auth.ts           # requireAuth, requireAdmin
└── routes/
    ├── auth.ts           # register/login/refresh/logout/me
    └── admin.ts          # /admin/* (gate via requireAdmin)
```

## Prossimi step

- [ ] Endpoint sync dati utente (cloud backup)
- [ ] Stripe integrazione + webhook
- [ ] Endpoint Coach (gestione atleti)
- [ ] Email verification + reset password
- [ ] Test E2E
- [ ] Rate limit con Redis per produzione
- [ ] Logging strutturato (Pino)
- [ ] Monitoring (Sentry)
