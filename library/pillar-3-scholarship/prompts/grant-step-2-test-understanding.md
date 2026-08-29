---
title: Grant step 2 — Test understanding
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: advanced
time_to_use: 2-10min
visual: text-only
tags: grants, specific-aims, sequence
verified_models: manuscript
best_model: Frontier reasoning tier (e.g., Claude Opus)
last_updated: 2026-08-29
source: Manuscript Table 5 / Figure 3
---
## What this prompt does

Step 2 of the manuscript's six-step grant-development sequence
(Table 5, Figure 3): **check whether the project reads clearly to a non-specialist reviewer**. The sequence uses
AI as an iterative thinking partner that improves scientific communication
*before* any drafting begins — the model widens and stress-tests; the
investigator supplies the science.

## When to use it

In order. Each step assumes the conversation state built by the previous
one; run the sequence in a single thread. The key principle for the whole
sequence: use AI to improve scientific thinking, organization, and
communication — not to replace investigator judgment.

## The prompt

```
Explain this project back to me as if you were describing it to an NIH
study-section reviewer outside my specialty. What do you think the
project is really about, and what is its central innovation?
```

## Expected output

The project restated in a non-specialist reviewer's terms, with the
central innovation named.

## Common failure modes

- Parrots your own wording back instead of genuinely restating it.
- Names an 'innovation' you consider background, revealing a framing gap
  — which is exactly the signal to use.

## Required human verification

If the model misstates the central hypothesis, innovation, or
significance despite detailed background, a reviewer unfamiliar with the
field is likely to stumble in the same place. Fix the framing, not the
prose.

## Best model and why

Frontier reasoning tier for the whole sequence — grant reasoning is the
deepest task in this pillar, and a shallow model produces confident
scaffolds with hollow logic.
