# 모노레포 도구 비교 분석 (Flow-Burst-Today)

## 문서 목적

- 모노레포 오케스트레이션 도구(Turborepo, Nx, Lerna, 순수 Workspaces)를 비교한다.
- 패키지 매니저(npm, yarn, pnpm, bun)를 비교하고, 최적 조합을 선택한다.

## 프로젝트 현황

| 항목              | 상태                                                                               |
| ----------------- | ---------------------------------------------------------------------------------- |
| **앱**            | `web/` (Next.js 14, React 18, TS 5.5) · `mobile/` (Expo 54, React 19, TS 5.9)      |
| **공유 코드**     | `shared/types/native-bridge.d.ts` 1개 (패키지화 안 됨)                             |
| **패키지 매니저** | 혼재 — `web/`에 `package-lock.json` + `yarn.lock`, `mobile/`에 `package-lock.json` |
| **루트 설정**     | `package.json` · `turbo.json` · `pnpm-workspace.yaml` 부재                         |
| **CI**            | GitHub Actions — 루트 `npm ci` (루트 `package.json` 없어 미작동)                   |
| **테스트**        | `web/`: Jest + Storybook + Chromatic / `mobile/`: 없음                             |
| **팀 규모**       | 1인 (소규모)                                                                       |

---

## Part 1: 오케스트레이션 도구 비교

### Turborepo

| 구분          | 평가                                                 |
| ------------- | ---------------------------------------------------- |
| 설정 복잡도   | ⭐ 매우 낮음 — `turbo.json` 1개 추가                 |
| 학습 곡선     | ⭐ 낮음 — 기존 npm scripts 유지, 새 개념 최소        |
| 빌드 캐시     | ✅ 로컬 + Remote Cache (Vercel 무료 티어)            |
| Affected 실행 | ✅ `--filter=...[origin/main]`                       |
| Next.js 호환  | ⭐ 최상 — Vercel 제작, 공식 예제 제공                |
| Expo/RN 호환  | ✅ Expo 공식 가이드에서 Turborepo 모노레포 설정 안내 |
| 코드 생성     | ❌ 없음 — 스캐폴딩 수동                              |
| 유지보수      | 낮음 — 설정 최소, 관리 포인트 적음                   |

### Nx

| 구분          | 평가                                                   |
| ------------- | ------------------------------------------------------ |
| 설정 복잡도   | 중간~높음 — `nx.json`, `project.json`(앱별) 등 다수    |
| 학습 곡선     | 높음 — executor, generator, target 등 독자 개념        |
| 빌드 캐시     | ✅ 로컬 + Nx Cloud                                     |
| Affected 실행 | ✅ 의존 그래프 기반 정밀 분석                          |
| Next.js 호환  | ✅ 공식 플러그인 (`@nx/next`)                          |
| Expo/RN 호환  | ✅ 공식 플러그인 (`@nx/expo`)                          |
| 코드 생성     | ⭐ 강력 — Generator 자동화                             |
| 유지보수      | 높음 — 버전 업데이트(nx migrate)가 잦고 설정 파일 많음 |

### Lerna

| 구분          | 평가                                                         |
| ------------- | ------------------------------------------------------------ |
| 설정 복잡도   | 낮음 — `lerna.json`                                          |
| 빌드 캐시     | ⚠️ 자체 없음 — Nx 연동 시 가능 (Lerna 6+ 내부적으로 Nx 사용) |
| Affected 실행 | ⚠️ 제한적 (`lerna changed` 수준)                             |
| 코드 생성     | ❌ 없음                                                      |
| 유지보수      | ⚠️ Nrwl 인수 후 독립 발전 멈춤, 사실상 Nx 의존               |

### 순수 Workspaces (npm/yarn/pnpm)

| 구분          | 평가                                                   |
| ------------- | ------------------------------------------------------ |
| 설정 복잡도   | ⭐ 최소 — `workspaces` 필드 또는 `pnpm-workspace.yaml` |
| 빌드 캐시     | ❌ 없음                                                |
| Affected 실행 | ❌ 없음 — 매번 전체 실행                               |
| 유지보수      | 낮음 — 단, 태스크 오케스트레이션을 직접 구현해야 함    |

### 종합 평가

| 도구            | 설정 난이도 | Next+Expo |  캐시  | 유지보수 |  **판정**   |
| --------------- | :---------: | :-------: | :----: | :------: | :---------: |
| **Turborepo**   |   ⭐⭐⭐    |  ⭐⭐⭐   | ⭐⭐⭐ |  ⭐⭐⭐  | **🥇 최적** |
| Nx              |     ⭐      |  ⭐⭐⭐   | ⭐⭐⭐ |    ⭐    |   🥈 과잉   |
| 순수 Workspaces |   ⭐⭐⭐    |   ⭐⭐    |   ⭐   |  ⭐⭐⭐  |   🥉 부족   |
| Lerna           |    ⭐⭐     |   ⭐⭐    |   ⭐   |    ⭐    |  ❌ 비추천  |

**Turborepo 선택 사유:**

1. `turbo.json` 1개로 캐시 + affected + 병렬화를 확보할 수 있어 비용 대비 효과가 최고
2. Vercel 제작 → Next.js 생태계와 정합성이 검증됨
3. 앱 2개 + 패키지 3~5개 규모에서 Nx의 generator/executor는 과잉 투자
4. Lerna는 Nx에 흡수되어 독립 도구를 선택하는 의미가 없음
5. 순수 Workspaces는 빌드 캐시가 없어 web의 무거운 빌드/테스트 파이프라인에 비효율적

---

## Part 2: 패키지 매니저 비교

### npm

| 구분              | 평가                                                           |
| ----------------- | -------------------------------------------------------------- |
| 설치 속도         | ⭐ 가장 느림                                                   |
| 디스크 효율       | ⭐ 낮음 — 패키지를 프로젝트마다 중복 저장                      |
| node_modules 구조 | flat — phantom dependency 허용 (선언 안 한 패키지도 접근 가능) |
| Workspaces        | ✅ v7+ 지원                                                    |
| Turborepo 호환    | ✅ 지원됨                                                      |
| 장점              | Node.js 기본 탑재, 별도 설치 불필요                            |
| 단점              | 속도·디스크 효율 모두 최하위, phantom dependency 문제          |

### yarn (Classic v1 / Berry v2+)

| 구분              | 평가                                                                         |
| ----------------- | ---------------------------------------------------------------------------- |
| 설치 속도         | ⭐⭐ Classic은 보통 / Berry PnP는 빠름                                       |
| 디스크 효율       | Classic: npm과 유사 / Berry PnP: ⭐⭐⭐ (`node_modules` 제거)                |
| node_modules 구조 | Classic: flat (npm과 동일) / Berry: PnP (zip + 가상 파일 시스템)             |
| Workspaces        | ✅ 안정적                                                                    |
| Turborepo 호환    | ✅ 지원됨                                                                    |
| 장점              | Berry PnP의 zero-install 가능, 성숙한 생태계                                 |
| 단점              | Berry PnP 호환 문제 (Expo/Metro 번들러와 충돌 가능), Classic은 유지보수 모드 |

### pnpm

| 구분              | 평가                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| 설치 속도         | ⭐⭐⭐ 빠름 — content-addressable store에서 hard link                     |
| 디스크 효율       | ⭐⭐⭐ 최고 — 동일 패키지를 한 번만 저장, hard link로 참조                |
| node_modules 구조 | **엄격(strict)** — 선언한 의존성만 접근 가능, phantom dependency 차단     |
| Workspaces        | ✅ 안정적, `workspace:*` 프로토콜 지원                                    |
| Turborepo 호환    | ✅ 최적 — `create-turbo` 기본값, 공식 예제 1순위                          |
| 장점              | 속도·효율·엄격함의 균형이 최고                                            |
| 단점              | Node.js 미기본탑재 (별도 설치 필요), symlink 구조가 일부 도구와 충돌 가능 |

### bun

| 구분              | 평가                                                               |
| ----------------- | ------------------------------------------------------------------ |
| 설치 속도         | ⭐⭐⭐ 최고 — 네이티브 구현으로 압도적                             |
| 디스크 효율       | ⭐⭐ 양호                                                          |
| node_modules 구조 | flat — npm과 유사, hoisting 문제 보고됨                            |
| Workspaces        | ⚠️ npm workspaces 형식 지원하나 아직 성숙도 부족                   |
| Turborepo 호환    | ✅ 지원됨                                                          |
| 장점              | 압도적 설치 속도, 올인원 런타임                                    |
| 단점              | 모노레포 기능 미성숙 (hoisting 버그), Expo/Metro와의 호환성 미검증 |

### 종합 평가

| 매니저     |  속도  | 디스크 | 엄격함 | 모노레포 성숙도 | Expo 호환 |      **판정**      |
| ---------- | :----: | :----: | :----: | :-------------: | :-------: | :----------------: |
| **pnpm**   | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |     ⭐⭐⭐      |   ⭐⭐    |    **🥇 최적**     |
| yarn Berry |  ⭐⭐  | ⭐⭐⭐ | ⭐⭐⭐ |     ⭐⭐⭐      |    ⭐     | 🥈 PnP 호환 리스크 |
| bun        | ⭐⭐⭐ |  ⭐⭐  |   ⭐   |       ⭐        |    ⭐     |     🥉 미성숙      |
| npm        |   ⭐   |   ⭐   |   ⭐   |      ⭐⭐       |  ⭐⭐⭐   |     ❌ 비추천      |

### pnpm 선택 사유

1. **엄격한 node_modules가 Turborepo 캐시와 궁합이 좋다**
   - pnpm은 선언되지 않은 의존성 접근을 차단(phantom dependency 방지)하므로, 캐시 키가 의존하는 파일 해시의 정합성이 높아진다
   - Turborepo는 `package.json`의 의존성 선언 + lockfile 해시를 기반으로 캐시를 판단하는데, phantom dependency가 있으면 선언과 실제 사용이 불일치하여 캐시 무효화 범위가 부정확해진다
   - Turborepo 공식 문서의 `create-turbo`가 pnpm을 기본값으로 사용하는 이유도 이 정합성 때문이다

2. **content-addressable store로 모노레포 디스크 비용을 줄인다**
   - `web`과 `mobile`이 공유하는 패키지(typescript, eslint 등)를 한 번만 저장하고 hard link로 참조
   - npm은 각 앱 `node_modules`에 동일 패키지를 중복 설치

3. **`workspace:*` 프로토콜이 내부 패키지 관리에 명확하다**
   - 내부 패키지 의존을 버전 범위가 아닌 `workspace:*`로 선언하여, 항상 로컬 소스를 참조하도록 강제
   - 실수로 npm registry에서 같은 이름의 외부 패키지를 설치하는 사고를 방지

4. **현재 프로젝트의 lockfile 혼재 문제를 일소한다**
   - `web/`의 `package-lock.json` + `yarn.lock` 공존 → 루트 `pnpm-lock.yaml` 단일화
   - `mobile/`의 `package-lock.json` → 제거

5. **yarn Berry PnP는 Expo/Metro와 충돌 위험이 있다**
   - PnP의 zip 기반 가상 파일 시스템은 Metro 번들러가 기대하는 `node_modules` 구조와 맞지 않음
   - pnpm은 symlink 구조이므로 Metro의 `watchFolders` 설정만 추가하면 호환 가능

6. **bun은 아직 모노레포 용도로 안정적이지 않다**
   - hoisting 관련 이슈가 보고되어 있고, Expo/Metro 조합의 검증 사례가 부족

---

## 최종 결론

> **Turborepo + pnpm** 조합이 이 프로젝트에 최적이다.

- **오케스트레이션**: Turborepo — 최소 설정으로 캐시/병렬화/affected 실행 확보
- **패키지 매니저**: pnpm — 엄격한 의존성 + 캐시 정합성 + 디스크 효율
- `monorepo/` 하위 계획 문서들과 방향이 일치하며, 실제 구현은 `turborepo-implementation-playbook.md`의 단계별 체크리스트를 기준으로 진행
