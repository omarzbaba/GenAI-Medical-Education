---
title: Audience-response question set for large-group teaching
pillar: teaching
event_type: n/a
audience: faculty
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: audience-response, large-group, tumor-board
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Drafts a set of live-polling questions (Kahoot/Poll Everywhere style) for
a large-group session or tumor board, designed to be answered in seconds
and to reveal a spread of opinion, not just test recall.

## When to use it

Planning a large-group teaching session where you want real-time
engagement data, not just a lecture.

## The prompt

```
Write 5 live-polling questions for a large-group session on [topic].
Each question should be answerable in under 15 seconds, have 3-4
options, and at least 2 of the 5 should be judgment questions where
reasonable people might disagree (to prompt discussion of the poll
results), not just single-fact recall.
```

## Expected output

Five short multiple-choice polling questions, explicitly marked for
which are recall vs. judgment/discussion-provoking.

## Common failure modes

- All questions test recall, producing a quiz rather than a discussion
  prompt.
- A "judgment" question actually has one clearly correct answer, killing
  the intended discussion.

## Required human verification

Confirm each judgment question genuinely admits reasonable disagreement
in current practice before using it live — a question with a hidden
clear answer will read as a trick rather than a discussion starter.

## Best model and why

Claude Sonnet 4.6 balances the recall/judgment mix well.
