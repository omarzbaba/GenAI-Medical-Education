---
title: Committee meeting minutes from raw notes
pillar: workflow-operations
event_type: n/a
audience: faculty, staff
difficulty: quick-win
time_to_use: <2min
visual: text-only
tags: meeting-minutes, committee, documentation
verified_models: TODO
best_model: Claude Haiku 4.5
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Converts raw, messy meeting notes into properly formatted minutes with
clear action items and owners — organizational cleanup, not content
generation.

## When to use it

Right after a committee meeting, while your raw notes are still fresh
enough to clarify ambiguities.

## The prompt

```
Turn these raw meeting notes into formatted minutes: [paste notes].
Structure as: attendees, agenda items discussed, decisions made, and a
clearly separated action-items table (task, owner, due date). Flag any
action item where I didn't note an owner or due date so I can fill it
in.
```

## Expected output

Clean, structured minutes with an explicit action-item table, and gaps
(missing owner/due date) flagged rather than invented.

## Common failure modes

- Invents an owner or due date for an action item you didn't actually
  specify.
- Loses the distinction between "discussed" and "decided" — treats an
  open discussion as a firm decision.

## Required human verification

Circulate the draft to attendees for confirmation before treating it as
the official record — this organizes your notes, but only the group can
confirm accuracy of what was actually decided.

## Best model and why

Claude Haiku 4.5 — fast, reliable structuring of already-complete notes.
