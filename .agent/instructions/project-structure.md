# Android WebView 전환 프로젝트 구조 (Monorepo)

## 사용 시점
- 디렉터리 구성/마이그레이션 작업 전 확인
- 구조 관련 결정이 필요할 때 참고

## 프로젝트 구조: Monorepo 방식

### 디렉터리 구조
```
FlowBurstApp/
├── web/                        # 기존 Next.js 프로젝트
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── actions/
│   ├── store/
│   ├── public/
│   ├── utils/
│   ├── data/
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   └── package.json
│
├── mobile/                     # Expo 기반 React Native 프로젝트
│   ├── src/
│   │   ├── App.tsx             # 앱 진입점
│   │   ├── screens/
│   │   │   ├── WebViewScreen.tsx   # 메인 WebView 화면
│   │   │   └── OfflineScreen.tsx   # 네트워크 오류 화면
│   │   ├── bridge/
│   │   │   ├── NativeBridge.ts     # 브릿지 핸들러
│   │   │   └── types.ts            # 브릿지 타입 정의
│   │   ├── services/
│   │   │   ├── auth.ts             # Google Sign-In 로직
│   │   │   ├── push.ts             # FCM 처리
│   │   │   └── network.ts          # 네트워크 상태 감지
│   │   └── utils/
│   │       └── deeplink.ts         # 딥링크 파싱
│   ├── android/                # Android 네이티브 코드
│   ├── ios/                    # iOS 네이티브 코드 (향후)
│   ├── package.json
│   └── eas.json                # EAS Update 설정
│
├── shared/                     # 공유 타입/유틸리티
│   └── types/
│       └── native-bridge.d.ts  # JS 브릿지 타입 정의
│
├── .agent/                     # 에이전트 설정
├── README.md
└── package.json                # 루트 (워크스페이스 설정, optional)
```

### 이 구조의 장점
1. **명확한 관심사 분리**: 웹과 네이티브 코드가 섞이지 않음
2. **독립적 배포**: 
   - `web/` → Vercel/Next.js 서버
   - `mobile/` → EAS Update + Play Store
3. **공유 리소스**: `shared/types/`에서 브릿지 타입 등 공유
4. **기존 코드 보존**: Next.js 코드를 `web/`으로 이동만 하면 됨

### 마이그레이션 순서
```bash
# 1. 루트에 디렉터리 생성
mkdir web mobile shared shared/types

# 2. 기존 Next.js 파일들을 web/으로 이동
mv app components hooks lib actions store public utils data \
   next.config.mjs tsconfig.json tailwind.config.ts postcss.config.mjs \
   package.json package-lock.json \
   web/

# 3. Expo 기반 RN 프로젝트 초기화
cd mobile
npx create-expo-app . --template blank-typescript
```

### 핵심 의존성 (mobile/package.json)
```json
{
  "dependencies": {
    "react-native-webview": "^13.x",
    "@react-native-google-signin/google-signin": "^12.x",
    "@react-native-firebase/app": "^19.x",
    "@react-native-firebase/auth": "^19.x",
    "@react-native-firebase/messaging": "^19.x",
    "expo-updates": "^0.x"
  }
}
```
