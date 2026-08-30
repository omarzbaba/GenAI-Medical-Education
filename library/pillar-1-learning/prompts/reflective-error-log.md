---
title: Reflective error log / personal M&M entry
pillar: learning
event_type: n/a
audience: resident, fellow
difficulty: quick-win
time_to_use: <2min
visual: text-only
tags: reflection, self-improvement, error-log
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Turns a brief note about a mistake or near-miss you made into a
structured personal-log entry — what happened, why, and what you'll do
differently — modeled on a morbidity-and-mortality format but for your
own private learning record.

## When to use it

Right after you catch your own error or a near-miss, while the details
are fresh, so the reflection captures the actual reasoning failure rather
than a vague memory of it later.

## The prompt

```
Help me turn this into a structured personal learning-log entry: [describe
what happened in your own words, including what you initially thought and
what turned out to be true]. Structure it as: what happened, what I
assumed and why it was reasonable at the time, what I missed, and one
specific, checkable habit I'll change. Keep my own words; don't invent
details I didn't give you.
```

## Expected output

A short, structured entry in your own voice, ending in one concrete,
checkable behavior change — not a generic "be more careful" conclusion.

## Common failure modes

- Adds clinical detail you didn't provide, drifting the entry away from
  what actually happened.
- Produces a vague resolution ("double-check next time") instead of a
  specific, checkable habit.

## Required human verification

This is a private reflective tool, not a reportable safety-event record —
follow your institution's actual incident-reporting requirements
separately when applicable. No patient-identifying detail should ever go
into this prompt.

## Best model and why

Claude Sonnet 4.6 keeps the tone appropriately personal rather than
clinical-report-flat.
