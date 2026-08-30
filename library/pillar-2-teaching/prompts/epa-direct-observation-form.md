---
title: EPA-based direct observation form
pillar: teaching
event_type: n/a
audience: faculty
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: EPA, assessment, direct-observation
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Drafts a direct-observation assessment form tied to a specific
entrustable professional activity (EPA), with behaviorally anchored
rating levels instead of a vague Likert scale.

## When to use it

Building or refreshing an observation tool for a specific EPA your
program already uses. **Not for:** inventing a new EPA — start from one
your program has already defined.

## The prompt

```
Draft a direct-observation form for this EPA: [paste EPA description].
For each of 3-4 key behaviors that demonstrate this EPA, write a
behaviorally anchored rating scale (what "not yet entrustable,"
"developing," and "entrustable" actually look like in observable terms,
not just a number). Keep it short enough to complete in under two
minutes immediately after observing.
```

## Expected output

A compact form with a handful of behaviors, each with concrete,
observable anchors at each entrustment level.

## Common failure modes

- Anchors describe internal cognitive states ("understands the
  indication") rather than observable behavior ("states the indication
  before proceeding").
- Form becomes too long to complete in real time after an observation.

## Required human verification

Confirm the EPA description and entrustment levels match your program's
official framework exactly before adopting the form for real assessment.

## Best model and why

Claude Sonnet 4.6 handles behaviorally-anchored rubric writing well at
this scale.
