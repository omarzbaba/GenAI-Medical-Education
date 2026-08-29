---
title: Grant step 6 — Draft the Aims framework
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

Step 6 of the manuscript's six-step grant-development sequence
(Table 5, Figure 3): **produce a specific aims scaffold flagged for human input**. The sequence uses
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
Draft a Specific Aims framework using the structure above. Mark every
place where additional preliminary data, citations, or investigator
interpretation is required. Do not fabricate references or scientific
findings.
```

## Expected output

A Specific Aims skeleton with explicit [NEEDS DATA] / [NEEDS CITATION] /
[INVESTIGATOR] markers — a scaffold you rewrite with real preliminary
data and domain judgment.

## Common failure modes

- Fabricates a plausible-looking citation despite the instruction.
- Fills a marker with invented preliminary data. Delete anything you did
  not supply.

## Required human verification

The model reduces blank-page time; it does not supply the science.
Every scientific claim, citation, and interpretation must be
independently verified before inclusion. Never upload confidential or
unpublished proposal material into public AI tools.

## Best model and why

Frontier reasoning tier for the whole sequence — grant reasoning is the
deepest task in this pillar, and a shallow model produces confident
scaffolds with hollow logic.
