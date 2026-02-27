# Stories Template

> Copy the relevant section below when creating a new story or task file.
> File naming: `<YYYY-MM-DD HH.MM.SS>-<TYPE>-<Title>-<TICKET-ID>.md`
> Example: `2026-02-27 10.00.00-STORY-User Registration-LPG-1.md`
> Example: `2026-02-27 10.00.00-TASK-Add Email Validation-LPG-2.md`
>
> Type values: `STORY` · `TASK`
> Ticket ID: `LPG-<incremental number>` — increment globally across all stories and tasks

---

## STORY Template

```
# <YYYY-MM-DD HH.MM.SS>-STORY-<Title>-<TICKET-ID>

| Field   | Value                                         |
|---------|-----------------------------------------------|
| **ID**      | LPG-<NN>                                  |
| **Type**    | Story                                     |
| **Status**  | To Do · In Progress · Done · Blocked      |
| **Feature** | <feature-slug>                            |

## User Story Statement

As a <type of user>,
I want <goal/feature>,
so that <benefit/value>.

## Background / Context

> Why does this story exist? Describe the problem, pain point, or stakeholder request.
> Link to Epic, design, PRD document, or Confluence if available.

- ...

## Business Rules / Functional Requirements

- ...

## Acceptance Criteria

- [ ] Given ... When ... Then ...
- [ ] Given ... When ... Then ...

## Out of Scope

- ...
```

---

## TASK Template

```
# <YYYY-MM-DD HH.MM.SS>-TASK-<Title>-<TICKET-ID>

| Field   | Value                                         |
|---------|-----------------------------------------------|
| **ID**      | LPG-<NN>                                  |
| **Type**    | Task                                      |
| **Status**  | To Do · In Progress · Done · Blocked      |
| **Feature** | <feature-slug>                            |

## Objective / Summary

> Describe the technical goal of this task.
> Example: Refactor payment service to extract discount calculation into a separate module.

...

## Scope

### In Scope

- ...

### Out of Scope

- ...

## Acceptance Criteria

- [ ] Unit and integration tests pass
- [ ] No regression on existing endpoints
- [ ] ...
```
