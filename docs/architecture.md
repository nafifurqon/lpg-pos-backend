# LPG POS — Backend Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | TypeORM |
| Auth | Passport.js + JWT (access + refresh tokens) |
| Google OAuth | google-auth-library |

## Folder Structure (`src/`)

```
src/
├── app.module.ts                   # Root NestJS module (TypeORM configured here)
├── main.ts                         # Entry point — listens on port 6000
├── data-source.ts                  # TypeORM DataSource for CLI migration commands
│
├── auth/                           # Authentication module
│   ├── auth.controller.ts          # POST /auth/register, /auth/login, /auth/google, /auth/refresh, /auth/logout
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   ├── dto/
│   │   ├── register-email.dto.ts
│   │   ├── login-email.dto.ts
│   │   └── google-auth.dto.ts
│   ├── guards/
│   │   ├── jwt-access.guard.ts
│   │   └── jwt-refresh.guard.ts
│   └── strategies/
│       ├── jwt-access.strategy.ts
│       └── jwt-refresh.strategy.ts
│
├── users/                          # Users module
│   ├── users.module.ts
│   ├── users.service.ts
│   └── entities/
│       └── user.entity.ts
│
├── authentications/                # Authentications (refresh token storage) module
│   ├── authentications.module.ts
│   ├── authentications.service.ts
│   └── entities/
│       └── authentication.entity.ts
│
├── dashboard/                      # Dashboard module (protected routes)
│   ├── dashboard.controller.ts
│   └── dashboard.module.ts
│
├── common/
│   └── types/
│       └── jwt-payload.type.ts
│
└── migrations/                     # TypeORM migration files — auto-generated via CLI
    └── README.md                   # Migration workflow guide
```

## API Base

Server runs on: `http://localhost:6000`

Configured in `main.ts`. Port can be overridden via `PORT` env var.

## Database

### Running PostgreSQL

PostgreSQL runs in Docker. The NestJS backend runs manually (not in Docker).

```bash
# From project root — start PostgreSQL only
docker compose up -d

# Stop PostgreSQL (data is preserved in the named volume)
docker compose down

# WARNING: destroys all data
docker compose down -v
```

Data is persisted in the named Docker volume `lpg_pos_pgdata`.

### Credentials (local development)

| Variable | Value |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | `lpg_pos_db` |
| `DB_USERNAME` | `lpg_pos_user` |
| `DB_PASSWORD` | `lpg_pos_password` |

These are defined in the root `.env` (used by `docker-compose.yml`) and mirrored in `backend/.env` (used by NestJS and TypeORM CLI).

## Schema Migrations

**Rule: `synchronize` is always `false`. All schema changes go through migration files.**

```bash
# From backend/

# 1. Generate a migration after modifying an entity:
npm run migration:generate -- src/migrations/<DescriptiveName>

# 2. Review the generated file in src/migrations/

# 3. Apply pending migrations:
npm run migration:run

# Rollback the last applied migration:
npm run migration:revert

# Show applied/pending migration status:
npm run migration:status
```

Never edit a migration file that has already been applied via `migration:run`.

## Authentication Architecture

Two-token strategy:
- **Access token** — short-lived JWT, carried in `Authorization: Bearer` header
- **Refresh token** — long-lived JWT, stored as `httpOnly` cookie; used to issue new access tokens

Strategies:
- `jwt-access.strategy.ts` — validates `Authorization` header
- `jwt-refresh.strategy.ts` — validates `refresh_token` cookie

Refresh tokens are persisted (hashed) in the `authentications` table, enabling secure revocation on logout.

## Google OAuth Flow (Backend Side)

1. Frontend sends `code` (authorization code from Google popup) to `POST /auth/google`
2. Backend exchanges `code` with Google API using `client_secret`
3. Backend upserts the user (creates if first-time Google login)
4. Backend returns access JWT + sets refresh token cookie

`client_secret` is **backend-only**. It must never be sent to or stored in the frontend.

## Running the Backend

```bash
# 1. Start the database (from project root)
docker compose up -d

# 2. Apply pending migrations (from backend/)
npm run migration:run

# 3. Start the dev server
npm run dev   # http://localhost:6000
```

## Environment Variables

| Variable | Description |
|---|---|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (backend-only) |
| `NODE_ENV` | `development` / `production` |

See `backend/.env.example` for the full reference.

## Naming Conventions

- All TypeScript symbols in **English**: `ShopService`, `createShop()`, `user.entity.ts`
- Files: `kebab-case`; classes: `PascalCase`; methods: `camelCase`
- API functions named by HTTP action + resource: `registerWithEmail`, `loginWithGoogle`
- Database table names: `snake_case` (enforced in entities)

## Adding a New Backend Feature

1. Create/modify entity → generate migration → run migration
2. Add module, service, controller
3. Register module in `app.module.ts`
4. Write/update DTO with class-validator decorators
5. Add story to `docs/stories/` and implementation plan to `docs/plans/`
