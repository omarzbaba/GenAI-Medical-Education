---
title: STAT / on-call decision-tree drill
pillar: learning
event_type: n/a
audience: resident
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: on-call, frozen-section, decision-making
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Simulates a time-pressured on-call scenario (frozen section, critical
value call, STAT consult) as a branching decision drill, forcing you to
commit to a next step before the model reveals what happens.

## When to use it

Before a call shift or frozen-section rotation, to rehearse the decision
points rather than just the content. **Not for:** real-time guidance
during an actual on-call case — use institutional protocols and call your
attending.

## The prompt

```
Run a timed on-call decision drill for [scenario, e.g., an intraoperative
frozen section with an unexpected finding]. Give me the situation, then
ask "what do you do next?" one decision at a time. Do not reveal the
outcome of a decision until I've committed to it. After each of my
answers, say whether it was reasonable and why, then continue the
scenario based on my choice.
```

## Expected output

A branching scenario that responds to your actual choices, with brief
feedback after each decision point — not a single linear narrative.

## Common failure modes

- Reveals the "right" answer before you've committed, defeating the
  pressure-test.
- Scenario branches become clinically implausible after a few steps.
- Feedback is vague ("good job") rather than tied to the specific
  reasoning that made the choice sound or unsound.

## Required human verification

This rehearses decision-making structure, not institutional protocol.
Verify every procedural step (who to call, what to document, turnaround
expectations) against your actual institution's policy — the model has no
access to it.

## Best model and why

Claude Sonnet 4.6 for the interactive branching. Push back if it reveals
outcomes too early: "Don't tell me what happens — ask me what I'd do
first."
