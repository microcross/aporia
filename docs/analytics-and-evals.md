# Analytics, Telemetry & Evals Design

**Last updated:** 2026-06-29

---

## The Problem

This is an open-source repo anyone can download and self-host. There is no central server to collect analytics from deployed instances. But we need:

1. **LLM traces** — what did the agent say, what was the quality of reasoning, where did it fail?
2. **Product analytics** — which features are used, what's the drop-off, is learning actually happening?
3. **Evals** — can we run automated quality checks against the agent's responses?

And we need all of this without collecting PII.

---

## Architecture

### Two-Layer Approach

**Layer 1 — LLM Observability (Langfuse)**
Captures every agent generation: the prompt, the completion, latency, cost, and any attached scores. Used for tracing reasoning, running evals, and debugging bad outputs. This is the engineering feedback loop.

**Layer 2 — Product Analytics (PostHog)**
Captures behavioral events (not content): which features fire, how far users progress, level-up rates, quiz completion. This is the product feedback loop.

Both are **opt-in** and **configurable via environment variables**. If no keys are set, all telemetry is no-ops (silent).

---

## Langfuse — LLM Traces & Evals

### Why Langfuse
- Open source with a self-hosted option — can run entirely on your own infrastructure
- Built specifically for LLM apps: traces, spans, generations, scores
- Has a native eval framework (run automated quality checks against stored traces)
- Free cloud tier for low-volume usage; self-host for production

### What Gets Captured Per Session

Each learning session is one Langfuse **trace**, containing:

```
Trace: session_{hashed_user_id}_{session_id}
├── Span: paper_fetch (tool call)
│   └── input: paper_id, output: structured_content, latency
├── Generation: agent_response_1
│   └── model, prompt_tokens, completion_tokens, latency, cost
├── Generation: agent_response_2
│   └── ...
├── Span: quiz_evaluation
│   └── questions_asked, scores
└── Score: session_quality (manual or automated)
```

### PII Rules (Strict)

**NEVER send to Langfuse:**
- Email addresses
- Real names
- Conversation content from the user's side
- Highlights containing personal notes
- Paper content (only paper IDs / DOIs)

**Safe to send:**
- `hashed_user_id` — SHA-256 of user's email, one-way, irreversible
- Session-level metadata: topic_slug, level, duration_seconds, xp_earned
- Agent generations (what the agent said — this is our content, not the user's)
- Tool call inputs/outputs (paper IDs, search queries — but not user-written content)
- Quiz scores (numeric) without question text if it contains user phrasing

### Eval Framework

Automated evals to run against stored traces:

| Eval Name | What It Checks | Method |
|-----------|---------------|--------|
| `explanation_accuracy` | Is the agent's explanation of a concept factually correct? | LLM-as-judge against a reference answer |
| `socratic_depth` | Does the agent ask questions or just lecture? | Rule-based: count question marks in responses |
| `level_calibration` | Is the complexity of language appropriate for the user's stated level? | Flesch-Kincaid readability score vs. expected range per level |
| `hallucination_check` | Does the agent make claims not supported by the fetched paper? | RAG faithfulness eval |
| `refusal_rate` | How often does the agent refuse to engage? | Count non-responses |
| `quiz_difficulty_match` | Are quiz questions at the right difficulty for the user's level? | Human spot-check + LLM judge |

Evals run async (not in the request path) against stored traces in Langfuse.

### Configuration

```env
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com  # or self-hosted URL
TELEMETRY_ENABLED=true  # default: false
```

---

## PostHog — Product Analytics

### Why PostHog
- Open source, can be self-hosted
- Strong privacy controls (no IP collection, EU hosting option, user-controlled data deletion)
- Good for funnel analysis, retention, and feature adoption

### Event Schema

Events are behavioral signals only — no content, no PII.

**Identity:**
- `distinct_id`: SHA-256 of user email — consistent across sessions, never reversible to email

**Events to capture:**

```
session_started
  properties: topic_slug, user_level, session_type (chat | quiz | review)

session_ended
  properties: topic_slug, duration_seconds, xp_earned, level_changed (bool)

level_up
  properties: topic_slug, old_level, new_level

quiz_completed
  properties: topic_slug, quiz_type (intake | in_session | spaced_review),
              questions_asked, questions_correct, xp_earned

paper_fetched
  properties: source (arxiv | pubmed | semantic_scholar | user_paste),
              paper_id (DOI or arXiv ID — NOT title or content)

highlight_saved
  properties: topic_slug, source (popover | manual), auto_saved (bool)

scheduled_quiz_configured
  properties: topic_slug, cadence (daily | weekly | custom), time_of_day_bucket (morning | afternoon | evening)

scheduled_quiz_completed
  properties: topic_slug, completed_on_schedule (bool)

sub_question_opened
  properties: topic_slug, depth (1 | 2 | 3)

feature_used
  properties: feature_name (feynman_moment | level_up | intake_quiz | just_tell_me_override)

niche_topic_declined
  properties: topic_query (hashed — so we can see what topics we're failing to serve without seeing the query itself)
```

**Events NOT to capture:**
- Any message content
- Search queries in clear text (hash or omit)
- Paper titles (use IDs only)
- Highlight text

### Configuration

```env
POSTHOG_API_KEY=phc_...
POSTHOG_HOST=https://app.posthog.com  # or self-hosted
ANALYTICS_ENABLED=true  # default: false
```

---

## How Opt-In Works for Open-Source Users

The repo ships with analytics **disabled by default**. A `.env.example` shows the variables but leaves them blank.

For Michael's hosted deployment, the production `.env` will have these keys set, capturing real usage data from users who consent (shown in onboarding).

**Onboarding consent flow (v1 — simple):**
> "To help improve this product, would you like to share anonymous usage data? No conversation content is ever shared. [Yes, share anonymously] [No thanks]"

This preference is stored in the user model and respected every session.

---

## Eval Workflow (Day-to-Day)

1. Traces accumulate in Langfuse as users interact with the agent
2. Weekly: run automated eval suite against last 7 days of traces
3. Flag any traces with low scores for manual review
4. Use flagged traces to identify prompt improvements
5. Update system prompt, re-run evals against the same traces to verify improvement
6. Track eval scores over time as a quality health metric

Langfuse dataset feature: curate a "golden set" of 50–100 representative session traces that become the regression suite for every prompt change.

---

## Open Questions

- What's the right consent UX for a desktop/web app vs. CLI tool?
- Should evals run in CI on every prompt change? (Yes — once we have a golden dataset)
- Do we want to self-host Langfuse from day one, or use cloud tier initially?
