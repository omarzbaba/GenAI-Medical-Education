# GenAI in Medical Education — Digital Companion

Interactive digital companion to the manuscript:

> **Baba OZ, Lele T, Chamala S.** *Generative AI in Medical Education and
> Scholarship: A Practical Framework and Prompt Toolkit from Pathology.*
> (Journal and DOI to be added upon publication.)

Live site: **https://omarzbaba.github.io/GenAI-Medical-Education**

## What this is

The manuscript presents a practice-derived implementation framework for
responsible generative AI use in medical education, worked through in
pathology. This site renders that framework as something you can walk
through:

- **Four pillar pages** — Learning · Teaching, Curriculum & Assessment ·
  Scholarship · Workflow & Operations — each with a guided, scenario-based
  walkthrough (prompt → output → verification step → judgment call), in the
  pattern of the manuscript's worked example (Supplementary Table S3).
- **An interactive prompt anatomy** (manuscript Figure 2): toggle the five
  components of a well-formed prompt and see what the model is left to assume.
- **A guardrails section** (manuscript Section 7 and Tables 3, 6, 7;
  Supplementary Tables S1–S2): the five recurring hazards, an interactive
  data-sensitivity check, a tool-tier matcher, and the three skill-formation
  principles (foundation-first, attempt-first prompting, staged autonomy).
- **A 102-prompt library** — 88 prompts developed for and deployed at a
  hands-on session at the 2026 Association for Pathology Informatics Bootcamp
  (Pathology Informatics Summit), extended with 14 scholarship prompts drawn
  directly from the manuscript. Each entry pairs the prompt with its intent,
  expected output, common failure modes, and a required human-verification
  step.
- **18 how-to guides** — an LLM-literacy curriculum, from a first 30 minutes
  with an LLM to bias screening and disclosure.

## Repository layout

```
index.html            Home — framework overview
learning.html         Pillar 1 with guided walkthrough
teaching.html         Pillar 2 with draft→review→extend + MCQ-gate demos
scholarship.html      Pillar 3 with the six-step grant sequence
operations.html       Pillar 4 with the SOP drafting demo
anatomy.html          Interactive prompt anatomy (Figure 2)
guardrails.html       Governance layer + interactive checks
library.html          Library browser (hash-routed, client-rendered)
about.html            Citation, license, scope
library/              Prompt library (markdown + generated manifest)
guides/               How-to guides (markdown)
scripts/              build_manifest.py — regenerates manifest + search index
assets/               CSS, JS, vendored marked.js + DOMPurify
```

Static site — no build step, no tracking, no accounts. After editing prompt
front-matter or adding a prompt, regenerate the manifest:

```bash
python3 scripts/build_manifest.py
```

## Fidelity to the manuscript

Every prompt, verification step, table, and design principle on this site is
drawn from the manuscript and its supplementary material. Model outputs shown
in walkthroughs are either the manuscript's recorded run (Learning pillar,
marked as such) or clearly labeled illustrative examples. Generative models
are non-deterministic and version-dependent: all prompts are illustrative
scaffolds to adapt and re-verify, not fixed recipes.

## Related

- [AI in Pathology Education — workshop companion library](https://omarzbaba.github.io/AI_Pathology_Education)
  — the original 88-prompt workshop deployment this companion extends.

## License

Content is released under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — reuse and adapt
with attribution. See [LICENSE](LICENSE).
