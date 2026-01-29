# React Native + WebView 앱 전환 구현 계획

## 문서 성격
- **기본 구현 기준 문서**: 여기 내용만 따른다.
- 막히면 `.agent/instructions/android-webview-alternatives.md`에서 대안을 선택한다.

## 목표/범위
- 대상: Android (향후 iOS 확장 가능)
- 방식: **React Native 껍데기 + WebView** (웹앱은 Next.js 서버에서 제공)
- 기능: Google 로그인(Firebase Auth + JWT), **웹 로그인 지원**, 네이티브 알림(FCM), WebView JS 브릿지
- 업데이트: **EAS Update(expo-updates) 기반 OTA 배포** (스토어 업데이트 최소화)
- 결제 없음

## 전환 아키텍처 개요
```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Shell                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Google Auth │  │  FCM Push   │  │    EAS Update       │  │
│  │ (Firebase)  │  │  Messaging  │  │   OTA Update        │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │
│         │                │                                   │
│         └────────┬───────┘                                   │
│                  ▼                                           │
│         ┌───────────────┐                                    │
│         │  JS Bridge    │                                    │
│         │  (WebView ↔   │                                    │
│         │   Native)     │                                    │
│         └───────┬───────┘                                    │
│                 ▼                                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              react-native-webview                    │    │
│  │         (https://your-domain.com 로드)               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ 웹 페이지    │  │ API Routes  │  │  Server Actions     │  │
│  │ (SSR/CSR)   │  │ (인증/데이터)│  │  ('use server')     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**핵심 원칙:**
- 웹앱은 별도 번들링 없이 **Next.js 서버에서 직접 제공**
- **모바일 인증/알림은 RN 네이티브, 웹 인증은 Next.js API**로 처리
- 스토어 업데이트 없이 **EAS Update**로 RN 코드 배포
- 웹 콘텐츠 업데이트는 서버 배포만으로 즉시 반영
- **웹 로그인도 동일한 세션 쿠키로 통합**

---

## 1) 인증 아키텍처 (Firebase Auth + JWT + Google OAuth)

### 모바일 인증 흐름
```
1. RN에서 Google Sign-In 실행
2. Firebase Auth로 ID Token 획득
3. JS Bridge를 통해 WebView로 토큰 전달
4. WebView → Next.js API Route로 토큰 전송
5. Next.js 서버에서 Firebase Admin SDK로 토큰 검증
6. JWT 세션 토큰 발급 → 쿠키 저장
7. 이후 요청은 JWT로 인증
```

### 필요 구성
- **RN 측**
  - `@react-native-google-signin/google-signin`
  - `@react-native-firebase/auth`
- **Next.js 측**
  - `firebase-admin` (토큰 검증)
  - JWT 세션 관리 (쿠키 기반)
  - `'use server'` 디렉티브가 있는 Server Actions 그대로 사용 가능

### 환경 변수
```env
# Next.js (.env.local)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
JWT_SECRET=

# RN
GOOGLE_WEB_CLIENT_ID=      # Firebase Console에서 발급
GOOGLE_ANDROID_CLIENT_ID=  # SHA-1 등록 필요
```

### 웹 인증 흐름 (Web)
```
1. 웹에서 /api/auth/google로 리다이렉트
2. 서버에서 Google OAuth 처리
3. Firebase Admin으로 토큰 검증
4. JWT 세션 쿠키 발급
5. 이후 요청은 쿠키 기반 인증
```

### 세션/쿠키 정책
- 쿠키: `HttpOnly`, `Secure(https)`, `SameSite=Lax`
- 도메인: 운영 도메인 기준(서브도메인 사용 시 범위 명시)
- WebView는 동일 도메인에서 쿠키가 유지되도록 구성

---

## 2) 프로젝트 구조

프로젝트 구조 상세는 별도 문서에 정리한다. (mobile은 Expo 기반)  
→ `.agent/instructions/project-structure.md`

---

## 3) JS 브릿지 상세 스펙

### 타입 정의 (RN 측 & 웹 측 공유)

```typescript
// shared/types/native-bridge.d.ts

/** 알림 권한 상태 */
type NotificationPermissionStatus = 'granted' | 'denied' | 'blocked' | 'not_determined';

/** 네이티브 → 웹 브릿지 메서드 */
interface NativeBridge {
  /**
   * Google 로그인 요청
   * @returns 결과는 NativeCallbacks.onAuthStateChanged로 전달
   */
  signInWithGoogle(): void;

  /**
   * 로그아웃 요청
   */
  signOut(): void;

  /**
   * 현재 알림 권한 상태 조회
   */
  getNotificationStatus(): Promise<NotificationPermissionStatus>;

  /**
   * 알림 권한 요청 (Android 13+)
   */
  requestNotificationPermission(): Promise<NotificationPermissionStatus>;

  /**
   * 시스템 알림 설정 화면으로 이동
   */
  openNotificationSettings(): void;

  /**
   * FCM 토큰 조회 (서버 등록용)
   */
  getFCMToken(): Promise<string>;

  /**
   * 플랫폼 정보 조회
   */
  getPlatformInfo(): Promise<{
    platform: 'android' | 'ios';
    version: string;
    appVersion: string;
    isNativeApp: true;
  }>;
}

/** 웹 → 네이티브 콜백 (이벤트 방식) */
interface NativeCallbacks {
  /**
   * 인증 상태 변경 시 호출
   */
  onAuthStateChanged(payload: {
    isSignedIn: boolean;
    idToken?: string;
    user?: {
      uid: string;
      email: string;
      displayName: string;
      photoURL?: string;
    };
    error?: {
      code: string;
      message: string;
    };
  }): void;

  /**
   * 푸시 알림 수신 시 호출 (포그라운드)
   */
  onNotificationReceived(payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }): void;

  /**
   * 알림 탭 시 호출
   */
  onNotificationTapped(payload: {
    path: string;
    params?: Record<string, string>;
  }): void;

  /**
   * 네트워크 상태 변경 시 호출
   */
  onNetworkStatusChanged(payload: {
    isConnected: boolean;
    type: 'wifi' | 'cellular' | 'none';
  }): void;
}

/** 전역 Window 확장 */
declare global {
  interface Window {
    NativeBridge?: NativeBridge;
    ReactNativeWebView?: {
      postMessage(message: string): void;
    };
  }
}
```

### 브릿지 통신 프로토콜

```typescript
// 웹 → 네이티브 (postMessage)
interface WebToNativeMessage {
  type: 'request';
  id: string;           // 요청 ID (응답 매칭용)
  method: keyof NativeBridge;
  args?: unknown[];
}

// 네이티브 → 웹 (injectedJavaScript)
interface NativeToWebMessage {
  type: 'response' | 'event';
  id?: string;          // response일 때만
  event?: keyof NativeCallbacks;  // event일 때만
  payload: unknown;
  error?: { code: string; message: string };
}
```

### 웹앱 측 브릿지 유틸리티

```typescript
// utils/native-bridge.ts

class NativeBridgeClient {
  private pendingRequests = new Map<string, {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
  }>();

  constructor() {
    // 네이티브 → 웹 메시지 수신 (SSR 안전 + WebView 호환)
    if (typeof window === 'undefined') return;
    const handler = this.handleMessage.bind(this);
    window.addEventListener('message', handler);
    // 일부 Android WebView는 document에서만 메시지가 오기도 함
    document.addEventListener('message', handler as EventListener);
  }

  private safeParse(data: unknown): NativeToWebMessage | null {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as NativeToWebMessage;
      } catch {
        return null;
      }
    }
    if (typeof data === 'object' && data) {
      return data as NativeToWebMessage;
    }
    return null;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private handleMessage(event: MessageEvent) {
    const data = this.safeParse(event.data);
    if (!data) return;
    
    if (data.type === 'response' && data.id) {
      const pending = this.pendingRequests.get(data.id);
      if (pending) {
        if (data.error) {
          pending.reject(new Error(data.error.message));
        } else {
          pending.resolve(data.payload);
        }
        this.pendingRequests.delete(data.id);
      }
    } else if (data.type === 'event' && data.event) {
      // CustomEvent로 브로드캐스트
      window.dispatchEvent(
        new CustomEvent(`native:${data.event}`, { detail: data.payload })
      );
    }
  }

  async call<T>(method: keyof NativeBridge, ...args: unknown[]): Promise<T> {
    if (!window.ReactNativeWebView) {
      throw new Error('Not running in native app');
    }

    const id = this.generateId();
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve: resolve as any, reject });
      
      window.ReactNativeWebView!.postMessage(JSON.stringify({
        type: 'request',
        id,
        method,
        args,
      }));

      // 타임아웃 (10초)
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 10000);
    });
  }
}

export const nativeBridge = new NativeBridgeClient();

// 사용 예시
// await nativeBridge.call('signInWithGoogle');
// await nativeBridge.call<string>('getFCMToken');
```

---

## 4) 웹/앱 분기 처리

### 플랫폼 감지 유틸리티

```typescript
// utils/platform.ts

export type Platform = 'web' | 'android' | 'ios';

/**
 * 네이티브 앱 내부에서 실행 중인지 확인
 */
export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!window.ReactNativeWebView;
};

/**
 * 현재 플랫폼 반환
 */
export const getPlatform = (): Platform => {
  if (!isNativeApp()) return 'web';
  
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
  return 'web';
};

/**
 * 플랫폼별 분기 실행
 */
export const runByPlatform = <T>(handlers: {
  web?: () => T;
  native?: () => T;
  android?: () => T;
  ios?: () => T;
}): T | undefined => {
  const platform = getPlatform();
  
  if (platform === 'android' && handlers.android) return handlers.android();
  if (platform === 'ios' && handlers.ios) return handlers.ios();
  if (isNativeApp() && handlers.native) return handlers.native();
  if (handlers.web) return handlers.web();
  
  return undefined;
};
```

### 분기 처리 예시

```typescript
// hooks/useAuth.ts
import { isNativeApp } from '@/utils/platform';
import { nativeBridge } from '@/utils/native-bridge';

export const useAuth = () => {
  const signIn = async () => {
    if (isNativeApp()) {
      // 네이티브 Google Sign-In
      await nativeBridge.call('signInWithGoogle');
      // 결과는 onAuthStateChanged 이벤트로 수신
    } else {
      // 웹 Google Sign-In
      window.location.href = '/api/auth/google';
    }
  };

  return { signIn };
};
```

```typescript
// hooks/useNotification.ts
export const useNotification = () => {
  const requestPermission = async () => {
    if (isNativeApp()) {
      return await nativeBridge.call<NotificationPermissionStatus>(
        'requestNotificationPermission'
      );
    } else {
      // 웹: Notification API만 사용
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        return result === 'default' ? 'not_determined' : (result as NotificationPermissionStatus);
      }
      return 'not_determined';
    }
  };

  return { requestPermission };
};
```

---

## 4.5) WebView 제약 대응 (사운드/진동/화면 꺼짐)

- **사운드 경로**: `public/` 자산은 절대경로(`/sounds/bell.mp3`)로 로드해 라우트 깊이와 무관하게 동작하도록 유지.
- **오디오/진동 제한**: WebView는 자동 재생/진동이 차단될 수 있으므로
  네이티브 피드백(브릿지 이벤트)으로 보완.
- **화면 꺼짐 방지**: Web Wake Lock이 실패할 수 있으므로
  네이티브 keep-awake로 보완하고 웹에서는 조용한 fallback 처리.

---

## 4.6) WebView 기본 설정 (필수)

- **originWhitelist**: WebView는 `WEBVIEW_BASE_URL`만 허용
- **외부 링크 처리**: `onShouldStartLoadWithRequest`로 외부 링크는 시스템 브라우저로 전환
- **mixedContentMode**: `never` (staging/production 모두 https 가정)
- **필수 옵션**: `javaScriptEnabled`, `domStorageEnabled` 활성화

---

## 5) 딥링크 & 라우팅 규격

### 딥링크 스키마

```
flowburst://[action]/[path]?[params]

예시:
flowburst://open/                     → 메인 화면
flowburst://open/statistic            → 통계 화면
flowburst://open/guide                → 가이드 화면
flowburst://open/feedback?id=123      → 특정 피드백 상세
flowburst://auth/callback?token=xxx   → 인증 콜백 (내부용)
```

### Android 딥링크 등록
- `AndroidManifest.xml`에 `intent-filter` 추가
- 스킴: `flowburst`
- host: `open`, `auth` (사용하는 액션만 허용)
- 알림/외부 링크 진입 시 `WebView` 라우팅으로 연결

### FCM 알림 페이로드

```json
{
  "notification": {
    "title": "뽀모도로 완료!",
    "body": "25분 집중을 완료했습니다."
  },
  "data": {
    "action": "open",
    "path": "/statistic",
    "params": "{\"date\":\"2026-01-28\"}"
  }
}
```

### RN 딥링크 처리

```typescript
// src/utils/deeplink.ts

interface DeepLinkData {
  action: 'open' | 'auth';
  path: string;
  params?: Record<string, string>;
}

export const parseDeepLink = (url: string): DeepLinkData | null => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'flowburst:') return null;

    const action = parsed.host as 'open' | 'auth';
    const path = parsed.pathname || '/';
    const params = Object.fromEntries(parsed.searchParams);

    return { action, path, params };
  } catch {
    return null;
  }
};

// FCM data에서 라우팅 정보 추출
export const parseNotificationData = (
  data: Record<string, string>
): DeepLinkData | null => {
  if (!data.path) return null;

  let params: Record<string, string> | undefined;
  if (data.params) {
    try {
      params = JSON.parse(data.params);
    } catch {
      params = undefined;
    }
  }

  return {
    action: (data.action as 'open' | 'auth') || 'open',
    path: data.path,
    params,
  };
};
```

### WebView 라우팅 전달

```typescript
// src/screens/WebViewScreen.tsx

const navigateWebView = (data: DeepLinkData) => {
  const url = new URL(data.path, WEBVIEW_BASE_URL);
  if (data.params) {
    Object.entries(data.params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  
  // 이벤트로 전달 (SPA 라우팅 지원)
  webViewRef.current?.injectJavaScript(`
    window.dispatchEvent(new CustomEvent('native:navigate', {
      detail: ${JSON.stringify(data)}
    }));
  `);
};
```

### 웹앱 라우팅 수신

```typescript
// hooks/useNativeNavigation.ts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useNativeNavigation = () => {
  const router = useRouter();

  useEffect(() => {
    const handler = (event: CustomEvent<DeepLinkData>) => {
      const { path, params } = event.detail;
      
      const url = new URL(path, window.location.origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      }
      
      router.push(url.pathname + url.search);
    };

    window.addEventListener('native:navigate', handler as EventListener);
    return () => {
      window.removeEventListener('native:navigate', handler as EventListener);
    };
  }, [router]);
};
```

---

## 6) OTA 업데이트 (EAS Update)

### 개요
- **CodePush는 공식 지원 중단으로 제외**
- **EAS Update(expo-updates)**를 기본 OTA 전략으로 사용

### 설정 (요약)

```bash
# EAS CLI 설치
npm install -g eas-cli

# expo-updates 설치
npx expo install expo-updates

# EAS 프로젝트 초기화
eas init
```

### app.json / app.config 설정 (요약)

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/<project-id>"
    },
    "runtimeVersion": "1.0.0"
  }
}
```

### 배포 플로우 (예시)

```bash
# Staging 업데이트
eas update --branch staging --message "staging update"

# Production 업데이트
eas update --branch production --message "production update"
```

### 업데이트 전략
- **RN 쉘 업데이트**: EAS Update로 즉시 배포 (JS 번들만)
- **네이티브 코드 변경**: 스토어 업데이트 필요
- **웹 콘텐츠 업데이트**: Next.js 서버 배포만으로 반영

---

## 7) 오프라인 처리

### 네트워크 상태 감지 (RN 측)

```typescript
// src/services/network.ts
import NetInfo from '@react-native-community/netinfo';

export const setupNetworkListener = (
  onStatusChange: (isConnected: boolean) => void
) => {
  return NetInfo.addEventListener((state) => {
    onStatusChange(state.isConnected ?? false);
  });
};
```

### 오프라인 화면

```typescript
// src/screens/OfflineScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  onRetry: () => void;
}

export const OfflineScreen: React.FC<Props> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.title}>인터넷 연결 없음</Text>
      <Text style={styles.message}>
        네트워크 연결을 확인하고 다시 시도해주세요.
      </Text>
      <Button title="다시 시도" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 24,
  },
});
```

### WebView 에러 처리

```typescript
// src/screens/WebViewScreen.tsx

const [isOffline, setIsOffline] = useState(false);

// 네트워크 상태 감지
useEffect(() => {
  const unsubscribe = setupNetworkListener(setIsOffline);
  return () => unsubscribe();
}, []);

// WebView 로드 에러 핸들링
const handleError = (syntheticEvent: WebViewErrorEvent) => {
  const { nativeEvent } = syntheticEvent;
  console.error('WebView error:', nativeEvent);
  
  if (nativeEvent.code === -2 || nativeEvent.description.includes('net::')) {
    setIsOffline(true);
  }
};

const handleRetry = () => {
  setIsOffline(false);
  webViewRef.current?.reload();
};

if (isOffline) {
  return <OfflineScreen onRetry={handleRetry} />;
}

return (
  <WebView
    ref={webViewRef}
    source={{ uri: WEBVIEW_BASE_URL }}
    onError={handleError}
    onHttpError={(e) => {
      if (e.nativeEvent.statusCode >= 500) {
        setIsOffline(true);
      }
    }}
    // ...
  />
);
```

---

## 8) 테스트 체크리스트

### 인증
- [ ] 최초 Google 로그인 → 토큰 발급 → 세션 생성
- [ ] 웹 로그인 → 세션 생성
- [ ] 앱 재시작 후 세션 유지
- [ ] 토큰 만료 시 갱신/재로그인 흐름
- [ ] 로그아웃 시 세션 정리

### 알림
- [ ] 권한 허용/거부/설정 변경 시 UI 동기화
- [ ] 포그라운드 알림 수신 → WebView 이벤트 전달
- [ ] 백그라운드 알림 탭 → 딥링크 라우팅
- [ ] Android 13+ 런타임 권한 처리

### WebView
- [ ] 외부 링크 → 시스템 브라우저로 열기
- [ ] 내부 라우팅 정상 동작
- [ ] 뒤로가기 버튼 → WebView history 탐색
- [ ] 파일 업로드/다운로드 (필요시)

### 네트워크
- [ ] 오프라인 시 에러 화면 표시
- [ ] 네트워크 복구 시 재시도 → 정상 로드
- [ ] 서버 오류(5xx) 시 에러 화면 표시

### OTA 업데이트
- [ ] EAS Update 감지 → 다운로드 → 적용
- [ ] 필수 업데이트 시 즉시 적용
- [ ] 업데이트 실패 시 롤백

---

## 9) 작업 순서 제안

1. **사전 결정/설정**
   - 패키지명/앱 아이디
   - Firebase 프로젝트 + `google-services.json`
   - SHA-1/256 등록
   - 딥링크 스킴(`flowburst://`) 확정
   - EAS 프로젝트/브랜치 이름 확정
   - WebView Base URL(staging/production) 확정

2. **모노레포 구조 적용**
   - 구조는 `.agent/instructions/project-structure.md` 참고

3. **Expo 프로젝트 초기화 + WebView 기본 연결**
   - Expo 기반 RN 프로젝트 생성
   - WebView 기본 로딩, 외부 링크 처리, 오프라인 처리

4. **JS 브릿지/딥링크/네비게이션**
   - 브릿지 통신 프로토콜 구현
   - WebView 라우팅 이벤트 연결
   - 딥링크 처리 및 WebView 전달

5. **인증 연동**
   - RN Google Sign-In 구현
   - 웹 로그인(`/api/auth/google`) 구현
   - Next.js API Route로 토큰 검증 및 세션 발급

6. **FCM 알림 연동**
   - Firebase Messaging 설정
   - 알림 권한 처리
   - 딥링크 라우팅 구현

7. **EAS Update 설정**
   - EAS 프로젝트 설정
   - 업데이트 브랜치/채널 구성

8. **QA 및 릴리스**
   - 테스트 체크리스트 수행
   - Play Store 등록

---

## 결정/확인 필요 항목

- [x] RN vs 순수 Android → **RN 선택**
- [x] 백엔드 구조 → **Next.js Server Actions + API Routes**
- [x] 인증 방식 → **Firebase Auth + JWT + Google OAuth**
- [x] 업데이트 전략 → **EAS Update OTA**
- [x] 오프라인 처리 → **에러 화면 표시**
- [ ] 패키지명/앱 아이디
- [ ] Firebase 프로젝트 ID + `google-services.json`
- [ ] SHA-1/256 등록
- [ ] 딥링크 스킴/Intent Filter 설정
- [ ] EAS 프로젝트 ID / 업데이트 브랜치(채널) 이름
- [ ] WebView 베이스 URL (production/staging, https 기준)
- [ ] 웹 로그인 엔드포인트(/api/auth/google) 동작 범위
- [ ] 세션 쿠키 도메인/SameSite 정책
