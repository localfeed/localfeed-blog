#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PUBLISH_CRON="0 19 * * 1-5 cd ${REPO_DIR} && bash scripts/auto-publish.sh >> scripts/publish-log.txt 2>&1"
REFILL_CRON="0 18 * * 1 cd ${REPO_DIR} && bash scripts/refill-queue.sh >> scripts/publish-log.txt 2>&1"

MARKER_PUBLISH="localfeed-blog-publish"
MARKER_REFILL="localfeed-blog-refill"

# Read current crontab (ignore error if empty)
CURRENT_CRON="$(crontab -l 2>/dev/null || true)"

UPDATED_CRON="$CURRENT_CRON"
ADDED=0

if echo "$CURRENT_CRON" | grep -q "$MARKER_PUBLISH"; then
  echo "Publish cron already installed — skipping."
else
  UPDATED_CRON="${UPDATED_CRON}
# $MARKER_PUBLISH — weekdays 7am NZT (19:00 UTC)
$PUBLISH_CRON"
  ADDED=$((ADDED + 1))
fi

if echo "$CURRENT_CRON" | grep -q "$MARKER_REFILL"; then
  echo "Refill cron already installed — skipping."
else
  UPDATED_CRON="${UPDATED_CRON}
# $MARKER_REFILL — Mondays 6am NZT (18:00 UTC)
$REFILL_CRON"
  ADDED=$((ADDED + 1))
fi

if [[ "$ADDED" -gt 0 ]]; then
  echo "$UPDATED_CRON" | crontab -
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Cron installed ($ADDED job(s) added)."
  echo "  Posts publish: weekdays at 7am NZT"
  echo "  Queue checks:  every Monday at 6am NZT"
  echo "  Repo: $REPO_DIR"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo "Both cron jobs already present. Nothing changed."
fi

echo ""
echo "Current localfeed-blog cron entries:"
crontab -l | grep "localfeed-blog" || echo "(none found)"
