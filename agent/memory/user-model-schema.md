# User Model Schema

> This document defines the structure of the per-user knowledge model. One file per user, updated after each session. Injected into the system prompt at session start.

---

## Schema

```json
{
  "user_id": "string",
  "created": "ISO date",
  "last_updated": "ISO date",
  
  "profile": {
    "preferred_explanation_style": "analogy | mathematical | first-principles | example-heavy",
    "preferred_session_length": "short (15min) | medium (30min) | deep (60min+)",
    "learning_velocity": "fast | moderate | methodical",
    "notes": "free text observations about how this person learns"
  },

  "topics": {
    "{{topic_slug}}": {
      "name": "string",
      "level": 1,
      "level_last_updated": "ISO date",
      "xp": 0,
      "streak_days": 0,
      "last_session": "ISO date",
      
      "concepts": {
        "{{concept_slug}}": {
          "name": "string",
          "introduced": "ISO date",
          "confidence": "none | fuzzy | partial | solid | mastered",
          "last_assessed": "ISO date",
          "next_review": "ISO date",
          "misconceptions": ["list of misconceptions observed"],
          "notes": "agent observations"
        }
      },
      
      "sessions": [
        {
          "date": "ISO date",
          "duration_minutes": 25,
          "concepts_covered": ["concept_a", "concept_b"],
          "papers_explored": ["arxiv:XXXX.XXXXX"],
          "xp_earned": 45,
          "highlights_added": 3,
          "summary": "Brief summary of what was covered"
        }
      ],
      
      "highlights": [
        {
          "id": "string",
          "text": "The highlighted passage",
          "source": "Paper title or agent response",
          "created": "ISO date",
          "tags": ["concept_a"],
          "note": "User's annotation if any"
        }
      ],
      
      "papers_read": [
        {
          "id": "arxiv:XXXX.XXXXX | url",
          "title": "string",
          "date_read": "ISO date",
          "completion": "partial | full",
          "key_concepts": ["list"]
        }
      ],
      
      "review_queue": [
        {
          "concept": "concept_slug",
          "due_date": "ISO date",
          "review_count": 2
        }
      ]
    }
  },

  "cross_topic_connections": [
    {
      "from_topic": "slug",
      "from_concept": "concept",
      "to_topic": "slug",
      "to_concept": "concept",
      "note": "Why these are connected"
    }
  ],
  
  "total_xp": 0,
  "total_sessions": 0,
  "current_streak": 0,
  "longest_streak": 0,
  "badges": ["list of earned badge IDs"]
}
```

---

## Level Thresholds (XP per topic)

| Level | XP Required | Label |
|-------|-------------|-------|
| 1 | 0 | Novice |
| 2 | 200 | Familiar |
| 3 | 600 | Proficient |
| 4 | 1500 | Advanced |
| 5 | 3500 | Expert-Adjacent |

---

## Badge Definitions

| Badge ID | Name | Trigger |
|----------|------|---------|
| `first_paper` | First Steps | Complete first paper session |
| `feynman_moment` | Feynman Moment | Successfully teach a concept back |
| `level_up` | Level Up | Advance to next level in any topic |
| `deep_diver` | Deep Diver | 60+ min session |
| `week_streak` | Momentum | 7-day learning streak |
| `polymath` | Polymath | Reach Level 3 in 3+ different topics |
| `rabbit_hole` | Rabbit Hole | Open 5+ sub-question popovers in one session |
| `connector` | Connector | Cross-topic connection identified by agent |
