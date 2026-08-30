---
title: Teach-back drill
pillar: learning
event_type: n/a
audience: resident
difficulty: quick-win
time_to_use: 2-10min
visual: text-only
tags: self-quizzing, metacognition, teach-back
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Reverses the usual direction: you explain a concept to the model, and it
grades your explanation for gaps, imprecision, and confabulation —
surfacing what you don't actually know as well as you thought.

## When to use it

After a first pass at a topic, before moving on — teaching something
exposes gaps that recognition-based review (like MCQs) can hide. **Not
for:** topics you haven't studied at all yet.

## The prompt

```
I am going to explain [topic] to you as if you were a junior learner.
After I finish, grade my explanation on: (1) factual accuracy — flag
anything wrong or unsupported, (2) completeness — what did I leave out
that a learner would need, (3) clarity — where would a learner get
confused. Do not correct me mid-explanation; wait until I say "done."

[your explanation]

done.
```

## Expected output

Structured feedback across the three axes, with specific line-level
callouts rather than a generic assessment.

## Common failure modes

- Praises a vague or hand-wavy explanation as "clear" because it read
  smoothly, not because it was actually correct.
- Flags something as an omission that was actually out of scope for the
  level you specified.

## Required human verification

Treat flagged inaccuracies as a prompt to check a primary source, not as
ground truth on their own — the grader can be wrong about what's wrong.

## Best model and why

Claude Sonnet 4.6 gives balanced, specific feedback without excessive
praise or excessive nitpicking.
