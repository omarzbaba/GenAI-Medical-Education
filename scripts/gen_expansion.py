#!/usr/bin/env python3
"""Generates the 29-prompt library expansion (Learning, Teaching, Scholarship,
Workflow & Operations) — prompts not drawn from the manuscript, added to
broaden practical coverage per user request."""
import os, textwrap

BASE = "/private/tmp/claude-501/-Users-omarbaba-Library-CloudStorage-OneDrive-Personal-AI-in-pathology-education/9477f417-c513-4335-b3c3-02875f25cc71/scratchpad/work2/library"

FM = """---
title: {title}
pillar: {pillar}
event_type: n/a
audience: {audience}
difficulty: {difficulty}
time_to_use: {time}
visual: {visual}
tags: {tags}
verified_models: TODO
best_model: {model}
last_updated: 2026-08-30
source: n/a — library expansion, not manuscript-derived
---
"""

def w(pillar_dir, slug, meta, body):
    path = f"{BASE}/{pillar_dir}/prompts/{slug}.md"
    meta.setdefault("visual", "text-only")
    open(path, "w").write(FM.format(**meta) + textwrap.dedent(body).lstrip())
    print("wrote", pillar_dir, slug)

# ============================================================ LEARNING ====
L = "pillar-1-learning"

w(L, "grading-staging-drill", dict(
    title="Grading and staging systems drill", pillar="learning",
    audience="resident", difficulty="intermediate", time="2-10min",
    tags="staging, grading, board-prep",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Drills a specific grading or staging system (Gleason, Nottingham, TNM, WHO
    grade) against a described specimen, asking you to apply the criteria
    yourself before the model checks your work — rather than the model just
    handing you a grade.

    ## When to use it

    When you're consolidating a staging/grading system you've read about but
    haven't yet applied under exam-like pressure. **Not for:** grading a real
    case for clinical use — staging always requires the actual slide/imaging
    and current edition of the relevant manual.

    ## The prompt

    ```
    Quiz me on [grading/staging system, e.g., Gleason grade group, current
    WHO/AJCC edition]. Describe one hypothetical specimen finding at a time,
    ask me to assign the grade/stage and state my reasoning, then tell me
    if I'm right before giving the next case. Vary difficulty: start
    straightforward, then include an edge case that tests a specific pitfall
    in this system. Name the edition/version you're using.
    ```

    ## Expected output

    One case at a time, each followed by feedback on your answer and the
    correct reasoning before the next case — not a bulk-graded quiz.

    ## Common failure modes

    - Uses a superseded edition of the grading system without saying so.
    - Invents a specimen finding that wouldn't actually occur together in
      real tissue.
    - Accepts a plausible-sounding but wrong justification as correct.

    ## Required human verification

    Cross-check the stated criteria and edition against the current official
    manual (AJCC, WHO) before trusting any threshold as current. Never use
    model-generated staging logic on a real case.

    ## Best model and why

    Claude Sonnet 4.6 handles the back-and-forth quiz format reliably. Name
    the exact edition in every session — staging criteria change often enough
    that an unspecified version is a real risk.
""")

w(L, "stat-oncall-decision-drill", dict(
    title="STAT / on-call decision-tree drill", pillar="learning",
    audience="resident", difficulty="intermediate", time="2-10min",
    tags="on-call, frozen-section, decision-making",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Simulates a time-pressured on-call scenario (frozen section, critical
    value call, STAT consult) as a branching decision drill, forcing you to
    commit to a next step before the model reveals what happens.

    ## When to use it

    Before a call shift or frozen-section rotation, to rehearse the decision
    points rather than just the content. **Not for:** real-time guidance
    during an actual on-call case — use institutional protocols and call your
    attending.

    ## The prompt

    ```
    Run a timed on-call decision drill for [scenario, e.g., an intraoperative
    frozen section with an unexpected finding]. Give me the situation, then
    ask "what do you do next?" one decision at a time. Do not reveal the
    outcome of a decision until I've committed to it. After each of my
    answers, say whether it was reasonable and why, then continue the
    scenario based on my choice.
    ```

    ## Expected output

    A branching scenario that responds to your actual choices, with brief
    feedback after each decision point — not a single linear narrative.

    ## Common failure modes

    - Reveals the "right" answer before you've committed, defeating the
      pressure-test.
    - Scenario branches become clinically implausible after a few steps.
    - Feedback is vague ("good job") rather than tied to the specific
      reasoning that made the choice sound or unsound.

    ## Required human verification

    This rehearses decision-making structure, not institutional protocol.
    Verify every procedural step (who to call, what to document, turnaround
    expectations) against your actual institution's policy — the model has no
    access to it.

    ## Best model and why

    Claude Sonnet 4.6 for the interactive branching. Push back if it reveals
    outcomes too early: "Don't tell me what happens — ask me what I'd do
    first."
""")

w(L, "classification-mnemonic-generator", dict(
    title="Mnemonic generator for classification schemes", pillar="learning",
    audience="resident", difficulty="quick-win", time="<2min",
    tags="mnemonics, classification, memorization",
    model="Claude Haiku 4.5"), """
    ## What this prompt does

    Generates candidate mnemonics for a classification scheme with many
    categories (WHO subtypes, a differential list, a staining panel), so you
    can pick the one that actually sticks rather than accept the first one
    offered.

    ## When to use it

    When a list is long enough that recall order matters (5+ items) and
    you're memorizing it for the first time. **Not for:** systems with only
    2-3 categories — a mnemonic adds overhead without payoff.

    ## The prompt

    ```
    I need to memorize this list in order: [paste list, e.g., WHO 2022
    classification subtypes of X]. Give me 3 different mnemonic options
    (acronym, acrostic sentence, and a short story/image), and for each,
    spell out exactly which word maps to which list item so I can check it's
    accurate.
    ```

    ## Expected output

    Three distinct mnemonic styles, each with an explicit item-by-item
    mapping so you can verify nothing was dropped or reordered.

    ## Common failure modes

    - Silently drops or reorders a list item to make the mnemonic work better
      — always check the mapping against your original list.
    - Produces a mnemonic that's harder to remember than the list itself.

    ## Required human verification

    Check the item-by-item mapping against your original list before relying
    on the mnemonic — the whole point fails if the mnemonic itself encodes an
    error.

    ## Best model and why

    Claude Haiku 4.5 — this is a lightweight, fast wordplay task that doesn't
    need deep reasoning.
""")

w(L, "patient-facing-explanation", dict(
    title="Patient-facing explanation practice", pillar="learning",
    audience="resident, fellow", difficulty="intermediate", time="2-10min",
    tags="communication, patient-facing, plain-language",
    model="Claude Sonnet 4.6"), """
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
""")

w(L, "ai-output-error-hunt", dict(
    title="AI-output error hunt", pillar="learning",
    audience="resident", difficulty="intermediate", time="2-10min",
    tags="critical-appraisal, metacognition, error-detection",
    model="Claude Opus 4.7"), """
    ## What this prompt does

    Deliberately produces a differential or explanation with one or more
    planted errors and asks you to find them — training the specific skill
    of catching AI mistakes, which every other prompt in this library
    depends on you already having.

    ## When to use it

    Periodically, as a standalone exercise in critical appraisal — not tied
    to a specific rotation. **Not for:** a first encounter with a topic; you
    need enough baseline knowledge to have a chance of catching the planted
    error.

    ## The prompt

    ```
    Generate a differential diagnosis (or explanation) for [topic/case], and
    deliberately include exactly one factual error somewhere in it — a wrong
    threshold, a mismatched stain pattern, a superseded criterion, whatever
    you choose. Do not tell me what or where it is. After I respond, tell me
    whether I found it, and if not, reveal it and explain why it's wrong.
    ```

    ## Expected output

    A plausible-looking differential or explanation containing one
    identifiable error, followed by honest feedback on whether you caught it.

    ## Common failure modes

    - The planted error is too obvious (a wildly wrong fact) to build real
      skill — ask for a subtler error if this happens.
    - The model claims something as "the error" that isn't actually wrong,
      undermining the exercise — verify its claimed answer independently.

    ## Required human verification

    Independently confirm the model's claimed "error" and "correction" are
    themselves accurate before treating them as ground truth — a model
    grading its own planted mistake can get the grading wrong too.

    ## Best model and why

    Claude Opus 4.7 — planting a subtle, realistic error and then correctly
    identifying it later is a harder task than straightforward explanation,
    and benefits from a deeper-reasoning tier.
""")

w(L, "teach-back-drill", dict(
    title="Teach-back drill", pillar="learning",
    audience="resident", difficulty="quick-win", time="2-10min",
    tags="self-quizzing, metacognition, teach-back",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Reverses the usual direction: you explain a concept to the model, and it
    grades your explanation for gaps, imprecision, and confabulation —
    surfacing what you don't actually know as well as you thought.

    ## When to use it

    After a first pass at a topic, before moving on — teaching something
    exposes gaps that recognition-based review (like MCQs) can hide. **Not
    for:** topics you haven't studied at all yet.

    ## The prompt

    ```
    I am going to explain [topic] to you as if you were a junior learner.
    After I finish, grade my explanation on: (1) factual accuracy — flag
    anything wrong or unsupported, (2) completeness — what did I leave out
    that a learner would need, (3) clarity — where would a learner get
    confused. Do not correct me mid-explanation; wait until I say "done."

    [your explanation]

    done.
    ```

    ## Expected output

    Structured feedback across the three axes, with specific line-level
    callouts rather than a generic assessment.

    ## Common failure modes

    - Praises a vague or hand-wavy explanation as "clear" because it read
      smoothly, not because it was actually correct.
    - Flags something as an omission that was actually out of scope for the
      level you specified.

    ## Required human verification

    Treat flagged inaccuracies as a prompt to check a primary source, not as
    ground truth on their own — the grader can be wrong about what's wrong.

    ## Best model and why

    Claude Sonnet 4.6 gives balanced, specific feedback without excessive
    praise or excessive nitpicking.
""")

w(L, "reflective-error-log", dict(
    title="Reflective error log / personal M&M entry", pillar="learning",
    audience="resident, fellow", difficulty="quick-win", time="<2min",
    tags="reflection, self-improvement, error-log",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Turns a brief note about a mistake or near-miss you made into a
    structured personal-log entry — what happened, why, and what you'll do
    differently — modeled on a morbidity-and-mortality format but for your
    own private learning record.

    ## When to use it

    Right after you catch your own error or a near-miss, while the details
    are fresh, so the reflection captures the actual reasoning failure rather
    than a vague memory of it later.

    ## The prompt

    ```
    Help me turn this into a structured personal learning-log entry: [describe
    what happened in your own words, including what you initially thought and
    what turned out to be true]. Structure it as: what happened, what I
    assumed and why it was reasonable at the time, what I missed, and one
    specific, checkable habit I'll change. Keep my own words; don't invent
    details I didn't give you.
    ```

    ## Expected output

    A short, structured entry in your own voice, ending in one concrete,
    checkable behavior change — not a generic "be more careful" conclusion.

    ## Common failure modes

    - Adds clinical detail you didn't provide, drifting the entry away from
      what actually happened.
    - Produces a vague resolution ("double-check next time") instead of a
      specific, checkable habit.

    ## Required human verification

    This is a private reflective tool, not a reportable safety-event record —
    follow your institution's actual incident-reporting requirements
    separately when applicable. No patient-identifying detail should ever go
    into this prompt.

    ## Best model and why

    Claude Sonnet 4.6 keeps the tone appropriately personal rather than
    clinical-report-flat.
""")

w(L, "antibody-panel-construction", dict(
    title="Antibody panel construction drill", pillar="learning",
    audience="resident", difficulty="intermediate", time="2-10min",
    tags="immunohistochemistry, panel-design, differential",
    model="Claude Opus 4.7"), """
    ## What this prompt does

    Reverses the usual IHC drill: instead of interpreting a panel someone
    else built, you build the panel yourself from a differential, then the
    model checks your choices — including which stains would and wouldn't
    discriminate the entities on your list.

    ## When to use it

    After you've learned individual stain patterns and want to practice the
    higher-order skill of choosing an efficient, discriminating panel.
    **Not for:** ordering a real panel — that must follow local protocol and
    available reagents.

    ## The prompt

    ```
    Here is my differential: [list 3-5 entities]. I am going to propose an
    IHC panel to distinguish them: [your stain list]. Check my panel: which
    stains actually discriminate between these specific entities, which are
    redundant, and what important discriminator am I missing? Don't just give
    me the answer — ask me to reconsider before revealing it if my panel has
    a gap.
    ```

    ## Expected output

    Feedback on your proposed panel's discriminating power, redundancy, and
    gaps — with a chance to revise before the model gives the complete
    answer.

    ## Common failure modes

    - States a stain is "positive" or "negative" for an entity as an absolute
      when real practice shows a range (focal, patchy, variable) — push back
      if this happens.
    - Recommends a stain not actually validated/available in typical practice
      settings.

    ## Required human verification

    Verify every stated staining pattern against a current IHC reference
    before treating it as fact — patterns and antibody clones are refined
    over time, and this is exactly the kind of specific factual claim models
    get confidently wrong.

    ## Best model and why

    Claude Opus 4.7 for the multi-entity discrimination logic, which is more
    demanding than single-stain interpretation.
""")

print("Learning: 8 prompts written")

# ============================================================ TEACHING ====
T = "pillar-2-teaching"

w(T, "annual-curriculum-map", dict(
    title="Academic-year curriculum map", pillar="teaching",
    audience="faculty", difficulty="advanced", time=">10min",
    tags="curriculum, program-design, academic-year",
    model="Claude Opus 4.7"), """
    ## What this prompt does

    Drafts a full academic-year curriculum map across subspecialty rotations
    — sequencing topics so foundational material precedes advanced material
    and nothing critical is only ever covered once, in passing.

    ## When to use it

    At the start of a curriculum redesign cycle, as a first-pass structure
    for program leadership to react to and correct — not as a finished
    document.

    ## The prompt

    ```
    Draft a one-year curriculum map for a [program type, e.g., AP/CP
    residency] covering these rotations in this order: [list]. For each
    rotation, note 2-3 core topics that should be introduced there, and flag
    any topic that depends on a prerequisite from an earlier rotation.
    Highlight any topic that appears only once across the whole year if it's
    high-stakes enough to warrant reinforcement later.
    ```

    ## Expected output

    A rotation-by-rotation topic map with explicit prerequisite dependencies
    flagged, plus a short list of single-exposure high-stakes topics worth a
    second pass.

    ## Common failure modes

    - Proposes a sequencing dependency that doesn't actually hold in your
      program's real rotation order.
    - Treats every topic as equally high-stakes, diluting the flag's
      usefulness.

    ## Required human verification

    This is a starting structure for program leadership discussion, not an
    approved curriculum. Verify every prerequisite claim and topic assignment
    against your program's actual accreditation requirements and faculty
    availability.

    ## Best model and why

    Claude Opus 4.7 — sequencing dependencies across a full year is a more
    demanding reasoning task than a single rotation blueprint.
""")

w(T, "epa-direct-observation-form", dict(
    title="EPA-based direct observation form", pillar="teaching",
    audience="faculty", difficulty="intermediate", time="2-10min",
    tags="EPA, assessment, direct-observation",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Drafts a direct-observation assessment form tied to a specific
    entrustable professional activity (EPA), with behaviorally anchored
    rating levels instead of a vague Likert scale.

    ## When to use it

    Building or refreshing an observation tool for a specific EPA your
    program already uses. **Not for:** inventing a new EPA — start from one
    your program has already defined.

    ## The prompt

    ```
    Draft a direct-observation form for this EPA: [paste EPA description].
    For each of 3-4 key behaviors that demonstrate this EPA, write a
    behaviorally anchored rating scale (what "not yet entrustable,"
    "developing," and "entrustable" actually look like in observable terms,
    not just a number). Keep it short enough to complete in under two
    minutes immediately after observing.
    ```

    ## Expected output

    A compact form with a handful of behaviors, each with concrete,
    observable anchors at each entrustment level.

    ## Common failure modes

    - Anchors describe internal cognitive states ("understands the
      indication") rather than observable behavior ("states the indication
      before proceeding").
    - Form becomes too long to complete in real time after an observation.

    ## Required human verification

    Confirm the EPA description and entrustment levels match your program's
    official framework exactly before adopting the form for real assessment.

    ## Best model and why

    Claude Sonnet 4.6 handles behaviorally-anchored rubric writing well at
    this scale.
""")

w(T, "muddiest-point-generator", dict(
    title="Muddiest-point formative question generator", pillar="teaching",
    audience="faculty", difficulty="quick-win", time="<2min",
    tags="formative-assessment, lecture, exit-ticket",
    model="Claude Haiku 4.5"), """
    ## What this prompt does

    Generates a single, fast end-of-lecture question designed to surface
    where the audience actually got lost — the "muddiest point" technique —
    rather than a generic recap question.

    ## When to use it

    In the last two minutes of a teaching session, as a low-stakes formative
    check. **Not for:** graded assessment.

    ## The prompt

    ```
    I just taught a session on [topic], covering these points: [list 3-4
    main points]. Write one exit-ticket question that asks the audience to
    identify the part of today's session that's still unclear to them — not
    a content-recall question, a self-report of confusion — plus one
    follow-up question I can ask a specific learner to probe further based
    on their answer.
    ```

    ## Expected output

    One self-report exit question plus a probing follow-up, both usable
    verbally or on a slide.

    ## Common failure modes

    - Writes a disguised content-recall question ("what is X?") instead of a
      genuine self-report of confusion.

    ## Required human verification

    None beyond reading the responses yourself — this is a low-stakes
    formative tool, not a scored instrument.

    ## Best model and why

    Claude Haiku 4.5 — fast, low-stakes, doesn't need deep reasoning.
""")

w(T, "audience-response-question-set", dict(
    title="Audience-response question set for large-group teaching", pillar="teaching",
    audience="faculty", difficulty="intermediate", time="2-10min",
    tags="audience-response, large-group, tumor-board",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Drafts a set of live-polling questions (Kahoot/Poll Everywhere style) for
    a large-group session or tumor board, designed to be answered in seconds
    and to reveal a spread of opinion, not just test recall.

    ## When to use it

    Planning a large-group teaching session where you want real-time
    engagement data, not just a lecture.

    ## The prompt

    ```
    Write 5 live-polling questions for a large-group session on [topic].
    Each question should be answerable in under 15 seconds, have 3-4
    options, and at least 2 of the 5 should be judgment questions where
    reasonable people might disagree (to prompt discussion of the poll
    results), not just single-fact recall.
    ```

    ## Expected output

    Five short multiple-choice polling questions, explicitly marked for
    which are recall vs. judgment/discussion-provoking.

    ## Common failure modes

    - All questions test recall, producing a quiz rather than a discussion
      prompt.
    - A "judgment" question actually has one clearly correct answer, killing
      the intended discussion.

    ## Required human verification

    Confirm each judgment question genuinely admits reasonable disagreement
    in current practice before using it live — a question with a hidden
    clear answer will read as a trick rather than a discussion starter.

    ## Best model and why

    Claude Sonnet 4.6 balances the recall/judgment mix well.
""")

w(T, "analogy-bank-builder", dict(
    title="Analogy bank builder", pillar="teaching",
    audience="faculty", difficulty="quick-win", time="2-10min",
    tags="analogies, lecture-prep, explanation",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Generates multiple candidate analogies for one hard concept so you can
    pick the one that will actually land with your specific audience, rather
    than settling for the first analogy that comes to mind.

    ## When to use it

    While prepping a lecture or teaching moment around a concept that's
    historically hard to explain (mechanism-heavy, counterintuitive, or
    abstract).

    ## The prompt

    ```
    I need to explain [concept] to [audience level]. Give me 4 different
    analogies from 4 different domains (everyday life, another branch of
    medicine, a common technology, a game/sport). For each, spell out exactly
    where the analogy breaks down, so I don't accidentally teach a
    misconception through an imperfect comparison.
    ```

    ## Expected output

    Four distinct analogies, each with its own limitation explicitly named —
    not just a list of comparisons.

    ## Common failure modes

    - Omits or downplays where an analogy breaks down, which is exactly the
      part that prevents a misconception from taking root.
    - All four analogies come from similar domains despite the request for
      variety.

    ## Required human verification

    Read every "where this breaks down" note carefully before using the
    analogy — an analogy that's slightly wrong at the edges can teach the
    wrong mental model more durably than no analogy at all.

    ## Best model and why

    Claude Sonnet 4.6 generates varied, genuinely different analogies rather
    than four variations on one idea.
""")

w(T, "post-simulation-debrief-script", dict(
    title="Post-simulation / M&M debrief script", pillar="teaching",
    audience="faculty", difficulty="intermediate", time="2-10min",
    tags="debrief, simulation, morbidity-and-mortality",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Drafts a structured facilitator script for debriefing a simulation or
    M&M case, using a non-blaming, systems-oriented question sequence rather
    than an ad hoc discussion.

    ## When to use it

    Preparing to facilitate a debrief where you want a repeatable, fair
    structure rather than improvising each time.

    ## The prompt

    ```
    Draft a facilitator debrief script for [simulation scenario or case
    type]. Use a structure that opens with participants' own reactions
    before analysis, moves to a systems-level "what made this hard" 
    discussion before any individual-performance discussion, and closes with
    concrete takeaways. Write it as a facilitator script with actual
    question wording, not just an outline of topics.
    ```

    ## Expected output

    A phase-by-phase script with actual question wording a facilitator can
    read from, structured to avoid a premature jump to blame.

    ## Common failure modes

    - Skips straight to individual-performance questions, undermining the
      psychological safety the structure is meant to protect.
    - Generic questions that don't reference the specific scenario's actual
      decision points.

    ## Required human verification

    Adapt the script to the specific scenario's real decision points and your
    institution's debrief norms before using it live; a facilitator still
    needs to read the room and deviate from the script when needed.

    ## Best model and why

    Claude Sonnet 4.6 for structured, sensitively-worded facilitation
    language.
""")

w(T, "teaching-philosophy-statement", dict(
    title="Teaching philosophy statement drafting", pillar="teaching",
    audience="faculty", difficulty="intermediate", time="2-10min",
    tags="portfolio, promotion, teaching-philosophy",
    model="Claude Opus 4.7"), """
    ## What this prompt does

    Helps organize your own teaching experiences and beliefs into a
    structured teaching-philosophy statement draft for a promotion or job
    portfolio — the model organizes and tightens; the substance and examples
    must be yours.

    ## When to use it

    Preparing a promotion packet or job application that requires a teaching
    philosophy statement, once you already have specific examples in mind.

    ## The prompt

    ```
    I want to write a teaching philosophy statement. Here are my actual
    beliefs and examples: [describe 2-3 real teaching experiences and what
    you believe about learning based on them]. Organize this into a
    statement structure: opening claim about what teaching is for me,
    2-3 examples that support it, and a closing statement about growth as an
    educator. Do not invent examples or embellish beyond what I gave you.
    ```

    ## Expected output

    A structured draft built entirely from your own stated examples and
    beliefs, organized for readability — not new content invented on your
    behalf.

    ## Common failure modes

    - Adds generic educational-philosophy language ("I believe every learner
      is unique") that isn't grounded in your actual examples.
    - Smooths a specific, distinctive example into something generic.

    ## Required human verification

    Read the full draft against your own voice and actual experience — a
    promotion committee is evaluating you, not a generic statement, and any
    invented or generic-sounding content should be struck.

    ## Best model and why

    Claude Opus 4.7 for the higher-stakes organizational and tonal work a
    promotion document deserves.
""")

w(T, "grand-rounds-qa-anticipation", dict(
    title="Grand rounds Q&A anticipation drill", pillar="teaching",
    audience="faculty, fellow", difficulty="intermediate", time="2-10min",
    tags="grand-rounds, presentation-prep, Q&A",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Anticipates the questions a grand rounds audience is likely to ask after
    your talk, so you can prepare answers in advance rather than being
    caught flat-footed.

    ## When to use it

    In the final prep pass before a grand rounds or similar presentation,
    once your slide content is set.

    ## The prompt

    ```
    Here is my grand rounds talk outline: [paste outline or key slide
    titles]. Predict 6 questions this audience is likely to ask afterward —
    include at least one skeptical/challenging question and one from a
    learner who missed a foundational point. For each, give me a one-line
    answer I could give on the spot.
    ```

    ## Expected output

    Six anticipated questions spanning difficulty levels, each with a
    ready one-line answer to rehearse.

    ## Common failure modes

    - Predicted questions are all softball/appreciative rather than including
      genuinely challenging ones.
    - Suggested answers state something as fact that you haven't actually
      verified — check every suggested answer yourself.

    ## Required human verification

    Verify every suggested answer against your own data and sources before
    relying on it live — an unverified one-liner delivered confidently in
    front of an audience is a real risk.

    ## Best model and why

    Claude Sonnet 4.6 anticipates a good spread of audience questions from an
    outline.
""")

print("Teaching: 8 prompts written")

# ========================================================= SCHOLARSHIP ====
S = "pillar-3-scholarship"

w(S, "response-to-reviewers-organizer", dict(
    title="Response-to-reviewers organizer", pillar="scholarship",
    audience="faculty, fellow", difficulty="intermediate", time="2-10min",
    tags="peer-review, revision, reviewer-response",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Organizes raw, unstructured reviewer comments into a clean point-by-point
    table you can work through systematically — the model organizes the
    comments; you write every substantive response.

    ## When to use it

    Right after receiving reviewer comments, before starting to draft actual
    responses, to convert a wall of prose into an actionable checklist.

    ## The prompt

    ```
    Here are the raw reviewer comments on my manuscript: [paste]. Organize
    them into a table: reviewer number, comment (verbatim), comment category
    (methods / results / clarity / minor), and an empty "response" column for
    me to fill in. Do not draft any responses yourself — just organize.
    ```

    ## Expected output

    A clean table of every comment, categorized, with an empty column
    waiting for your actual responses — not the responses themselves.

    ## Common failure modes

    - Paraphrases a reviewer comment instead of preserving it verbatim,
      losing precision about what was actually asked.
    - Merges two distinct comments into one row, causing you to miss
      responding to one of them.

    ## Required human verification

    Check every row against the original reviewer letter to confirm nothing
    was dropped, merged, or paraphrased — a missed reviewer comment in a
    resubmission is a real editorial problem.

    ## Best model and why

    Claude Sonnet 4.6 for reliable structured extraction; this task is
    organizational, not generative, so a lighter tier would also work but
    accuracy on comment fidelity matters more than speed.
""")

w(S, "limitations-section-drafting", dict(
    title="Limitations section drafting from bullet notes", pillar="scholarship",
    audience="faculty, fellow", difficulty="intermediate", time="2-10min",
    tags="manuscript-drafting, limitations, writing",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Turns a bulleted list of study weaknesses you've already identified into
    connected prose for a Limitations section — organizing and connecting
    your own points, not generating new ones.

    ## When to use it

    When you already know your study's limitations and need help with
    prose structure and flow, not with identifying the limitations
    themselves.

    ## The prompt

    ```
    Turn these bullet points into a Limitations section: [paste your bullets].
    Organize from most to least consequential, connect them with transitions,
    and end with a sentence on what these limitations mean for interpreting
    the results. Do not add any limitation I did not list, and do not soften
    or downplay any of them.
    ```

    ## Expected output

    Connected prose covering only the limitations you listed, ordered by
    consequence, ending with an interpretive note — no new limitations
    introduced, none downplayed.

    ## Common failure modes

    - Softens a limitation's phrasing in a way that undersells its actual
      impact on the findings.
    - Adds a generic limitation ("small sample size") you didn't list, just
      because it's common in this type of study.

    ## Required human verification

    Compare the draft against your original bullets line by line to confirm
    nothing was added, dropped, or softened — limitations sections are where
    authors are held to the highest standard of honesty, and generic padding
    or softened language undermines that.

    ## Best model and why

    Claude Sonnet 4.6 for prose connection without overreach.
""")

w(S, "abstract-structuring-from-results", dict(
    title="Abstract structuring from completed results", pillar="scholarship",
    audience="faculty, fellow", difficulty="intermediate", time="2-10min",
    tags="abstract, manuscript-structure, writing",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Structures a completed set of results and conclusions into a
    word-limited abstract in your target journal's required format —
    structural help, not new content generation.

    ## When to use it

    After your Results and Discussion are essentially finalized, to compress
    them into an abstract without losing the key finding. **Not for:** an
    abstract for work still in progress.

    ## The prompt

    ```
    Structure this into a [word limit]-word structured abstract with these
    exact sections: [paste target journal's required abstract sections,
    e.g., Background/Methods/Results/Conclusions]. Here is my finalized
    content: [paste key results, methods summary, and conclusions]. Do not
    add any number, claim, or interpretation not present in what I gave you.
    ```

    ## Expected output

    A structured abstract at the target word count, built only from the
    content you supplied, correctly sectioned per the journal's format.

    ## Common failure modes

    - Rounds or restates a number slightly differently than your original,
      introducing a subtle numerical inconsistency between abstract and body.
    - Overstates a conclusion beyond what the results actually support to
      make the abstract sound more impactful.

    ## Required human verification

    Check every number in the abstract against the source data and the
    manuscript body for exact consistency — abstract/body numerical
    mismatches are a common and easily-caught reviewer criticism.

    ## Best model and why

    Claude Sonnet 4.6 handles format-constrained compression well.
""")

w(S, "cover-letter-structure", dict(
    title="Cover letter structure to journal editor", pillar="scholarship",
    audience="faculty, fellow", difficulty="quick-win", time="2-10min",
    tags="cover-letter, submission, editor",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Drafts the structural skeleton of a submission cover letter — why this
    journal, what's novel, any required disclosures — from your own notes,
    leaving the substantive novelty claim to you.

    ## When to use it

    At submission time, once you know your key novelty argument and have
    checked the target journal's specific cover-letter requirements.

    ## The prompt

    ```
    Draft a cover letter structure for submitting to [journal name]. Sections:
    opening (what we're submitting and to what article type), why this
    journal specifically, one paragraph on novelty (I'll provide the
    content), any required statements ([list what your target journal
    requires, e.g., prior submission history, conflicts]), and a closing.
    Leave the novelty paragraph as a placeholder for me to write — don't
    invent a novelty claim on my behalf.
    ```

    ## Expected output

    A properly sectioned cover letter template with your journal's required
    statements included and the substantive novelty claim explicitly left
    for you to write.

    ## Common failure modes

    - Fills in the novelty paragraph with a generic claim instead of leaving
      it as a placeholder, risking an unsubstantiated claim slipping through.
    - Omits a disclosure statement specific to the target journal.

    ## Required human verification

    Verify every required statement against the current target-journal
    submission guidelines — requirements change and vary widely by journal —
    and write the novelty claim yourself from your actual contribution.

    ## Best model and why

    Claude Sonnet 4.6 for reliable template structuring.
""")

w(S, "credit-contribution-statement", dict(
    title="CRediT contribution statement drafting", pillar="scholarship",
    audience="faculty, fellow", difficulty="quick-win", time="<2min",
    tags="authorship, CRediT, disclosure",
    model="Claude Haiku 4.5"), """
    ## What this prompt does

    Maps your team's actual contributions onto the standard CRediT taxonomy
    categories (conceptualization, methodology, writing, etc.) to draft the
    contribution statement many journals now require.

    ## When to use it

    At submission, once you know what each author actually did.

    ## The prompt

    ```
    Here is what each author actually did on this project: [list author
    initials and their contributions in plain language]. Map this onto the
    standard CRediT taxonomy categories and draft the contribution statement
    in the format [target journal]'s guidelines specify. Flag any
    contribution I described that doesn't cleanly map to a CRediT category
    so I can decide how to categorize it.
    ```

    ## Expected output

    A CRediT-formatted contribution statement with any ambiguous mappings
    explicitly flagged for your decision rather than guessed at.

    ## Common failure modes

    - Assigns a CRediT category to an author who wasn't actually described as
      doing that work.
    - Guesses at an ambiguous mapping instead of flagging it.

    ## Required human verification

    Every author should confirm their own listed contributions are accurate
    before submission — this is an authorship-integrity document, not just a
    formatting exercise.

    ## Best model and why

    Claude Haiku 4.5 — straightforward taxonomy mapping from clear input.
""")

w(S, "lay-summary-grant-relevance", dict(
    title="Lay / public-health-relevance summary for a grant", pillar="scholarship",
    audience="faculty, fellow", difficulty="intermediate", time="2-10min",
    tags="grants, lay-summary, public-relevance",
    model="Claude Sonnet 4.6"), """
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
""")

w(S, "reviewer-comment-tracking-table", dict(
    title="Multi-round reviewer comment tracking table", pillar="scholarship",
    audience="faculty, fellow", difficulty="quick-win", time="2-10min",
    tags="peer-review, revision-tracking, multi-round",
    model="Claude Haiku 4.5"), """
    ## What this prompt does

    Builds a running tracking table across multiple rounds of revision,
    showing which comments have been addressed, which are still open, and
    which reviewer raised each — useful once a manuscript has gone through
    more than one review cycle.

    ## When to use it

    Managing a manuscript in its second or later round of review, when
    keeping track of what's resolved across rounds by memory gets
    error-prone.

    ## The prompt

    ```
    I have reviewer comments across multiple rounds. Round 1 comments and how
    I addressed them: [paste]. Round 2 comments (some may reference round 1
    issues): [paste]. Build a single tracking table: comment, round raised,
    status (resolved / still open / new), and which reviewer. Flag any round
    2 comment that seems to reopen a round 1 issue I thought was resolved.
    ```

    ## Expected output

    One consolidated table spanning both rounds, with reopened issues
    explicitly flagged for your attention.

    ## Common failure modes

    - Misses that a round 2 comment is actually the same underlying issue as
      a round 1 comment phrased differently.
    - Marks something "resolved" based on your round 1 response without
      confirming the reviewer actually accepted it in round 2.

    ## Required human verification

    Confirm every "resolved" status against the actual reviewer's round 2
    language — a reviewer restating a concern in different words is not the
    same as a new, unrelated comment.

    ## Best model and why

    Claude Haiku 4.5 for straightforward table consolidation from clearly
    supplied text.
""")

print("Scholarship: 7 prompts written")

# =============================================== WORKFLOW & OPERATIONS ====
O = "pillar-4-workflow-operations"

w(O, "qa-qc-nonconformance-report", dict(
    title="QA/QC nonconformance report drafting", pillar="workflow-operations",
    audience="faculty, staff", difficulty="intermediate", time="2-10min",
    tags="quality-assurance, nonconformance, lab-operations",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Converts raw notes about a quality event (a failed QC run, a
    documentation gap, an equipment deviation) into a structured
    nonconformance report following the standard root-cause-and-corrective-
    action format.

    ## When to use it

    Right after a quality event is identified, to draft the report a
    supervisor or quality manager will then review and finalize.

    ## The prompt

    ```
    Draft a nonconformance report from these notes: [describe what happened,
    when, and what you've observed so far]. Structure it as: description of
    the nonconformance, immediate containment action taken, suspected root
    cause (flag as "suspected" if not yet confirmed), proposed corrective
    action, and follow-up verification plan. Do not state a root cause as
    confirmed unless I told you it was.
    ```

    ## Expected output

    A structured draft report with root cause explicitly labeled as
    suspected or confirmed based only on what you provided — ready for
    quality-manager review, not final sign-off.

    ## Common failure modes

    - States a plausible root cause as confirmed when it was only suspected.
    - Proposes a corrective action that isn't actually feasible in your lab's
      real workflow.

    ## Required human verification

    A qualified supervisor or quality manager must review and approve every
    nonconformance report before it's finalized — this drafts the structure,
    it doesn't substitute for the required quality sign-off process.

    ## Best model and why

    Claude Sonnet 4.6 for reliable structured technical writing.
""")

w(O, "instrument-validation-protocol", dict(
    title="Instrument validation/verification protocol drafting", pillar="workflow-operations",
    audience="faculty, staff", difficulty="advanced", time=">10min",
    tags="validation, instrumentation, protocol",
    model="Claude Opus 4.7"), """
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
""")

w(O, "accreditation-self-study-narrative", dict(
    title="Accreditation self-study narrative section drafting", pillar="workflow-operations",
    audience="faculty, staff", difficulty="advanced", time=">10min",
    tags="accreditation, self-study, ACGME, CAP",
    model="Claude Opus 4.7"), """
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
""")

w(O, "clinician-facing-announcement", dict(
    title="Clinician-facing announcement for a workflow or test change", pillar="workflow-operations",
    audience="faculty, staff", difficulty="quick-win", time="2-10min",
    tags="communication, announcement, test-changes",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Drafts a clear, action-oriented announcement to ordering clinicians about
    a new test, a send-out change, or a workflow modification — organized
    around what the clinician actually needs to do differently.

    ## When to use it

    Rolling out any change that affects how clinicians order or interpret
    lab/pathology services.

    ## The prompt

    ```
    Draft a clinician-facing announcement about this change: [describe the
    change — new test, new send-out lab, new ordering process, new
    turnaround time]. Lead with what the clinician needs to do differently,
    then the reason for the change, then who to contact with questions. Keep
    it to one screen's worth of text; clinicians won't read a long memo.
    ```

    ## Expected output

    A short, action-first announcement — what changed, what to do, who to
    ask — not a lengthy explanation clinicians will skim past.

    ## Common failure modes

    - Leads with background/rationale instead of the action item, burying the
      one thing busy clinicians need to see first.
    - Omits the effective date or a contact person.

    ## Required human verification

    Confirm the effective date, contact information, and every procedural
    detail against the actual approved change before distribution.

    ## Best model and why

    Claude Sonnet 4.6 for concise, action-oriented communication.
""")

w(O, "committee-meeting-minutes", dict(
    title="Committee meeting minutes from raw notes", pillar="workflow-operations",
    audience="faculty, staff", difficulty="quick-win", time="<2min",
    tags="meeting-minutes, committee, documentation",
    model="Claude Haiku 4.5"), """
    ## What this prompt does

    Converts raw, messy meeting notes into properly formatted minutes with
    clear action items and owners — organizational cleanup, not content
    generation.

    ## When to use it

    Right after a committee meeting, while your raw notes are still fresh
    enough to clarify ambiguities.

    ## The prompt

    ```
    Turn these raw meeting notes into formatted minutes: [paste notes].
    Structure as: attendees, agenda items discussed, decisions made, and a
    clearly separated action-items table (task, owner, due date). Flag any
    action item where I didn't note an owner or due date so I can fill it
    in.
    ```

    ## Expected output

    Clean, structured minutes with an explicit action-item table, and gaps
    (missing owner/due date) flagged rather than invented.

    ## Common failure modes

    - Invents an owner or due date for an action item you didn't actually
      specify.
    - Loses the distinction between "discussed" and "decided" — treats an
      open discussion as a firm decision.

    ## Required human verification

    Circulate the draft to attendees for confirmation before treating it as
    the official record — this organizes your notes, but only the group can
    confirm accuracy of what was actually decided.

    ## Best model and why

    Claude Haiku 4.5 — fast, reliable structuring of already-complete notes.
""")

w(O, "bench-tech-onboarding-packet", dict(
    title="New bench-tech onboarding packet", pillar="workflow-operations",
    audience="faculty, staff", difficulty="intermediate", time="2-10min",
    tags="onboarding, laboratory-staff, training",
    model="Claude Sonnet 4.6"), """
    ## What this prompt does

    Drafts a first-week onboarding packet for a new laboratory technologist
    — distinct from resident/trainee rotation onboarding, focused on bench
    competency sign-offs and safety orientation.

    ## When to use it

    Preparing for a new bench-tech hire, as a starting structure to adapt to
    your specific lab section.

    ## The prompt

    ```
    Draft a first-week onboarding packet for a new [lab section, e.g.,
    histology/hematology] technologist. Include: day-by-day orientation
    schedule, required safety and competency sign-offs to complete in week
    one, who their point-of-contact is for each area, and a checklist they
    can track their own progress against. Flag any competency I should list
    that's specific to my lab section but that I haven't mentioned, so I can
    confirm it applies.
    ```

    ## Expected output

    A day-by-day first-week schedule plus a self-trackable competency
    checklist, with lab-specific gaps flagged for your confirmation.

    ## Common failure modes

    - Assumes a competency requirement or safety training that doesn't apply
      to your specific lab section or regulatory environment.
    - Overloads day one with more sign-offs than are realistically completed.

    ## Required human verification

    Confirm every listed competency and safety requirement against your
    lab's actual accreditation and safety officer requirements before use —
    this is a starting structure, not a validated onboarding checklist.

    ## Best model and why

    Claude Sonnet 4.6 for practical, well-organized onboarding structure.
""")

print("Workflow & Operations: 6 prompts written")
print("\\nTOTAL new prompts: 29")
