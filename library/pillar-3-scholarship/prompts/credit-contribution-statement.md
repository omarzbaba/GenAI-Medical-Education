---
title: CRediT contribution statement drafting
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: quick-win
time_to_use: <2min
visual: text-only
tags: authorship, CRediT, disclosure
verified_models: TODO
best_model: Claude Haiku 4.5
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Maps your team's actual contributions onto the standard CRediT taxonomy
categories (conceptualization, methodology, writing, etc.) to draft the
contribution statement many journals now require.

## When to use it

At submission, once you know what each author actually did.

## The prompt

```
Here is what each author actually did on this project: [list author
initials and their contributions in plain language]. Map this onto the
standard CRediT taxonomy categories and draft the contribution statement
in the format [target journal]'s guidelines specify. Flag any
contribution I described that doesn't cleanly map to a CRediT category
so I can decide how to categorize it.
```

## Expected output

A CRediT-formatted contribution statement with any ambiguous mappings
explicitly flagged for your decision rather than guessed at.

## Common failure modes

- Assigns a CRediT category to an author who wasn't actually described as
  doing that work.
- Guesses at an ambiguous mapping instead of flagging it.

## Required human verification

Every author should confirm their own listed contributions are accurate
before submission — this is an authorship-integrity document, not just a
formatting exercise.

## Best model and why

Claude Haiku 4.5 — straightforward taxonomy mapping from clear input.
