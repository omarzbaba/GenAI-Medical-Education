---
title: Guardrailed language editing
pillar: scholarship
event_type: n/a
audience: resident, faculty
difficulty: quick-win
time_to_use: <2min
visual: text-only
tags: writing, editing
verified_models: manuscript
best_model: Workhorse tier (e.g., Claude Sonnet)
last_updated: 2026-08-29
source: Manuscript §5 and Table 4
---
## What this prompt does

The clearest and most defensible scholarly use of AI: language work on
text you already own. The prompt pins the model to clarity and concision
while forbidding it from touching your numbers or claims. This matters
most for authors writing in English as an additional language, for whom
editing assistance narrows a longstanding disadvantage in review.

## When to use it

On any paragraph of your own draft. Two variants from the manuscript —
use the one matching the section you are editing.

## The prompt

Results variant:

```
Edit the following Results paragraph for clarity and concision. Do not
add, remove, or reinterpret any numerical result or statistical claim.
Preserve every value exactly. Flag any sentence you find ambiguous rather
than guessing at my meaning.
```

Methods variant:

```
Improve the clarity and concision of this Methods paragraph without
changing its meaning or any numbers. Flag any sentence where you were
unsure what I meant. [paste]
```

## Expected output

Your paragraph, tightened, with every value intact and ambiguous sentences
flagged rather than silently reinterpreted.

## Common failure modes

- Models silently "correct" numbers and strengthen tentative claims.
- Hedges ("may", "suggests") quietly upgraded to assertions.

## Required human verification

Compare against your original line by line to confirm no data, claim, or
hedge was altered. Meaning and statistics must survive intact. Fluency is
not accuracy: any AI-touched sentence describing methods or results must
be checked against the actual data by the author. Disclose language
editing per your target journal's policy.

## Best model and why

Workhorse tier. Language editing is exactly what these models do best; the
risk is not capability but silent overreach, which the verification step
catches.
