---
title: Five testable questions at levels of ambition
pillar: scholarship
event_type: n/a
audience: resident, faculty
difficulty: quick-win
time_to_use: 2-10min
visual: text-only
tags: ideation, study-design
verified_models: manuscript
best_model: Workhorse tier (e.g., Claude Sonnet)
last_updated: 2026-08-29
source: Manuscript §5
---
## What this prompt does

Converts a diffuse research interest into five specific, testable questions
arranged by ambition — from a single-institution pilot to a multicenter
trial — each with its primary outcome and main threat to validity.

## When to use it

When you know the area you care about but not yet the study you can
actually run. The ladder format exposes the trade-off between feasibility
and impact before you commit.

## The prompt

```
I am a pathology resident interested in whether AI-generated board
questions help junior residents study. Propose five specific, testable
research questions at different levels of ambition (from a
single-institution pilot to a multicenter trial), and for each note the
primary outcome and the main threat to validity.
```

Substitute your own interest for the topic in the first sentence.

## Expected output

Five numbered questions in ascending ambition, each with a primary outcome
and one named threat to validity.

## Common failure modes

- The five questions collapse into restatements of the same study at
  different sample sizes rather than genuinely different designs.
- Threats to validity are generic ("selection bias") rather than specific
  to the design proposed.

## Required human verification

These are hypotheses to pursue, not a protocol. Check each proposed outcome
for measurability in your setting, and take the feasible candidates to a
mentor before investing further.

## Best model and why

Workhorse tier. The task is structured brainstorming; verification and
selection carry the intellectual weight.
