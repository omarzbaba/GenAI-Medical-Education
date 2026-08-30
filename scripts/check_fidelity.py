#!/usr/bin/env python3
"""Manuscript-fidelity checker for the GenAI-Medical-Education companion.

Two layers of checking, run from the repo root:

  python3 scripts/check_fidelity.py [--manuscript /path/to/manuscript.txt]

1. PROMPT BLOCKS — every <pre> inside a .promptbox on the four pillar pages,
   and every fenced code block in library/pillar-3-scholarship/prompts/*.md,
   must appear verbatim in the manuscript (only checkable when --manuscript
   is supplied; the manuscript is unpublished and is never committed here).

2. CANONICAL STRINGS — scripts/fidelity_expected.json lists every sentence
   the site presents AS manuscript content (table cells, S1-S4 rows, the S3
   worked example, figure-legend fragments, key lines). Each entry must
   appear verbatim in the named site file, and — when --manuscript is
   supplied — in the manuscript as well.

Matching is typography-insensitive: quotes, dashes, whitespace, case, and
punctuation are normalized before comparison, so only real wording drift
fails. Exit code is non-zero on any failure, so this can gate a deploy.
"""
import argparse
import glob
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WALKTHROUGH_PAGES = [
    "learning.html", "teaching.html", "scholarship.html", "operations.html",
]

# Prompts that are deliberately NEW (grounded in a manuscript-discussed task
# but not a verbatim manuscript quote, unlike every other library prompt).
# Listed explicitly, with the reason, rather than silently excluded.
NON_VERBATIM_PROMPTS = {
    "library/pillar-3-scholarship/prompts/title-abstract-screening.md":
        "Manuscript Sec. 5 describes title/abstract screening and cites "
        "supporting evidence, but gives no prompt template for it (unlike "
        "every other scholarship task) — this prompt was authored to fill "
        "that gap and is not a manuscript quote.",
    "library/pillar-3-scholarship/prompts/response-to-reviewers-organizer.md": 'Library-expansion prompt (2026-08-30): original material added to broaden practical coverage, not tied to any manuscript section.',
    "library/pillar-3-scholarship/prompts/limitations-section-drafting.md": 'Library-expansion prompt (2026-08-30): original material added to broaden practical coverage, not tied to any manuscript section.',
    "library/pillar-3-scholarship/prompts/abstract-structuring-from-results.md": 'Library-expansion prompt (2026-08-30): original material added to broaden practical coverage, not tied to any manuscript section.',
    "library/pillar-3-scholarship/prompts/cover-letter-structure.md": 'Library-expansion prompt (2026-08-30): original material added to broaden practical coverage, not tied to any manuscript section.',
    "library/pillar-3-scholarship/prompts/credit-contribution-statement.md": 'Library-expansion prompt (2026-08-30): original material added to broaden practical coverage, not tied to any manuscript section.',
    "library/pillar-3-scholarship/prompts/lay-summary-grant-relevance.md": 'Library-expansion prompt (2026-08-30): original material added to broaden practical coverage, not tied to any manuscript section.',
    "library/pillar-3-scholarship/prompts/reviewer-comment-tracking-table.md": 'Library-expansion prompt (2026-08-30): original material added to broaden practical coverage, not tied to any manuscript section.',
}


def norm(s):
    s = html.unescape(s)
    for a, b in [("’", "'"), ("‘", "'"), ("“", '"'),
                 ("”", '"'), ("—", "-"), ("–", "-"),
                 ("→", ""), (" ", " ")]:
        s = s.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)


def load(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as fh:
        return fh.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manuscript", help="path to a plain-text extraction of "
                    "the manuscript + supplementary (local only, never "
                    "committed)")
    args = ap.parse_args()

    msn = None
    if args.manuscript:
        with open(args.manuscript, encoding="utf-8") as fh:
            msn = norm(fh.read())

    failures = []
    checked = 0

    # ---- layer 1: prompt blocks --------------------------------------
    blocks = []
    for page in WALKTHROUGH_PAGES:
        text = load(page)
        for m in re.finditer(r'<div class="promptbox"><pre>(.*?)</pre>',
                             text, re.S):
            blocks.append((page, strip_tags(m.group(1))))
    for path in sorted(glob.glob(
            os.path.join(ROOT, "library/pillar-3-scholarship/prompts/*.md"))):
        rel = os.path.relpath(path, ROOT)
        text = open(path, encoding="utf-8").read()
        for m in re.finditer(r"```\n(.*?)\n```", text, re.S):
            blocks.append((rel, m.group(1)))

    for where, block in blocks:
        checked += 1
        if where in NON_VERBATIM_PROMPTS:
            continue
        if msn is not None and norm(block) not in msn:
            head = " ".join(block.split())[:60]
            failures.append(f"PROMPT NOT IN MANUSCRIPT  {where}: {head}")

    # ---- layer 2: canonical strings ----------------------------------
    expected = json.load(open(os.path.join(ROOT,
                              "scripts/fidelity_expected.json"),
                              encoding="utf-8"))
    site_cache = {}
    for item in expected:
        checked += 1
        page = item["file"]
        if page not in site_cache:
            site_cache[page] = norm(strip_tags(load(page)))
        needle = norm(item["text"])
        if needle not in site_cache[page]:
            failures.append(f"MISSING ON SITE  {item['id']}  ({page})")
        if (msn is not None and not item.get("figure_image_source")
                and needle not in msn):
            failures.append(f"NOT IN MANUSCRIPT  {item['id']}")

    # ---- report ------------------------------------------------------
    print(f"fidelity check: {checked} items "
          f"({len(blocks)} prompt blocks [{len(NON_VERBATIM_PROMPTS)} "
          f"declared non-verbatim], {len(expected)} canonical strings)"
          + ("" if msn is not None else
             " — manuscript comparison SKIPPED (no --manuscript)"))
    if failures:
        print(f"\n{len(failures)} FAILURE(S):")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("all checks passed")


if __name__ == "__main__":
    main()
