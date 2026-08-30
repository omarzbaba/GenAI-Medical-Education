---
title: Clinician-facing announcement for a workflow or test change
pillar: workflow-operations
event_type: n/a
audience: faculty, staff
difficulty: quick-win
time_to_use: 2-10min
visual: text-only
tags: communication, announcement, test-changes
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Drafts a clear, action-oriented announcement to ordering clinicians about
a new test, a send-out change, or a workflow modification — organized
around what the clinician actually needs to do differently.

## When to use it

Rolling out any change that affects how clinicians order or interpret
lab/pathology services.

## The prompt

```
Draft a clinician-facing announcement about this change: [describe the
change — new test, new send-out lab, new ordering process, new
turnaround time]. Lead with what the clinician needs to do differently,
then the reason for the change, then who to contact with questions. Keep
it to one screen's worth of text; clinicians won't read a long memo.
```

## Expected output

A short, action-first announcement — what changed, what to do, who to
ask — not a lengthy explanation clinicians will skim past.

## Common failure modes

- Leads with background/rationale instead of the action item, burying the
  one thing busy clinicians need to see first.
- Omits the effective date or a contact person.

## Required human verification

Confirm the effective date, contact information, and every procedural
detail against the actual approved change before distribution.

## Best model and why

Claude Sonnet 4.6 for concise, action-oriented communication.
