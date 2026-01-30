# iOS WebView 전환 대안 모음

본 문서는 `.agent/instructions/ios-webview-plan.md`에서 **선택하지 않은 대안**을 모아 둔 참고 문서다.

## 사용 시점

- 기본 구현이 막히거나 제약이 발생했을 때만 참고
- 적용 시 계획 문서에 선택 내용을 반영

## 0) 프로젝트 구조 대안

- **Monolithic 구조**
  - web/mobile 코드를 한 프로젝트에 혼합
  - 배포/의존성 충돌 위험이 커서 기본 플랜에서는 제외

## 1) RN 프로젝트/업데이트 전략 대안

- **RN CLI + expo-updates**
  - Expo를 쓰지 않고 RN CLI로 시작하되 `expo-updates`만 붙이는 방식.
  - 설정/빌드 난이도가 높아질 수 있어 기본 플랜에서는 제외.

- **OTA 업데이트 대안(비-EAS)**
  - `expo-updates` 커스텀 서버(Self-host)
  - CodePush 호환 Managed 서비스(운영/비용 검토 필요)

## 2) 웹 로그인 대안

- **Firebase JS SDK 기반 로그인**
  - 웹에서 직접 Google OAuth → Firebase ID Token 획득
  - 이후 API로 토큰 전달해 동일 세션 쿠키 발급

## 3) WebView 라우팅 전달 대안

- **URL 직접 변경 방식**
  - `injectJavaScript`로 `window.location.href` 변경
  - SPA 라우팅이 아닌 **전체 페이지 reload** 기반

## 3.5) WebView mixed content 대안

- **staging이 http인 경우**
  - iOS에서는 App Transport Security 예외 설정 필요
  - 운영은 https로 유지

## 4) 딥링크 방식 대안

- **Universal Links**
  - `flowburst://` 커스텀 스킴 대신 HTTPS 기반 딥링크 사용
  - 마케팅 링크/공유 링크에 유리, Apple-App-Site-Association 파일 설정 필요

## 5) 웹 알림 대안

- **Web Push 도입**
  - 웹에서도 FCM Web Push를 지원
  - 서비스 워커/HTTPS/권한 정책 추가 필요

## 6) WebView 오디오/진동 대안

- **사용자 제스처 기반 재생**
  - WebView의 자동 재생 제한을 우회하기 위한 방식
  - UI 상호작용 시 사운드/진동 트리거
