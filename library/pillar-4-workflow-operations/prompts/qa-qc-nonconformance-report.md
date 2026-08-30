---
title: QA/QC nonconformance report drafting
pillar: workflow-operations
event_type: n/a
audience: faculty, staff
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: quality-assurance, nonconformance, lab-operations
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Converts raw notes about a quality event (a failed QC run, a
documentation gap, an equipment deviation) into a structured
nonconformance report following the standard root-cause-and-corrective-
action format.

## When to use it

Right after a quality event is identified, to draft the report a
supervisor or quality manager will then review and finalize.

## The prompt

```
Draft a nonconformance report from these notes: [describe what happened,
when, and what you've observed so far]. Structure it as: description of
the nonconformance, immediate containment action taken, suspected root
cause (flag as "suspected" if not yet confirmed), proposed corrective
action, and follow-up verification plan. Do not state a root cause as
confirmed unless I told you it was.
```

## Expected output

A structured draft report with root cause explicitly labeled as
suspected or confirmed based only on what you provided — ready for
quality-manager review, not final sign-off.

## Common failure modes

- States a plausible root cause as confirmed when it was only suspected.
- Proposes a corrective action that isn't actually feasible in your lab's
  real workflow.

## Required human verification

A qualified supervisor or quality manager must review and approve every
nonconformance report before it's finalized — this drafts the structure,
it doesn't substitute for the required quality sign-off process.

## Best model and why

Claude Sonnet 4.6 for reliable structured technical writing.
