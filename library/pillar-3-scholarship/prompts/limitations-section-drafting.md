---
title: Limitations section drafting from bullet notes
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: manuscript-drafting, limitations, writing
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Turns a bulleted list of study weaknesses you've already identified into
connected prose for a Limitations section — organizing and connecting
your own points, not generating new ones.

## When to use it

When you already know your study's limitations and need help with
prose structure and flow, not with identifying the limitations
themselves.

## The prompt

```
Turn these bullet points into a Limitations section: [paste your bullets].
Organize from most to least consequential, connect them with transitions,
and end with a sentence on what these limitations mean for interpreting
the results. Do not add any limitation I did not list, and do not soften
or downplay any of them.
```

## Expected output

Connected prose covering only the limitations you listed, ordered by
consequence, ending with an interpretive note — no new limitations
introduced, none downplayed.

## Common failure modes

- Softens a limitation's phrasing in a way that undersells its actual
  impact on the findings.
- Adds a generic limitation ("small sample size") you didn't list, just
  because it's common in this type of study.

## Required human verification

Compare the draft against your original bullets line by line to confirm
nothing was added, dropped, or softened — limitations sections are where
authors are held to the highest standard of honesty, and generic padding
or softened language undermines that.

## Best model and why

Claude Sonnet 4.6 for prose connection without overreach.
