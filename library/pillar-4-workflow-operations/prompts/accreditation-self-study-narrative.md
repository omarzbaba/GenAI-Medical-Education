---
title: Accreditation self-study narrative section drafting
pillar: workflow-operations
event_type: n/a
audience: faculty, staff
difficulty: advanced
time_to_use: >10min
visual: text-only
tags: accreditation, self-study, ACGME, CAP
verified_models: TODO
best_model: Claude Opus 4.7
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Drafts a narrative section of an accreditation self-study (ACGME, CAP,
or similar) from your program's factual notes and data, organizing them
to address the specific standard being cited.

## When to use it

Assembling a self-study document, once you have the actual data and
program details the narrative needs to describe.

## The prompt

```
Draft the narrative for this accreditation standard: [paste standard
text/number]. Here is our program's actual data and practice relevant to
it: [paste your notes/data]. Write the narrative addressing the standard
directly, using only the data I provided. Flag anywhere the standard
seems to require information I haven't given you, rather than filling
the gap with a generic statement.
```

## Expected output

A narrative addressing the specific standard, built only from your
supplied data, with explicit gaps flagged rather than papered over.

## Common failure modes

- Writes a generically compliant-sounding sentence to fill a gap in your
  data instead of flagging the gap — self-study narratives are audited
  claims, and an unverified generic statement is a real risk.
- Misreads what the specific standard is actually asking for.

## Required human verification

Every factual claim in a self-study narrative must be verified against
your actual program records before submission — this is an audited
compliance document, and an inaccurate or unsupported statement carries
real accreditation consequences.

## Best model and why

Claude Opus 4.7 for careful standard-by-standard interpretation and
higher-stakes accuracy.
