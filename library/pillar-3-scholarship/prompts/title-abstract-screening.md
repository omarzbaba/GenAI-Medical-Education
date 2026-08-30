---
title: Title-and-abstract screening assistant
pillar: scholarship
event_type: n/a
audience: resident, faculty
difficulty: intermediate
time_to_use: 2-10min
visual: text-only
tags: literature, screening, systematic-review
verified_models: manuscript
best_model: Workhorse tier (e.g., Claude Sonnet)
last_updated: 2026-08-30
source: Manuscript §5 (task and evidence); prompt newly authored, not a manuscript quote
---

## What this prompt does

Applies your inclusion and exclusion criteria to a batch of titles and
abstracts and returns a provisional include/exclude/unsure call for each,
with the reasoning shown. This is the screening step, not the search step —
it comes after search-term scoping has already produced a candidate list of
citations from PubMed/Scopus.

## When to use it

When you have a batch of citations to triage before full-text review. In a
title-and-abstract screening evaluation, LLMs reached sensitivity comparable
to human screeners for identifying eligible studies — AI can shoulder part of
the screening burden that dominates a review. **Not for:** generating the
citation list itself (use the search-term-scoping and MeSH-clustering
prompts, then retrieve in PubMed/Scopus) or making a final exclusion
decision unsupervised.

## The prompt

```
I am screening titles and abstracts for a review. My inclusion criteria are:
[list inclusion criteria]. My exclusion criteria are: [list exclusion
criteria]. For each citation below, return: (1) include / exclude / unsure,
(2) a one-sentence reason tied to a specific criterion, and (3) a confidence
label (high/medium/low). Do not exclude anything you are not highly
confident about — mark it "unsure" instead. Do not invent or infer details
not present in the title or abstract.

Citations:
[paste titles and abstracts, one per numbered entry]
```

## Expected output

A per-citation table: call, the specific criterion the call turns on, and a
confidence label — with anything ambiguous routed to "unsure" rather than a
guessed exclusion.

## Common failure modes

- Excludes a citation on a criterion the abstract doesn't actually address,
  effectively guessing rather than reading structurally.
- Grows more permissive or more strict partway through a long batch as
  context shifts — spot-check calls from the middle and end of the list, not
  just the first few.
- States high confidence on a genuinely ambiguous abstract.

## Required human verification

This is a first-pass filter and organizer, with human verification at every
decision point — not an autonomous synthesizer. Every "exclude" call is
checked against the actual abstract before the citation is dropped; every
"unsure" call goes to full-text review. Treat the model's confidence label
as a prioritization aid for your own re-read, not a substitute for it. The
model is never the source of the citations themselves — PubMed and Scopus
remain the systems of record, because a model asked to name references will
still fabricate plausible-looking ones.

## Best model and why

Workhorse tier is sufficient for applying explicit criteria to text already
in front of the model; the task is structured judgment, not novel reasoning.
Screening large batches in smaller chunks (10–20 citations) keeps calls more
consistent than one very long batch.
