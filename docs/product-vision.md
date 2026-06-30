# Aporia — Product Vision

**Last updated:** 2026-06-29  
**Owner:** Michael Cross (microccross@gmail.com)

---

## The Problem

Advanced knowledge is locked inside research papers and journals that are inaccessible to curious, intelligent people who aren't specialists. The bottleneck isn't intelligence — it's jargon, assumed context, and the absence of a patient, adaptive guide. Even graduate students struggle to bridge across fields. Textbooks lag years behind. YouTube explainers stay at the surface.

---

## The Vision

A personal learning agent that reads advanced material *with* you, meets you at your level, and progressively elevates you toward real expertise — automatically adapting to where you are and where you're heading.

Think: a brilliant PhD advisor available 24/7, who knows exactly what you understand, what you don't, and how to close the gap.

---

## Target User

**Curious generalists** — intellectually ambitious people (professionals, self-directed learners, career-switchers) who want *genuine* understanding of advanced topics, not pop-science summaries. They are smart, but may lack domain vocabulary or foundational context for a given field.

---

## Core Principles

### 1. Meet Them Where They Are
The agent's first job is calibration. It should infer the user's knowledge level from how they write and what they ask, not force them through a quiz. An adaptive intake quiz is *available* but never required. The agent builds a live internal model of what the user knows, updating it continuously.

### 2. Adaptive Dialogue (Socratic Where Earned)
The agent adapts its approach by level. At lower levels, it explains with comprehension checks. At higher levels, it challenges and debates — leading with questions, letting the user work. At any level, "just tell me" immediately switches to direct explanation. The agent naturally returns to dialogue on the next concept.

### 3. Teach to Learn (Feynman Technique)
After any major concept, the agent invites the user to explain it back in their own words — ideally to a hypothetical 10-year-old or a friend with no background. This forces active recall and surfaces the gaps the user didn't know they had.

### 4. Desirable Difficulty
The agent deliberately resists being too easy. Research shows that effortful retrieval, interleaved practice, and being made to struggle slightly before receiving help produces dramatically stronger long-term retention. The agent should *not* rush to fill silences or offer unsolicited answers.

### 5. Spaced Repetition Built In
The system tracks concepts encountered per topic and schedules lightweight review prompts over time (1 day → 3 days → 7 days → 14 days). Reviews are woven into natural conversation, not sent as isolated flash cards.

### 6. Show Progress Visibly
Learners quit when they can't see themselves improving. The product must make progress legible — through mastery levels, topic summaries, highlight collections, and explicit "you've moved from Level 2 to Level 3" milestones.

---

## Core Features

### A. Chat Learning Interface
- Primary mode: conversation with the agent about a paper, topic, or concept
- User can paste a paper URL, upload a PDF, or simply name a topic
- Agent fetches relevant papers when given a topic (arXiv, PubMed, Semantic Scholar)
- Responses are calibrated to the user's current level
- Tone: curious, patient, rigorous — never condescending

### B. Pop-Over Sub-Questions ("Rabbit Hole" Mode)
- Highlight any word or phrase in the agent's response to open a contextual pop-over
- Pop-over answers the sub-question without losing the main thread
- Similar to Command+clicking a link to open a new tab — explore without losing context
- Pop-overs can themselves be popped (nested exploration, up to 2-3 layers)
- **Auto-save rule:** if the user spends >30 seconds in a pop-over, it is automatically added to their highlights collection for that topic (no friction, no prompt)

### C. Highlights & Collection
- User can highlight any passage (from the agent or from the original paper)
- Highlights are saved to a per-topic collection, automatically tagged and categorized
- Agent periodically surfaces highlights for spaced review
- The collection becomes the user's personal "knowledge library" for that topic

### D. Topic Summaries (Auto-Generated)
- At the end of each session (or on demand), the agent synthesizes a clean summary of what was covered
- Summaries evolve as the user learns more — earlier summaries get annotated with later understanding
- Summaries are exportable and shareable

### E. Adaptive Quiz Mode
- Optional intake quiz per new topic: begins at mid-difficulty, branches based on answers (IRT-style adaptive testing)
- The quiz finds the user's current frontier of knowledge and places them at Level 1–5
- In-session mini-quizzes test recall after major concepts
- Review quizzes surface old material using spaced repetition scheduling
- Gamification: quiz answers contribute to XP, streaks, and level progression

### F. Leveling & Gamification
- Each topic has 5 mastery levels (Novice → Fluent → Proficient → Expert → Researcher)
- Level reflects demonstrated understanding, not just time spent
- XP is earned from: completing sessions, acing quizzes, teaching concepts back, completing topic summaries
- Streaks track daily engagement
- "Momentum" score tracks rate of learning velocity — visible on the dashboard
- Badging for milestones: first paper read, first concept explained back, first level-up

### G. Scheduled Spaced Repetition Quizzes
- Users can configure a recurring quiz schedule per topic: "Quiz me on [topic] every Tuesday and Thursday"
- Scheduling is set via natural language within the chat: "Set up a weekly review for this topic every Sunday at 9am"
- Delivered as a short conversational quiz session (5–8 questions, ~10 minutes)
- Difficulty adapts based on performance in previous review sessions
- Users choose their own reminder mechanism: in-app on next open, push notification (v2), or email digest (v2)
- The schedule is stored in the user model and respected across sessions
- A missed session doesn't penalize — it just reschedules. No streak punishment.

### H. Topic Projects (Organization Layer)
- Learning is organized into "Topics" — not just a list of chats
- Each Topic has: current level, recent sessions, highlight collection, summary doc, quiz history
- Topics can be nested (e.g., "Machine Learning > Reinforcement Learning > RLHF")
- Recommended next papers surface within a topic based on level and learning history

---

## Agent Memory Model

The agent maintains a per-user knowledge model tracking:
- Topics explored and depth per topic
- Concepts demonstrated as understood (from quiz results + Feynman explanations)
- Common misconceptions surfaced in past sessions
- Preferred explanation style (more analogy-heavy, more mathematical, etc.)
- Learning velocity per topic
- Highlight and note history

This is stored as structured memory, updated after each session, and used to personalize every subsequent interaction.

---

## Content Sources

1. **User-provided**: paste a URL, upload a PDF, or drop text directly into chat
2. **Agent-sourced**: user names a topic, agent searches arXiv, PubMed, Semantic Scholar for recent high-impact papers at the right level
3. **Web content**: blog posts, documentation, textbooks — anything linkable

---

## UX Principles

- **Progressive disclosure**: don't overwhelm on first open. One input, one conversation.
- **Low friction to start**: no onboarding wall, no required quiz. Just start talking.
- **Visible context**: always show what topic the user is in and what level they're at
- **Non-linear exploration**: pop-overs make it safe to follow curiosity without losing the thread
- **Exportable knowledge**: everything the user builds (summaries, highlights, notes) should be exportable

---

## What This Is Not

- Not a search engine for papers — it's a guide through them
- Not a content delivery platform — it's a dialogue
- Not a rote flashcard app — the depth of conversation *is* the product
- Not a replacement for a university — it's a supplement for self-directed learners

---

## Success Metrics

- **Retention**: do users return? (Daily/weekly active rate)
- **Level progression**: are users measurably advancing across topics?
- **Session depth**: average time in meaningful dialogue (vs. surface bouncing)
- **Quiz improvement**: are post-session quiz scores better than intake scores?
- **NPS**: would users recommend this to a smart friend?

---

## Design Decisions (Closed)

**Niche topics with few accessible papers (v1):** Tell the user there isn't enough material to support the topic yet and decline gracefully. No half-baked experiences.

**Level granularity:** 5 levels is the right call — fine enough to feel meaningful, coarse enough to feel achievable.

**Advancing too fast:** The agent gently pushes back — explains the spaced repetition rationale and encourages slowing down — but always lets the user proceed. No hard blockers, no annoyance.

**Spaced repetition reminders:** User-configured. The agent asks during setup: "How would you like to be reminded for review sessions?" Options include in-app on next open, scheduled notifications, or email digest. No default spam.

**Multi-language support:** v1 English only. v2 adds translation (agent translates papers + conducts dialogue in user's language).
