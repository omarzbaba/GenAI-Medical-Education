---
title: Grant step 4 — Reviewer critique
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

Step 4 of the manuscript's six-step grant-development sequence
(Table 5, Figure 3): **stress-test the argument before a real reviewer does**. The sequence uses
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
Act as an experienced grant reviewer. Identify the three biggest
weaknesses in my significance argument. What evidence is missing? Which
claims appear overstated?
```

## Expected output

Three named weaknesses with the missing evidence or overstatement
identified for each.

## Common failure modes

- Generic weaknesses ('sample size may be limited') that apply to any
  proposal.
- Misses field-specific standards a real study section would apply.

## Required human verification

Confirm each weakness is real against your preliminary data before
restructuring. Note the rubric-currency caveat: review criteria change —
NIH has proposed replacing overall impact scores with categories — so
name the version of the framework you are simulating.

## Best model and why

Frontier reasoning tier for the whole sequence — grant reasoning is the
deepest task in this pillar, and a shallow model produces confident
scaffolds with hollow logic.
