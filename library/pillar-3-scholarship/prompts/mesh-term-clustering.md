---
title: MeSH and keyword clustering
pillar: scholarship
event_type: n/a
audience: resident, faculty
difficulty: quick-win
time_to_use: <2min
visual: text-only
tags: literature, search-strategy
verified_models: manuscript
best_model: Workhorse tier (e.g., Claude Sonnet)
last_updated: 2026-08-29
source: Manuscript §5
---
## What this prompt does

Takes the candidate terms you already collected and organizes them:
thematic clusters, redundancies flagged, gaps suggested. Note the closing
instruction — it explicitly forbids the failure mode (fabricated
citations) that makes LLMs unsafe for retrieval.

## When to use it

After you have drafted a term list (yours, or from the scoping prompt) and
before you build the final search strategy.

## The prompt

```
Here are 15 candidate MeSH terms and free-text keywords for a review on
LLM-generated MCQs in pathology education. Group them into thematic
clusters, flag redundant terms, and suggest 3 terms I may have missed.
Do not return any article citations.
```

Paste your own term list after the prompt.

## Expected output

Your terms regrouped into named clusters, redundancies identified, and
exactly three suggested additions — and no citations.

## Common failure modes

- Suggested "missing" terms drift off-topic or duplicate an existing
  cluster under a synonym.
- The model ignores the no-citations instruction. If it does, discard the
  citations unread.

## Required human verification

Check each suggested term against the MeSH browser before adding it to a
search strategy. The clustering is organizational help, not a validated
search filter.

## Best model and why

Workhorse tier — this is structured text manipulation with a hard
guardrail, not reasoning.
