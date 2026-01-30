/** 알림 권한 상태 */
export type NotificationPermissionStatus =
  | "granted"
  | "denied"
  | "blocked"
  | "not_determined";

/** 네이티브 → 웹 브릿지 메서드 */
export interface NativeBridge {
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
   * 알림 권한 요청 (iOS)
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
    platform: "ios";
    version: string;
    appVersion: string;
    isNativeApp: true;
  }>;
}

/** 웹 → 네이티브 콜백 (이벤트 방식) */
export interface NativeCallbacks {
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
    type: "wifi" | "cellular" | "none";
  }): void;
}

/** 웹 → 네이티브 (postMessage) */
export interface WebToNativeMessage {
  type: "request";
  id: string; // 요청 ID (응답 매칭용)
  method: keyof NativeBridge;
  args?: unknown[];
}

/** 네이티브 → 웹 (injectedJavaScript) */
export interface NativeToWebMessage {
  type: "response" | "event";
  id?: string; // response일 때만
  event?: keyof NativeCallbacks; // event일 때만
  payload: unknown;
  error?: { code: string; message: string };
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

export {};
