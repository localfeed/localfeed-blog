#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QUEUE_FILE="$SCRIPT_DIR/topic-queue.txt"
LOG_FILE="$SCRIPT_DIR/publish-log.txt"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"
TODAY="$(date +%Y-%m-%d)"

log() { echo "[$TIMESTAMP] $*" | tee -a "$LOG_FILE"; }

# ── Check remaining unused topics ────────────────────────────────────────────
REMAINING="$(grep -c '^[^#]' "$QUEUE_FILE" || echo 0)"
log "Queue check: $REMAINING topics remaining."

if [[ "$REMAINING" -ge 10 ]]; then
  log "Queue healthy. No refill needed."
  exit 0
fi

log "Queue low ($REMAINING remaining). Generating 50 new topics..."

# ── Extract existing topics (used and unused) for dedup ─────────────────────
EXISTING="$(sed 's/^# *//' "$QUEUE_FILE" | tr '[:upper:]' '[:lower:]')"

# ── Generate 50 new keywords via Claude Code ─────────────────────────────────
NEW_TOPICS="$(claude --print --no-update-notification "Generate exactly 50 NZ hospitality SEO keywords. Output ONLY the keywords — one per line, no numbering, no bullets, no explanation, no blank lines.

Rules:
- Each keyword must be something a NZ venue owner or local diner would actually Google
- Mix of: venue types (cafes, pubs, breweries, bakeries, food trucks, wine bars, pie shops, takeaways, delis, dessert shops), NZ cities (Auckland, Wellington, Tauranga, Hamilton, Christchurch, Dunedin, Queenstown, Napier, Nelson, Rotorua, Whangarei, New Plymouth, Palmerston North, Gisborne, Invercargill), platform comparison (commission, booking fees, no-show policy), hospo operations (staff, food cost, menu pricing, pos systems), diner-side discovery (deals, local favourites, opening hours), industry trends (2026, post-covid, sustainability, events)
- Never use generic non-NZ keywords
- Do not repeat any of these existing topics:
${EXISTING}")"

if [[ -z "$NEW_TOPICS" ]]; then
  log "ERROR: Claude returned no topics. Refill aborted."
  exit 1
fi

# Count and append ────────────────────────────────────────────────────────────
NEW_COUNT="$(echo "$NEW_TOPICS" | grep -c '^.' || echo 0)"
echo "" >> "$QUEUE_FILE"
echo "$NEW_TOPICS" >> "$QUEUE_FILE"

log "Queue refilled: ${TODAY} — ${NEW_COUNT} new topics added."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Refill complete: $NEW_COUNT new topics"
echo "  Total unused: $((REMAINING + NEW_COUNT))"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
