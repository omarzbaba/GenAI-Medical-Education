---
title: Lay / public-health-relevance summary for a grant
pillar: scholarship
event_type: n/a
audience: faculty, fellow
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: grants, lay-summary, public-relevance
verified_models: TODO
best_model: Claude Sonnet 4.6
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
## What this prompt does

Translates a technical project summary into the plain-language "public
health relevance" or lay-summary section many funders require — a
distinct writing register from the scientific narrative.

## When to use it

At the grant-assembly stage, once your technical Specific Aims are
settled, to draft the separate lay-audience section.

## The prompt

```
Here is my project's technical summary: [paste]. Write a public health
relevance / lay summary of [word or character limit] for a general
educated audience, not scientists. Explain why this work matters in
terms a funding-agency reviewer from outside my specialty, or a member of
the public, would find compelling and understandable. Do not overstate
clinical impact beyond what the technical summary supports.
```

## Expected output

A plain-language summary at the required length, grounded strictly in
the technical summary's actual scope and claims.

## Common failure modes

- Overstates near-term clinical impact for a basic-science or early-stage
  project, promising more than the actual work supports.
- Uses jargon anyway, defeating the purpose of a lay summary.

## Required human verification

Check that every impact claim in the lay summary is proportionate to
what the technical project can actually support — overstatement here is
a credibility risk with reviewers who read both sections.

## Best model and why

Claude Sonnet 4.6 balances accessibility with accuracy for this register
shift.
