---
title: Multi-round reviewer comment tracking table
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: quick-win
time_to_use: 2-10min
visual: text-only
tags: peer-review, revision-tracking, multi-round
verified_models: TODO
best_model: Claude Haiku 4.5
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Builds a running tracking table across multiple rounds of revision,
showing which comments have been addressed, which are still open, and
which reviewer raised each — useful once a manuscript has gone through
more than one review cycle.

## When to use it

Managing a manuscript in its second or later round of review, when
keeping track of what's resolved across rounds by memory gets
error-prone.

## The prompt

```
I have reviewer comments across multiple rounds. Round 1 comments and how
I addressed them: [paste]. Round 2 comments (some may reference round 1
issues): [paste]. Build a single tracking table: comment, round raised,
status (resolved / still open / new), and which reviewer. Flag any round
2 comment that seems to reopen a round 1 issue I thought was resolved.
```

## Expected output

One consolidated table spanning both rounds, with reopened issues
explicitly flagged for your attention.

## Common failure modes

- Misses that a round 2 comment is actually the same underlying issue as
  a round 1 comment phrased differently.
- Marks something "resolved" based on your round 1 response without
  confirming the reviewer actually accepted it in round 2.

## Required human verification

Confirm every "resolved" status against the actual reviewer's round 2
language — a reviewer restating a concern in different words is not the
same as a new, unrelated comment.

## Best model and why

Claude Haiku 4.5 for straightforward table consolidation from clearly
supplied text.
