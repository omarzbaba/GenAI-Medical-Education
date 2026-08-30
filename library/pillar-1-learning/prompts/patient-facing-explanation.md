---
title: Patient-facing explanation practice
pillar: learning
event_type: n/a
audience: resident, fellow
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: communication, patient-facing, plain-language
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Practices translating a pathology finding into language appropriate for
the patient who has it — a distinct skill from explaining the same
finding to a colleague, and one pathology training rarely drills
directly.

## When to use it

Preparing to discuss a result with a patient or family (in specialties
where pathologists have direct patient contact) or to write a
patient-facing after-visit summary. **Not for:** the actual clinical
conversation — this is rehearsal, and delivery depends on the specific
patient's context, which a generic prompt cannot know.

## The prompt

```
Explain the following pathology finding as you would to the patient who
has it, with no medical jargon: [paste finding]. Assume an anxious adult
with no medical background. After the explanation, list every medical
term you had to work around and how you handled it, so I can see the
translation choices you made.
```

## Expected output

A plain-language explanation plus an explicit list of the jargon-to-plain
substitutions made, so you can judge whether each one is accurate or
oversimplified.

## Common failure modes

- Oversimplifies to the point of changing the clinical meaning (e.g.,
  flattening "atypical" into "abnormal" in a way that overstates risk).
- Adopts a falsely reassuring or falsely alarming tone not warranted by
  the actual finding.

## Required human verification

Check every simplified statement against the actual finding for accuracy
— plain language must not drift from what the pathology actually shows.
The tone and content of a real patient conversation must be set by the
treating clinician, not by this rehearsal.

## Best model and why

Claude Sonnet 4.6 balances plain language with clinical precision better
than a heavier or lighter model for this task.
