# Feature 01 — Register, Login & Register Shop (Backend)

## Overview

Implements user registration and login via email/password and Google OAuth, plus JWT-based session management (access + refresh tokens). The shop registration endpoint is defined here but lives in the `shops` module when implemented.

## Modules Involved

| Module | Responsibility |
|---|---|
| `AuthModule` | Register, login, Google OAuth, token refresh, logout |
| `UsersModule` | User entity CRUD, lookup by email/Google ID |
| `AuthenticationsModule` | Refresh token persistence and validation |
| `DashboardModule` | Protected route (requires valid access token) |

## Entities

### `users` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK, auto-generated |
| `email` | `varchar` | Unique, nullable (Google-only users may add later) |
| `password_hash` | `varchar` | Nullable (null for Google-only users) |
| `name` | `varchar` | Nullable |
| `role` | `enum` | `owner` (default) |
| `google_id` | `varchar` | Nullable, unique |
| `created_at` | `timestamp` | Auto |
| `updated_at` | `timestamp` | Auto |

### `authentications` table

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `users.id` |
| `refresh_token_hash` | `varchar` | Hashed refresh token |
| `created_at` | `timestamp` | Auto |

## API Contracts

### `POST /auth/register`

Register with email and password.

**Request:**
```json
{
  "email": "owner@example.com",
  "password": "SecurePass1!"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "owner@example.com",
    "name": null,
    "role": "owner"
  },
  "accessToken": "jwt_access_token"
}
```

Refresh token is set as `httpOnly` cookie: `refresh_token`.

**Errors:**
- `409 Conflict` — email already registered

---

### `POST /auth/login`

Login with email and password.

**Request:**
```json
{
  "email": "owner@example.com",
  "password": "SecurePass1!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "owner@example.com",
    "name": "Owner Name",
    "role": "owner"
  },
  "accessToken": "jwt_access_token"
}
```

Refresh token is set as `httpOnly` cookie.

**Errors:**
- `401 Unauthorized` — invalid credentials

---

### `POST /auth/google`

Exchange Google OAuth authorization code for app JWT.

**Request:**
```json
{
  "code": "google_authorization_code"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "owner@gmail.com",
    "name": "Owner Name",
    "role": "owner"
  },
  "accessToken": "jwt_access_token"
}
```

Refresh token is set as `httpOnly` cookie.

**Errors:**
- `401 Unauthorized` — invalid or expired Google code

---

### `POST /auth/refresh`

Issue a new access token using refresh token cookie.

**Request:** No body. Sends `refresh_token` cookie automatically.

**Response (200):**
```json
{
  "accessToken": "new_jwt_access_token"
}
```

**Errors:**
- `401 Unauthorized` — refresh token missing, invalid, or revoked

---

### `POST /auth/logout`

Invalidate the current refresh token.

**Request:** Requires `Authorization: Bearer <access_token>` header.

**Response (200):**
```json
{ "message": "Logged out successfully" }
```

Clears the `refresh_token` cookie.

---

### `POST /shops`

Register a new shop. Requires Bearer access token.

**Request:**
```json
{
  "name": "Pangkalan Jaya Abadi",
  "address": "Jl. Raya Bogor No. 123, Jakarta Timur",
  "registrationNumber": "REG-2024-001"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Pangkalan Jaya Abadi",
  "address": "Jl. Raya Bogor No. 123, Jakarta Timur",
  "registrationNumber": "REG-2024-001",
  "ownerId": "uuid",
  "createdAt": "2026-02-25T00:00:00.000Z"
}
```

**Errors:**
- `401 Unauthorized` — missing or invalid token

---

## Validation Rules (DTO)

| Field | Rule |
|---|---|
| `email` | Valid email format, required |
| `password` | Min 8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit, ≥1 symbol |
| `shop.name` | Required, max 100 chars |
| `shop.address` | Required, max 500 chars |
| `shop.registrationNumber` | Optional, max 50 chars |

## Security Notes

- `client_secret` is **backend-only** — never sent to or stored in the frontend
- Passwords are hashed with `bcrypt` before storage
- Refresh tokens are stored as `bcrypt` hashes in the `authentications` table
- Refresh token cookie flags: `httpOnly: true`, `secure: true` (production), `sameSite: strict`
