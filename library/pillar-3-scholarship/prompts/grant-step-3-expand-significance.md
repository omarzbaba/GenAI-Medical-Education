---
title: Grant step 3 — Expand significance
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

Step 3 of the manuscript's six-step grant-development sequence
(Table 5, Figure 3): **generate candidate angles that could strengthen impact**. The sequence uses
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
Suggest related diseases, biomarkers, biological pathways, technologies,
or clinical applications that could strengthen the significance of this
proposal. Clearly identify which suggestions require literature
verification.
```

## Expected output

A list of adjacent angles — related markers, methods from other organ
systems, downstream applications — each labeled for verification.

## Common failure modes

- Suggests connections that sound plausible but have no literature
  behind them.
- Presents speculative links with the same confidence as established
  ones, even when asked to label them.

## Required human verification

These connections are hypotheses to pursue in the primary literature,
not established facts. Each requires verification before it enters an
application.

## Best model and why

Frontier reasoning tier for the whole sequence — grant reasoning is the
deepest task in this pillar, and a shallow model produces confident
scaffolds with hollow logic.
