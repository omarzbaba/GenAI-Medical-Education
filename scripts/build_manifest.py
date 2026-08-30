#!/usr/bin/env python3
"""Build library/manifest.json and library/search-index.json.

Reads front-matter from every prompt .md under library/pillar-*/prompts/,
groups prompts into the manuscript's Table 2 categories, and emits:

  - manifest.json      — pillar > section > prompt cards for the browser UI
  - search-index.json  — flat records for client-side search

Run from the repo root:  python3 scripts/build_manifest.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, "library")

PILLARS = [
    {
        "dir": "pillar-1-learning",
        "slug": "learning",
        "title": "Pillar 1 — Learning",
        "short": "Learning",
        "tagline": "Self-directed study, from board preparation to lifelong learning.",
    },
    {
        "dir": "pillar-2-teaching",
        "slug": "teaching",
        "title": "Pillar 2 — Teaching, Curriculum & Assessment",
        "short": "Teaching",
        "tagline": "The faculty-facing anchor: the model proposes, the expert disposes.",
    },
    {
        "dir": "pillar-3-scholarship",
        "slug": "scholarship",
        "title": "Pillar 3 — Scholarship",
        "short": "Scholarship",
        "tagline": "Ideation to disclosure — AI accelerates scaffolding; accountability stays human.",
    },
    {
        "dir": "pillar-4-workflow-operations",
        "slug": "workflow-operations",
        "title": "Pillar 4 — Workflow & Operations",
        "short": "Workflow & Ops",
        "tagline": "The adjacent domain: operational text, drafted under review.",
    },
]

# Section order per pillar (mirrors manuscript Table 2; scholarship added).
SECTION_ORDER = {
    "learning": [
        "Concept work", "Self-quizzing", "Case-based drilling",
        "Reading the literature", "Multimodal & lab",
        "Molecular & CP workflow",
        "Source-grounded AI (NotebookLM & Claude Projects)",
    ],
    "teaching": [
        "Learning objectives & assessment", "Cases & vignettes",
        "Lectures & presentations", "Written feedback & narrative",
        "Discussion-based formats", "Resident communication",
    ],
    "scholarship": [
        "Ideation & question refinement", "Literature scoping",
        "Manuscript drafting & editing", "Pre-submission critique",
        "Grant development", "Authorship & disclosure",
    ],
    "workflow-operations": [
        "Workshops", "Rotations", "Courses", "Conferences & journal clubs",
        "Lab Operations & Quality",
    ],
}

# Library-expansion prompts (not manuscript-derived; added to broaden
# practical coverage) — assign their sections here since they postdate the
# original workshop-library migration's _old_sections.json lookup.
EXPANSION_SECTIONS = {
    # Learning
    "grading-staging-drill": "Case-based drilling",
    "stat-oncall-decision-drill": "Case-based drilling",
    "classification-mnemonic-generator": "Concept work",
    "patient-facing-explanation": "Concept work",
    "ai-output-error-hunt": "Self-quizzing",
    "teach-back-drill": "Self-quizzing",
    "reflective-error-log": "Self-quizzing",
    "antibody-panel-construction": "Multimodal & lab",
    # Teaching
    "annual-curriculum-map": "Learning objectives & assessment",
    "epa-direct-observation-form": "Learning objectives & assessment",
    "muddiest-point-generator": "Discussion-based formats",
    "audience-response-question-set": "Lectures & presentations",
    "analogy-bank-builder": "Lectures & presentations",
    "post-simulation-debrief-script": "Discussion-based formats",
    "teaching-philosophy-statement": "Written feedback & narrative",
    "grand-rounds-qa-anticipation": "Discussion-based formats",
    # Workflow & Operations — new category
    "qa-qc-nonconformance-report": "Lab Operations & Quality",
    "instrument-validation-protocol": "Lab Operations & Quality",
    "accreditation-self-study-narrative": "Lab Operations & Quality",
    "clinician-facing-announcement": "Lab Operations & Quality",
    "committee-meeting-minutes": "Lab Operations & Quality",
    "bench-tech-onboarding-packet": "Lab Operations & Quality",
}

# Scholarship prompts are new; assign their sections here.
SCHOLARSHIP_SECTIONS = {
    "research-question-refinement": "Ideation & question refinement",
    "testable-questions-ladder": "Ideation & question refinement",
    "search-term-scoping": "Literature scoping",
    "mesh-term-clustering": "Literature scoping",
    "language-editing-guardrailed": "Manuscript drafting & editing",
    "discussion-outline-from-notes": "Manuscript drafting & editing",
    "pre-submission-critique": "Pre-submission critique",
    "title-abstract-screening": "Literature scoping",
    "grant-step-1-build-context": "Grant development",
    "grant-step-2-test-understanding": "Grant development",
    "grant-step-3-expand-significance": "Grant development",
    "grant-step-4-reviewer-critique": "Grant development",
    "grant-step-5-build-story": "Grant development",
    "grant-step-6-draft-aims": "Grant development",
    "ai-disclosure-drafting": "Authorship & disclosure",
    "response-to-reviewers-organizer": "Manuscript drafting & editing",
    "limitations-section-drafting": "Manuscript drafting & editing",
    "abstract-structuring-from-results": "Manuscript drafting & editing",
    "cover-letter-structure": "Manuscript drafting & editing",
    "credit-contribution-statement": "Authorship & disclosure",
    "lay-summary-grant-relevance": "Grant development",
    "reviewer-comment-tracking-table": "Pre-submission critique",
}


def parse_front_matter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    fm = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip()
    return fm, text[m.end():] if m else text


def first_paragraph_after(heading, body):
    m = re.search(rf"^## {re.escape(heading)}\s*\n+(.+?)(?:\n\n|\Z)", body, re.S | re.M)
    if not m:
        return ""
    para = " ".join(m.group(1).split())
    return para


def load_old_sections():
    path = os.path.join(LIB, "_old_sections.json")
    if os.path.exists(path):
        return json.load(open(path))
    return {}


def main():
    old_sections = load_old_sections()
    manifest = {"generated_from": "scripts/build_manifest.py", "pillars": []}
    search = []
    total = 0

    for p in PILLARS:
        pdir = os.path.join(LIB, p["dir"], "prompts")
        sections = {name: [] for name in SECTION_ORDER[p["slug"]]}
        for fn in sorted(os.listdir(pdir)):
            if not fn.endswith(".md"):
                continue
            slug = fn[:-3]
            text = open(os.path.join(pdir, fn)).read()
            fm, body = parse_front_matter(text)
            intent = first_paragraph_after("What this prompt does", body)
            if p["slug"] == "scholarship":
                section = SCHOLARSHIP_SECTIONS.get(slug)
            else:
                section = EXPANSION_SECTIONS.get(slug) or old_sections.get(slug)
            if section is None or section not in sections:
                sys.exit(f"ERROR: no section for prompt '{slug}' (pillar {p['slug']})")
            card = {
                "title": fm.get("title", slug),
                "intent": (intent[:220] + "…") if len(intent) > 220 else intent,
                "difficulty": fm.get("difficulty", ""),
                "time_to_use": fm.get("time_to_use", ""),
                "audience": fm.get("audience", ""),
                "best_model": fm.get("best_model", ""),
                "tags": fm.get("tags", ""),
                "slug": slug,
                "path": f"library/{p['dir']}/prompts/{fn}",
            }
            sections[section].append(card)
            search.append({
                "title": card["title"],
                "pillar": p["short"],
                "pillar_slug": p["slug"],
                "section": section,
                "intent": intent,
                "tags": card["tags"],
                "path": card["path"],
            })
            total += 1
        manifest["pillars"].append({
            "slug": p["slug"], "dir": p["dir"], "title": p["title"],
            "short": p["short"], "tagline": p["tagline"],
            "sections": [
                {"title": name, "prompts": sections[name]}
                for name in SECTION_ORDER[p["slug"]] if sections[name]
            ],
        })

    json.dump(manifest, open(os.path.join(LIB, "manifest.json"), "w"), indent=1)
    json.dump(search, open(os.path.join(LIB, "search-index.json"), "w"), indent=1)
    counts = ", ".join(
        f"{pp['short']}: {sum(len(s['prompts']) for s in pp['sections'])}"
        for pp in manifest["pillars"])
    print(f"manifest built — {total} prompts ({counts})")


if __name__ == "__main__":
    main()
