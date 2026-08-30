---
title: Grading and staging systems drill
pillar: learning
event_type: n/a
audience: resident
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: staging, grading, board-prep
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Drills a specific grading or staging system (Gleason, Nottingham, TNM, WHO
grade) against a described specimen, asking you to apply the criteria
yourself before the model checks your work — rather than the model just
handing you a grade.

## When to use it

When you're consolidating a staging/grading system you've read about but
haven't yet applied under exam-like pressure. **Not for:** grading a real
case for clinical use — staging always requires the actual slide/imaging
and current edition of the relevant manual.

## The prompt

```
Quiz me on [grading/staging system, e.g., Gleason grade group, current
WHO/AJCC edition]. Describe one hypothetical specimen finding at a time,
ask me to assign the grade/stage and state my reasoning, then tell me
if I'm right before giving the next case. Vary difficulty: start
straightforward, then include an edge case that tests a specific pitfall
in this system. Name the edition/version you're using.
```

## Expected output

One case at a time, each followed by feedback on your answer and the
correct reasoning before the next case — not a bulk-graded quiz.

## Common failure modes

- Uses a superseded edition of the grading system without saying so.
- Invents a specimen finding that wouldn't actually occur together in
  real tissue.
- Accepts a plausible-sounding but wrong justification as correct.

## Required human verification

Cross-check the stated criteria and edition against the current official
manual (AJCC, WHO) before trusting any threshold as current. Never use
model-generated staging logic on a real case.

## Best model and why

Claude Sonnet 4.6 handles the back-and-forth quiz format reliably. Name
the exact edition in every session — staging criteria change often enough
that an unspecified version is a real risk.
