---
title: Abstract structuring from completed results
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: abstract, manuscript-structure, writing
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Structures a completed set of results and conclusions into a
word-limited abstract in your target journal's required format —
structural help, not new content generation.

## When to use it

After your Results and Discussion are essentially finalized, to compress
them into an abstract without losing the key finding. **Not for:** an
abstract for work still in progress.

## The prompt

```
Structure this into a [word limit]-word structured abstract with these
exact sections: [paste target journal's required abstract sections,
e.g., Background/Methods/Results/Conclusions]. Here is my finalized
content: [paste key results, methods summary, and conclusions]. Do not
add any number, claim, or interpretation not present in what I gave you.
```

## Expected output

A structured abstract at the target word count, built only from the
content you supplied, correctly sectioned per the journal's format.

## Common failure modes

- Rounds or restates a number slightly differently than your original,
  introducing a subtle numerical inconsistency between abstract and body.
- Overstates a conclusion beyond what the results actually support to
  make the abstract sound more impactful.

## Required human verification

Check every number in the abstract against the source data and the
manuscript body for exact consistency — abstract/body numerical
mismatches are a common and easily-caught reviewer criticism.

## Best model and why

Claude Sonnet 4.6 handles format-constrained compression well.
