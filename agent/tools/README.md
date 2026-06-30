# Agent Tools

This directory will contain tool definitions for the learning agent. Tools give the agent capabilities beyond conversation.

---

## Planned Tools

### `fetch_paper`
Fetches a research paper from a URL or arXiv ID and returns structured content (abstract, sections, figures list).

**Inputs:** `url_or_id: string`  
**Outputs:** `{ title, authors, abstract, sections[], full_text, publication_date, doi }`

---

### `search_papers`
Searches arXiv, PubMed, or Semantic Scholar for papers on a topic at an appropriate level.

**Inputs:** `topic: string, level: 1-5, limit: number, source: "arxiv" | "pubmed" | "semantic_scholar"`  
**Outputs:** `[{ title, authors, abstract, url, relevance_score }]`

---

### `update_user_model`
Persists a delta update to the user's knowledge model after a session.

**Inputs:** `user_id: string, model_delta: object`  
**Outputs:** `{ success: boolean, updated_model: object }`

---

### `get_user_model`
Retrieves the current user knowledge model to inject into the session.

**Inputs:** `user_id: string`  
**Outputs:** `user_model: object` (see `../memory/user-model-schema.md`)

---

### `schedule_review`
Schedules a spaced repetition review for a concept using the FSRS algorithm (`py-fsrs` library). FSRS models memory more accurately than SM-2 and adapts to individual retention curves.

**Inputs:** `user_id: string, topic: string, concept: string, fsrs_card_state: object`  
**Outputs:** `{ next_review_date: ISO date, updated_card_state: object }`  
**Note:** The `fsrs_card_state` object is the FSRS `Card` object — persist it in the user model alongside each concept.

---

### `save_highlight`
Saves a highlighted passage to the user's collection for a topic.

**Inputs:** `user_id: string, topic: string, text: string, source: string, tags: string[]`  
**Outputs:** `{ highlight_id: string }`

---

### `generate_topic_summary`
Produces an updated summary document for a topic based on session history.

**Inputs:** `user_id: string, topic: string`  
**Outputs:** `{ summary_markdown: string }`

---

### `award_xp`
Awards XP to a user for a learning action and checks for level-up or badge triggers.

**Inputs:** `user_id: string, topic: string, action: string, amount: number`  
**Outputs:** `{ new_total_xp: number, level_up: boolean, badges_earned: string[] }`

---

## Implementation Notes

- Tools will initially be implemented as simple API wrappers + JSON file persistence
- Later: swap persistence layer for a real database (Postgres or Supabase)
- Paper fetching will use arXiv API (free, no auth required) and Semantic Scholar API
- User model storage: start with JSON files per user, migrate to DB when scaling
