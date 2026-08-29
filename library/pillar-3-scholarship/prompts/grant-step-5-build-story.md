---
title: Grant step 5 — Build the story
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

Step 5 of the manuscript's six-step grant-development sequence
(Table 5, Figure 3): **impose a logical structure on the proposal**. The sequence uses
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
Organize my proposal into the following structure: Important Problem →
Knowledge Gap → Preliminary Data → Central Hypothesis → Specific Aims →
Expected Impact. Explain the purpose of each section and ensure each
leads logically to the next.
```

## Expected output

Your material rearranged into the canonical arc, with the logical
hand-off between sections made explicit.

## Common failure modes

- Forces material into the arc even where your evidence is thin,
  papering over the gap instead of exposing it.
- The 'logical flow' asserted rather than demonstrated.

## Required human verification

Read the arc for the weakest hand-off — that is where a reviewer will
stop believing. Strengthen the science there before drafting.

## Best model and why

Frontier reasoning tier for the whole sequence — grant reasoning is the
deepest task in this pillar, and a shallow model produces confident
scaffolds with hollow logic.
