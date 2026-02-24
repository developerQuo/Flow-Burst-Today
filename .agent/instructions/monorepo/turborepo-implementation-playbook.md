# Turborepo 모노레포 구현 플레이북 (AI Agent 실행용)

## 문서 목적

- 이 문서는 **실제 코드 변경을 수행하는 AI 에이전트**를 위한 실행 지침이다.
- 분석/원칙 문서가 아니라, 순서대로 실행 가능한 구현 절차를 제공한다.

## 적용 범위

- 대상 저장소: `Flow-Burst-Today`
- 기본 전략: **점진 전환**
  - 1차 전환에서는 `web/`, `mobile/` 경로를 유지
  - 필요 시 2차에서 `apps/*` 경로로 이동

## 사전 규칙

1. 한 단계 완료 후 다음 단계로 이동한다.
2. 각 단계마다 `검증`을 반드시 수행한다.
3. 실패 시 즉시 `롤백` 후 원인 수정한다.
4. 초기 범위에서 공용 패키지는 `shared-types`만 필수 도입한다.

---

## 경로 의존 변경 체크리스트

1. `.github/workflows/node.js.yml`

- 루트 기준 `pnpm install` + `turbo run`으로 통일

2. `.github/workflows/chromatic.yml`

- `turbo run build-storybook --filter=./web` 적용

3. `web/next.config.mjs`

- 내부 패키지 사용 시 `transpilePackages` 반영

4. `mobile/metro.config.js`

- workspace 패키지 사용 시 `watchFolders`/`nodeModulesPaths` 반영

5. lockfile 정리

- 제거: `web/package-lock.json`, `web/yarn.lock`, `mobile/package-lock.json`
- 유지: `pnpm-lock.yaml` 단일화

## 구조 전환 순서 (권장)

1. 루트 workspace/turbo 파일 추가

- `package.json`, `pnpm-workspace.yaml`, `turbo.json`

2. 앱 스크립트 정렬

- `web`, `mobile`에 `typecheck/lint` 실행 가능 상태 확보

3. `packages/shared-types` 도입

- 기존 `shared/types/native-bridge.d.ts`를 패키지화

4. lockfile 단일화

- pnpm 기준으로 통합

5. Next/Expo 모노레포 호환 설정

- `web/next.config.mjs`, `mobile/metro.config.js`

6. CI를 루트 `pnpm + turbo`로 전환

---

## Step 0. 베이스라인 확보

### 목적

- 전환 전 상태를 기록하고, 실패 시 복구 기준점을 만든다.

### 작업

1. 현재 브랜치 확인
2. 테스트/빌드 베이스라인 측정

### 명령

```bash
git status --short
node -v
npm -v
corepack enable
corepack prepare pnpm@9 --activate

# web 기준 현재 정상 동작 확인
cd web && npm ci && npm run build && npm run test
cd ..
```

### 검증

- `web` 빌드/테스트가 기존 기준으로 통과한다.

### 롤백

- 아직 파일 변경 전이므로 롤백 불필요.

---

## Step 1. 루트 워크스페이스 골격 생성

### 목적

- 루트에서 monorepo 오케스트레이션을 시작할 최소 파일을 만든다.

### 생성/수정 파일

1. `package.json` (루트 신규)
2. `pnpm-workspace.yaml` (루트 신규)
3. `turbo.json` (루트 신규)
4. `.gitignore` (루트 수정: `.turbo` 추가)

### 구현 상세

1. 루트 `package.json` 생성

```json
{
  "name": "flow-burst-today",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

2. `pnpm-workspace.yaml` 생성

```yaml
packages:
  - web
  - mobile
  - packages/*
```

3. `turbo.json` 생성

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**", "storybook-static/**"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"]
    },
    "build-storybook": {
      "outputs": ["storybook-static/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": ["**/*.tsbuildinfo"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 검증 명령

```bash
pnpm install
pnpm turbo run build --filter=./web
```

### 완료 기준

- 루트에서 `pnpm install`이 성공한다.
- `pnpm turbo run build --filter=./web`가 실행된다.

### 롤백

- 루트 신규 파일 3개 삭제 후 기존 상태로 복귀.

---

## Step 2. 앱 워크스페이스 스크립트 정렬

### 목적

- 루트 `turbo run`이 각 앱 태스크를 호출할 수 있도록 스크립트를 정규화한다.

### 수정 파일

1. `web/package.json`
2. `mobile/package.json`

### 구현 상세

1. `web/package.json`

- 기존 스크립트 유지
- 누락 시 `typecheck` 추가:
  - `"typecheck": "tsc --noEmit"`

2. `mobile/package.json`

- 최소 스크립트 추가:
  - `"lint": "eslint ."`
  - `"typecheck": "tsc --noEmit"`
  - `"build": "expo export --platform web"` (초기에는 선택, 필요 시 도입)
- 모바일에서 lint를 쓰려면 eslint devDependency를 함께 추가한다.

### 검증 명령

```bash
pnpm turbo run typecheck --filter=./web --filter=./mobile
pnpm turbo run lint --filter=./web
```

### 완료 기준

- 루트에서 web/mobile typecheck가 모두 실행된다.

### 롤백

- 추가한 스크립트만 제거하고 기존 스크립트 복원.

---

## Step 3. `shared-types` 패키지 도입 (필수)

### 목적

- `shared/types/native-bridge.d.ts`를 workspace 패키지로 전환한다.

### 생성/수정 파일

1. `packages/shared-types/package.json` (신규)
2. `packages/shared-types/src/native-bridge.d.ts` (신규, 기존 파일 이동)
3. `packages/shared-types/src/index.ts` (신규)
4. `shared/types/native-bridge.d.ts` (삭제 또는 re-export stub)
5. `web/package.json`, `mobile/package.json` (workspace 의존성 추가)

### 구현 상세

1. `packages/shared-types/package.json`

```json
{
  "name": "@flow/shared-types",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

2. `src/index.ts`에서 타입 export

```ts
export * from "./native-bridge";
```

3. 앱 의존성 추가

- `web/package.json`:
  - `"@flow/shared-types": "workspace:*"`
- `mobile/package.json`:
  - `"@flow/shared-types": "workspace:*"`

4. 앱 코드 import 경로를 `@flow/shared-types`로 통일

### 검증 명령

```bash
pnpm install
pnpm turbo run typecheck --filter=./web --filter=./mobile
rg -n "shared/types/native-bridge" web mobile
```

### 완료 기준

- 상대경로 타입 import가 제거된다.
- 두 앱에서 `@flow/shared-types` import가 정상 동작한다.

### 롤백

- `packages/shared-types` 제거 후 원래 `shared/types` 경로로 import 복원.

---

## Step 4. pnpm 단일화 및 lockfile 정리

### 목적

- lockfile 혼재를 제거하고 단일 설치 경로를 만든다.

### 수정 파일

1. `web/package-lock.json` 삭제
2. `web/yarn.lock` 삭제
3. `mobile/package-lock.json` 삭제
4. `pnpm-lock.yaml` 생성

### 명령

```bash
rm -f web/package-lock.json web/yarn.lock mobile/package-lock.json
pnpm install
```

### 검증

```bash
test ! -f web/package-lock.json
test ! -f web/yarn.lock
test ! -f mobile/package-lock.json
test -f pnpm-lock.yaml
```

### 완료 기준

- 루트 lockfile(`pnpm-lock.yaml`)만 남는다.

### 롤백

- 삭제 lockfile을 git에서 복원하고 `pnpm-lock.yaml` 제거.

---

## Step 5. Next/Expo 모노레포 호환 설정

### 목적

- 내부 workspace 패키지를 웹/모바일에서 안정적으로 import 가능하게 만든다.

### 수정 파일

1. `web/next.config.mjs`
2. `mobile/metro.config.js` (신규, 필요 시)

### 구현 상세

1. `web/next.config.mjs`

- 내부 패키지 사용 시 `transpilePackages` 설정

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@flow/shared-types"],
};

export default nextConfig;
```

2. `mobile/metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");
const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

module.exports = config;
```

### 검증 명령

```bash
pnpm turbo run build --filter=./web
pnpm --filter mobile start -- --offline
```

### 완료 기준

- web build 성공
- mobile bundler가 workspace 패키지 import 에러 없이 기동

### 롤백

- `transpilePackages`/`metro.config.js` 변경만 되돌린다.

---

## Step 6. CI를 루트 monorepo 방식으로 전환

### 목적

- GitHub Actions가 루트 `pnpm + turbo`를 사용하도록 변경한다.

### 수정 파일

1. `.github/workflows/node.js.yml`
2. `.github/workflows/chromatic.yml`

### 구현 상세

1. 공통

- `actions/setup-node` + `pnpm/action-setup` 사용
- `pnpm install --frozen-lockfile` 실행

2. `node.js.yml`

- main 이외 브랜치에서는 affected 실행:
  - checkout `fetch-depth: 0`
  - `turbo run lint test build --filter=...[origin/main]`
- main 브랜치에서는 전체 실행:
  - `turbo run lint test build`
- PR 워크플로우는 사용하지 않음 (push 트리거만 사용)

3. `chromatic.yml`

- 웹 워크스페이스만 실행:
  - `pnpm turbo run build-storybook --filter=./web`
  - chromatic action의 working dir 지정

### 검증 기준

- main 외 브랜치 push에서 affected 명령이 실패 없이 실행
- main push에서 전체 build/test 통과

### 롤백

- workflow를 이전 npm 기반으로 되돌리되, 루트 전환 브랜치는 유지.

---

## Step 7. 정책 검사 자동화 추가

### 목적

- 전환 이후 정책 이탈(다중 lockfile, workspace 누락)을 CI에서 차단한다.

### 구현 항목

1. 다중 lockfile 금지 검사 스크립트 추가 (`scripts/check-lockfiles.sh`)
2. 내부 패키지 의존성 `workspace:*` 검사 스크립트 추가
3. CI에 검사 단계 연결

### 예시 명령

```bash
test ! -f web/package-lock.json
test ! -f web/yarn.lock
test ! -f mobile/package-lock.json
pnpm -r dedupe --check
```

### 완료 기준

- 정책 위반 시 CI가 즉시 실패한다.

---

## 최종 완료 기준 (Definition of Done)

1. 루트에서 다음 명령이 모두 성공한다.

```bash
pnpm install --frozen-lockfile
pnpm turbo run lint test build typecheck
```

2. lockfile은 `pnpm-lock.yaml` 단일 파일만 유지한다.
3. 공용 타입은 `@flow/shared-types`로 참조된다.
4. CI는 루트 `pnpm + turbo` 기준으로 동작한다.
5. 문서 인덱스(`.agent/instructions/README.md`)와 실제 문서 경로가 일치한다.

---

## 에이전트 실행 순서 요약

1. Step 0~2: 워크스페이스/터보 기반 구축
2. Step 3~5: 공용 타입 + 런타임 호환
3. Step 6~7: CI/정책 자동화

이 순서를 유지하면 리스크를 낮춘 상태로 모노레포 전환을 완료할 수 있다.
