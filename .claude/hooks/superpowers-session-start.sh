#!/usr/bin/env bash
# Project-scoped SessionStart hook for the team superpowers harness.
# Reads .claude/superpowers.config.json; only injects context when mode is "auto".
# Adapted from obra/superpowers hooks/session-start (MIT).

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CONFIG_FILE="${PROJECT_DIR}/.claude/superpowers.config.json"
SKILL_FILE="${PROJECT_DIR}/.claude/skills/superpowers/SKILL.md"

# Default to manual if config is missing or unreadable.
mode="manual"
if [ -r "$CONFIG_FILE" ]; then
  parsed=$(grep -o '"mode"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" \
    | head -n1 \
    | sed -E 's/.*"mode"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/' \
    || true)
  if [ -n "$parsed" ]; then
    mode="$parsed"
  fi
fi

if [ "$mode" != "auto" ]; then
  # Manual mode — emit nothing. Skills still available via /superpowers, /brainstorming, etc.
  printf '{}\n'
  exit 0
fi

if [ ! -r "$SKILL_FILE" ]; then
  printf '{}\n'
  exit 0
fi

superpowers_content=$(cat "$SKILL_FILE")

# Escape for JSON embedding via bash parameter substitution.
escape_for_json() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/\\r}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

superpowers_escaped=$(escape_for_json "$superpowers_content")
session_context="<EXTREMELY_IMPORTANT>\nYou have superpowers (team harness, project-scoped).\n\n**Below is the full content of your 'superpowers' skill — your introduction to using skills. For all other skills, use the 'Skill' tool:**\n\n${superpowers_escaped}\n</EXTREMELY_IMPORTANT>"

# Claude Code expects hookSpecificOutput.additionalContext.
printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$session_context"

exit 0
