# Turborepo 기반 공용 모듈 설계 계획

## 목표

- 웹/모바일이 안전하게 재사용할 수 있는 공용 계층을 정의한다.
- 플랫폼 결합 코드를 분리해 테스트 가능성과 확장성을 높인다.

## 설계 원칙

1. 공유 우선순위는 `타입 -> 도메인 로직 -> UI` 순서로 진행
2. 공용 패키지는 플랫폼 API(`window`, `navigator`, `react-native`) 직접 참조 금지
3. 플랫폼 의존 기능은 어댑터 인터페이스로 주입

## 권장 패키지 경계 (MVP 우선)

1. 필수: `packages/shared-types`

- 현재 `shared/types/native-bridge.d.ts`를 패키지로 승격
- 웹/모바일 브릿지 계약 타입의 단일 소스 역할

2. 선택: `packages/domain-pomodoro` (조건부)

- `web/lib/pomodoro.ts`의 순수 시간 계산/상태 전이 로직만 추출
- Web API 결합을 제거할 때만 분리 진행

3. 보류(초기 범위 제외)

- `packages/platform-web`
- `packages/platform-native`
- `packages/design-tokens`
- 위 3개는 모바일에 실제 도메인 로직이 생기고, 웹/모바일 양쪽에서 같은 기능을 재사용할 필요가 확인된 뒤 도입

## 구현 계획

1. 1단계: 타입 공유 실사용화 (필수)

- `shared/types/native-bridge.d.ts`를 `@flow/shared-types`로 패키징
- `web`, `mobile` 양쪽에서 import 경로를 내부 패키지로 통일
- 완료 기준: 상대경로 타입 import 0건, `workspace:*` 기반 참조로만 사용

2. 2단계: 도메인 로직 분리 (선택)

현재 `web/lib/pomodoro.ts`의 `Pomodoro` 클래스는 Web API와 결합되어 있다. 분리 조건이 충족될 때만 진행한다.

분리 조건:
- 모바일에서도 동일 타이머 규칙을 실제로 사용
- 최소 2회 이상 기능 추가가 웹/모바일 양쪽에 동시에 발생

분리 대상 API:

| 현재 코드                                             | 결합된 플랫폼 API | 어댑터 인터페이스                                                       |
| ----------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- |
| `alertCompletion()` 내 `new Audio("sounds/bell.mp3")` | Web Audio API     | `playSound(soundId: string): void`                                      |
| `alertCompletion()` 내 `navigator.vibrate(200)`       | Vibration API     | `vibrate(duration: number): void`                                       |
| `lockScreenWithWake()` / `unLockScreenWithWake()`     | Wake Lock API     | `acquireWakeLock(): Promise<void>` / `releaseWakeLock(): Promise<void>` |

리팩터링 순서:
1. `PlatformAdapter` 인터페이스 정의
2. `Pomodoro` 생성자에 어댑터 주입
3. 웹 구현을 어댑터로 이동
4. 기존 테스트 통과 확인 후 `packages/domain-pomodoro`로 이동

3. 3단계: 경계 강제 (필수)

- ESLint 규칙으로 앱 간 직접 import 제한
- 공용 코드 접근은 `packages/*` 공개 엔트리만 허용
- 완료 기준: `web -> mobile`, `mobile -> web` 직접 import 0건

4. 4단계: 확장 패키지 도입 (보류 항목)

- `platform-web/native/design-tokens`는 필요 증거가 확보되면 추가
- 필요 증거: 코드 중복, 플랫폼별 분기 증가, 팀 합의된 유지비 대비 효과

## 기대 효과

1. 재사용성 향상

- 타입과 핵심 로직이 웹/모바일에 동일하게 적용돼 기능 일관성이 높아진다.

2. 플랫폼 변경 대응력 향상

- 웹/모바일 구현을 교체해도 공용 도메인 로직 수정이 최소화된다.

3. 테스트 안정성 향상

- 플랫폼 API를 분리해 핵심 로직 테스트를 빠르고 안정적으로 수행 가능

4. 확장성 확보

- 향후 데스크톱 앱/서버 사이드 기능 추가 시 기존 공용 계층을 재사용할 수 있다.
