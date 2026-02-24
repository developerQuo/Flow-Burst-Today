# Turborepo 기반 빌드 최적화 계획

## 목표

- `web` 중심의 빌드/테스트 시간을 캐시 기반으로 단축한다.
- 변경 영향 범위만 실행해 CI 비용과 대기 시간을 줄인다.

## 현재 병목

1. 앱별 독립 실행

- `web`과 `mobile` 작업이 서로 인지되지 않아 중복 실행이 발생한다.

2. 캐시 전략 부재

- 빌드/테스트 결과 재사용 기준이 없어 동일 작업이 반복된다.

3. CI 파이프라인 비표준

- 루트 기준 태스크 설계가 없어 워크플로우 일관성이 낮다.

## 구현 계획

1. Turbo 파이프라인 정의

- `build`, `lint`, `test`, `typecheck`, `storybook`, `dev` 태스크를 명시
- 캐시 가능한 태스크와 불가능한 태스크를 분리

예시(`turbo.json`):

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**", "storybook-static/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": ["**/*.tsbuildinfo"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "build-storybook": {
      "outputs": ["storybook-static/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

2. 앱별 스크립트 표준화

- `web`(또는 `apps/web`): `build/lint/test/typecheck/storybook` 정식화
- `mobile`(또는 `apps/mobile`): 최소 `typecheck/lint`를 우선 추가하여 파이프라인 참여

3. 변경 영향 실행 적용

- PR 전제조건:
  - checkout 단계에서 `fetch-depth: 0` 사용
  - base 브랜치 ref(`origin/main`)가 로컬에 존재하도록 fetch 보장
- PR 실행: `turbo run lint test build --filter=...[origin/main]`
- main 브랜치: 전체 실행 + 캐시 업로드

참고:

- 단위 테스트(`test`)는 `build`에 직접 의존시키지 않는다.
- 빌드 산출물이 필요한 E2E/통합 테스트만 `test:e2e -> build` 의존을 둔다.

4. 원격 캐시 도입

- Vercel Remote Cache 또는 자체 캐시 저장소 사용
- CI와 로컬에서 동일 캐시 키 전략 사용

5. 측정 기준 운영

- 기준 지표: cold build 시간, warm build 시간, PR 평균 검사 시간
- 2주 단위로 캐시 적중률과 실행 시간을 비교

## 기대 효과

1. PR 검증 시간 단축

- 변경 없는 워크스페이스 태스크를 건너뛰어 대기 시간을 줄임

2. 반복 작업 속도 향상

- 로컬/CI 모두 warm cache 활용으로 동일 명령 재실행 시간이 감소

3. 빌드 신뢰도 개선

- 의존 태스크(`dependsOn`)가 명시돼 누락 빌드/검증 위험 감소

4. 인프라 비용 절감

- 불필요한 테스트/빌드 실행량 감소로 CI 사용량 최적화
