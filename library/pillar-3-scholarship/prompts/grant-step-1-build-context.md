---
title: Grant step 1 — Build context
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

Step 1 of the manuscript's six-step grant-development sequence
(Table 5, Figure 3): **surface the core scientific narrative before any drafting**. The sequence uses
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
I am developing a grant proposal. Based only on the information I
provide, summarize the scientific problem, knowledge gap, novelty, and
potential impact. Clearly distinguish established findings from
hypotheses.
```

## Expected output

A faithful summary that separates what you established from what you
hypothesize.

## Common failure modes

- Blends hypothesis into established fact when your notes are loosely
  worded.
- Inflates impact language beyond what you supplied.

## Required human verification

Supply only non-confidential context. Check the summary against your own
understanding: anything the model got wrong is a place your framing —
not your prose — needs work.

## Best model and why

Frontier reasoning tier for the whole sequence — grant reasoning is the
deepest task in this pillar, and a shallow model produces confident
scaffolds with hollow logic.
