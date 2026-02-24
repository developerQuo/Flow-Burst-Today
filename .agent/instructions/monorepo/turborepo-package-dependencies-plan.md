# Turborepo 기반 패키지 의존성 관리 계획

## 목표

- 단일 락파일/단일 정책으로 의존성을 통제한다.
- 앱 간 버전 드리프트를 줄이고 업그레이드 비용을 예측 가능하게 만든다.

## 현재 이슈

1. 패키지 매니저 혼재

- `web`에 `yarn.lock` + `package-lock.json` 동시 존재
- `mobile`은 npm lockfile 사용

2. 핵심 버전 불일치

- React: `web` 18.x, `mobile` 19.x
- TypeScript: `web` 5.5.x, `mobile` 5.9.x

3. 공통 정책 부재

- 공통 lint/tsconfig/prettier 버전 기준이 앱별로 분리되어 관리된다.

## 구현 계획

1. 패키지 매니저 단일화

- Turborepo와 궁합이 좋은 `pnpm`을 루트 표준으로 채택
- 루트 lockfile(`pnpm-lock.yaml`)만 유지
- 하위 lockfile은 마이그레이션 완료 후 제거

2. 워크스페이스 의존성 규칙 도입

- 내부 패키지는 반드시 `workspace:*`로 참조
- 앱에서 내부 패키지의 상대경로 import 금지

3. 공통 설정 패키지 분리

- `packages/eslint-config`
- `packages/tsconfig`
- 필요 시 `packages/prettier-config`

4. 버전 정렬 전략

- 즉시 정렬 대상: TypeScript, ESLint, Jest 계열(도구 체인)
- 단계적 정렬 대상: React(웹/모바일 런타임 제약 고려)
- React 공용 모듈은 `peerDependencies` 범위로 관리

예시:

```json
{
  "peerDependencies": {
    "react": ">=18 <20"
  }
}
```

5. pnpm + Metro(Expo) 호환 설정

- pnpm의 symlink 기반 `node_modules`는 Metro 번들러가 기본적으로 추적하지 못함
- `mobile/metro.config.js`(또는 경로 이동 시 `apps/mobile/metro.config.js`)에 워크스페이스 루트와 공용 패키지 경로를 명시적으로 등록

예시(`mobile/metro.config.js`):

```js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// 모노레포 루트의 node_modules도 모듈 해석 대상에 포함
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

module.exports = config;
```

6. 검증 자동화

- CI에 의존성 정책 검사 추가
- 예: 다중 lockfile 탐지, `workspace:*` 누락 탐지, 중복 패키지 점검

권장 검사 명령:

```bash
# 1) lockfile 단일화 검사
test ! -f web/package-lock.json
test ! -f web/yarn.lock
test ! -f mobile/package-lock.json
test -f pnpm-lock.yaml

# 2) workspace 의존성 누락 검사(예시: 내부 패키지명 규칙 @flow/*)
rg -n "\"@flow/.+\": \"(?!workspace:)" --glob "**/package.json"

# 3) 중복 의존성 점검
pnpm -r dedupe --check
```

## 기대 효과

1. 버전 충돌 감소

- 앱별 업그레이드가 공통 기준에서 관리돼 예기치 않은 충돌이 줄어든다.

2. 의존성 가시성 개선

- 루트에서 전체 의존 관계를 조회/감사할 수 있어 유지보수성이 높아진다.

3. 업그레이드 비용 절감

- 공통 설정 패키지로 도구 버전 업데이트를 일괄 적용할 수 있다.

4. 릴리즈 안정성 향상

- lockfile과 정책 검사 자동화로 환경 차이로 인한 실패를 줄인다.
