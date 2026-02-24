# 에이전트 문서 인덱스

이 폴더의 문서는 **AI 에이전트가 읽는 기준 문서**다.  
작업 전 반드시 아래 순서와 용도를 따른다.

## 적용 범위

- `tdd-policy.md`는 **모든 코드 작업**에 적용된다.
- `ios-*` 문서들은 **iOS WebView 전환 작업**에 적용된다.
- `project-structure.md`는 **모노레포 구조/마이그레이션 작업**에 적용된다.
- `monorepo/*` 문서들은 **Turborepo 모노레포 전환 작업**에 적용된다.

---

## 공통 정책 (항상 적용)

1. `tdd-policy.md` — 기본 개발 방식(TDD)

## iOS WebView 전환 관련 (읽기 순서)

1. `ios-webview-plan.md` — **구현 기준** (단일 선택)
2. `ios-webview-review.md` — 구현 전 **리스크 확인**
3. `project-structure.md` — 모노레포 구조/마이그레이션
4. `ios-webview-concepts.md` — FCM/APNs/브릿지 개념 정리 (필요시)
5. `ios-webview-alternatives.md` — **막힐 때만** 대안 참고

## Turborepo 모노레포 전환 관련 (읽기 순서)

1. `monorepo/monorepo-tool-comparison.md` — 도구/패키지 매니저 비교 분석 (Turborepo+pnpm 선택 근거)
2. `monorepo/turborepo-monorepo-analysis.md` — 현재 코드베이스 적용성 분석/우선순위
3. `monorepo/turborepo-project-management-plan.md` — 프로젝트 운영 구조/워크플로우 계획
4. `monorepo/turborepo-build-optimization-plan.md` — 빌드/테스트 캐시 및 CI 최적화 계획
5. `monorepo/turborepo-package-dependencies-plan.md` — 의존성/버전/락파일 관리 계획
6. `monorepo/turborepo-shared-modules-plan.md` — 공용 모듈 경계/패키지 설계 계획
7. `monorepo/turborepo-implementation-playbook.md` — AI 에이전트 구현용 단계별 실행 지침

## 사용 규칙

- **기본 구현은 `ios-webview-plan.md`만 따른다.**
- **구현 착수 전** `ios-webview-review.md`로 리스크를 확인한다.
- 구현 중 제약/이슈가 생기면 `ios-webview-alternatives.md`에서 대안을 선택한다.
- 구조 변경 작업은 `project-structure.md`를 우선 확인한다.
- 모노레포 전환 작업에서는 `ios-*` 문서를 기본 구현 기준으로 사용하지 않는다.
- Turborepo 전환 작업은 `monorepo/*` 문서를 위 순서대로 확인한다.
- 실제 코드 구현은 `monorepo/turborepo-implementation-playbook.md`를 기준으로 진행한다.
- 앱별 세부 구현 전에 `monorepo/turborepo-shared-modules-plan.md`의 경계 규칙을 먼저 확정한다.
- 테스트는 `tdd-policy.md`를 기본으로 따른다.
