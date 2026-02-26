# Implementation Plan — [Feature Name]

> Copy this template and fill in each section before starting work.  
> File naming: `NN-<feature-slug>.md` (e.g. `02-shop-inventory.md`)

---

## Overview

| Field | Value |
|---|---|
| **Plan ID** | BE-PLAN-NN |
| **Feature** | [Feature name and number] |
| **Related Stories** | [e.g. BE-07, BE-08] |
| **Author** | — |
| **Date** | YYYY-MM-DD |
| **Status** | Draft · In Review · Approved · Done |

## Goal

> One paragraph describing what this plan accomplishes and why.

## Scope

### In Scope
- ...

### Out of Scope
- ...

## Affected Files

| File | Change Type | Notes |
|---|---|---|
| `src/.../entity.ts` | Create / Modify | |
| `src/.../service.ts` | Create / Modify | |
| `src/.../controller.ts` | Create / Modify | |
| `src/migrations/...` | Create | Auto-generated |
| `src/app.module.ts` | Modify | Register new module |

## Implementation Steps

1. **Entity** — Define/update entity and TypeORM decorators
2. **Migration** — Run `npm run migration:generate -- src/migrations/<Name>`, review output
3. **Apply Migration** — Run `npm run migration:run`
4. **DTO** — Create request/response DTOs with `class-validator` decorators
5. **Service** — Implement business logic
6. **Controller** — Wire HTTP endpoints; add guards/decorators
7. **Module** — Register providers/exports; import in `app.module.ts`
8. **Test** — Verify with `curl` / Postman; check edge cases

## API Changes

> List any new or modified endpoints.

| Method | Path | Auth Required | Notes |
|---|---|---|---|
| POST | `/resource` | Yes / No | |

## Environment Variable Changes

> List any new `.env` keys required.

| Variable | Description | Default |
|---|---|---|
| `NEW_VAR` | What it does | — |

## Rollback Plan

- Revert migration: `npm run migration:revert`
- Steps to undo any data or config changes

## Verification Checklist

- [ ] `npm run migration:status` shows all migrations applied
- [ ] All new endpoints return expected responses
- [ ] `401` is returned for protected endpoints without a token
- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] Related stories marked `Done` in `docs/stories/`
