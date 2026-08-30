---
title: Instrument validation/verification protocol drafting
pillar: workflow-operations
event_type: n/a
audience: faculty, staff
difficulty: advanced
time_to_use: >10min
visual: text-only
tags: validation, instrumentation, protocol
verified_models: TODO
best_model: Claude Opus 4.7
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Drafts a skeleton validation or verification protocol for bringing a new
instrument or method online — sections and structure only; the actual
acceptance criteria and sample sizes must come from your lab's own
validation plan and applicable regulatory guidance.

## When to use it

Early in planning a new instrument's validation, to get a structural
starting point rather than starting the document from a blank page.

## The prompt

```
Draft a skeleton validation protocol for [instrument/method type,
e.g., a new hematology analyzer]. Include sections for: purpose and
scope, applicable regulatory/accreditation standards to cite, precision
and accuracy testing plan, sample size justification (flag this as
needing lab-director sign-off), acceptance criteria (flag as
lab-specific, to be filled in), and documentation/sign-off requirements.
Flag every section that needs lab-specific technical input rather than
filling it in generically.
```

## Expected output

A section skeleton with every technically-specific section (acceptance
criteria, sample size, applicable standards) explicitly flagged as
requiring your lab's own determination rather than filled with generic
content.

## Common failure modes

- Fills in a specific acceptance criterion or sample size as if it were
  general knowledge, when it must be determined by your lab director per
  your specific regulatory framework.
- Cites a regulatory standard without you having specified it.

## Required human verification

Every acceptance criterion, sample size, and regulatory citation must be
confirmed by your laboratory director against current applicable
standards (CAP, CLIA, or your jurisdiction's equivalent) before this
protocol is used — none of that content should be trusted from the model.

## Best model and why

Claude Opus 4.7 for the more demanding structural and regulatory-adjacent
organization this document requires, even though its specific content
must be human-supplied.
