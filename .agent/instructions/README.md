# 에이전트 문서 인덱스

이 폴더의 문서는 **AI 에이전트가 읽는 기준 문서**다.  
작업 전 반드시 아래 순서와 용도를 따른다.

## 적용 범위
- `tdd-policy.md`는 **모든 코드 작업**에 적용된다.
- 나머지 문서들은 **Android WebView 전환 프로젝트**에 특화되어 있다.

---

## 공통 정책 (항상 적용)
1. `tdd-policy.md` — 기본 개발 방식(TDD)

## Android WebView 전환 관련 (읽기 순서)
1. `android-webview-plan.md` — **구현 기준** (단일 선택)
2. `android-webview-review.md` — 구현 전 **리스크 확인**
3. `project-structure.md` — 모노레포 구조/마이그레이션
4. `android-webview-concepts.md` — FCM/브릿지 개념 정리 (필요시)
5. `android-webview-alternatives.md` — **막힐 때만** 대안 참고

## 사용 규칙
- **기본 구현은 `android-webview-plan.md`만 따른다.**
- **구현 착수 전** `android-webview-review.md`로 리스크를 확인한다.
- 구현 중 제약/이슈가 생기면 `android-webview-alternatives.md`에서 대안을 선택한다.
- 구조 변경 작업은 `project-structure.md`를 우선 확인한다.
- 테스트는 `tdd-policy.md`를 기본으로 따른다.
