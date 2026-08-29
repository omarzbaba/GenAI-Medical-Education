---
title: Literature search-term scoping
pillar: scholarship
event_type: n/a
audience: resident, faculty
difficulty: quick-win
time_to_use: 2-10min
visual: text-only
tags: literature, search-strategy
verified_models: manuscript
best_model: Workhorse tier (e.g., Claude Sonnet)
last_updated: 2026-08-29
source: Manuscript Table 4
---
## What this prompt does

Brainstorms PubMed search terms, MeSH headings, and synonym clusters for a
review topic — the step *before* a formal search. It maps how a literature
is organized; it does not retrieve it.

## When to use it

Before your first PubMed/Scopus session on a new review topic. **Not
for:** finding actual articles. A model asked to name references will, in
this setting, still fabricate plausible-looking citations. PubMed and
Scopus remain the systems of record.

## The prompt

```
Suggest PubMed search terms, MeSH headings, and synonym clusters for a
scoping review of large language models used to generate assessment items
in medical education.
```

## Expected output

Clusters of candidate terms — controlled vocabulary and free-text — grouped
by concept, ready to test in a real database.

## Common failure modes

- Invents MeSH headings that do not exist in the current thesaurus.
- Volunteers specific papers, DOIs, or study counts. Do not accept any of
  them.

## Required human verification

Treat the output as a search-term starting point only; run the actual
retrieval in PubMed/Scopus. Verify every proposed MeSH term against the
MeSH browser. Do not accept any specific paper, DOI, or count the model
volunteers — verify every reference independently.

## Best model and why

Workhorse tier. Term brainstorming does not need deep reasoning, and the
guardrail (no citations accepted) is the same at every tier.
