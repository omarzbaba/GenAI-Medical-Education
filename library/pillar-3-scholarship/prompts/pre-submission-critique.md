---
title: Pre-submission reviewer simulation
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: advanced
time_to_use: 2-10min
visual: text-only
tags: peer-review, revision
verified_models: manuscript
best_model: Frontier reasoning tier (e.g., Claude Opus)
last_updated: 2026-08-29
source: Manuscript §5 and Table 4
---
## What this prompt does

Asks a model to predict what a reviewer would object to in your own
unsubmitted draft — a rehearsal of peer review, not a substitute for it.
The instruction to diagnose rather than rewrite is deliberate: it keeps
your voice, keeps the revision a learning event, and keeps disclosure
simple, because no generated prose enters the manuscript.

## When to use it

On early drafts, where the distance between what the critique surfaces and
what you already know is greatest. Value approaches zero on mature work
whose weaknesses the team has already discussed.

**Three conditions bound this use (manuscript §5):**

1. **Directional.** Run it only on your *own unsubmitted* work. A reviewer
   must never run it on a manuscript assigned to them — that material is
   confidential by editorial policy.
2. **Deployment.** An unsubmitted manuscript is unpublished intellectual
   property. This task belongs in an institutional or otherwise sanctioned
   tool whose terms exclude training — not a public consumer account.
3. **Interpretive.** The model anticipates objections a competent reviewer
   *would* raise; it cannot anticipate the ones a reviewer *should not*
   raise. Concordance with human review is a ceiling, not a gold standard.

## The prompt

```
Act as a reviewer for [target journal] and critique this Discussion
section. List the three weaknesses most likely to be raised at review,
and for each say what would resolve it. Do not rewrite my text.
```

## Expected output

Three named weaknesses with what would resolve each — diagnosis only, no
replacement prose.

## Common failure modes

- Rewrites your text despite the instruction. Discard the rewrite.
- Surfaces stylistic quibbles while missing a real methodological gap —
  silence is not clearance.

## Required human verification

Treat each item as a prediction of reviewer concern, not a verdict:
confirm the weakness is real against your data and design before acting
on it. A weakness the model fails to raise is not evidence a reviewer
will not raise it. Simulated critique does not replace mentorship — an
experienced colleague reads for what a model cannot.

## Best model and why

Frontier reasoning tier — critique quality tracks reasoning depth, and a
shallow critique gives false reassurance, which is worse than none.
