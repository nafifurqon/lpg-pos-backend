# Git Standards

This document defines the branch naming convention and commit message standards for this project.

---

## Branch Naming Convention

> Reference: [GitHub Branching Name Best Practices](https://dev.to/jps27cse/github-branching-name-best-practices-49ei)

### Format

```
<prefix>/<short-description>-<TICKET-ID>
```

- Use **lowercase** and **hyphens** (`-`) to separate words — no spaces or underscores
- Keep the description **short and descriptive** (3–5 words max)
- Always append the **ticket ID** at the end (e.g. `LPG-2`)

### Prefixes

| Prefix | Purpose |
|--------|---------|
| `feat/` | New feature or functionality |
| `bugfix/` | Bug fix |
| `hotfix/` | Urgent patch for production |
| `refactor/` | Code restructuring without behaviour change |
| `test/` | Adding or updating tests |
| `doc/` | Documentation updates |
| `design/` | UI/UX changes |

### Examples

```
feat/create-register-endpoint-LPG-2
bugfix/fix-token-expiry-check-LPG-5
hotfix/patch-sql-injection-LPG-9
refactor/extract-discount-logic-LPG-12
doc/add-git-standards-LPG-2
```

---

## Commit Message Standards

> Reference: [Git Commit Standards](https://medium.com/@fatihsevencan/git-commit-standards-d76f2f5f5c7f)

### Format

```
type(scope): short description
```

- **type** — what kind of change (see table below)
- **scope** — the specific feature or area affected, written in `camelCase`, ideally a single word (e.g. `auth`, `userProfile`, `ui`)
- **short description** — imperative mood, lowercase, no period at the end

### Types

| Type | When to use |
|------|-------------|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `refactor` | Restructuring existing code without changing functionality |
| `docs` | Documentation or comment changes |
| `style` | Code formatting, whitespace, punctuation — no logic change |
| `test` | Adding or updating tests |
| `chore` | Build tools, config files, project organization |

### Examples

```
feat(auth): add email registration endpoint
fix(auth): resolve refresh token expiry mismatch
refactor(user): extract password hashing into helper
docs(git): add branch naming and commit standards
chore(config): update environment variable names
style(auth): reformat controller method signatures
test(auth): add unit tests for token validation
```

### Merge Conflict Resolution

When resolving conflicts while merging `develop` into a feature branch, use:

```
fix(conflict): resolve conflicts

Merge develop into <branch-name>. Resolve conflicts on <file or module>.
```
