---
title: Muddiest-point formative question generator
pillar: teaching
event_type: n/a
audience: faculty
difficulty: quick-win
time_to_use: <2min
visual: text-only
tags: formative-assessment, lecture, exit-ticket
verified_models: TODO
best_model: Claude Haiku 4.5
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Generates a single, fast end-of-lecture question designed to surface
where the audience actually got lost — the "muddiest point" technique —
rather than a generic recap question.

## When to use it

In the last two minutes of a teaching session, as a low-stakes formative
check. **Not for:** graded assessment.

## The prompt

```
I just taught a session on [topic], covering these points: [list 3-4
main points]. Write one exit-ticket question that asks the audience to
identify the part of today's session that's still unclear to them — not
a content-recall question, a self-report of confusion — plus one
follow-up question I can ask a specific learner to probe further based
on their answer.
```

## Expected output

One self-report exit question plus a probing follow-up, both usable
verbally or on a slide.

## Common failure modes

- Writes a disguised content-recall question ("what is X?") instead of a
  genuine self-report of confusion.

## Required human verification

None beyond reading the responses yourself — this is a low-stakes
formative tool, not a scored instrument.

## Best model and why

Claude Haiku 4.5 — fast, low-stakes, doesn't need deep reasoning.
