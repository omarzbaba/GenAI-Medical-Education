---
title: Discussion outline from bullet notes
pillar: scholarship
event_type: n/a
audience: resident, faculty
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: writing, structure
verified_models: manuscript
best_model: Workhorse tier (e.g., Claude Sonnet)
last_updated: 2026-08-29
source: Manuscript Table 4
---
## What this prompt does

Converts your bullet-point findings into a proposed Discussion outline —
opening interpretation, comparison with prior work, limitations,
implications. The model organizes; the claims stay yours.

## When to use it

When the results are in hand and the blank page is the obstacle. **Not
for:** generating the comparison-with-prior-work content itself — the
model will import generic claims if you let it.

## The prompt

```
Turn these bullet-point findings into a proposed Discussion outline for a
pathology-education paper: opening interpretation, comparison with prior
work, limitations, and implications. [paste bullets]
```

## Expected output

A section-by-section outline that reflects only what your bullets support,
with placeholders where your judgment or literature is required.

## Common failure modes

- Imports generic claims or overreaching conclusions your results do not
  license.
- Invents a "comparison with prior work" from training data rather than
  leaving it for your literature.

## Required human verification

Confirm the outline reflects only what your data support; strike anything
your results do not license. Every claim that survives into the draft is
yours to defend.

## Best model and why

Workhorse tier for the outline; consider a frontier reasoning tier if the
findings are genuinely intricate and the logical ordering is the hard
part.
