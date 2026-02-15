#!/bin/bash
# Post agent report to Telegram
# Usage: ./post-report.sh scout /path/to/report.md

AGENT=$1
REPORT_PATH=$2

if [ -z "$AGENT" ] || [ -z "$REPORT_PATH" ]; then
    echo "Usage: ./post-report.sh <agent> <report-path>"
    exit 1
fi

if [ ! -f "$REPORT_PATH" ]; then
    echo "❌ Report not found: $REPORT_PATH"
    exit 1
fi

# Read report content
CONTENT=$(cat "$REPORT_PATH")

# Extract summary (first 1000 chars) for Telegram
# Full report links to GitHub
SUMMARY=$(echo "$CONTENT" | head -c 1000)

# Telegram message
MESSAGE="**${AGENT^^} REPORT**

$SUMMARY

...

📄 Full report: [View on GitHub](https://github.com/DanielWarg/ai-team-system/blob/main/agents/${AGENT}/reports/$(basename $REPORT_PATH))"

# Post to Telegram
cd "$(dirname "$0")"
python3 bot.py post "$AGENT" "$MESSAGE"
