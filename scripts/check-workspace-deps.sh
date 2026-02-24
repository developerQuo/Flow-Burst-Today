#!/usr/bin/env bash
set -euo pipefail

# 내부 패키지 의존성 workspace:* 검사
# @flow/* 패키지가 workspace:* 프로토콜을 사용하는지 확인

EXIT_CODE=0

check_workspace_protocol() {
  local pkg_json="$1"

  if [ ! -f "$pkg_json" ]; then
    return
  fi

  # dependencies와 devDependencies에서 @flow/* 패키지 검색
  local violations
  violations=$(node -e "
    const pkg = require('./${pkg_json}');
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    Object.entries(deps).forEach(([name, version]) => {
      if (name.startsWith('@flow/') && !version.startsWith('workspace:')) {
        console.log('  ' + name + ': ' + version + ' (expected workspace:*)');
      }
    });
  " 2>/dev/null || true)

  if [ -n "$violations" ]; then
    echo "❌ ${pkg_json}에서 workspace: 프로토콜 미사용 발견:"
    echo "$violations"
    EXIT_CODE=1
  fi
}

check_workspace_protocol "web/package.json"
check_workspace_protocol "mobile/package.json"

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "✅ workspace 의존성 정책 통과"
fi

exit $EXIT_CODE
