---
title: Research question refinement
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
source: Manuscript Table 4
---
## What this prompt does

Turns a vague clinical observation into a focused, testable research
question, and names the key variables and confounders you will have to
handle. The value is generative breadth rather than correctness: the model
widens the option space that you then narrow.

## When to use it

At the earliest stage of a project, when a hunch has not yet become a
researchable question. **Not for:** retrieving literature (Pillar 3's
scoping prompts) or making final design decisions — those are yours.

## The prompt

```
I want to study whether AI-generated MCQs save faculty time in a pathology
residency without lowering item quality. Help me sharpen this into a
focused research question and name the key variables and confounders.
```

Substitute your own observation for the example in the first sentence.

## Expected output

One or two sharpened question formulations plus a short list of variables,
candidate outcomes, and threats to validity.

## Common failure modes

- Omits obvious threats to validity (item difficulty drift, faculty
  seniority) while inventing variables that do not apply to your setting.
- Proposes outcomes that sound rigorous but are not measurable in your
  environment.

## Required human verification

Confirm the proposed outcomes and confounders make methodological sense for
your setting. The model may omit obvious threats or invent variables that
don't apply. Design decisions remain the investigator's.

## Best model and why

A workhorse-tier model is sufficient; the task rewards breadth, not depth.
Escalate to a frontier reasoning tier if the design space is genuinely
complex (multi-site, nested outcomes).
