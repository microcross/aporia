# Learning Science Principles for Aporia

This document catalogs the evidence-based learning principles the agent is designed around, and how each maps to a product behavior.

---

## 1. Active Recall (Retrieval Practice)

**The science:** Actively retrieving information from memory is 2–3× more effective for long-term retention than re-reading or passive review. A 2006 Roediger & Karpicke study found that a group who read once and tested three times retained 50% more than those who re-read four times, despite less total time with the material.

**In the product:**
- The agent regularly asks the user to explain a concept before providing the explanation
- After covering a major concept, the agent asks the user to summarize it back
- Quiz mode triggers active retrieval of previously covered material
- Highlights are surfaced for recall prompts, not just reference

---

## 2. Spaced Repetition

**The science:** The "spacing effect" — that learning is more durable when spaced across time — is one of the most replicated findings in memory research. Forgetting curves flatten with each spaced review. Optimal intervals roughly follow: 1 day → 3 days → 7 days → 14 days.

**In the product:**
- The system tracks when concepts were first encountered and schedules review prompts
- Reviews are conversational ("We talked about attention mechanisms last week — how would you explain the key insight now?"), not just flashcard-style
- The agent can surface a short review at the start of each new session

---

## 3. Spaced Practice Schedule (Implementation Guide)

| Review # | Timing After First Encounter |
|----------|------------------------------|
| 1 | 1 day |
| 2 | 3 days |
| 3 | 7 days |
| 4 | 14 days |
| 5 | 30 days |
| 6+ | 60+ days (long-term retention) |

---

## 4. Desirable Difficulties

**The science:** Robert Bjork's "desirable difficulties" framework shows that introducing certain forms of challenge during learning — interleaving, spacing, reducing feedback frequency — improves long-term retention, even though it *feels* harder and less productive in the moment.

**In the product:**
- The agent resists giving direct answers when a question can be productively explored first
- Interleaved sessions (mixing concepts across sessions) are preferred to blocked deep-dives
- The agent provides less scaffolding as the user advances levels
- The system uses "generation effect" — asking users to generate an answer before confirming it

---

## 5. The Feynman Technique

**The science:** Richard Feynman's approach: if you can't explain something simply, you don't understand it. Teaching forces retrieval, exposes gaps, and requires reconsolidation of knowledge. Studies confirm that "learning by teaching" produces stronger encoding than learning for a test.

**In the product:**
- The agent periodically invites: *"Can you explain [concept] to me as if I'd never heard of it?"*
- Gaps in the user's explanation are explored gently with follow-up questions
- Successful explanations contribute to level-up milestones
- The agent may role-play as a confused novice to elicit teaching from the user

---

## 6. Zone of Proximal Development (Vygotsky)

**The science:** Learning is most effective in the zone just beyond current understanding — not too easy (boring), not too hard (overwhelming). The role of a skilled teacher is to scaffold the learner through this zone, then gradually remove support.

**In the product:**
- The adaptive leveling system finds the frontier of understanding and stays just beyond it
- The agent adjusts vocabulary, assumed context, and depth of explanation based on level
- As levels increase, scaffolding decreases — higher-level users receive less hand-holding
- The intake quiz and ongoing conversation calibrate this zone dynamically

---

## 7. Interleaving

**The science:** Practicing multiple topics or problem types in an interleaved (mixed) order — rather than blocked (one topic at a time) — produces 43% higher retention on delayed tests, despite feeling harder during learning.

**In the product:**
- When a user has multiple active topics, the agent may occasionally surface a related concept from another topic ("This reminds me of what we discussed in your reinforcement learning topic...")
- Spaced review pulls from across topics, not just the one being studied today

---

## 8. Elaborative Interrogation

**The science:** Asking "why?" and "how?" repeatedly forces learners to connect new information to prior knowledge, which dramatically strengthens encoding and transfer.

**In the product:**
- The agent proactively asks "Why do you think that is?" before offering explanations
- The agent asks "How does this connect to what you already know about X?" when introducing related concepts
- The agent challenges the user to derive implications: "If this is true, what would that mean for Y?"

---

## 9. Chunking

**The science:** Working memory can hold roughly 4±1 chunks of information at once. Expert knowledge is organized into larger, richer chunks than novices possess — which is a key part of what expertise *is*. Teaching should build chunks progressively.

**In the product:**
- Papers are not summarized all at once — they are chunked into digestible concept units
- The agent introduces prerequisite chunks before building toward more complex ones
- Vocabulary is introduced in context before being used in explanations

---

## 10. Metacognition

**The science:** Learners who monitor their own understanding (metacognition) outperform those who don't. Simply asking "how confident are you in this?" improves calibration and retention.

**In the product:**
- The agent periodically asks the user to rate their confidence in a concept
- Confidence ratings are tracked over time and inform spaced repetition priority
- The agent explicitly names when the user is in an "I know I don't know" vs "I don't know what I don't know" state
- Topic summaries include a confidence snapshot for each major concept

---

## 11. Gamification & Motivation (Self-Determination Theory)

**The science:** Ryan & Deci's Self-Determination Theory identifies three core psychological needs for sustained motivation: Autonomy (choice), Competence (progress), and Relatedness (connection). Gamification works best when it serves intrinsic motivation, not just extrinsic reward.

**Design implications:**
- **Autonomy**: users choose their topic, their pace, their entry point — the quiz is optional
- **Competence**: levels, XP, and progression make growth tangible and visible
- **Relatedness**: (future) peer features, shared summaries, community learning paths

Gamification to avoid: punitive streaks, leaderboards that pit users against each other, reward removal.

---

## Sources

- Roediger & Karpicke (2006): Testing effect / active recall
- Bjork (1994, 2011): Desirable difficulties framework
- Vygotsky (1978): Zone of Proximal Development
- Kornell & Bjork (2008): Interleaving study (43% improvement)
- Ryan & Deci (2000): Self-Determination Theory
- Feynman, R.: Learning through teaching / explanation
- Ebbinghaus (1885): Forgetting curve and spacing effect
