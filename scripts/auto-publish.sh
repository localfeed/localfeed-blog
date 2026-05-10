#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
QUEUE_FILE="$SCRIPT_DIR/topic-queue.txt"
LOG_FILE="$SCRIPT_DIR/publish-log.txt"
BLOG_DIR="$REPO_DIR/src/content/blog"
TODAY="$(date +%Y-%m-%d)"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"

log() { echo "[$TIMESTAMP] $*" | tee -a "$LOG_FILE"; }

# ── 1. Pick first unused topic ──────────────────────────────────────────────
KEYWORD="$(grep -m1 '^[^#]' "$QUEUE_FILE" || true)"

if [[ -z "$KEYWORD" ]]; then
  log "ERROR: No unused topics remaining. Run refill-queue.sh first."
  exit 1
fi

log "TOPIC: $KEYWORD"

# ── 2. Mark as used ─────────────────────────────────────────────────────────
# Escape for sed on macOS (BSD sed requires -i '')
sed -i '' "s|^${KEYWORD}$|# ${KEYWORD}|" "$QUEUE_FILE"

# ── 3. Generate slug ─────────────────────────────────────────────────────────
SLUG="$(echo "$KEYWORD" | tr '[:upper:]' '[:lower:]' | sed "s/[^a-z0-9 ]//g" | tr ' ' '-' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')"
POST_FILE="$BLOG_DIR/${SLUG}.md"

log "SLUG: $SLUG"
log "FILE: $POST_FILE"

# ── 4. Write the markdown file with a placeholder the Claude prompt will fill ─
cat > "$POST_FILE" <<FRONTMATTER
---
title: ""
slug: "${SLUG}"
description: ""
date: "${TODAY}"
author: "Benoit Boussuge"
category: "venue-marketing"
tags: []
status: "published"
readTime: ""
targetKeyword: "${KEYWORD}"
---

FRONTMATTER

# ── 5. Generate full post with Claude Code ───────────────────────────────────
log "Calling Claude to write post..."

claude --print --no-update-notification "Write a complete blog post for the LocalFeed blog. Output ONLY valid Markdown — no preamble, no explanation, no code fences. The output will be saved directly to a .md file.

KEYWORD: ${KEYWORD}
SLUG: ${SLUG}
DATE: ${TODAY}

OUTPUT FORMAT — start the file with this exact frontmatter shape, filled in:
---
title: \"[SEO title, keyword first, under 65 chars]\"
slug: \"${SLUG}\"
description: \"[140-155 chars, includes keyword, reads naturally]\"
date: \"${TODAY}\"
author: \"Benoit Boussuge\"
category: \"[most relevant: platform-comparison | off-peak-revenue | venue-marketing | hospo-operations | local-seo | diner-deals | industry-news | localfeed-story]\"
tags: [\"tag1\", \"tag2\", \"tag3\"]
status: \"published\"
readTime: \"[X min read]\"
targetKeyword: \"${KEYWORD}\"
---

VOICE — Benoit Boussuge. French-Kiwi. 20 years hospo experience across France, Australia, NZ. Direct, no-bullshit operator. Peer to venue owners, not a marketer talking at them. Dry humour when natural. Never hyped.

WORD COUNT: 1000-1400 words

STRUCTURE:
- Start with a hook that earns the read — not a definition, not a question, not a statistic dump. Something specific that makes the reader feel seen.
- H2 subheadings every 250-300 words
- Short direct sentences. Active voice. Contractions always (you're, don't, it's, they're).
- Mix sentence lengths aggressively — fragments and long sentences, never three the same length in a row.
- NZ-specific throughout — use real NZ cities (Auckland, Wellington, Tauranga, Hamilton, Christchurch, Dunedin, Queenstown, Napier, Nelson, Rotorua, Whangarei), real NZ venue types (pubs, cafes, bakeries, pie shops, wine bars, breweries, food trucks, takeaways, delis, dessert shops — never default to \"restaurant\" only).
- Real numbers and specifics, not vague generalisations.
- End with a subtle CTA to LocalFeed — not salesy, operator-peer tone. One sentence max.
- Naturally include one internal link to a related topic: use placeholder [related topic](/blog/related-slug) if needed.

LOCALFEED FACTS — get these exactly right, never guess:
- \$10/week after 20 bookings (not per booking, not \$50)
- \$5 booking fee for special events up to 4 people
- 75% of no-show fee goes to the venue
- Zero commission on food revenue
- Never name competitors by name — say \"some platforms\" or \"booking platforms\"
- Never say discounts are bad — say \"forced discounts\" or \"deals you didn't design\"

BANNED WORDS — never use:
literally, actually, basically, maybe, probably, very, really, just, delve, navigate, landscape, tapestry, realm, foster, robust, seamless, leverage, paradigm, holistic, nuanced, pivotal, comprehensive, thrilled, passionate, incredibly, remarkable, game-changer, exciting

BANNED PATTERNS:
- Em dashes (— or –)
- Rhetorical questions at end of sections
- Fragment stacking (three short sentences in a row)
- AI transitions: \"It's worth noting\", \"In today's world\", \"When it comes to\", \"It's important to\", \"At the end of the day\"
- Balanced pros/cons structure
- Starting broad then narrowing — start specific, stay specific
- Saying LocalFeed is \"the answer\" or \"the solution\"" > "$POST_FILE"

# ── 6. Validate frontmatter was written ──────────────────────────────────────
if ! grep -q '^---' "$POST_FILE"; then
  log "ERROR: Claude output missing frontmatter. Post not committed."
  rm -f "$POST_FILE"
  exit 1
fi

WORD_COUNT="$(wc -w < "$POST_FILE" | tr -d ' ')"
POST_TITLE="$(grep '^title:' "$POST_FILE" | head -1 | sed 's/title: *//' | tr -d '"')"

log "GENERATED: \"$POST_TITLE\" ($WORD_COUNT words)"

# ── 7. Regenerate sitemap if script exists ───────────────────────────────────
if [[ -f "$REPO_DIR/scripts/generate-sitemap.mjs" ]]; then
  cd "$REPO_DIR"
  node scripts/generate-sitemap.mjs >> "$LOG_FILE" 2>&1 && log "Sitemap regenerated"
fi

# ── 8. Git commit and push ───────────────────────────────────────────────────
cd "$REPO_DIR"
git add src/content/blog/"${SLUG}.md"
git commit -m "blog: ${POST_TITLE:-$KEYWORD}

Auto-published via auto-publish.sh
Keyword: ${KEYWORD}
Date: ${TODAY}"

git push origin main
log "PUSHED: ${SLUG}.md → main"

# ── 9. Final summary ─────────────────────────────────────────────────────────
REMAINING="$(grep -c '^[^#]' "$QUEUE_FILE" || echo 0)"
log "DONE. Queue: $REMAINING topics remaining."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Post: $POST_TITLE"
echo "  Slug: $SLUG"
echo "  Words: $WORD_COUNT"
echo "  Queue: $REMAINING remaining"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
