#!/bin/bash
# Run this once from the aporia folder to init git and push to GitHub.
# Requires: git, gh (GitHub CLI). Install gh with: brew install gh

set -e

cd "$(dirname "$0")"

echo "→ Cleaning up any stale git state..."
rm -rf .git

echo "→ Initializing git..."
git init

echo "→ Staging files..."
git add .
git status

echo "→ Initial commit..."
git commit -m "Initial commit — Aporia v0.1.0-alpha

Agent design phase complete:
- Core system prompt (Socratic, adaptive by level)
- Level assessment prompt
- Quiz prompt (in-session + spaced review)
- User model schema
- Tool definitions (fetch_paper, search_papers, user model, highlights, XP)
- Product vision doc
- Learning science principles
- Analytics & evals architecture"

echo "→ Tagging v0.1.0-alpha..."
git tag -a v0.1.0-alpha -m "v0.1.0-alpha — agent design phase, no code yet"

echo "→ Creating GitHub repo and pushing..."
gh repo create aporia \
  --public \
  --description "An agentic learning experience for understanding advanced research papers" \
  --source=. \
  --remote=origin \
  --push

echo "→ Pushing tag..."
git push origin v0.1.0-alpha

echo "→ Marking release as pre-release on GitHub..."
gh release create v0.1.0-alpha \
  --title "v0.1.0-alpha — Agent Design Phase" \
  --notes "Agent design phase complete. Core prompts, user model schema, and tool definitions are in place. No runnable code yet." \
  --prerelease

echo ""
echo "✓ Done! Repo live at: https://github.com/microccross/aporia"
