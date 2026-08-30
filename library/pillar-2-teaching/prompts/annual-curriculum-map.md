---
title: Academic-year curriculum map
pillar: teaching
event_type: n/a
audience: faculty
difficulty: advanced
time_to_use: >10min
visual: text-only
tags: curriculum, program-design, academic-year
verified_models: TODO
best_model: Claude Opus 4.7
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Drafts a full academic-year curriculum map across subspecialty rotations
— sequencing topics so foundational material precedes advanced material
and nothing critical is only ever covered once, in passing.

## When to use it

At the start of a curriculum redesign cycle, as a first-pass structure
for program leadership to react to and correct — not as a finished
document.

## The prompt

```
Draft a one-year curriculum map for a [program type, e.g., AP/CP
residency] covering these rotations in this order: [list]. For each
rotation, note 2-3 core topics that should be introduced there, and flag
any topic that depends on a prerequisite from an earlier rotation.
Highlight any topic that appears only once across the whole year if it's
high-stakes enough to warrant reinforcement later.
```

## Expected output

A rotation-by-rotation topic map with explicit prerequisite dependencies
flagged, plus a short list of single-exposure high-stakes topics worth a
second pass.

## Common failure modes

- Proposes a sequencing dependency that doesn't actually hold in your
  program's real rotation order.
- Treats every topic as equally high-stakes, diluting the flag's
  usefulness.

## Required human verification

This is a starting structure for program leadership discussion, not an
approved curriculum. Verify every prerequisite claim and topic assignment
against your program's actual accreditation requirements and faculty
availability.

## Best model and why

Claude Opus 4.7 — sequencing dependencies across a full year is a more
demanding reasoning task than a single rotation blueprint.
