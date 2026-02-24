#!/usr/bin/env bash
set -euo pipefail

# 다중 lockfile 금지 검사
# pnpm-lock.yaml 이외의 lockfile이 존재하면 실패

EXIT_CODE=0

FORBIDDEN_LOCKFILES=(
  "web/package-lock.json"
  "web/yarn.lock"
  "mobile/package-lock.json"
  "mobile/yarn.lock"
)

for lockfile in "${FORBIDDEN_LOCKFILES[@]}"; do
  if [ -f "$lockfile" ]; then
    echo "❌ 금지된 lockfile 발견: $lockfile"
    EXIT_CODE=1
  fi
done

if [ ! -f "pnpm-lock.yaml" ]; then
  echo "❌ pnpm-lock.yaml이 존재하지 않습니다."
  EXIT_CODE=1
fi

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "✅ lockfile 정책 통과"
fi

exit $EXIT_CODE
