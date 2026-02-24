# Turborepo 기반 프로젝트 관리 계획

## 목표

- 웹/모바일/공용 패키지를 단일 운영 체계로 관리한다.
- 로컬 개발, CI, 릴리즈에서 동일한 명령 체계를 사용한다.

## 구현 계획

1. 루트 워크스페이스 표준화

- 루트 `package.json` 생성 후 `workspaces` 선언
- Turborepo 설정 파일 `turbo.json` 추가
- 앱/패키지 경로를 명시적으로 정리

기본안(점진 전환, 권장):

```text
.
├── web/
├── mobile/
├── packages/
│   ├── shared-types/
│   ├── eslint-config/
│   └── tsconfig/
├── turbo.json
└── package.json
```

확장안(필요 시):

```text
.
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
│   ├── shared-types/
│   ├── eslint-config/
│   └── tsconfig/
├── turbo.json
└── package.json
```

2. 루트 명령 체계 통합

- `dev`, `build`, `lint`, `test`, `typecheck`를 루트 스크립트로 통일
- 앱별 직접 실행 대신 `turbo run <task> --filter=<workspace>` 사용

예시:

```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  }
}
```

3. 단계별 전환 규칙

- 1단계(기본): `web/`, `mobile/` 경로를 유지한 채 루트 workspace/turbo만 도입
- 2단계(선택): 운영상 필요할 때만 `apps/web`, `apps/mobile`로 이동
- 경로 이동은 CI/Storybook/Jest/Expo 설정 정비를 한 번에 처리할 수 있을 때 수행

4. 앱별 책임 분리 규칙 정의

- `web/`(또는 `apps/web`): 웹 런타임/웹 UI
- `mobile/`(또는 `apps/mobile`): 네이티브 런타임/네이티브 UI
- `packages/*`: 플랫폼 독립 코드 또는 공통 설정만 배치

5. CI 파이프라인 재구성

- 워크플로우 진입점을 루트로 통일
- PR에서는 변경 영향 패키지만 실행(affected strategy)
- `storybook/chromatic`은 웹 경로 필터(`./web` 또는 `./apps/web`)로 분리 실행

6. 운영 가이드 문서화

- 개발 시작/테스트/배포 커맨드를 팀 기준으로 고정
- 신규 패키지 생성 규칙(네이밍, 공개범위, 테스트 요구조건) 추가

## 마이그레이션 체크리스트

### A안: 경로 유지(`web/`, `mobile/`) 단계

| 파일                              | 수정 내용                                              |
| --------------------------------- | ------------------------------------------------------ |
| `.github/workflows/node.js.yml`   | 루트에서 `pnpm install` + `turbo run` 실행으로 통일   |
| `.github/workflows/chromatic.yml` | `pnpm install` 후 `turbo run build-storybook --filter=./web` |
| `web/next.config.mjs`             | 내부 패키지 사용 시 `transpilePackages` 반영           |
| `mobile/metro.config.js`          | 내부 패키지 import 시 monorepo watchFolders 설정       |
| `.gitignore`                      | 루트 기준 캐시/산출물 패턴(`.turbo`, `coverage`) 정리  |
| 기존 하위 lockfile                | `web/package-lock.json`, `web/yarn.lock`, `mobile/package-lock.json` 삭제 |

### B안: 경로 이동(`apps/*`) 단계

`web/` → `apps/web/`, `mobile/` → `apps/mobile/` 이동 시 추가 업데이트 파일:

| 파일                              | 수정 내용                                                                 |
| --------------------------------- | ------------------------------------------------------------------------- |
| `apps/web/tsconfig.json`          | `paths`의 `@/*` 매핑이 상대경로 기준으로 유지되는지 확인                  |
| `apps/web/.storybook/main.ts`     | `stories` 경로 패턴이 새 위치에서 동작하는지 확인                         |
| `apps/web/chromatic.config.json`  | 프로젝트 루트 기준 경로 확인                                              |
| `apps/web/jest.config.js`         | `moduleNameMapper`의 `@/` alias 경로 확인                                 |
| `apps/web/next.config.mjs`        | `transpilePackages`에 내부 패키지 추가 필요                               |
| `apps/mobile/app.json`            | Expo 프로젝트 루트 기준 경로 확인                                         |
| `.github/workflows/node.js.yml`   | 필요시 `working-directory` 또는 `--filter=./apps/web` 등 경로 기준 반영     |
| `.github/workflows/chromatic.yml` | 필요시 `working-directory: apps/web` 반영                                 |

## 기대 효과

1. 작업 일관성 확보

- 팀원이 어느 앱을 다루든 동일한 루트 명령으로 작업 가능

2. 운영 복잡도 감소

- 앱별 개별 문서/스크립트 의존도가 낮아지고 CI 유지보수가 단순해짐

3. 협업 속도 개선

- 공통 정책(스크립트/검증/폴더 규칙) 하에서 PR 리뷰 포인트가 명확해짐

4. 확장성 확보

- 향후 `admin`, `api`, `docs` 같은 새 앱/패키지를 동일 패턴으로 무리 없이 추가 가능
