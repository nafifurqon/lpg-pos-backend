# Stories — Feature 01: Register, Login & Register Shop (Backend)

> **Format:** Each story card lists its ID, type, status, description, and acceptance criteria.
> Status values: `Done` · `In Progress` · `To Do` · `Blocked`

---

## BE-01 — Implement `POST /auth/register`

| Field | Value |
|---|---|
| **ID** | BE-01 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As a** new owner,
**I want to** register an account with email and password,
**so that** I can access the system.

**Acceptance Criteria:**
- [x] `POST /auth/register` accepts `{ email, password }`
- [x] Password is validated (min 8 chars, ≥1 upper, ≥1 lower, ≥1 digit, ≥1 symbol)
- [x] Password is hashed with `bcrypt` before storage
- [x] Returns `{ user, accessToken }` on success
- [x] Sets `refresh_token` as `httpOnly` cookie
- [x] Returns `409` if email is already registered

---

## BE-02 — Implement `POST /auth/login`

| Field | Value |
|---|---|
| **ID** | BE-02 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As an** existing owner,
**I want to** log in with email and password,
**so that** I can access my account.

**Acceptance Criteria:**
- [x] `POST /auth/login` accepts `{ email, password }`
- [x] Returns `401` for unknown email or wrong password
- [x] Returns `{ user, accessToken }` + sets `refresh_token` cookie on success
- [x] Refresh token is persisted (hashed) in `authentications` table

---

## BE-03 — Implement `POST /auth/google`

| Field | Value |
|---|---|
| **ID** | BE-03 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As an** owner,
**I want to** sign in or register via Google OAuth,
**so that** I don't need to manage a separate password.

**Acceptance Criteria:**
- [x] `POST /auth/google` accepts `{ code }` (authorization code from frontend popup)
- [x] Backend exchanges `code` with Google using `client_secret` (never exposed to frontend)
- [x] Upserts user (creates on first Google login; updates on subsequent)
- [x] Returns `{ user, accessToken }` + sets `refresh_token` cookie
- [x] Returns `401` if `code` is invalid or expired

---

## BE-04 — Implement JWT Access & Refresh Token Strategy

| Field | Value |
|---|---|
| **ID** | BE-04 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As the** system,
**I want to** issue short-lived access tokens and long-lived refresh tokens,
**so that** sessions are secure and recoverable without re-login.

**Acceptance Criteria:**
- [x] `jwt-access.strategy.ts` validates `Authorization: Bearer` header
- [x] `jwt-refresh.strategy.ts` validates `refresh_token` cookie
- [x] `POST /auth/refresh` issues new access token using a valid refresh token
- [x] `POST /auth/logout` hashes and removes the refresh token from `authentications`
- [x] Invalid/missing tokens return `401`

---

## BE-05 — Implement `POST /shops` (Register Shop)

| Field | Value |
|---|---|
| **ID** | BE-05 |
| **Type** | Story |
| **Status** | Done |
| **Feature** | 01-register-login |

**As an** authenticated owner,
**I want to** register my shop,
**so that** I can start using the POS system.

**Acceptance Criteria:**
- [x] `POST /shops` requires valid access token
- [x] Validates: `name` (required, max 100), `address` (required, max 500), `registrationNumber` (optional, max 50)
- [x] Returns `201` with the created shop object
- [x] Returns `401` if token is missing or invalid
- [x] An owner can only register one shop (enforce uniqueness by `owner_id`)

---

## BE-06 — Protect `GET /dashboard` Endpoint

| Field | Value |
|---|---|
| **ID** | BE-06 |
| **Type** | Task |
| **Status** | Done |
| **Feature** | 01-register-login |

**Acceptance Criteria:**
- [x] `GET /dashboard` (or equivalent) requires `JwtAccessGuard`
- [x] Returns `401` for unauthenticated requests
- [x] Returns current user info from JWT payload
