---
title: Antibody panel construction drill
pillar: learning
event_type: n/a
audience: resident
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: immunohistochemistry, panel-design, differential
verified_models: TODO
best_model: Claude Opus 4.7
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Reverses the usual IHC drill: instead of interpreting a panel someone
else built, you build the panel yourself from a differential, then the
model checks your choices — including which stains would and wouldn't
discriminate the entities on your list.

## When to use it

After you've learned individual stain patterns and want to practice the
higher-order skill of choosing an efficient, discriminating panel.
**Not for:** ordering a real panel — that must follow local protocol and
available reagents.

## The prompt

```
Here is my differential: [list 3-5 entities]. I am going to propose an
IHC panel to distinguish them: [your stain list]. Check my panel: which
stains actually discriminate between these specific entities, which are
redundant, and what important discriminator am I missing? Don't just give
me the answer — ask me to reconsider before revealing it if my panel has
a gap.
```

## Expected output

Feedback on your proposed panel's discriminating power, redundancy, and
gaps — with a chance to revise before the model gives the complete
answer.

## Common failure modes

- States a stain is "positive" or "negative" for an entity as an absolute
  when real practice shows a range (focal, patchy, variable) — push back
  if this happens.
- Recommends a stain not actually validated/available in typical practice
  settings.

## Required human verification

Verify every stated staining pattern against a current IHC reference
before treating it as fact — patterns and antibody clones are refined
over time, and this is exactly the kind of specific factual claim models
get confidently wrong.

## Best model and why

Claude Opus 4.7 for the multi-entity discrimination logic, which is more
demanding than single-stain interpretation.
