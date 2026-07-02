# Aporia — UX & Design System Direction

**Last updated:** 2026-07-02
**Status:** Direction established, not yet visually validated. See "Open Items" below.

---

## Why This Doc Exists

Phase 2 introduces a web frontend. Before scaffolding `web/`, two open questions needed answers: the core interaction paradigm (chat-only? a persistent artifact, like Jenni.ai's doc-in-the-middle layout?), and the visual design system. This doc captures the direction established through discovery, so implementation can start from settled decisions instead of re-litigating them.

---

## UX Direction: Four Modes, One Shell

The single-artifact-in-the-center paradigm (Jenni.ai's model) was rejected — that pattern suits writing a document from scratch, whereas Aporia is more often *interpreting existing material* or engaging in open dialogue. Chat-only alone was also rejected: it's weak at spatial reference ("what did we cover on X three days ago?") and at making progress visible — both required by existing UX Principles in `product-vision.md` ("Visible context," "Show Progress Visibly").

The shell is **one app with three adaptive workspace states**, entered via a persistent topic library:

### 1. Persistent left rail — Topic Library
Readwise-Reader-inspired list of all topics the user has explored. Always visible; the entry point into the app. Maps directly to `product-vision.md` Feature H ("Topic Projects... current level, recent sessions, highlight collection, summary doc").

### 2. Learn (default workspace state)
Chat-first. When a source (paper/URL) is actively in play, a reading pane slides in alongside chat; when there's no source (open topic exploration), chat expands to fill the space. One view that adapts, rather than a hard mode switch between "reading a paper" and "just talking."

### 3. Review (passive)
Highlights + auto-generated topic summary, browsable — the "look back at what you've learned" surface. Kept explicitly distinct from Practice below: `product-vision.md`'s "Desirable Difficulty" principle notes passive re-reading is weaker than active recall, so these must never be merged into one screen.

### 4. Practice (active recall)
Card-based spaced-repetition quiz session (`schedule_review` / `review_queue` surface here), not chat-shaped. Auto-surfaces when reviews are due; can also be entered manually. Closer to Anki/Duolingo's review pattern than to a conversation.

### Pop-over sub-questions ("rabbit hole" mode)
Anchored inline card, appearing directly next to the highlighted text — matches the existing Cmd+click analogy in `product-vision.md`. Not a side drawer, not a bottom dock.

### Gamification placement
Moment-only surfacing — toasts/celebrations at level-ups and end-of-session recaps. No persistent always-visible XP/streak status bar. Rationale: these numbers don't move fast enough session-to-session to earn permanent screen real estate.

---

## Design System Direction

| Axis | Decision | Rationale |
|---|---|---|
| **Visual tone** | Warm & approachable | Rounded, friendly, not clinical or academic-cold. Chosen over "editorial/academic" to keep advanced material from feeling intimidating to the target user — `product-vision.md` names them "curious generalists," not domain specialists. |
| **Typography** | All sans-serif, one type family | Used across both reading content and UI chrome. Simpler system than a serif/sans split; no visually distinct "reading mode" vs. "app mode." |
| **Color** | Warm multi-color palette | Several soft, coordinated colors used throughout, not a single restrained accent. Reinforces the approachable tone — more lifestyle-app than dev-tool in feel. |
| **Density** | Spacious / airy | Generous whitespace, one thing emphasized at a time. Directly matches the existing UX Principle: "Progressive disclosure: don't overwhelm on first open." |

These four choices are mutually reinforcing — warm tone, multi-color, and airy spacing all point the same direction, which is a good sign they form one coherent system rather than four independent picks.

---

## Open Items

1. **Not yet written**: concrete design tokens (spacing scale, color values, type scale, component library choice).
2. **Not yet validated**: a low-fidelity mockup of the four-mode shell, specifically the adaptive Learn pane (paper appearing/disappearing when a source is or isn't in play) — flagged as the one part of the shell with real layout risk.
3. **Blocked on the above**: scaffolding `web/` (Next.js + React per `architecture.md`).
