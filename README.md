# Aporia

![Status](https://img.shields.io/badge/status-work%20in%20progress-orange) ![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)

An agentic learning experience that helps curious people understand advanced topics — sourced from research papers and journals — at their own pace and level. Aporia means productive confusion, the building block of understanding right before things click. 

## What It Does

- Reads advanced research papers *with* you, meeting you at your current knowledge level
- Uses evidence-based learning techniques: active recall, spaced repetition, Socratic dialogue, Feynman teaching
- Builds a model of what you know and progressively elevates you toward expertise
- Lets you explore sub-topics in context (pop-over rabbit holes) without losing the main thread
- Saves highlights, builds topic summaries, and quizzes you on what you've learned
- Gamifies the journey: levels, XP, streaks, and badges track your progress across topics

## Status

🚧 Early development — agent design phase. Not ready for use.

## Repo Structure

```
aporia/
├── docs/
│   ├── product-vision.md       # Full product vision and feature spec
│   └── learning-principles.md  # Evidence-based learning science backing each design decision
├── agent/
│   ├── prompts/
│   │   ├── system.md           # Core agent system prompt
│   │   ├── level-assessment.md # Adaptive intake quiz prompt
│   │   └── quiz.md             # In-session and spaced review quiz prompts
│   ├── memory/
│   │   └── user-model-schema.md # Schema for per-user knowledge model
│   └── tools/
│       └── README.md           # Planned tool definitions
└── web/                        # Future frontend (placeholder)
```

## Design Principles

1. **Meet learners where they are** — calibrate continuously, never assume
2. **Socratic first** — ask before explaining
3. **Desirable difficulty** — resist being too easy; productive struggle improves retention
4. **Active recall over passive review** — work through material together, don't just summarize it
5. **Show visible progress** — growth should be felt and seen

## Built With

- Claude API (Anthropic) — core agent
- arXiv / Semantic Scholar APIs — paper discovery
- [Frontend TBD — leaning Next.js + React]

## Author

Michael Cross — [github.com/microccross](https://github.com/microccross)
