---
title: AI-output error hunt
pillar: learning
event_type: n/a
audience: resident
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: critical-appraisal, metacognition, error-detection
verified_models: TODO
best_model: Claude Opus 4.7
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Deliberately produces a differential or explanation with one or more
planted errors and asks you to find them — training the specific skill
of catching AI mistakes, which every other prompt in this library
depends on you already having.

## When to use it

Periodically, as a standalone exercise in critical appraisal — not tied
to a specific rotation. **Not for:** a first encounter with a topic; you
need enough baseline knowledge to have a chance of catching the planted
error.

## The prompt

```
Generate a differential diagnosis (or explanation) for [topic/case], and
deliberately include exactly one factual error somewhere in it — a wrong
threshold, a mismatched stain pattern, a superseded criterion, whatever
you choose. Do not tell me what or where it is. After I respond, tell me
whether I found it, and if not, reveal it and explain why it's wrong.
```

## Expected output

A plausible-looking differential or explanation containing one
identifiable error, followed by honest feedback on whether you caught it.

## Common failure modes

- The planted error is too obvious (a wildly wrong fact) to build real
  skill — ask for a subtler error if this happens.
- The model claims something as "the error" that isn't actually wrong,
  undermining the exercise — verify its claimed answer independently.

## Required human verification

Independently confirm the model's claimed "error" and "correction" are
themselves accurate before treating them as ground truth — a model
grading its own planted mistake can get the grading wrong too.

## Best model and why

Claude Opus 4.7 — planting a subtle, realistic error and then correctly
identifying it later is a harder task than straightforward explanation,
and benefits from a deeper-reasoning tier.
