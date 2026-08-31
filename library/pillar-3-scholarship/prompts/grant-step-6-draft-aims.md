---
title: Grant step 6 — Build a requirements checklist
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: advanced
time_to_use: 2-10min
visual: text-only
tags: grants, specific-aims, sequence
verified_models: manuscript
best_model: Frontier reasoning tier (e.g., Claude Opus)
last_updated: 2026-08-31
source: Manuscript Table 7 / Figure 3
---
## What this prompt does

Step 6 of the manuscript's six-step grant-development sequence
(Table 7, Figure 3): **turn the agreed structure into a checklist of what
the applicant must supply for each section — no application text is
generated**. The sequence uses AI as an iterative thinking partner that
improves scientific communication *before* any drafting begins — the
model widens, organizes, and stress-tests; the investigator writes every
word of the application.

## When to use it

In order. Each step assumes the conversation state built by the previous
one; run the sequence in a single thread. The key principle for the whole
sequence: use AI to improve scientific thinking, organization, and
communication — never to author any part of the application's own text.
Funders including NIH restrict the use of generative AI in developing
the substantive content of an application; this step is deliberately
non-generative for that reason.

## The prompt

```
Using the structure above, list what each section (Significance,
Innovation, Approach, Specific Aims) must establish, and what
preliminary data, citations, or investigator input it requires. Do not
write any of the actual application text — produce a requirements
checklist only.
```

## Expected output

A section-by-section checklist of what each part of the Aims must
establish and what you still need to supply — not draft prose, and not
a "scaffold" of application text to edit down.

## Common failure modes

- Slips into drafting actual Aims-page prose despite the instruction;
  if it does, discard the prose and re-run with the checklist framing.
- Fills a checklist item with invented preliminary data. Delete anything
  you did not supply.

## Required human verification

The model reduces blank-page time; it does not supply the science, and
it must not supply any of the application's own language. Every
scientific claim, citation, and interpretation must be independently
verified before inclusion. Never upload confidential or unpublished
proposal material into public AI tools.

## Best model and why

Frontier reasoning tier for the whole sequence — grant reasoning is the
deepest task in this pillar, and a shallow model produces a confident
checklist with hollow logic.
