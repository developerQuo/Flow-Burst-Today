# Android WebView 전환 검토 메모

본 문서는 현재 코드베이스와 `.agent/instructions/android-webview-plan.md` 간
충돌/에러 가능성과 개선 방안을 정리한 검토 결과다.

## 사용 시점
- **구현 착수 전** 리스크 확인 (필수)
- 구현 완료 후 회귀/누락 점검

---

## 검증된 문제점 및 개선 방안

### 1. 상대 경로 사운드 로딩 실패 (Medium)

| 항목 | 내용 |
|------|------|
| **위치** | `lib/pomodoro.ts:134` |
| **현재 코드** | `new Audio("sounds/bell.mp3")` |
| **문제** | `/guide`, `/statistic` 등 하위 라우트에서 404 발생 |
| **개선** | 절대경로로 변경: `new Audio("/sounds/bell.mp3")` |

---

### 2. WebView 오디오/진동 차단 (Medium)

| 항목 | 내용 |
|------|------|
| **위치** | `lib/pomodoro.ts:134-139` |
| **현재 코드** | `ringingBell.play()`, `navigator.vibrate(200)` |
| **문제** | 모바일 WebView는 자동 재생/진동을 제한 → 완료 피드백이 무음/무진동 |
| **개선** | 네이티브 브릿지 이벤트 추가 (`playSound`, `vibrate`) → RN에서 직접 재생 |

---

### 3. Wake Lock 의존성 (Medium)

| 항목 | 내용 |
|------|------|
| **위치** | `lib/wakeLock.ts` |
| **현재 코드** | `navigator.wakeLock.request("screen")` |
| **문제** | Web Wake Lock은 WebView 지원 불안정 → 화면 꺼짐 가능 |
| **개선** | 네이티브 keep-awake (`react-native-keep-awake`) 브릿지로 보완, 웹에서는 실패 시 조용한 fallback |

---

### 4. 브릿지 유틸 안정화 (구현 시 적용)

브릿지 코드는 아직 구현 전이므로, 구현 시 아래 사항을 반영한다:

| 항목 | 개선 방안 |
|------|----------|
| SSR/빌드 안전 | `typeof window !== 'undefined'` 가드 후 리스너 등록 |
| 메시지 파싱 | `event.data` 타입 검사 + try/catch |
| 리스너 호환 | `window` + `document` 모두 등록 (WebView 호환) |
| UUID | `crypto.randomUUID()` 미지원 시 폴백 생성기 사용 |
| injectJavaScript | `JSON.stringify()`로 문자열 안전 처리 |
