---
title: Analogy bank builder
pillar: teaching
event_type: n/a
audience: faculty
difficulty: quick-win
time_to_use: 2-10min
visual: text-only
tags: analogies, lecture-prep, explanation
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Generates multiple candidate analogies for one hard concept so you can
pick the one that will actually land with your specific audience, rather
than settling for the first analogy that comes to mind.

## When to use it

While prepping a lecture or teaching moment around a concept that's
historically hard to explain (mechanism-heavy, counterintuitive, or
abstract).

## The prompt

```
I need to explain [concept] to [audience level]. Give me 4 different
analogies from 4 different domains (everyday life, another branch of
medicine, a common technology, a game/sport). For each, spell out exactly
where the analogy breaks down, so I don't accidentally teach a
misconception through an imperfect comparison.
```

## Expected output

Four distinct analogies, each with its own limitation explicitly named —
not just a list of comparisons.

## Common failure modes

- Omits or downplays where an analogy breaks down, which is exactly the
  part that prevents a misconception from taking root.
- All four analogies come from similar domains despite the request for
  variety.

## Required human verification

Read every "where this breaks down" note carefully before using the
analogy — an analogy that's slightly wrong at the edges can teach the
wrong mental model more durably than no analogy at all.

## Best model and why

Claude Sonnet 4.6 generates varied, genuinely different analogies rather
than four variations on one idea.
